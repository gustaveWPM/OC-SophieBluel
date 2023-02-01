/*
#=================================================
# * ... Gallery Manager
#-------------------------------------------------
# * ... Handles the projects figures collection
#=================================================
*/

/*** 📝 [§ Cache] */
let __CACHE = {
    "COLLECTIONS": {},
    "WORKS": {}
}

function deepCopy(obj) {
    const copy = JSON.parse(JSON.stringify(obj));
    return copy;
}

function cacheCategories(categories) {
    if (failedToGetFromApi(categories)) {
        return;
    }
    __CACHE.COLLECTIONS = deepCopy(categories);
}

function cacheWorks(worksCollection) {
    function dynamicRouteToStaticRoute(element) {
        const url = element.imageUrl;
        const noodle = getCacheConf("IMAGES_FOLDER_NOODLE");
        const newPrefix = getCacheConf("STATIC_IMAGES_ROUTE_PREFIX");
        const noodleIndex = url.indexOf(noodle) + 1;
        const urlWithoutHost = url.substring(noodleIndex);
        const newUrl = `${newPrefix}${urlWithoutHost}`;

        element.imageUrl = newUrl;
        return element;
    }

    function newWorksCollectionWithStaticRoutes(worksCollection) {
        const newCollection = worksCollection.map(element => dynamicRouteToStaticRoute(element));
        return newCollection;
    }
    if (failedToGetFromApi(worksCollection)) {
        return;
    }
    __CACHE.WORKS = newWorksCollectionWithStaticRoutes(worksCollection);
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

    cacheWorks(worksCollection);
    return worksCollection;
}

async function fetchCategoriesCollection() {
    const categoriesRoute = getRoute("CATEGORIES");
    const categoriesCollection = await collectionFromApiBuilder(categoriesRoute);

    if (failedToGetFromApi(categoriesCollection)) {
        return false;
    }
    const categoriesSet = new Set(categoriesCollection);
    cacheCategories(categoriesSet);
    return categoriesSet;
}

/*** 🎣 [§ DOM getters] */
function galleryFiltersButtonsGetter() {
    return document.querySelectorAll(getSelector("FILTERS_BUTTONS_COMPONENT"));
}

function activeBtnGetter() {
    const activeBtnSelector = `${getSelector("FILTERS_BUTTONS_COMPONENT")}.${getDynamicClass("FILTERS_BUTTONS_COMPONENT_IS_ACTIVE")}`;

    return document.querySelector(activeBtnSelector);
}

function galleryComponentRootNodeGetter() {
    return document.querySelector(getSelector("GALLERY_COMPONENT"));
}

function filtersComponentRootNodeGetter() {
    return document.querySelector(getSelector("FILTERS_COMPONENT"));
}

