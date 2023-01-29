/*
#=================================================
# * ... Gallery Manager
#-------------------------------------------------
# * ... Handles the projects figures collection
#=================================================
*/

/*** 🌕 [§ Globals] */
/* [§ Dynamic classes, id, and API Servlet URL] */
let __GLOBALS = {
    "DYN_CLASSES": {
        "FILTERS_BUTTONS_COMPONENT_IS_ACTIVE": 'is-active',
        "FILTERS_BUTTONS_COMPONENT_BY_DEFAULT": 'by-default',
        "FAILED_TO_FETCH": 'failed-to-fetch',
        "PREVENT_SELECT": 'prevent-select',
        "TOAST": 'is-toast',
        "SHOW_TOAST": 'show',
        "BOX": 'is-box',
        "ERROR_BOX": 'error-box',
        "FILTERS_BUTTONS_CATEGORY_PREFIX": 'category-',
        "TOASTS_COMPONENT": "toasts-component"
    },

    "DYN_IDS": {
        "DIDNT_UPDATE_GALLERY_FIGURES_TOAST": 'didnt-update-gallery-figures-toast',
        "STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST": 'still-failed-to-load-gallery-figures-toast'
    },

    "API": {
        SERVLET_URL: 'http://localhost:5678/api'
    }
}

/* [§ API Routes] */
Object.assign(__GLOBALS["API"],
    {
        "ROUTES": {
            "WORKS": `${__GLOBALS.API.SERVLET_URL}/works`,
            "CATEGORIES": `${__GLOBALS.API.SERVLET_URL}/categories`
        }
    }
);

/* [§ Selectors] */
__GLOBALS["SELECTORS"] = {
    "GALLERY_COMPONENT": '#gallery-component',
    "FILTERS_COMPONENT": '#filter-by-category-component',
    "FILTERS_BUTTONS_COMPONENT": '.filter-by-category-component>.btn',
    "ERROR_BOXES": `.${__GLOBALS.DYN_CLASSES.ERROR_BOX}`,
    [__GLOBALS.DYN_IDS.DIDNT_UPDATE_GALLERY_FIGURES_TOAST]: `#${__GLOBALS.DYN_IDS.DIDNT_UPDATE_GALLERY_FIGURES_TOAST}`,
    [__GLOBALS.DYN_IDS.STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST]: `#${__GLOBALS.DYN_IDS.STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST}`,
    [__GLOBALS.DYN_CLASSES.TOASTS_COMPONENT]: `#${__GLOBALS.DYN_CLASSES.TOASTS_COMPONENT}`
}

/* [§ Vocab] */
__GLOBALS["VOCAB"] = {
    "FILTERS_BUTTONS_UNAVAILABLE": 'Filters buttons unavailable',
    "GALLERY_FIGURES_UNAVAILABLE": 'Gallery figures unavailable',
    "FAILED_TO_CONNECT_TO_THE_API": 'failed to connect to the API!',
    "UNKNOWN_ERROR": 'Unknown error',
    "CRASH": '⚠️ Application has crashed. Please, refresh this page.',
    [__GLOBALS.DYN_IDS.DIDNT_UPDATE_GALLERY_FIGURES_TOAST]: 'Failed to connect to the API: the gallery has been left untouched.',
    [__GLOBALS.DYN_IDS.STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST]: 'Still failed to load the gallery. Please, try again.'
}

/*** 🔨 [§ Collection from API] */
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
    const worksRoute = __GLOBALS.API.ROUTES.WORKS;
    const categoriesRoute = __GLOBALS.API.ROUTES.CATEGORIES;

    switch (flag) {
        case 'all':
            worksCollection = await collectionFromApiBuilder(worksRoute);
            categoriesCollection = await collectionFromApiBuilder(categoriesRoute);
            return [worksCollection, categoriesCollection];
        case 'figures':
            worksCollection = await collectionFromApiBuilder(worksRoute);
            return worksCollection;
        case 'buttons':
            categoriesCollection = await collectionFromApiBuilder(categoriesRoute);
            return categoriesCollection;
        default:
            return null;
    }
}

/*** 📐 [§ DOM getters] */
function domGetterSingleElement(selector) {
    return document.querySelector(selector);
}

