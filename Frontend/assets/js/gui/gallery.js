/*
#=================================================
# * ... Gallery Manager
#-------------------------------------------------
# * ... Handles the projects figures collection
#=================================================
*/

/*** 📝 Cache */
function cacheWorks(worksCollection) {
    function dynamicRouteToStaticRoute(element) {
        const haystack = element.imageUrl;
        const needle = getCacheConf("IMAGES_FOLDER_NEEDLE");
        const newPrefix = getCacheConf("STATIC_IMAGES_ROUTE_PREFIX");
        const needleIndex = haystack.indexOf(needle) + 1;
        const urlWithoutHost = haystack.substring(needleIndex);
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

    const worksCollectionConvertedToCacheData = newWorksCollectionWithStaticRoutes(worksCollection);
    updateCacheValue("WORKS", worksCollectionConvertedToCacheData);
}

/* [§ Fetch Data] */
async function fetchWorksCollection() {
    const worksCollection = await getWorksFromDatabase();

    if (!failedToGetFromApi(worksCollection)) {
        cacheWorks(worksCollection);
    }
    return worksCollection;
}

async function fetchCategoriesCollection() {
    const categoriesCollection = await getCategoriesFromDatabase();

    if (failedToGetFromApi(categoriesCollection)) {
        return false;
    }

    const categoriesSet = new Set(categoriesCollection);
    return categoriesSet;
}

/*** 🔒 Login */
function setLoginButtonCtx(isLoggedIn) {
    function setButtonToLogin(rootNode) {
        rootNode.innerHTML = getVocab("LOGIN");
    }

    function setButtonToLogout(rootNode) {
        rootNode.innerHTML = getVocab("LOGOUT");

        rootNode.addEventListener("click", function doLogOut(event) {
            event.preventDefault();
            deleteLocalStorageUserInfos();
            isLoggedIn = false;
            rootNode.removeEventListener("click", doLogOut);
            drawSuccessToast(getDynamicId("LOGGED_OUT_SUCCESS_TOAST"));
            appendEditor();
            setLoginButtonCtx(isLoggedIn);
        });
    }

    const rootNode = loginComponentRootNodeGetter();
    isLoggedIn ? setButtonToLogout(rootNode) : setButtonToLogin(rootNode);
}

function processLogOut() {
    deleteLocalStorageUserInfos();
}

/*** 🎣 DOM getters */
function loginComponentRootNodeGetter() {
    return document.querySelector(getSelector("LOG_USER_BTN"));
}

function galleryFiltersButtonsGetter() {
    return document.querySelectorAll(getSelector("FILTERS_BUTTONS_COMPONENT"));
}

function activeBtnGetter() {
    const activeBtnSelector = `${getSelector("FILTERS_BUTTONS_COMPONENT")}.${getDynamicClass("IS_ACTIVE_STATE")}`;

    return document.querySelector(activeBtnSelector);
}

function galleryComponentRootNodeGetter() {
    return document.querySelector(getSelector("GALLERY_COMPONENT"));
}

function filtersComponentRootNodeGetter() {
    return document.querySelector(getSelector("FILTERS_COMPONENT"));
}

function modalAddPictureSelectRootNodeGetter() {
    return document.querySelector(getSelector("MODAL_CATEGORY_SELECT"));
}

function galleryFiguresGetter() {
    return document.querySelectorAll(getSelector("FILTERS_COMPONENT"));
}

/*** 🧬 DOM mutations functions */
function getGalleryWorksCollectionSortedByCategory(worksCollection, id) {
    if (failedToGetFromApi(worksCollection)) {
        return false;
    }

    const worksToSortAmount = worksCollection.length ?? worksCollection.size;
    const nothingToSort = worksToSortAmount === 0;

    if (nothingToSort) {
        return worksCollection;
    }
    return new Set(worksCollection.filter(({categoryId}) => categoryId === id));
}

function getWorksCollectionToDispose(worksCollection, worksCategoryId) {
    if (failedToGetFromApi(worksCollection)) {
        return worksCollection;
    }

    const activeBtn = activeBtnGetter();
    const triggeredFilterByCategBtn = !activeBtn.classList.contains(getDynamicClass("FILTERS_BUTTONS_COMPONENT_BY_DEFAULT"));

    if (triggeredFilterByCategBtn) {
        return getGalleryWorksCollectionSortedByCategory(worksCollection, worksCategoryId);
    }

    return worksCollection;
}

/*** 🎨 Drawers */
/* [§ Drawers -> Gallery] */
function doDrawGalleryFigures(node, element, noFadeIn = false) {
    function generateImg(alt, url) {
        const img = document.createElement('img');

        img.setAttribute('src', url);
        img.setAttribute('alt', alt);

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

    if (noFadeIn) {
        figure.classList.add(getDynamicClass("FORCE_NO_ANIMATION"));
    }

    figure.classList.add(getDynamicClass("GALLERY_FIGURE"));
    node.appendChild(figure);
}

function drawGalleryFigures(worksCollectionToDispose, noFadeIn = false) {
    function drawNothingToShowBox(rootNode) {
        drawWarningBox(rootNode, `${getVocab("GALLERY_NO_FIGURES_HERE")}`);
        rootNode.classList.add(getDynamicClass("FORCE_DISPLAY_FLEX"));
    }

    function doHandleNothingToShow(rootNode, worksCollectionToDispose) {
        const worksToDisplayAmount = worksCollectionToDispose.length ?? worksCollectionToDispose.size;

        if (worksToDisplayAmount === 0) {
            drawNothingToShowBox(rootNode);

            return true;
        }
        return false;
    }

    function doHandleFailedToGetFromApi(rootNode, worksCollectionToDispose) {
        if (failedToGetFromApi(worksCollectionToDispose)) {
            drawErrorBox(rootNode, `${getVocab("GALLERY_FIGURES_UNAVAILABLE")}`);
            rootNode.classList.add(getDynamicClass("FORCE_DISPLAY_FLEX"));
            drawRetryButton(rootNode);
            return true;
        }
        return false;
    }

    function freeRetryStateClasses(rootNode) {
        rootNode.classList.remove(getDynamicClass("FORCE_FLEX_COLUMN"));
        rootNode.classList.remove(getDynamicClass("FORCE_DISPLAY_FLEX"));
        rootNode.classList.remove(getDynamicClass("FAILED_TO_FETCH"));    
    }

    const rootNode = galleryComponentRootNodeGetter();
    rootNode.innerHTML = '';

    if (doHandleFailedToGetFromApi(rootNode, worksCollectionToDispose)) {
        return false;
    }

    freeRetryStateClasses(rootNode);

    if (doHandleNothingToShow(rootNode, worksCollectionToDispose)) {
        return true;
    }

    worksCollectionToDispose.forEach(element => doDrawGalleryFigures(rootNode, element, noFadeIn));
    return true;
}

/* [§ Drawers -> Gallery Filters] */
function doDrawGalleryFilters(node, element, opts = undefined) {
    function generateButtonEvent(filterButtonElement, categoryId) {
        const triggerFullUpdateSideEffect = null;

        filterButtonElement.addEventListener("click", () => {
            updateActiveFilterBtn(filterButtonElement);
            updateGalleryFigures(triggerFullUpdateSideEffect, categoryId);
        });
    }

    function generateButton(element, opts) {
        const button = document.createElement('button');
        const buttonTxt = document.createTextNode(element.name);
        const categoryId = element.id;

        button.classList.add(getDynamicClass("BTN"));
        button.classList.add(getDynamicClass("FILTER_BTN"));
        generateButtonEvent(button, categoryId);
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
    function freeRetryStateClasses(rootNode) {
        rootNode.classList.remove(getDynamicClass("FAILED_TO_FETCH"));
    }

    function drawDefaultFilterButton(rootNode) {
        doDrawGalleryFilters(rootNode, {
            "id": 0,
            "name": 'Tous'
        }, {
            classList: [
                getDynamicClass("FILTERS_BUTTONS_COMPONENT_BY_DEFAULT"),
                getDynamicClass("IS_ACTIVE_STATE")
            ]
        });
    }

    const rootNode = filtersComponentRootNodeGetter();
    rootNode.innerHTML = '';

    if (failedToGetFromApi(categoriesCollection)) {
        rootNode.classList.add(getDynamicClass("FAILED_TO_FETCH"));
        return false;
    }

    freeRetryStateClasses(rootNode);
    drawDefaultFilterButton(rootNode);

    categoriesCollection.forEach(element => doDrawGalleryFilters(rootNode, element));
    return true;
}

function appendModalAddPictureOptions(categoriesCollection) {
    const rootNode = modalAddPictureSelectRootNodeGetter();

    categoriesCollection.forEach(element => {
        const option = document.createElement('option');
        const optionTxt = document.createTextNode(element.name);
        const optionId = element.id;

        option.value = `${getMiscConf("SELECT_CATEGORY_ID_PREFIX")}${optionId}`;
        option.appendChild(optionTxt);
        rootNode.appendChild(option);
    });
}

/*** 🔄 Update */
/* [§ Update -> Active Filter Button] */
function updateActiveFilterBtn(element) {
    const activeClass = getDynamicClass("IS_ACTIVE_STATE");
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
async function updateGalleryFigures(worksCollection = null, worksCategoryId = -1, noFadeIn = false) {
    const maybeAlreadyInitialized = worksCategoryId !== -1;
    const triggerFullUpdateSideEffect = worksCollection === null;
    const rootNode = galleryComponentRootNodeGetter();

    rootNode.classList.add(getDynamicClass("FORCE_LOADING_ANIMATION"));

    if (triggerFullUpdateSideEffect) {
        worksCollection = await fetchWorksCollection();
    }

    if (failedToGetFromApi(worksCollection) && maybeAlreadyInitialized) {
        if (cacheIsNotInitialized()) {
            drawErrorToast(getDynamicId("FAILED_TO_LOAD_GALLERY_FIGURES_TOAST"), uniq = false);
            return false;
        } else {
            worksCollection = getCacheValue("WORKS");
        }
    }

    const worksCollectionToDispose = getWorksCollectionToDispose(worksCollection, worksCategoryId);

    rootNode.classList.remove(getDynamicClass("FORCE_LOADING_ANIMATION"));
    drawGalleryFigures(worksCollectionToDispose, noFadeIn);
    return worksCollectionToDispose;
}

/*** ✨ Side Effects */
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

    if (curHash === expectedHash) {
        scrollToFooter();
    }
}

/*** ✏️ Dynamic content generation */
async function appendEditor() {
    const isLogged = await isLoggedIn();

    setEditorVisibility(isLogged);
    setLoginButtonCtx(isLogged);
}

async function appendDynamicCategories() {
    const categoriesCollection = await fetchCategoriesCollection();

    if (failedToGetFromApi(categoriesCollection)) {
        const rootNode = galleryComponentRootNodeGetter();
        rootNode.classList.add(getDynamicClass("FAILED_TO_FETCH"));
        return false;
    }

    drawGalleryFilters(categoriesCollection);
    appendModalAddPictureOptions(categoriesCollection);
    updateCacheValue("FETCHED_CATEGORIES", true);
    return categoriesCollection;
}

async function appendDynamicWorks() {
    const worksCollection = await fetchWorksCollection();

    await updateGalleryFigures(worksCollection);
    return worksCollection;
}

/*** 💥 Crash */
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
            initializeGallery(retryContext = true);
        });
    }

    if (!retryContext) {
        drawCrashErrorBox(crashNode);
        drawCrashRetryButton(crashNode);
    }
}

/*** 🚀 Run */
async function initializeGallery(retryContext = false) {
    const dynamicCategories = await appendDynamicCategories();
    const filtersComponentNode = filtersComponentRootNodeGetter();

    await appendEditor();

    if (failedToGetFromApi(dynamicCategories)) {
        crash(filtersComponentNode, retryContext);
        if (!retryContext) {
            filtersComponentNode.classList.add(getDynamicClass("FORCE_FLEX_COLUMN"));
        } else {
            drawErrorToast(getDynamicId("FAILED_TO_LOAD_GALLERY_FIGURES_TOAST"));
        }
        return;
    }

    if (retryContext) {
        filtersComponentNode.classList.remove(getDynamicClass("FORCE_FLEX_COLUMN"));
    }

    await appendDynamicWorks();
}

/*** 🚪 Entry point */
async function main() {
    try {
        handleContactHash();
        await initializeGallery();
        handleContactHash();
    } catch (e) {
        console.error(e);
    }
}

main();
