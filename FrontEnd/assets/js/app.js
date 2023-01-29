/*
#=================================================
# * ... Gallery Manager
#-------------------------------------------------
# * ... Handles the projects figures collection
#=================================================
*/

/* ⚙️ [§ Configuration] */
const __CONF_DYN_CLASSES_IDS = {
    "FILTERS_BUTTON_COMPONENT_IS_ACTIVE": 'is-active',
    "FILTERS_BUTTON_COMPONENT_BY_DEFAULT": 'by-default',
    "FAILED_TO_FETCH": 'failed-to-fetch',
    "PREVENT_SELECT": 'prevent-select',
    "TOAST": 'is-toast',
    "SHOW_TOAST": 'show',
    "BOX": 'is-box',
    "ERROR_BOX": 'error-box',
    "FILTERS_BUTTON_CATEGORY_PREFIX": 'category-',
    "DIDNT_UPDATE_GALLERY_FIGURES_TOAST": 'didnt-update-gallery-figures-toast',
    "STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST": 'still-failed-to-load-gallery-figures-toast',
    "TOASTS_COMPONENT": "toasts-component"
};

const __CONF_VOCAB = {
    "FILTERS_BUTTON_UNAVAILABLE": 'Filters buttons unavailable',
    "GALLERY_FIGURES_UNAVAILABLE": 'Gallery figures unavailable',
    "FAILED_TO_CONNECT_TO_THE_API": 'failed to connect to the API!',
    "UNKNOWN_ERROR": 'Unknown error',
    [__CONF_DYN_CLASSES_IDS.DIDNT_UPDATE_GALLERY_FIGURES_TOAST]: 'Failed to connect to the API: the gallery has been left untouched.',
    [__CONF_DYN_CLASSES_IDS.STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST]: 'Still failed to load the gallery. Please, try again.'
};

const __CONF_SELECTORS = {
    "GALLERY_COMPONENT": '#gallery-component',
    "FILTERS_COMPONENT": '#filter-by-category-component',
    "FILTERS_BUTTON_COMPONENT": '.filter-by-category-component>.btn',
    [__CONF_DYN_CLASSES_IDS.DIDNT_UPDATE_GALLERY_FIGURES_TOAST]: `#${__CONF_DYN_CLASSES_IDS.DIDNT_UPDATE_GALLERY_FIGURES_TOAST}`,
    [__CONF_DYN_CLASSES_IDS.TOASTS_COMPONENT]: `#${__CONF_DYN_CLASSES_IDS.TOASTS_COMPONENT}`
};

const __CONF_SERVLET_URL = 'http://localhost:5678/api';
const __CONF_ROUTES = {
    "WORKS": `${__CONF_SERVLET_URL}/works`,
    "CATEGORIES": `${__CONF_SERVLET_URL}/categories`
};

/* 🔨 [§ Collection from API] */
/* [§ Builder] */
async function collectionFromApiBuilder(req) {
    async function request() {
        try {
            const response = await fetch(req);
            const collection = await response.json();
            return collection;
        } catch {
            return false;
        }
    }

    const collection = await request();
    return collection;
}

/* [§ Fetch Data] */
async function fetchGalleryData(flag = 'all') {
    let worksCollection, categoriesCollection;
    switch (flag) {
        case 'all':
            worksCollection = await collectionFromApiBuilder(__CONF_ROUTES.WORKS);
            categoriesCollection = await collectionFromApiBuilder(__CONF_ROUTES.CATEGORIES);
            return [worksCollection, categoriesCollection];
        case 'figures':
            worksCollection = await collectionFromApiBuilder(__CONF_ROUTES.WORKS);
            return worksCollection;
        case 'buttons':
            categoriesCollection = await collectionFromApiBuilder(__CONF_ROUTES.CATEGORIES);
            return categoriesCollection;
        default:
            return null;
    }
}

/* 📐 [§ DOM getters] */
function domGetterSingleElement(selector) {
    return document.querySelector(selector);
}

function domGetterManyElements(selector) {
    return document.querySelectorAll(selector);
}

function galleryFiltersButtonsGetter() {
    return domGetterManyElements(__CONF_SELECTORS.FILTERS_BUTTON_COMPONENT);
}

