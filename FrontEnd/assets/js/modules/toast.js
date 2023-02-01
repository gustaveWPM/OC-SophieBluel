/*
#=================================================
# * ... Toasts Manager
#-------------------------------------------------
# * ... Handles toasts notifications
#=================================================
*/

/* [§ Drawers -> Toasts] */
function drawToast(id, msg, uniq=true) {
    const rootNode = document.querySelector(getSelector(getDynamicClass("TOASTS_COMPONENT")));
    function createToastThread(toast) {
        rootNode.appendChild(toast);
        setTimeout(() => toast.classList.add(getDynamicClass("SHOW_TOAST")), 150);
        setTimeout(() => toast.classList.remove(getDynamicClass("SHOW_TOAST")), 2000);
        setTimeout(() => toast.remove(), 2800);
    }

    const curToastsAmount = rootNode.getElementsByTagName('*').length;
    if (document.querySelector(getSelector(id)) !== null && uniq) {
        return null;
    }
    if (__GLOBALS.MODULES_CONFIG.MAX_TOASTS <= curToastsAmount) {
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