/*** 🧬 [§ DOM mutations functions] */
function getGalleryWorksCollectionSortedByCategory(worksCollection, id) {
    if (failedToGetFromApi(worksCollection)) {
        return false;
    }
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
/* [§ Drawers -> Gallery] */
function doDrawGalleryFigures(node, element, fromCache = false) {
    function generateImg(alt, url) {
        const img = document.createElement('img');
        img.setAttribute('src', url);
        img.setAttribute('alt', alt);
        if (fromCache) {
            img.setAttribute('crossorigin', '');
        }

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
    const alt = `Photographie - ${title}`;
    const img = generateImg(alt, url);
    const figure = generateFigure(img, title);

    figure.classList.add(getDynamicClass("GALLERY_FIGURE"));
    node.appendChild(figure);
}

function drawGalleryFigures(worksCollection) {
    const rootNode = galleryComponentRootNodeGetter();
    rootNode.innerHTML = '';

    if (failedToGetFromApi(worksCollection)) {
        drawErrorBox(rootNode, `${getVocab("GALLERY_FIGURES_UNAVAILABLE")} : ${getVocab("FAILED_TO_CONNECT_TO_THE_API")}`);
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

        button.classList.add(getDynamicClass("BTN"));
        button.classList.add(getDynamicClass("FILTER_BTN"));
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

function drawGalleryFilters(categoriesCollection) {
    const rootNode = filtersComponentRootNodeGetter();
    rootNode.innerHTML = '';

    if (failedToGetFromApi(categoriesCollection)) {
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
    categoriesCollection.forEach(element => doDrawGalleryFilters(rootNode, element));
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

/*** ✨ [§ Side Effects] */
function snapToTop() {
    window.scrollTo(0, 0);
}

function scrollToFooter() {
    function skipScrollToFooter() {
        const skipScroll = failedToLoadElement(getSelector("FILTERS_COMPONENT")) || failedToLoadElement(getSelector("GALLERY_COMPONENT"));
        return skipScroll;
    }

    const skipScroll = skipScrollToFooter();
    if (skipScroll) {
        return;
    }
    const pageHeight = document.body.scrollHeight;
    window.scrollTo({
        top: pageHeight,
        left: 0,
        behavior: 'smooth'
    });
}

function handleContactHash() {
    const curHash = window.location.hash;
    const expectedHash = getSideEffectConf("SCROLL_DOWN_TRIGGER_HASH");

    if (curHash == expectedHash) {
        scrollToFooter();
    }
}

/*** ✏️ [§ Dynamic content generation] */
async function appendDynamicCategories() {
    const categoriesCollection = await fetchCategoriesCollection();
    if (failedToGetFromApi(categoriesCollection)) {
        return false;
    }
    drawGalleryFilters(categoriesCollection);
    return categoriesCollection;
}

async function appendDynamicWorks() {
    const worksCollection = await fetchWorksCollection();
    if (failedToGetFromApi(worksCollection)) {
        return false;
    }
    await updateGalleryFigures(worksCollection);
    return worksCollection;
}

async function appendDynamicContent() {
    const categoriesCollection = await appendDynamicCategories();
    if (failedToGetFromApi(categoriesCollection)) {
        return false;
    }
    const worksCollection = await appendDynamicWorks();
    if (failedToGetFromApi(worksCollection)) {
        return false;
    }
    return true;
}

/*** 💥 [§ Crash] */
function crash(crashNode, retryContext = false) {
    function drawCrashErrorBox(rootNode) {
        const errorBoxes = document.querySelectorAll(getSelector("ERROR_BOXES"));
        errorBoxes.forEach(element => element.remove());
        drawErrorBox(rootNode, getVocab("CRASH"));
    }

    function drawCrashRetryButton(rootNode) {
        const retryButton = document.createElement('button');
        const retryButtonTxt = document.createTextNode(getVocab("RETRY_TO_LOAD_GALLERY"));

        retryButton.classList.add(getDynamicClass("BTN"));
        retryButton.appendChild(retryButtonTxt);
        rootNode.appendChild(retryButton);

        retryButton.addEventListener("click", () => {
            run(retryContext = true);
        });
    }

    if (!retryContext) {
        drawCrashErrorBox(crashNode);
        drawCrashRetryButton(crashNode);
        console.log("lolilol");
    }
}

/*** 🚀 [§ Run] */
async function run(retryContext = false) {
    const startApp = await appendDynamicContent();
    const filtersComponentNode = filtersComponentRootNodeGetter();

    if (!startApp) {
        crash(filtersComponentNode, retryContext);
        if (!retryContext) {
            filtersComponentNode.classList.add(getDynamicClass("FORCE_FLEX_COLUMN"));
        } else {
            drawErrorToast(getDynamicId("STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST"));
        }
        return;
    }
    if (retryContext) {
        filtersComponentNode.classList.remove(getDynamicClass("FORCE_FLEX_COLUMN"));
    }
    generateEvents();
}

/*** 🚪 [§ Entry point] */
async function main() {
    try {
        handleContactHash();
        await run();
        handleContactHash();
    } catch (e) {
        console.log(e);
    }
}

main();