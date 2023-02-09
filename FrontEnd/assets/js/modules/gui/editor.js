/*
#=================================================
# * ... Gallery Editor
#-------------------------------------------------
# * ... Editor close/open functions + Add/Delete
#=================================================
*/

let __MEMO_FOCUS = null;

/*** 🖋️ [§ Editor] */
/* 👁️ [§ Editor -> Visibility] */
function disableEditor() {
    const editorElements = document.querySelectorAll(getSelector("EDITOR_ELEMENT"));
    const hiddenElements = document.querySelectorAll(getSelector("HIDE_WHEN_EDITOR_ENABLED"));

    editorElements.forEach(element => {
        element.setAttribute("aria-hidden", "true");
        element.classList.add(getDynamicClass("HIDDEN_EDITOR_ELEMENT"));
    });
    hiddenElements.forEach(element => {
        element.removeAttribute("aria-hidden");
        element.classList.remove(getDynamicClass("HIDDEN_EDITOR_ELEMENT"));
    });
}

function enableEditor() {
    const editorElements = document.querySelectorAll(getSelector("EDITOR_ELEMENT"));
    const hiddenElements = document.querySelectorAll(getSelector("HIDE_WHEN_EDITOR_ENABLED"));

    editorElements.forEach(element => {
        element.removeAttribute("aria-hidden");
        element.classList.remove(getDynamicClass("HIDDEN_EDITOR_ELEMENT"));
    });
    hiddenElements.forEach(element => {
        element.setAttribute("aria-hidden", "true");
        element.classList.add(getDynamicClass("HIDDEN_EDITOR_ELEMENT"));
    });
}

function setEditorVisibility(isLoggedIn) {
    isLoggedIn ? enableEditor() : disableEditor();
}

