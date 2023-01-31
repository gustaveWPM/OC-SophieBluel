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
        "GALLERY_FIGURE": 'gallery-figure',
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
    },

    "SIDE_EFFECTS": {
        "PAGE_LOAD_MS_DELAY": 250,
        "SCROLL_DOWN_TRIGGER_HASH": '#scroll-down'
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

Object.freeze(__GLOBALS);

/* [§ Getters] */
function getSelector(key) {
    const value = __GLOBALS.SELECTORS[key];
    if (value === undefined) {
        console.error(`No configured selector found with this key: ${key}`)
    }
    return value;
}

function getRoute(key) {
    const value = __GLOBALS.API.ROUTES[key];
    if (value === undefined) {
        console.error(`No configured route found with this key: ${key}`)
    }
    return value;
}

function getDynamicClass(key) {
    const value = __GLOBALS.DYN_CLASSES[key];
    if (value === undefined) {
        console.error(`No configured dynamic class found with this key: ${key}`)
    }
    return value;
}

function getDynamicId(key) {
    const value = __GLOBALS.DYN_IDS[key];
    if (value === undefined) {
        console.error(`No configured dynamic id found with this key: ${key}`)
    }
    return value;
}

function getVocab(key) {
    const value = __GLOBALS.VOCAB[key];
    if (value === undefined) {
        console.error(`No configured vocab found with this key: ${key}`)
    }
    return value;
}

function getSideEffectConf(key) {
    const value = __GLOBALS.SIDE_EFFECTS[key];
    if (value === undefined) {
        console.error(`No configured vocab found with this key: ${key}`)
    }
    return value;
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
async function fetchWorksCollection() {
    const worksRoute = getRoute("WORKS");
    const worksCollection = await collectionFromApiBuilder(worksRoute);

    return worksCollection;
}

async function fetchCategoriesCollection() {
    const categoriesRoute = getRoute("CATEGORIES");
    const categoriesCollection = await collectionFromApiBuilder(categoriesRoute);

    return new Set(categoriesCollection);
}

async function fetchGalleryData() {
    const [worksCollection, categoriesCollection] = [
        await fetchWorksCollection(),
        await fetchCategoriesCollection()
    ];
    return [worksCollection, categoriesCollection];
}

/*** 📐 [§ DOM getters] */
function domGetterSingleElement(selector) {
    return document.querySelector(selector);
}

function domGetterManyElements(selector) {
    return document.querySelectorAll(selector);
}

function galleryFiltersButtonsGetter() {
    return domGetterManyElements(getSelector("FILTERS_BUTTONS_COMPONENT"));
}

function activeBtnGetter() {
    const activeBtnSelector = `${getSelector("FILTERS_BUTTONS_COMPONENT")}.${getDynamicClass("FILTERS_BUTTONS_COMPONENT_IS_ACTIVE")}`;

    return domGetterSingleElement(activeBtnSelector);
}

function galleryComponentRootNodeGetter() {
    return domGetterSingleElement(getSelector("GALLERY_COMPONENT"));
}

function filtersComponentRootNodeGetter() {
    return domGetterSingleElement(getSelector("FILTERS_COMPONENT"));
}

/*** 📐 [§ Errors States Manager] */
function failedToLoadElement(itemSelector) {
    const failedToLoadItemSelector = `${itemSelector}.${getDynamicClass("FAILED_TO_FETCH")}`;
    const failedToLoadElement = document.querySelector(failedToLoadItemSelector);

    return failedToLoadElement !== null;
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
        const prefix = getDynamicClass("FILTERS_BUTTONS_CATEGORY_PREFIX");
        const startIndex = string.indexOf(prefix) + prefix.length;
        const substringFromStartIndex = string.substring(startIndex, string.length);
        const id = substringFromStartIndex.substring(0, substringFromStartIndex.indexOf(' '));
        return id;
    }

    const activeBtn = activeBtnGetter();
    const mutateCollection = activeBtn ? !activeBtn.classList.contains(getDynamicClass("FILTERS_BUTTONS_COMPONENT_BY_DEFAULT")) : false;

    if (mutateCollection) {
        const id = extractCategoryId(activeBtn.classList.value);
        return getGalleryWorksCollectionSortedByCategory(worksCollection, id);
    }
    return worksCollection;
}

/*** 🎨 [§ Drawers] */
/* [§ Drawers -> Toasts] */
function createToastThread(toast) {
    const rootNode = domGetterSingleElement(getSelector(getDynamicClass("TOASTS_COMPONENT")));
    rootNode.appendChild(toast);
    setTimeout(() => toast.classList.add(getDynamicClass("SHOW_TOAST")), 250);
    setTimeout(() => toast.classList.remove(getDynamicClass("SHOW_TOAST")), 4500);
    setTimeout(() => toast.remove(), 8500);
}

function drawToast(id, msg) {
    if (domGetterSingleElement(getSelector(id)) !== null) {
        return null;
    }
    const toast = document.createElement('div');
    const toastTxt = document.createTextNode(msg);
    toast.id = id;
    toast.classList.add(getDynamicClass("PREVENT_SELECT"));
    toast.classList.add(getDynamicClass("TOAST"));
    toast.appendChild(toastTxt);

    createToastThread(toast);
    return toast;
}

function drawErrorToast(id) {
    const msg = getVocab(id) ?? getVocab("UNKNOWN_ERROR");
    const toast = drawToast(id, msg);

    if (toast !== null) {
        toast.classList.add(getDynamicClass("ERROR_BOX"));
    }
    return toast;
}

/* [§ Drawers -> Error boxes] */
function drawErrorBox(node, errorMessage) {
    function generateErrorBox(msg) {
        const errorBox = document.createElement('div');
        const errorBoxTxt = document.createTextNode(msg);

        errorBox.classList.add(getDynamicClass("PREVENT_SELECT"));
        errorBox.classList.add(getDynamicClass("BOX"));
        errorBox.classList.add(getDynamicClass("ERROR_BOX"));
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

    figure.classList.add(getDynamicClass("GALLERY_FIGURE"));
    node.appendChild(figure);
}

function drawGalleryFigures(worksCollection) {
    const rootNode = galleryComponentRootNodeGetter();
    rootNode.innerHTML = '';

    if (failedToGetFromApi(worksCollection)) {
        drawErrorBox(rootNode, `${getVocab("GALLERY_FIGURES_UNAVAILABLE")}: ${getVocab("FAILED_TO_CONNECT_TO_THE_API")}`);
        rootNode.classList.add(getDynamicClass("FAILED_TO_FETCH"));
        return false;
    }
    rootNode.classList.remove(getDynamicClass("FAILED_TO_FETCH"));
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
            button.classList.add(`${getDynamicClass("FILTERS_BUTTONS_CATEGORY_PREFIX")}${element.id}`);
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
        drawErrorBox(rootNode, `${getVocab("FILTERS_BUTTONS_UNAVAILABLE")}: ${getVocab("FAILED_TO_CONNECT_TO_THE_API")}`);
        rootNode.classList.add(getDynamicClass("FAILED_TO_FETCH"));
        return false;
    }
    rootNode.classList.remove(getDynamicClass("FAILED_TO_FETCH"));
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
    const activeClass = getDynamicClass("FILTERS_BUTTONS_COMPONENT_IS_ACTIVE");
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
        worksCollection = await fetchWorksCollection();
    }
    if (failedToGetFromApi(worksCollection) && !naive) {
        if (failedToLoadElement(getSelector("GALLERY_COMPONENT"))) {
            drawErrorToast(getDynamicId("STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST"));
        } else {
            drawErrorToast(getDynamicId("DIDNT_UPDATE_GALLERY_FIGURES_TOAST"));
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
    const errorBoxes = domGetterManyElements(getSelector("ERROR_BOXES"));
    errorBoxes.forEach(element => element.remove());
    drawErrorBox(rootNode, getVocab("CRASH"));
}

function scrollToFooter() {
    const pageHeight = document.body.scrollHeight;

    window.scroll({
        top: pageHeight,
        left: 0,
        behavior: 'smooth'
      });
}

/*** 🚀 [§ Entry point] */
async function run() {
    const [worksCollection, filtersCollection] = await fetchGalleryData();
    await updateGalleryFigures(worksCollection);
    drawGalleryFilters(filtersCollection);
    if (failedToLoadElement(getSelector("FILTERS_COMPONENT"))) {
        const crashErrorBoxRootNode = filtersComponentRootNodeGetter();
        makeCrash(crashErrorBoxRootNode);
    } else {
        generateEvents();
    }
}

function sideEffects() {
    const curHash = window.location.hash;
    const expectedHash = getSideEffectConf("SCROLL_DOWN_TRIGGER_HASH");
    const DELAY = getSideEffectConf("PAGE_LOAD_MS_DELAY");

    if (curHash == expectedHash) {
        setTimeout(() => scrollToFooter(), DELAY);
    }
}

async function main() {
    try {
        await run();
        sideEffects();
    } catch (e) {
        console.log(e);
    }
}

main();