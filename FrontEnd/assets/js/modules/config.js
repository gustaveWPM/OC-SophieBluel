/*
#=================================================
# * ... Config
#-------------------------------------------------
# * ... Config values
#=================================================
*/

/*** 🌕 [§ Globals] */
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
        console.error(`No configured side effect config value found with this key: ${key}`)
    }
    return value;
}

function getPageUrl(key) {
    const value = __GLOBALS.PAGES_URLS[key];
    if (value === undefined) {
        console.error(`No configured page URL found with this key: ${key}`)
    }
    return value;
}

function getLocalStorageKey(key) {
    const value = __GLOBALS.LOCALSTORAGE_KEYS[key];
    if (value === undefined) {
        console.error(`No localstorage key found with this key: ${key}`)
    }
    return value;
}

function getCacheConf(key) {
    const value = __GLOBALS.CACHE_KEYS[key];
    if (value === undefined) {
        console.error(`No cache configuration value found with this key: ${key}`)
    }
    return value;
}

function getMiscConf(key) {
    const value = __GLOBALS.MISC[key];
    if (value === undefined) {
        console.error(`No misc configuration value found with this key: ${key}`)
    }
    return value;
}

/* [§ Dynamic classes, id, and API Host] */
let __GLOBALS = {
    "DYN_CLASSES": {
        "GALLERY_FIGURE": 'gallery-figure',
        "FILTERS_BUTTONS_COMPONENT_IS_ACTIVE": 'is-active',
        "FILTERS_BUTTONS_COMPONENT_BY_DEFAULT": 'by-default',
        "FAILED_TO_FETCH": 'failed-to-fetch',
        "TOAST": 'is-toast',
        "SHOW_TOAST": 'show',
        "BOX": 'is-box',
        "BTN": 'is-btn',
        "FILTER_BTN": 'filter-btn',
        "INFO_BOX": 'info-box',
        "ERROR_BOX": 'error-box',
        "WARNING_BOX": 'warning-box',
        "PREVENT_SELECT": 'prevent-select',
        "OPEN_EDITOR": 'open-editor',
        "CLOSE_EDITOR": 'close-editor',
        "EDITOR_ELEMENT": 'is-editor-element',
        "EDITOR_COMPONENT": 'editor-component',
        "EDITOR_BANNER": 'editor-banner',
        "MODAL_WRAPPER": 'modal-wrapper',
        "MODAL_GO_BACK_EDITOR": 'modal-go-back-editor',
        "MODAL_GALLERY_DELETE_ALL_BUTTON": 'modal-gallery-delete-all-button',    
        "MODAL_GALLERY": 'modal-gallery',
        "MODAL_GALLERY_ELEMENT": 'modal-gallery-element',
        "MODAL_GALLERY_ELEMENT_IMG": 'modal-gallery-element-img',
        "MODAL_GALLERY_ELEMENT_BTNS": 'modal-gallery-element-btns',
        "MODAL_GALLERY_MOVE_BTN": 'modal-gallery-move-btn',
        "MODAL_GALLERY_TRASH_BTN": 'modal-gallery-trash-btn',
        "HIDE_WHEN_EDITOR_ENABLED": 'hide-when-editor-enabled',
        "HIDDEN_EDITOR_ELEMENT": 'hidden-editor-element',
        "FORCE_NO_ANIMATION": 'js-monkey-patch-remove-animations',
        "FORCE_LOADING_ANIMATION": 'js-monkey-patch-loading',
        "FORCE_FLEX_COLUMN": 'js-monkey-patch-flex-column',
        "FORCE_DISPLAY_FLEX": 'js-monkey-patch-display-flex',
        "FORCE_DISPLAY_NONE": 'js-monkey-patch-display-none',
        "FILTERS_BUTTONS_CATEGORY_PREFIX": 'category-',
        "MODAL_STATE_PREFIX": 'modal-state-'
    },

    "DYN_IDS": {
        "LOG_USER_BTN": 'log-user-btn',
        "FAILED_TO_OPEN_GALLERY_EDITOR_MODAL_TOAST": 'failed-to-open-gallery-editor-modal-toast',
        "FAILED_TO_LOAD_GALLERY_FIGURES_TOAST": 'failed-to-load-gallery-figures-toast',
        "FAILED_TO_LOGIN_TOAST": 'failed-to-login-toast',
        "FAILED_TO_DELETE_TOAST": 'failed-to-delete-toast',
        "CANT_CONNECT_TOAST": 'cant-connect-toast',
        "LOGGED_OUT_SUCCESS_TOAST": 'logged-out-success-toast',
        "DELETED_ELEMENT_SUCCESS_TOAST": 'deleted-element-success-toast',
        "TOASTS_COMPONENT": 'toasts-component'
    },

    "API": {
        "HOST": 'http://localhost:5678',
    },

    "SIDE_EFFECTS": {
        "SCROLL_DOWN_TRIGGER_HASH": '#contact'
    }
}