/*** 🪟 Modal */
/* 🎨 [§ Modal -> State 1 Drawers] */
function doDrawModalGalleryContent(rootNode, element, isFirst) {
    function generateImg(alt, url) {
        const img = document.createElement('img');
        img.setAttribute('src', url);
        img.setAttribute('alt', alt);
        img.classList.add(getDynamicClass("MODAL_GALLERY_ELEMENT_IMG"));

        return img;
    }

    async function deleteWorkElementById(id) {
        try {
            const response = await deleteWorkById(id);

            if (response.ok) {
                const triggerCacheUpdateSideEffect = null;
                await updateGalleryFigures(triggerCacheUpdateSideEffect, worksCategoryId = 0, noFadeIn = true);
                updateModalGalleryContent();
                drawSuccessToast(getDynamicId("DELETED_ELEMENT_SUCCESS_TOAST"), uniq = false);
            } else {
                response.status === getMiscConf("SERVICE_UNAVAILABLE_CODE") ?
                    drawErrorToast(getDynamicId("CANT_CONNECT_TOAST"), uniq = false) :
                    drawErrorToast(getDynamicId("FAILED_TO_DELETE_TOAST", uniq = false));
            }
        } catch {
            drawErrorToast(getDynamicId("CANT_CONNECT_TOAST"), uniq = false);
        }
    }

    function generateGalleryElementDeleteBtnEvent(element, id) {
        element.addEventListener("click", (event) => {
            event.preventDefault();
            deleteWorkElementById(id);
        });
    }

    function generateGalleryElementButtons(firstElement = false, elementId) {
        const galleryElementButtonsWrapper = document.createElement('div');
        galleryElementButtonsWrapper.classList.add(getDynamicClass("MODAL_GALLERY_ELEMENT_BTNS"));
        const galleryElementMoveButtonItem = document.createElement('a');
        galleryElementMoveButtonItem.href = "#";
        const galleryElementMoveButtonImg = generateImg('Bouton déplacer', './assets/icons/button-move.svg');

        const galleryElementDeleteButtonItem = document.createElement('a');
        galleryElementDeleteButtonItem.href = "#";
        const galleryElementDeleteButtonImg = generateImg('Bouton supprimer', './assets/icons/button-trash.svg');

        galleryElementMoveButtonItem.append(galleryElementMoveButtonImg);
        galleryElementDeleteButtonItem.append(galleryElementDeleteButtonImg);
        galleryElementMoveButtonItem.classList.add(getDynamicClass("MODAL_GALLERY_MOVE_BTN"));
        galleryElementDeleteButtonItem.classList.add(getDynamicClass("MODAL_GALLERY_TRASH_BTN"));

        generateGalleryElementDeleteBtnEvent(galleryElementDeleteButtonImg, elementId);
        if (firstElement) {
            galleryElementButtonsWrapper.append(galleryElementMoveButtonItem);
        }
        galleryElementButtonsWrapper.append(galleryElementDeleteButtonItem);
        return galleryElementButtonsWrapper;
    }

    function generateGalleryElementEditBtn() {
        const editBtnWrapper = document.createElement('div');
        const editBtn = document.createElement('a');
        const editBtnTxt = document.createTextNode(getVocab("EDIT"));
        editBtn.href = "#";
        editBtn.appendChild(editBtnTxt);
        editBtnWrapper.append(editBtn);

        return editBtnWrapper;
    }

    function generateGalleryElementEditBtnEvent(element, id) {
        element.addEventListener("click", () => console.log(`{ToDo} Ouverture de l'éditeur pour l'élément ayant comme id ${id}. N'est pas dans le périmètre de l'itération concernée par le projet.`));
    }

    function generateGalleryElement(galleryElementImg, elementId, isFirst = false) {
        const galleryElementWrapper = document.createElement('div');
        const galleryElementButtons = generateGalleryElementButtons(isFirst, elementId);
        const galleryElementEditBtn = generateGalleryElementEditBtn();
        generateGalleryElementEditBtnEvent(galleryElementEditBtn, elementId);

        galleryElementWrapper.append(galleryElementButtons);
        galleryElementWrapper.append(galleryElementImg);
        galleryElementWrapper.append(galleryElementEditBtn);
        return galleryElementWrapper;
    }

    const [title, imgUrl, elementId] = [element.title, element.imageUrl, element.id];
    const alt = title;
    const img = generateImg(alt, imgUrl);
    const galleryElement = generateGalleryElement(img, elementId, isFirst);

    galleryElement.classList.add(getDynamicClass("MODAL_GALLERY_ELEMENT"));
    rootNode.appendChild(galleryElement);
}

function drawModalGalleryContent(worksCollection) {
    function drawNothingToShowBox(rootNode) {
        drawWarningBox(rootNode, `${getVocab("GALLERY_NO_FIGURES_HERE")}`);
        rootNode.classList.add(getDynamicClass("FORCE_DISPLAY_FLEX"));
    }

    const rootNode = document.querySelector(getSelector("MODAL_GALLERY"));
    let firstIteration = true;
    rootNode.innerHTML = '';

    const worksToDisplayAmount = worksCollection.length ?? worksCollection.size;
    if (worksToDisplayAmount === 0) {
        drawNothingToShowBox(rootNode);
        return;
    }
    rootNode.classList.remove(getDynamicClass("FORCE_DISPLAY_FLEX"));
    worksCollection.forEach(element => {
        doDrawModalGalleryContent(rootNode, element, firstIteration);
        firstIteration = false;
    });
}

/* 🔄 [§ Modal -> Updates] */
function hideModalGoBackButton() {
    const goBackBtnElement = document.querySelector(getSelector("MODAL_GO_BACK_EDITOR"));
    goBackBtnElement.classList.add(getDynamicClass("HIDDEN_EDITOR_ELEMENT"));
}

function showModalGoBackButton() {
    const goBackBtnElement = document.querySelector(getSelector("MODAL_GO_BACK_EDITOR"));
    goBackBtnElement.classList.remove(getDynamicClass("HIDDEN_EDITOR_ELEMENT"));
}

