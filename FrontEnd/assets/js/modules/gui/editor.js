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
function doDrawModalGalleryContent(rootNode, element) {
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

    function generateGalleryElementMoveBtnEvent(element, id) {
        function behaviourPlaceholder(id) {
            console.log(`{ToDo} Déplacement de l'élément ayant comme id ${id}. N'est pas dans le périmètre de l'itération concernée par le projet.`);
        }

        element.addEventListener("click", () => behaviourPlaceholder(id));
    }

    function generateGalleryElementButtons(elementId) {
        function generateGalleryMoveButton() {
            const galleryElementMoveButtonItem = document.createElement('a');
            const galleryElementMoveButtonImg = generateImg('Bouton déplacer', './assets/icons/button-move.svg');

            galleryElementMoveButtonItem.href = "#";
            galleryElementMoveButtonItem.append(galleryElementMoveButtonImg);
            galleryElementMoveButtonItem.classList.add(getDynamicClass("MODAL_GALLERY_MOVE_BTN"));

            return galleryElementMoveButtonItem;
        }

        function generateGalleryDeleteButton() {
            const galleryElementDeleteButtonItem = document.createElement('a');
            const galleryElementDeleteButtonImg = generateImg('Bouton supprimer', './assets/icons/button-trash.svg');

            galleryElementDeleteButtonItem.href = "#";
            galleryElementDeleteButtonItem.append(galleryElementDeleteButtonImg);
            galleryElementDeleteButtonItem.classList.add(getDynamicClass("MODAL_GALLERY_TRASH_BTN"));

            return galleryElementDeleteButtonItem;
        }

        function appendMoveButton(galleryElementButtonsWrapper, galleryElementMoveButtonItem, elementId) {
            generateGalleryElementMoveBtnEvent(galleryElementMoveButtonItem, elementId);
            galleryElementButtonsWrapper.append(galleryElementMoveButtonItem);
        }

        function process() {
            const galleryElementButtonsWrapper = document.createElement('div');
            const galleryElementMoveButtonItem = generateGalleryMoveButton();
            const galleryElementDeleteButtonItem = generateGalleryDeleteButton();

            galleryElementButtonsWrapper.classList.add(getDynamicClass("MODAL_GALLERY_ELEMENT_BTNS"));

            generateGalleryElementDeleteBtnEvent(galleryElementDeleteButtonItem, elementId);
            appendMoveButton(galleryElementButtonsWrapper, galleryElementMoveButtonItem, elementId);
            galleryElementButtonsWrapper.append(galleryElementDeleteButtonItem);

            return galleryElementButtonsWrapper;
        }

        return process();
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
        function behaviourPlaceholder(id) {
            console.log(`{ToDo} Ouverture de l'éditeur pour l'élément ayant comme id ${id}. N'est pas dans le périmètre de l'itération concernée par le projet.`);
        }

        element.addEventListener("click", () => behaviourPlaceholder(id));
    }

    function generateGalleryElement(galleryElementImg, elementId) {
        const galleryElementWrapper = document.createElement('div');
        const galleryElementButtons = generateGalleryElementButtons(elementId);
        const galleryElementEditBtn = generateGalleryElementEditBtn();

        generateGalleryElementEditBtnEvent(galleryElementEditBtn, elementId);

        galleryElementWrapper.append(galleryElementButtons);
        galleryElementWrapper.append(galleryElementImg);
        galleryElementWrapper.append(galleryElementEditBtn);
        return galleryElementWrapper;
    }

    function generateGalleryElementMoveButtonVisibilityEvent(element) {
        const moveBtn = element.querySelector(getSelector("MODAL_GALLERY_MOVE_BTN"));
        element.addEventListener("mouseover", () => moveBtn.classList.add("is-active"));
        element.addEventListener("mouseout", () => moveBtn.classList.remove("is-active"));
    }

    function process() {
        const [title, imgUrl, elementId] = [element.title, element.imageUrl, element.id];
        const alt = title;
        const img = generateImg(alt, imgUrl);
        const galleryElement = generateGalleryElement(img, elementId);
    
        generateGalleryElementMoveButtonVisibilityEvent(galleryElement);
        galleryElement.classList.add(getDynamicClass("MODAL_GALLERY_ELEMENT"));
        rootNode.appendChild(galleryElement);
    }

    process();
}

function drawModalGalleryContent(worksCollection) {
    function drawNothingToShowBox(rootNode) {
        drawWarningBox(rootNode, `${getVocab("GALLERY_NO_FIGURES_HERE")}`);
        rootNode.classList.add(getDynamicClass("FORCE_DISPLAY_FLEX"));
    }

    function doHandleNothingToShow(rootNode, worksCollection) {
        const worksToDisplayAmount = worksCollection.length ?? worksCollection.size;

        if (worksToDisplayAmount === 0) {
            drawNothingToShowBox(rootNode);

            return true;
        }
        return false;
    }

    function process() {
        const rootNode = document.querySelector(getSelector("MODAL_GALLERY"));
        rootNode.innerHTML = '';

        if (doHandleNothingToShow(rootNode, worksCollection)) {
            return;
        }

        rootNode.classList.remove(getDynamicClass("FORCE_DISPLAY_FLEX"));
        worksCollection.forEach(element => doDrawModalGalleryContent(rootNode, element));
    }

    process();
}