/* [§ Servlet URL] */
Object.assign(__GLOBALS["API"], {
    "SERVLET_URL": `${__GLOBALS.API.HOST}/api`
});

/* [§ API Routes] */
Object.assign(__GLOBALS["API"], {
    "ROUTES": {
        "WORKS": `${__GLOBALS.API.SERVLET_URL}/works`,
        "CATEGORIES": `${__GLOBALS.API.SERVLET_URL}/categories`,
        "LOGIN": `${__GLOBALS.API.SERVLET_URL}/users/login`
    }
});

/* [§ Pages URL] */
__GLOBALS["PAGES_URLS"] = {
    "INDEX": './index.html'
}

/* [§ Selectors] */
__GLOBALS["SELECTORS"] = {
    "CURRENT_FOCUSED_ELEMENT": ':focus',
    "GALLERY_COMPONENT": '#gallery-component',
    "FILTERS_COMPONENT": '#filter-by-category-component',
    "LOGIN_FORM": '#login-form',
    "FILTERS_BUTTONS_COMPONENT": '.filter-by-category-component>.is-btn',
    "GALLERY_FIGURE": `.${getDynamicClass("GALLERY_FIGURE")}`,
    "OPEN_EDITOR": `.${getDynamicClass("OPEN_EDITOR")}`,
    "CLOSE_EDITOR": `.${getDynamicClass("CLOSE_EDITOR")}`,
    "EDITOR_COMPONENT": `.${getDynamicClass("EDITOR_COMPONENT")}`,
    "EDITOR_BANNER": `.${getDynamicClass("EDITOR_BANNER")}`,
    "EDITOR_ELEMENT": `.${getDynamicClass("EDITOR_ELEMENT")}`,
    "MODAL_WRAPPER": `.${getDynamicClass("MODAL_WRAPPER")}`,
    "MODAL_GO_BACK_EDITOR": `.${getDynamicClass("MODAL_GO_BACK_EDITOR")}`,
    "MODAL_GALLERY": `.${getDynamicClass("MODAL_GALLERY")}`,
    "MODAL_GALLERY_DELETE_ALL_BUTTON": `.${getDynamicClass("MODAL_GALLERY_DELETE_ALL_BUTTON")}`,
    "MODAL_FOCUSABLES": 'a:not(.hidden-editor-element)',
    "HIDE_WHEN_EDITOR_ENABLED": `.${getDynamicClass("HIDE_WHEN_EDITOR_ENABLED")}`,
    "ERROR_BOXES": `.${getDynamicClass("ERROR_BOX")}`,
    "LOG_USER_BTN": `#${getDynamicId("LOG_USER_BTN")}`,
    "TOASTS_COMPONENT": `#${getDynamicId("TOASTS_COMPONENT")}`,
    [`${getDynamicId("FAILED_TO_OPEN_GALLERY_EDITOR_MODAL_TOAST")}`]: `#${getDynamicId("FAILED_TO_OPEN_GALLERY_EDITOR_MODAL_TOAST")}`,
    [`${getDynamicId("FAILED_TO_LOAD_GALLERY_FIGURES_TOAST")}`]: `#${getDynamicId("FAILED_TO_LOAD_GALLERY_FIGURES_TOAST")}`,
    [`${getDynamicId("FAILED_TO_LOGIN_TOAST")}`]: `#${getDynamicId("FAILED_TO_LOGIN_TOAST")}`,
    [`${getDynamicId("FAILED_TO_DELETE_TOAST")}`]: `#${getDynamicId("FAILED_TO_DELETE_TOAST")}`,
    [`${getDynamicId("CANT_CONNECT_TOAST")}`]: `#${getDynamicId("CANT_CONNECT_TOAST")}`,
    [`${getDynamicId("LOGGED_OUT_SUCCESS_TOAST")}`]: `#${getDynamicId("LOGGED_OUT_SUCCESS_TOAST")}`,
    [`${getDynamicId("DELETED_ELEMENT_SUCCESS_TOAST")}`]: `#${getDynamicId("DELETED_ELEMENT_SUCCESS_TOAST")}`
}