function updateModalGalleryContent() {
    if (cacheIsNotInitialized()) {
        return;
    }

    const worksCollection = __GALLERY_CACHE.WORKS;
    hideModalGoBackButton();
    drawModalGalleryContent(worksCollection);
}

function updateModalAddPictureContent() {
    showModalGoBackButton();
}

function updateModal(stateId) {
    switch (stateId) {
        case 1:
            updateModalGalleryContent();
            break;
        case 2:
            updateModalAddPictureContent();
            break;
    }
}

/* 🎰 [§ Modal -> States] */
function modalSetState(stateId) {
    const stateAmounts = 2;
    const modalStatePrefix = getDynamicClass("MODAL_STATE_PREFIX");

    for (let curStateId = 0; curStateId <= stateAmounts; curStateId++) {
        let curModalStateSelector = `.${modalStatePrefix}${curStateId}`;
        let curModalState = document.querySelector(curModalStateSelector);
        if (!curModalState) {
            continue;
        }
        let curModalStateFocusables = document.querySelectorAll(`${curModalStateSelector} a, ${curModalStateSelector} button`);
        if (curStateId !== stateId) {
            curModalState.classList.add(getDynamicClass("FORCE_DISPLAY_NONE"));
            curModalStateFocusables.forEach(element => element.classList.add(getDynamicClass("HIDDEN_EDITOR_ELEMENT")));
        } else {
            curModalState.classList.remove(getDynamicClass("FORCE_DISPLAY_NONE"));
            curModalStateFocusables.forEach(element => element.classList.remove(getDynamicClass("HIDDEN_EDITOR_ELEMENT")));
        }
    }
    updateModal(stateId);
}

function setDefaultModalState() {
    modalSetState(1);
}

/* 👁️ [§ Modal -> Open/Close State] */
function openEditorModal(modalElement) {
    if (cacheIsNotInitialized()) {
        drawErrorToast(getDynamicId("FAILED_TO_OPEN_GALLERY_EDITOR_MODAL_TOAST"), uniq = false);
        return;
    }

    __MEMO_FOCUS = document.querySelector(getSelector("CURRENT_FOCUSED_ELEMENT"));
    const editorModalElement = document.querySelector(getSelector("EDITOR_COMPONENT"));
    editorModalElement.removeAttribute("aria-hidden");
    editorModalElement.setAttribute("aria-modal", "true");
    editorModalElement.classList.remove(getDynamicClass("FORCE_DISPLAY_NONE"));

    const selector = getSelector("MODAL_FOCUSABLES");
    const firstFocusableElement = [...modalElement.querySelectorAll(selector)].at(0);
    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }
    disableScroll();
    setDefaultModalState();
}

function closeEditorModal(modalElement) {
    const editorModalElement = document.querySelector(getSelector("EDITOR_COMPONENT"));
    editorModalElement.setAttribute("aria-hidden", "true");
    editorModalElement.removeAttribute("aria-modal");
    editorModalElement.classList.add(getDynamicClass("FORCE_DISPLAY_NONE"));
    enableScroll();

    if (__MEMO_FOCUS !== null) {
        __MEMO_FOCUS.focus();
        __MEMO_FOCUS = null;
    }
}