function domGetterManyElements(selector) {
    return document.querySelectorAll(selector);
}

function galleryFiltersButtonsGetter() {
    return domGetterManyElements(__GLOBALS.SELECTORS.FILTERS_BUTTONS_COMPONENT);
}

function activeBtnGetter() {
    const activeBtnSelector = `${__GLOBALS.SELECTORS.FILTERS_BUTTONS_COMPONENT}.${__GLOBALS.DYN_CLASSES.FILTERS_BUTTONS_COMPONENT_IS_ACTIVE}`;

    return domGetterSingleElement(activeBtnSelector);
}

function galleryComponentRootNodeGetter() {
    return domGetterSingleElement(__GLOBALS.SELECTORS.GALLERY_COMPONENT);
}

function filtersComponentRootNodeGetter() {
    return domGetterSingleElement(__GLOBALS.SELECTORS.FILTERS_COMPONENT);
}

/*** 📐 [§ Errors States Manager] */
function failedToLoadElement(itemSelector) {
    const failedToLoadItemSelector = `${itemSelector}.${__GLOBALS.DYN_CLASSES.FAILED_TO_FETCH}`;
    const failedToLoadElements = document.querySelector(failedToLoadItemSelector);

    return failedToLoadElements !== null;
}

function failedToGetFromApi(collection) {
    return !collection;
}

/*** 📐 [§ DOM mutations functions] */
function getGalleryWorksCollectionSortedByCategory(worksCollection, id) {
    return new Set(worksCollection.filter(item => item.categoryId == id));
}

function getWorksCollectionToDispose(worksCollection) {
    if (failedToGetFromApi(worksCollection)) {
        return worksCollection;
    }

    function extractCategoryId(string) {
        const prefix = __GLOBALS.DYN_CLASSES.FILTERS_BUTTONS_CATEGORY_PREFIX;
        const startIndex = string.indexOf(prefix) + prefix.length;
        const substringFromStartIndex = string.substring(startIndex, string.length);
        const id = substringFromStartIndex.substring(0, substringFromStartIndex.indexOf(' '));
        return id;
    }

    const activeBtn = activeBtnGetter();
    const mutateCollection = activeBtn ? !activeBtn.classList.contains(__GLOBALS.DYN_CLASSES.FILTERS_BUTTONS_COMPONENT_BY_DEFAULT) : false;

    if (mutateCollection) {
        const id = extractCategoryId(activeBtn.classList.value);
        return getGalleryWorksCollectionSortedByCategory(worksCollection, id);
    }
    return worksCollection;
}

/*** 🎨 [§ Drawers] */
/* [§ Drawers -> Error box] */
function drawToast(id, flag) {
    function generateErrorToast(id) {
        if (domGetterSingleElement(__GLOBALS.SELECTORS[id]) !== null) {
            return null;
        }
        const toast = document.createElement('div');
        const msg = __GLOBALS.VOCAB[id] ?? __GLOBALS.VOCAB.UNKNOWN_ERROR;
        const toastTxt = document.createTextNode(msg);

        toast.id = id;
        toast.classList.add(__GLOBALS.DYN_CLASSES.PREVENT_SELECT);
        toast.classList.add(__GLOBALS.DYN_CLASSES.TOAST);
        toast.classList.add(__GLOBALS.DYN_CLASSES.ERROR_BOX);
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
        const rootNode = domGetterSingleElement(__GLOBALS.SELECTORS[__GLOBALS.DYN_CLASSES.TOASTS_COMPONENT]);
        rootNode.appendChild(toast);
        setTimeout(() => toast.classList.add(__GLOBALS.DYN_CLASSES.SHOW_TOAST), 250);
        setTimeout(() => toast.classList.remove(__GLOBALS.DYN_CLASSES.SHOW_TOAST), 4500);
        setTimeout(() => toast.remove(), 6500);
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

        errorBox.classList.add(__GLOBALS.DYN_CLASSES.PREVENT_SELECT);
        errorBox.classList.add(__GLOBALS.DYN_CLASSES.BOX);
        errorBox.classList.add(__GLOBALS.DYN_CLASSES.ERROR_BOX);
        errorBox.appendChild(errorBoxTxt);

        return errorBox;
    }

    const errorBox = generateErrorBox(errorMessage);
    node.appendChild(errorBox);
}

