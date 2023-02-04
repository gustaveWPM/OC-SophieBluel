/*
#=================================================
# * ... Gallery Editor
#-------------------------------------------------
# * ... ¯\_(ツ)_/¯
#=================================================
*/

/*** 👁️ [§ Visibility] */
function disableEditor() {
    const editorElements = document.querySelectorAll(getSelector("EDITOR_ELEMENT"));
    const hiddenElements = document.querySelectorAll(getSelector("HIDE_WHEN_EDITOR_ENABLED"));
    editorElements.forEach(element => element.classList.add(getDynamicClass("HIDDEN_EDITOR_ELEMENT")));
    hiddenElements.forEach(element => element.classList.remove(getDynamicClass("HIDDEN_EDITOR_ELEMENT")));
}

function enableEditor() {
    const editorElements = document.querySelectorAll(getSelector("EDITOR_ELEMENT"));
    const hiddenElements = document.querySelectorAll(getSelector("HIDE_WHEN_EDITOR_ENABLED"));
    editorElements.forEach(element => element.classList.remove(getDynamicClass("HIDDEN_EDITOR_ELEMENT")));
    hiddenElements.forEach(element => element.classList.add(getDynamicClass("HIDDEN_EDITOR_ELEMENT")));
}

function setEditorVisibility(isLoggedIn) {
    isLoggedIn ? enableEditor() : disableEditor();
}
