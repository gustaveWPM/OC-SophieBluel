/*
#=================================================
# * ... Toasts Manager
#-------------------------------------------------
# * ... Handles toasts notifications
#=================================================
*/

/* [§ Drawers -> Toasts] */
function createToastThread(toast) {
    const rootNode = document.querySelector(getSelector(getDynamicClass("TOASTS_COMPONENT")));
    rootNode.appendChild(toast);
    setTimeout(() => toast.classList.add(getDynamicClass("SHOW_TOAST")), 250);
    setTimeout(() => toast.classList.remove(getDynamicClass("SHOW_TOAST")), 4500);
    setTimeout(() => toast.remove(), 7500);
}

function drawToast(id, msg, uniq=true) {
    if (document.querySelector(getSelector(id)) !== null && uniq) {
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

function drawErrorToast(id, uniq=true) {
    const msg = getVocab(id) ?? getVocab("UNKNOWN_ERROR");
    const toast = drawToast(id, msg, uniq);

    if (toast !== null) {
        toast.classList.add(getDynamicClass("ERROR_BOX"));
    }
    return toast;
}