/* [§ Vocab] */
__GLOBALS["VOCAB"] = {
    "LOGIN": 'login',
    "LOGOUT": 'logout',
    "EDIT": 'éditer',
    "GALLERY_FIGURES_UNAVAILABLE": 'Les images de la galerie sont indisponibles.',
    "GALLERY_NO_FIGURES_HERE": 'Il n’y a rien à afficher ici pour le moment.',
    "UNKNOWN_ERROR": 'Erreur inconnue',
    "RETRY_TO_LOAD_GALLERY": 'Actualiser la galerie',
    "CRASH": 'La galerie n’a pas pu être affichée. Veuillez réessayer.',
    [`${getDynamicId("FAILED_TO_OPEN_GALLERY_EDITOR_MODAL_TOAST")}`]: 'Échec de connexion',
    [`${getDynamicId("FAILED_TO_LOAD_GALLERY_FIGURES_TOAST")}`]: 'Échec de la connexion. Merci de réessayer plus tard.',
    [`${getDynamicId("FAILED_TO_DELETE_TOAST")}`]: 'Impossible de supprimer cet élément.',
    [`${getDynamicId("FAILED_TO_LOGIN_TOAST")}`]: 'Erreur dans l’identifiant ou le mot de passe.',
    [`${getDynamicId("CANT_CONNECT_TOAST")}`]: 'Impossible de se connecter pour le moment. Veuillez réessayer plus tard.',
    [`${getDynamicId("LOGGED_OUT_SUCCESS_TOAST")}`]: 'Vous avez bien été déconnecté !',
    [`${getDynamicId("DELETED_ELEMENT_SUCCESS_TOAST")}`]: 'Élement supprimé avec succès !'
}

/* [§ Localstorage keys] */
__GLOBALS["LOCALSTORAGE_KEYS"] = {
    "USER_INFOS": 'userInfos'
}

/* [§ Cache] */
__GLOBALS["CACHE_KEYS"] = {
    "IMAGES_FOLDER_NOODLE": '/images',
    "STATIC_IMAGES_ROUTE_PREFIX": '../Backend/'
}

/* [§ Misc] */
__GLOBALS["MISC"] = {
    "MAX_TOASTS": 5,
    "UNAUTHORIZED_CODE": 401,
    "SERVICE_UNAVAILABLE_CODE": 503
}

Object.freeze(__GLOBALS);
Object.freeze(__GLOBALS.DYN_CLASSES);
Object.freeze(__GLOBALS.DYN_IDS);
Object.freeze(__GLOBALS.API);
Object.freeze(__GLOBALS.API.ROUTES);
Object.freeze(__GLOBALS.SIDE_EFFECTS);
Object.freeze(__GLOBALS.PAGES_URLS);
Object.freeze(__GLOBALS.SELECTORS);
Object.freeze(__GLOBALS.VOCAB);
Object.freeze(__GLOBALS.MISC);
Object.freeze(__GLOBALS.LOCALSTORAGE_KEYS);
Object.freeze(__GLOBALS.CACHE_KEYS);