function activeBtnGetter() {
    const activeBtnSelector = `${__CONF_SELECTORS.FILTERS_BUTTON_COMPONENT}.${__CONF_DYN_CLASSES_IDS.FILTERS_BUTTON_COMPONENT_IS_ACTIVE}`;

    return domGetterSingleElement(activeBtnSelector);
}

function galleryComponentRootNodeGetter() {
    return domGetterSingleElement(__CONF_SELECTORS.GALLERY_COMPONENT);
}

function filtersComponentRootNodeGetter() {
    return domGetterSingleElement(__CONF_SELECTORS.FILTERS_COMPONENT);
}

/* 📐 [§ Errors States Manager] */
function failedToLoadElement(itemSelector) {
    const failedToLoadItemSelector = `${itemSelector}.${__CONF_DYN_CLASSES_IDS.FAILED_TO_FETCH}`;
    const failedToLoadElements = document.querySelector(failedToLoadItemSelector);

    return failedToLoadElements !== null;
}

function failedToGetFromApi(collection) {
    return !collection;
}

/* 📐 [§ DOM mutations functions] */
function getGalleryWorksCollectionSortedByCategory(worksCollection, id) {
    return new Set(worksCollection.filter(item => item.categoryId == id));
}

function getWorksCollectionToDispose(worksCollection) {
    if (failedToGetFromApi(worksCollection)) {
        return worksCollection;
    }

    function extractCategoryId(string) {
        const prefix = __CONF_DYN_CLASSES_IDS.FILTERS_BUTTON_CATEGORY_PREFIX;
        const startIndex = string.indexOf(prefix) + prefix.length;
        const substringFromStartIndex = string.substring(startIndex, string.length);
        const id = substringFromStartIndex.substring(0, substringFromStartIndex.indexOf(' '));
        return id;
    }

    const activeBtn = activeBtnGetter();
    const mutateCollection = activeBtn ? !activeBtn.classList.contains(__CONF_DYN_CLASSES_IDS.FILTERS_BUTTON_COMPONENT_BY_DEFAULT) : false;

    if (mutateCollection) {
        const id = extractCategoryId(activeBtn.classList.value);
        return getGalleryWorksCollectionSortedByCategory(worksCollection, id);
    }
    return worksCollection;
}

/* 🎨 [§ Drawers] */
/* [§ Drawers => Error box] */
function drawToast(id, flag) {
    function generateErrorToast(id) {
        if (domGetterSingleElement(__CONF_SELECTORS[id]) !== null) {
            return null;
        }
        const toast = document.createElement('div');
        const msg = __CONF_VOCAB[id] ?? __CONF_VOCAB.UNKNOWN_ERROR;
        const toastTxt = document.createTextNode(msg);

        toast.id = id;
        toast.classList.add(__CONF_DYN_CLASSES_IDS.PREVENT_SELECT);
        toast.classList.add(__CONF_DYN_CLASSES_IDS.TOAST);
        toast.classList.add(__CONF_DYN_CLASSES_IDS.ERROR_BOX);
        toast.appendChild(toastTxt);

        return toast;
    }

    function matchFlag(flag, id) {
        switch (flag) {
            case 'error':
                return generateErrorToast(id);
        }
        return null;
    }

    function createToastThread(toast) {
        const rootNode = domGetterSingleElement(__CONF_SELECTORS[__CONF_DYN_CLASSES_IDS.TOASTS_COMPONENT]);
        rootNode.appendChild(toast);
        setTimeout(() => {toast.classList.add(__CONF_DYN_CLASSES_IDS.SHOW_TOAST);}, 250);
        setTimeout(() => {toast.classList.remove(__CONF_DYN_CLASSES_IDS.SHOW_TOAST);}, 4500);
        setTimeout(() => {toast.remove();}, 6500);
    }

    const toast = matchFlag(flag, id);
    if (toast !== null) {
        createToastThread(toast);
    }
}