/* 📐 [§ Modal -> Events Generator] */
function appendModalVisibilityEvents() {
    function galleryConditionalFocus(shiftkeyPressed, modalElement) {
        let focusElement = null;
        const selector = getSelector("MODAL_FOCUSABLES");
        if (shiftkeyPressed) {
            const lastFocusableElement = [...modalElement.querySelectorAll(selector)].at(-1);
            focusElement = (lastFocusableElement) ? lastFocusableElement : null;
            console.log(lastFocusableElement);
        } else {
            focusElement = modalElement.querySelector(selector);
        }
        return focusElement;
    }

    function generateDeleteTheWholeGalleryEvent() {
        const deleteTheWholeGalleryBtn = document.querySelector(getSelector("MODAL_GALLERY_DELETE_ALL_BUTTON"));
        deleteTheWholeGalleryBtn.addEventListener("click", () => console.log(`{ToDo} Réinitialiser la galerie. N'est pas dans le périmètre de l'itération concernée par le projet.`));
    }

    function generateOpenModalEvents() {
        const openModalBtnElements = document.querySelectorAll(getSelector("OPEN_EDITOR"));

        openModalBtnElements.forEach(element => element.addEventListener("click", (event) => {
            event.preventDefault();
            openEditorModal(modalElement);
        }));
    }

    function generateCloseModalEvents() {
        const closeModalBtnElements = document.querySelectorAll(getSelector("CLOSE_EDITOR"));

        closeModalBtnElements.forEach(element => element.addEventListener("click", (event) => {
            event.preventDefault();
            closeEditorModal(modalElement);
        }));
    }

    function generateGoBackEvent() {
        const goBackBtnElement = document.querySelector(getSelector("MODAL_GO_BACK_EDITOR"));
        goBackBtnElement.addEventListener("click", () => {
            modalSetState(1);
        });
    }

    function generateEditorBannerFocusRescue(modalElement) {
        const bannerElement = document.querySelector(getSelector("EDITOR_BANNER"));

        bannerElement.addEventListener("transitionend", () => {
            const outOfScopeElementCurrentlyFocused = document.querySelector(getSelector("CURRENT_FOCUSED_ELEMENT"));
            if (outOfScopeElementCurrentlyFocused !== null) {
                const focusElement = galleryConditionalFocus(shiftkeyPressed = false, modalElement);
                if (focusElement !== null) {
                    focusElement.focus();
                }
            }
        });
    }

    function generateKeyboardEvents(modalElement) {
        window.addEventListener("keydown", (event) => {
            if (event.key == "Escape" || event.key == "Esc") {
                closeEditorModal(modalElement);
            } else {
                modalElement.addEventListener("transitionend", () => {
                    const outOfScopeElementCurrentlyFocused = document.querySelector(getSelector("CURRENT_FOCUSED_ELEMENT"));
                    if (outOfScopeElementCurrentlyFocused !== null) {
                        const focusElement = galleryConditionalFocus(event.shiftKey, modalElement);
                        if (focusElement !== null) {
                            focusElement.focus();
                        }
                    }
                });
            }
        });
    }

    function generateAddWorkButtonEvent() {
        const addWorkButtonElement = document.querySelector(getSelector("MODAL_ADD_WORK_BUTTON"));
        addWorkButtonElement.addEventListener("click", () => {
            modalSetState(2);
        });
    }

    const modalElement = document.querySelector(getSelector("EDITOR_COMPONENT"));

    generateEditorBannerFocusRescue(modalElement);
    generateKeyboardEvents(modalElement);
    generateOpenModalEvents();
    generateCloseModalEvents();
    generateDeleteTheWholeGalleryEvent();
    generateGoBackEvent();
    generateAddWorkButtonEvent();
}

/*** ✨ [§ Side Effects] */
function disableScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    window.onscroll = () => window.scrollTo(scrollLeft, scrollTop);
    document.documentElement.style.overflow = 'hidden';
}

function enableScroll() {
    window.onscroll = () => {};
    document.documentElement.style.overflow = 'auto';
}

/*** 🚀 Run */
function generateModalEvents() {
    appendModalVisibilityEvents();
}

function hideModals() {
    const modals = document.querySelectorAll(getSelector("MODAL_WRAPPER"));

    if (modals === null) {
        return;
    }
    modals.forEach(element => {
        element.classList.add(getDynamicClass("FORCE_DISPLAY_NONE"))
    });
}

function setupModal() {
    generateModalEvents();
    hideModals();
}

setupModal();