function sendNewWorkForm(payload) {
    let formData = new FormData();
    console.log(payload);

//    formData.append("", "");
//    formData.append("", "");
}

function generateSubmitButtonEvent() {
    const submitButton = document.querySelector(getSelector("SEND_IMG_FORM"));

    submitButton.addEventListener("submit", (event) => {
        event.preventDefault();
        const workTitle = event.target.querySelector("[name=title]").value;
        const category = event.target.querySelector(".select").value;

        const payload = {workTitle, category};
        sendNewWorkForm(payload);
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

    const worksCollection = getCacheValue("WORKS");
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
    const statesAmount = 2;
    const modalStatePrefix = getDynamicClass("MODAL_STATE_PREFIX");

    for (let curStateId = 0; curStateId <= statesAmount; curStateId++) {
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
    function skipOpenEditorModal() {
        if (cacheIsNotInitialized()) {
            drawErrorToast(getDynamicId("FAILED_TO_OPEN_GALLERY_EDITOR_MODAL_TOAST"), uniq = false);
            return true;
        }
        return false;
    }

    function updateAttributes() {
        const editorModalElement = document.querySelector(getSelector("EDITOR_COMPONENT"));
        editorModalElement.removeAttribute("aria-hidden");
        editorModalElement.setAttribute("aria-modal", "true");
        editorModalElement.classList.remove(getDynamicClass("FORCE_DISPLAY_NONE"));    
    }

    function forceFocus() {
        const selector = getSelector("MODAL_FOCUSABLES");
        const firstFocusableElement = modalElement.querySelector(selector);

        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }    
    }

    function process() {
        if (skipOpenEditorModal()) {
            return;
        }

        __MEMO_FOCUS = document.querySelector(getSelector("CURRENT_FOCUSED_ELEMENT"));
        updateAttributes();

        forceFocus();
        disableScroll();
        setDefaultModalState();
    }

    process();
}

function closeEditorModal() {
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
    function editorConditionalFocus(shiftkeyPressed, modalElement) {
        let focusElement = null;
        const selector = getSelector("MODAL_FOCUSABLES");
        if (shiftkeyPressed) {
            const lastFocusableElement = [...modalElement.querySelectorAll(selector)].at(-1);
            focusElement = (lastFocusableElement) ? lastFocusableElement : null;
        } else {
            focusElement = modalElement.querySelector(selector);
        }
        return focusElement;
    }

    function generateCloseModalOnClick() {
        function stopCloseModalOnClickPropagation(event) {
            event.stopPropagation();
        }

        const modalElement = document.querySelector(getSelector("EDITOR_COMPONENT"));
        const modalWindowElements = document.querySelectorAll(getSelector("MODAL"));

        modalElement.addEventListener("click", () => {
            closeEditorModal()
        });
        modalWindowElements.forEach(
            element => element.addEventListener("click", (event) => stopCloseModalOnClickPropagation(event))
        );
    }

    function generateDeleteTheWholeGalleryEvent() {
        function behaviourPlaceholder() {
            console.log(`{ToDo} Réinitialiser la galerie. N'est pas dans le périmètre de l'itération concernée par le projet.`);
        }
        const deleteTheWholeGalleryBtn = document.querySelector(getSelector("MODAL_GALLERY_DELETE_ALL_BUTTON"));
        deleteTheWholeGalleryBtn.addEventListener("click", () => behaviourPlaceholder());
    }

    function generateOpenModalEvents(modalElement) {
        const openModalBtnElements = document.querySelectorAll(getSelector("OPEN_EDITOR"));

        openModalBtnElements.forEach(element => element.addEventListener("click", (event) => {
            event.preventDefault();
            openEditorModal(modalElement);
        }));
    }

    function generateCloseModalEvents(modalElement) {
        const closeModalBtnElements = document.querySelectorAll(getSelector("CLOSE_EDITOR"));

        closeModalBtnElements.forEach(element => element.addEventListener("click", (event) => {
            event.preventDefault();
            closeEditorModal();
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
                const focusElement = editorConditionalFocus(shiftkeyPressed = false, modalElement);
                if (focusElement !== null) {
                    focusElement.focus();
                }
            }
        });
    }

    function generateKeyboardEvents(modalElement) {
        window.addEventListener("keydown", (event) => {
            if (event.key == "Escape" || event.key == "Esc") {
                closeEditorModal();
            } else {
                modalElement.addEventListener("transitionend", () => {
                    const outOfScopeElementCurrentlyFocused = document.querySelector(getSelector("CURRENT_FOCUSED_ELEMENT"));
                    if (outOfScopeElementCurrentlyFocused !== null) {
                        const focusElement = editorConditionalFocus(event.shiftKey, modalElement);
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

    function process() {
        const modalElement = document.querySelector(getSelector("EDITOR_COMPONENT"));

        generateEditorBannerFocusRescue(modalElement);
        generateKeyboardEvents(modalElement);
        generateOpenModalEvents(modalElement);
        generateCloseModalEvents(modalElement);
        generateDeleteTheWholeGalleryEvent();
        generateGoBackEvent();
        generateAddWorkButtonEvent();
        generateCloseModalOnClick();
        generateSubmitButtonEvent();
    }

    process();
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
