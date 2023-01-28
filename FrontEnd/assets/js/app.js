/*
#=================================================
# * ... Gallery Manager
#-------------------------------------------------
# * ... Handles the projects figures collection
#=================================================
*/

/* ⚙️ [§ Configuration] */
const __CONF_SELECTORS = {
    "GALLERY_COMPONENT": '#gallery-component',
    "FILTERS_COMPONENT": '#filter-by-category-component',
    "FILTERS_BUTTON_COMPONENT": '.filter-by-category-component>.btn'
};

const __CONF_DYN_CLASSES = {
    "FILTERS_BUTTON_COMPONENT_IS_ACTIVE": 'is-active',
    "FILTERS_BUTTON_COMPONENT_BY_DEFAULT": 'by-default',
    "FILTERS_BUTTON_CATEGORY_PREFIX": 'category-'
};

const __CONF_SERVLET_URL = 'http://localhost:5678/api';
const __CONF_ROUTES = {
    "WORKS": `${__CONF_SERVLET_URL}/works`,
    "CATEGORIES": `${__CONF_SERVLET_URL}/categories`
};

/* 🔨 [§ Collection from API Builder] */
async function collectionFromApiBuilder(req) {
    async function request() {
        const response = await fetch(req);
        const collection = await response.json();

        return collection;
    }

    const collection = await request();
    return collection;
}

/* 📐 [§ DOM getters] */
function getGalleryFiltersButtons() {
    return document.querySelectorAll(__CONF_SELECTORS.FILTERS_BUTTON_COMPONENT);
}

function getActiveBtn() {
    const activeBtnSelector = `.filter-by-category-component>.btn.${__CONF_DYN_CLASSES.FILTERS_BUTTON_COMPONENT_IS_ACTIVE}`;

    return document.querySelector(activeBtnSelector);
}

function galleryComponentRootNodeGetter() {
    return document.querySelector(__CONF_SELECTORS.GALLERY_COMPONENT);
}

function filtersComponentRootNodeGetter() {
    return document.querySelector(__CONF_SELECTORS.FILTERS_COMPONENT);
}

/* 📐 [§ DOM mutations functions] */
function getGalleryWorksCollectionSortedByCategory(worksCollection, id) {
    return new Set(worksCollection.filter(item => item.categoryId == id));
}

function getWorksCollectionToDispose(worksCollection) {
    function extractCategoryId(string) {
        const prefix = __CONF_DYN_CLASSES.FILTERS_BUTTON_CATEGORY_PREFIX;
        const startIndex = string.indexOf(prefix) + prefix.length;
        const substringFromStartIndex = string.substring(startIndex, string.length);
        const id = substringFromStartIndex.substring(0, substringFromStartIndex.indexOf(' '));
        return id;
    }

    const activeBtn = getActiveBtn();
    const mutateCollection = activeBtn ? !activeBtn.classList.contains(__CONF_DYN_CLASSES.FILTERS_BUTTON_COMPONENT_BY_DEFAULT) : false;

    if (mutateCollection) {
        const id = extractCategoryId(activeBtn.classList.value);
        return getGalleryWorksCollectionSortedByCategory(worksCollection, id);
    }
    return worksCollection;
}

/* 🎨 [§ Drawers] */
/* [§ Drawers => Gallery] */
function doDrawGalleryFigures(node, element) {
    function generateImg(alt, url) {
        const img = document.createElement('img');
        img.setAttribute('src', url);
        img.setAttribute('alt', alt);
        img.setAttribute('crossorigin', '');

        return img;
    }

    function generateFigure(img, caption) {
        const figure = document.createElement('figure');
        const figcaptionTxt = document.createTextNode(caption);
        const figcaption = document.createElement('figcaption');
        figcaption.appendChild(figcaptionTxt);
        figure.append(img);
        figure.append(figcaption);

        return figure;
    }

    const [title, url] = [element.title, element.imageUrl];
    const img = generateImg(title, url);
    const figure = generateFigure(img, title);

    node.appendChild(figure);
}

function drawGalleryFigures(worksCollection) {
    const rootNode = galleryComponentRootNodeGetter();
    rootNode.innerHTML = '';

    worksCollection.forEach(element => {
        doDrawGalleryFigures(rootNode, element);
    });
}

/* [§ Drawers => Gallery Filters] */
function doDrawGalleryFilters(node, element, opts = undefined) {
    function generateButton(element, opts) {
        const button = document.createElement('button');
        const buttonTxt = document.createTextNode(element.name);
        button.classList.add('btn');
        if (element.id >= 0) {
            button.classList.add(`${__CONF_DYN_CLASSES.FILTERS_BUTTON_CATEGORY_PREFIX}${element.id}`);
        }
        if (opts && opts.classList) {
            button.classList.add(...opts.classList);
        }
        button.appendChild(buttonTxt);

        return button;
    }

    const button = generateButton(element, opts);
    node.appendChild(button);
}

function drawGalleryFilters(filtersCollection) {
    const rootNode = filtersComponentRootNodeGetter();
    rootNode.innerHTML = '';

    doDrawGalleryFilters(rootNode, {
        "id": -1,
        "name": 'Tous'
    }, {
        classList: ['by-default', 'is-active']
    });
    filtersCollection.forEach(element => {
        doDrawGalleryFilters(rootNode, element);
    });
}

/* 🔄 [§ Update] */
function updateActiveFilterBtn(element) {
    if (element.classList.contains(__CONF_DYN_CLASSES.FILTERS_BUTTON_COMPONENT_IS_ACTIVE)) return false;
    const activeClass = __CONF_DYN_CLASSES.FILTERS_BUTTON_COMPONENT_IS_ACTIVE;
    const buttons = getGalleryFiltersButtons();

    buttons.forEach(element => {
        element.classList.remove(activeClass)
    })
    element.classList.add(activeClass);
    return true;
}

function updateGallery(worksCollection) {
    const worksCollectionToDispose = getWorksCollectionToDispose(worksCollection);

    drawGalleryFigures(worksCollectionToDispose);
}

/* 📐 [§ Render Triggers] */
/* [§ Render Triggers => Gallery Figures] */
async function triggerGalleryFiguresDynamicRenderer() {
    const worksCollection = await collectionFromApiBuilder(__CONF_ROUTES.WORKS);
    updateGallery(worksCollection);
}

/* [§ Render Triggers => Gallery Filters] */
async function triggerGalleryFiltersDynamicRenderer() {
    const categoriesCollection = await collectionFromApiBuilder(__CONF_ROUTES.CATEGORIES);
    drawGalleryFilters(categoriesCollection);
}

/* 📐 [§ Events Generator] */
function generateEvents() {
    function generateFiltersButtonsEvents() {
        const buttons = getGalleryFiltersButtons();

        buttons.forEach(function (element) {
            element.addEventListener("click", () => {
                if (updateActiveFilterBtn(element)) {
                    triggerGalleryFiguresDynamicRenderer();
                }
            });
        });
    }

    generateFiltersButtonsEvents();
}

/* 🚀 [§ Entry point] */
async function run() {
    await triggerGalleryFiguresDynamicRenderer();
    await triggerGalleryFiltersDynamicRenderer();
    generateEvents();
}

async function main() {
    try {
        await run();
    } catch (e) {
        console.log(e);
    }
}

main();