/* [§ Drawers -> Gallery] */
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
        drawErrorBox(rootNode, `${__GLOBALS.VOCAB.GALLERY_FIGURES_UNAVAILABLE}: ${__GLOBALS.VOCAB.FAILED_TO_CONNECT_TO_THE_API}`);
        rootNode.classList.add(__GLOBALS.DYN_CLASSES.FAILED_TO_FETCH);
        return false;
    }
    rootNode.classList.remove(__GLOBALS.DYN_CLASSES.FAILED_TO_FETCH);
    worksCollection.forEach(element => doDrawGalleryFigures(rootNode, element));
    return true;
}

/* [§ Drawers -> Gallery Filters] */
function doDrawGalleryFilters(node, element, opts = undefined) {
    function generateButton(element, opts) {
        const button = document.createElement('button');
        const buttonTxt = document.createTextNode(element.name);
        const elementIsFromApi = element.id >= 0;

        button.classList.add('btn');
        if (elementIsFromApi) {
            button.classList.add(`${__GLOBALS.DYN_CLASSES.FILTERS_BUTTONS_CATEGORY_PREFIX}${element.id}`);
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
        drawErrorBox(rootNode, `${__GLOBALS.VOCAB.FILTERS_BUTTONS_UNAVAILABLE}: ${__GLOBALS.VOCAB.FAILED_TO_CONNECT_TO_THE_API}`);
        rootNode.classList.add(__GLOBALS.DYN_CLASSES.FAILED_TO_FETCH);
        return false;
    }
    rootNode.classList.remove(__GLOBALS.DYN_CLASSES.FAILED_TO_FETCH);
    doDrawGalleryFilters(rootNode, {
        "id": -1,
        "name": 'Tous'
    }, {
        classList: ['by-default', 'is-active']
    });
    filtersCollection.forEach(element => doDrawGalleryFilters(rootNode, element));
    return true;
}

/*** 🔄 [§ Update] */
/* [§ Update -> Active Filter Button] */
function updateActiveFilterBtn(element) {
    const activeClass = __GLOBALS.DYN_CLASSES.FILTERS_BUTTONS_COMPONENT_IS_ACTIVE;
    const skipUpdate = element.classList.contains(activeClass);

    if (skipUpdate) {
        return false;
    }

    const buttons = galleryFiltersButtonsGetter();
    buttons.forEach(element => element.classList.remove(activeClass));
    element.classList.add(activeClass);
    return true;
}

/* [§ Update -> Gallery Figures] */
async function updateGalleryFigures(worksCollection = null, naive = true) {
    if (worksCollection === null) {
        worksCollection = await fetchGalleryData('figures');
    }
    if (failedToGetFromApi(worksCollection) && !naive) {
        if (failedToLoadElement(__GLOBALS.SELECTORS.GALLERY_COMPONENT)) {
            drawToast(__GLOBALS.DYN_IDS.STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST, 'error');
        } else {
            drawToast(__GLOBALS.DYN_IDS.DIDNT_UPDATE_GALLERY_FIGURES_TOAST, 'error');
        }
        return false;
    }
    const worksCollectionToDispose = getWorksCollectionToDispose(worksCollection);

    drawGalleryFigures(worksCollectionToDispose);
    return worksCollectionToDispose;
}

/*** 📐 [§ Events Generator] */
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

/*** 💥 [§ Crash] */
function makeCrash(rootNode) {
    const errorBoxes = domGetterManyElements(__GLOBALS.SELECTORS.ERROR_BOXES);
    errorBoxes.forEach(element => element.remove());
    drawErrorBox(rootNode, __GLOBALS.VOCAB.CRASH);
}

/*** 🚀 [§ Entry point] */
async function run() {
    const [worksCollection, filtersCollection] = await fetchGalleryData();
    await updateGalleryFigures(worksCollection);
    drawGalleryFilters(filtersCollection);
    if (failedToLoadElement(__GLOBALS.SELECTORS.FILTERS_COMPONENT)) {
        const crashErrorBoxRootNode = filtersComponentRootNodeGetter();
        makeCrash(crashErrorBoxRootNode);
    } else {
        generateEvents();
    }
}

async function main() {
    try {
        await run();
    } catch (e) {
        console.log(e);
    }
}

main();