function drawErrorBox(node, errorMessage) {
    function generateErrorBox(msg) {
        const errorBox = document.createElement('div');
        const errorBoxTxt = document.createTextNode(msg);

        errorBox.classList.add(__CONF_DYN_CLASSES_IDS.PREVENT_SELECT);
        errorBox.classList.add(__CONF_DYN_CLASSES_IDS.BOX);
        errorBox.classList.add(__CONF_DYN_CLASSES_IDS.ERROR_BOX);
        errorBox.appendChild(errorBoxTxt);

        return errorBox;
    }

    const errorBox = generateErrorBox(errorMessage);
    node.appendChild(errorBox);
}

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

    if (failedToGetFromApi(worksCollection)) {
        drawErrorBox(rootNode, `${__CONF_VOCAB.GALLERY_FIGURES_UNAVAILABLE}: ${__CONF_VOCAB.FAILED_TO_CONNECT_TO_THE_API}`);
        rootNode.classList.add(__CONF_DYN_CLASSES_IDS.FAILED_TO_FETCH);
        return false;
    }
    rootNode.classList.remove(__CONF_DYN_CLASSES_IDS.FAILED_TO_FETCH);
    worksCollection.forEach(element => {
        doDrawGalleryFigures(rootNode, element);
    });
    return true;
}

/* [§ Drawers => Gallery Filters] */
function doDrawGalleryFilters(node, element, opts = undefined) {
    function generateButton(element, opts) {
        const button = document.createElement('button');
        const buttonTxt = document.createTextNode(element.name);
        const elementIsFromApi = element.id >= 0;

        button.classList.add('btn');
        if (elementIsFromApi) {
            button.classList.add(`${__CONF_DYN_CLASSES_IDS.FILTERS_BUTTON_CATEGORY_PREFIX}${element.id}`);
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

    if (failedToGetFromApi(filtersCollection)) {
        drawErrorBox(rootNode, `${__CONF_VOCAB.FILTERS_BUTTON_UNAVAILABLE}: ${__CONF_VOCAB.FAILED_TO_CONNECT_TO_THE_API}`);
        rootNode.classList.add(__CONF_DYN_CLASSES_IDS.FAILED_TO_FETCH);
        return false;
    }
    rootNode.classList.remove(__CONF_DYN_CLASSES_IDS.FAILED_TO_FETCH);
    doDrawGalleryFilters(rootNode, {
        "id": -1,
        "name": 'Tous'
    }, {
        classList: ['by-default', 'is-active']
    });
    filtersCollection.forEach(element => {
        doDrawGalleryFilters(rootNode, element);
    });
    return true;
}

/* 🔄 [§ Update] */
/* [§ Update => Active Filter Button] */
function updateActiveFilterBtn(element) {
    const skipUpdate = element.classList.contains(__CONF_DYN_CLASSES_IDS.FILTERS_BUTTON_COMPONENT_IS_ACTIVE);

    if (skipUpdate) {
        return false;
    }

    const activeClass = __CONF_DYN_CLASSES_IDS.FILTERS_BUTTON_COMPONENT_IS_ACTIVE;
    const buttons = galleryFiltersButtonsGetter();

    buttons.forEach(element => {
        element.classList.remove(activeClass)
    })
    element.classList.add(activeClass);
    return true;
}

/* [§ Update => Gallery Figures] */
async function updateGalleryFigures(worksCollection = null, naive = true) {
    if (worksCollection === null) {
        worksCollection = await fetchGalleryData('figures');
    }
    if (failedToGetFromApi(worksCollection) && !naive) {
        if (failedToLoadElement(__CONF_SELECTORS.GALLERY_COMPONENT)) {
            drawToast(__CONF_DYN_CLASSES_IDS.STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST, 'error');
        } else {
            drawToast(__CONF_DYN_CLASSES_IDS.DIDNT_UPDATE_GALLERY_FIGURES_TOAST, 'error');
        }
        return false;
    }
    const worksCollectionToDispose = getWorksCollectionToDispose(worksCollection);

    drawGalleryFigures(worksCollectionToDispose);
    return true;
}

/* 📐 [§ Events Generator] */
async function generateEvents() {
    async function generateFiltersButtonsEvents() {
        const buttons = galleryFiltersButtonsGetter();

        buttons.forEach(function (element) {
            element.addEventListener("click", () => {
                const activeFilterBtnHasBeenUpdated = updateActiveFilterBtn(element);
                updateGalleryFigures(null, activeFilterBtnHasBeenUpdated);
            });
        });
    }

    generateFiltersButtonsEvents();
}

/* 🚀 [§ Entry point] */
async function run() {
    const [worksCollection, filtersCollection] = await fetchGalleryData();
    await updateGalleryFigures(worksCollection);
    drawGalleryFilters(filtersCollection);
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