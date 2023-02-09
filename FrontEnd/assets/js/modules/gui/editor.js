/*
#=================================================
# * ... Gallery Editor
#-------------------------------------------------
# * ... ¯\_(ツ)_/¯
#=================================================
*/

let __MEMO_FOCUS = null;

/*** Editor */
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

/*** Modal */
/* 🎨 [§ Modal -> Drawers] */
function doDrawModalGalleryContent(rootNode, element, isFirst) {
    function generateImg(alt, url) {
        const img = document.createElement('img');
        img.setAttribute('src', url);
        img.setAttribute('alt', alt);
        img.classList.add('gallery-element-img');

        return img;
    }

    async function deleteWorkElementById(id) {
        try {
            const response = await deleteWorkById(id);

            if (response?.ok) {
                deleteCacheWorkElementById(id);
                updateModalGalleryContent();    
            } else {
                drawErrorToast(getDynamicId("FAILED_TO_LOAD_GALLERY_FIGURES_TOAST"));
//                drawErrorToast(getDynamicId("FAILED_TO_DELETE_TOAST", uniq = false));
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
        galleryElementButtonsWrapper.classList.add('gallery-element-btns');
        const galleryElementMoveButtonItem = generateImg('Bouton déplacer', './assets/icons/button-move.svg');
        const galleryElementDeleteButtonItem = generateImg('Bouton supprimer', './assets/icons/button-trash.svg');

        galleryElementMoveButtonItem.classList.add('gallery-move-btn');
        galleryElementDeleteButtonItem.classList.add('gallery-trash-btn');

        generateGalleryElementDeleteBtnEvent(galleryElementDeleteButtonItem, elementId);
        if (firstElement) {
            galleryElementButtonsWrapper.append(galleryElementMoveButtonItem);
        }
        galleryElementButtonsWrapper.append(galleryElementDeleteButtonItem);
        return galleryElementButtonsWrapper;
    }

    function generateGalleryElementEditBtn() {
        const editBtnWrapper = document.createElement('div');
        const editBtn = document.createElement('a');
        const editBtnTxt = document.createTextNode('éditer');
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

    galleryElement.classList.add('gallery-element');
    rootNode.appendChild(galleryElement);
}

function drawModalGalleryContent(worksCollection) {
    const rootNode = document.querySelector(".modal-gallery");
    let firstIteration = true;
    rootNode.innerHTML = '';

    worksCollection.forEach(element => {
        doDrawModalGalleryContent(rootNode, element, firstIteration);
        firstIteration = false;
    });
}

/* 🔄 [§ Modal -> Updates] */
function updateModalGalleryContent() {
    if (cacheIsEmpty()) {
        return;
    }

    const worksCollection = __GALLERY_CACHE.WORKS;
    drawModalGalleryContent(worksCollection);
}

function updateModal(stateId) {
    switch (stateId) {
        case 1:
            updateModalGalleryContent();
            break;
        case 2:
            break;
    }
}

/* 🎰 [§ Modal -> States] */
function modalSetState(stateId) {
    const stateAmounts = 2;
    const modalStatePrefix = 'modal-state-';

    for (let curStateId = 0; curStateId <= stateAmounts; curStateId++) {
        let curModalStateSelector = `.${modalStatePrefix}${curStateId}`;
        let curModalState = document.querySelector(curModalStateSelector);
        if (!curModalState) {
            continue;
        }
        if (curStateId !== stateId) {
            curModalState.classList.add(getDynamicClass("FORCE_DISPLAY_NONE"));
        } else {
            curModalState.classList.remove(getDynamicClass("FORCE_DISPLAY_NONE"));
        }
    }
    updateModal(stateId);
}

function setDefaultModalState() {
    modalSetState(1);
}

/* 👁️ [§ Modal -> Open/Close State] */
function openEditorModal(modalElement) {
    if (cacheIsEmpty()) {
        drawErrorToast(getDynamicId("FAILED_TO_OPEN_GALLERY_EDITOR_MODAL_TOAST"), uniq = false);
        return;
    }

    __MEMO_FOCUS = document.querySelector(':focus');
    const editorModalElement = document.querySelector("#editor-component");
    editorModalElement.removeAttribute("aria-hidden");
    editorModalElement.setAttribute("aria-modal", "true");
    editorModalElement.classList.remove(getDynamicClass("FORCE_DISPLAY_NONE"));
    focusElement = modalElement.querySelector('a');
    focusElement.focus();
    setDefaultModalState();
}

function closeEditorModal(modalElement) {
    const editorModalElement = document.querySelector("#editor-component");
    editorModalElement.setAttribute("aria-hidden", "true");
    editorModalElement.removeAttribute("aria-modal");
    editorModalElement.classList.add(getDynamicClass("FORCE_DISPLAY_NONE"));

    if (__MEMO_FOCUS !== null) {
        __MEMO_FOCUS.focus();
        __MEMO_FOCUS = null;
    }
}

/* 📐 [§ Modal -> Events Generator] */
function appendModalVisibilityEvents() {
    const modalElement = document.querySelector('#editor-component');
    const openModalBtnElements = document.querySelectorAll('.open-editor');
    const closeModalBtnElements = document.querySelectorAll('.close-editor');

    openModalBtnElements.forEach(element => element.addEventListener("click", (event) => {
        event.preventDefault();
        openEditorModal(modalElement);
    }));
    closeModalBtnElements.forEach(element => element.addEventListener("click", (event) => {
        event.preventDefault();
        closeEditorModal(modalElement);
    }));

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" || event.key === "Esc") {
            closeEditorModal(modalElement);
        }

        modalElement.addEventListener('transitionend', () => {
            let focusElement = null;
            if (event.shiftKey) {
                const lastFocusableElement = [...modalElement.querySelectorAll('a')].at(-1);
                focusElement = (lastFocusableElement) ? lastFocusableElement : null;
                console.log(focusElement);
            } else {
                focusElement = modalElement.querySelector('a');
            }
            if (focusElement !== null) {
                focusElement.focus();
            }
        });
    });
}

function generateModalEvents() {
    appendModalVisibilityEvents();
}

function hideModals() {
    const modals = document.querySelectorAll('.modal');

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
