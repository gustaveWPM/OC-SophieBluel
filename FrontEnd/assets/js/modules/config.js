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
        "EDITOR_ELEMENT": 'is-editor-element',
        "HIDE_WHEN_EDITOR_ENABLED": 'hide-when-editor-enabled',
        "HIDDEN_EDITOR_ELEMENT": 'hidden-editor-element',
        "FORCE_LOADING_ANIMATION": 'js-monkey-patch-loading',
        "FORCE_FLEX_COLUMN": 'js-monkey-patch-flex-column',
        "FORCE_DISPLAY_FLEX": 'js-monkey-patch-display-flex',
        "FILTERS_BUTTONS_CATEGORY_PREFIX": 'category-'
    },

    "DYN_IDS": {
        "LOG_USER_BTN": 'log-user-btn',
        "TRYING_TO_RELOAD_TOAST": 'trying-to-reload-toast',
        "FAILED_TO_LOAD_GALLERY_FIGURES_TOAST": 'failed-to-load-gallery-figures-toast',
        "FAILED_TO_LOGIN_TOAST": 'failed-to-login-toast',
        "CANT_LOGIN_TOAST": 'cant-login-toast',
        "LOGGED_OUT_SUCCESS_TOAST": 'logged-out-success-toast',
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
    "GALLERY_COMPONENT": '#gallery-component',
    "FILTERS_COMPONENT": '#filter-by-category-component',
    "LOGIN_FORM": '#login-form',
    "FILTERS_BUTTONS_COMPONENT": '.filter-by-category-component>.is-btn',
    "EDITOR_ELEMENT": `.${getDynamicClass("EDITOR_ELEMENT")}`,
    "HIDE_WHEN_EDITOR_ENABLED": `.${getDynamicClass("HIDE_WHEN_EDITOR_ENABLED")}`,
    "ERROR_BOXES": `.${getDynamicClass("ERROR_BOX")}`,
    "LOG_USER_BTN": `#${getDynamicId("LOG_USER_BTN")}`,
    "TOASTS_COMPONENT": `#${getDynamicId("TOASTS_COMPONENT")}`,
    [`${getDynamicId("TRYING_TO_RELOAD_TOAST")}`]: `#${getDynamicId("TRYING_TO_RELOAD_TOAST")}`,
    [`${getDynamicId("FAILED_TO_LOAD_GALLERY_FIGURES_TOAST")}`]: `#${getDynamicId("FAILED_TO_LOAD_GALLERY_FIGURES_TOAST")}`,
    [`${getDynamicId("FAILED_TO_LOGIN_TOAST")}`]: `#${getDynamicId("FAILED_TO_LOGIN_TOAST")}`,
    [`${getDynamicId("CANT_LOGIN_TOAST")}`]: `#${getDynamicId("CANT_LOGIN_TOAST")}`,
    [`${getDynamicId("LOGGED_OUT_SUCCESS_TOAST")}`]: `#${getDynamicId("LOGGED_OUT_SUCCESS_TOAST")}`
}

/* [§ Vocab] */
__GLOBALS["VOCAB"] = {
    "LOGIN": 'login',
    "LOGOUT": 'logout',
    "GALLERY_FIGURES_UNAVAILABLE": 'Les images de la galerie sont indisponibles.',
    "UNKNOWN_ERROR": 'Erreur inconnue',
    "RETRY_TO_LOAD_GALLERY": 'Afficher la galerie',
    "RETRY_TO_LOAD_GALLERY_FIGURES": 'Afficher les images',
    "CRASH": 'La galerie n’a pas pu être affichée. Veuillez réessayer.',
    [`${getDynamicId("TRYING_TO_RELOAD_TOAST")}`]: 'Tentative de reconnexion...',
    [`${getDynamicId("FAILED_TO_LOAD_GALLERY_FIGURES_TOAST")}`]: 'Échec de la connexion. Merci de réessayer plus tard.',
    [`${getDynamicId("FAILED_TO_LOGIN_TOAST")}`]: 'Erreur dans l’identifiant ou le mot de passe.',
    [`${getDynamicId("CANT_LOGIN_TOAST")}`]: 'Impossible de se connecter pour le moment. Veuillez réessayer plus tard.',
    [`${getDynamicId("LOGGED_OUT_SUCCESS_TOAST")}`]: 'Vous avez bien été déconnecté !'
}

/* [§ Modules config] */
__GLOBALS["MODULES_CONFIG"] = {
    "MAX_TOASTS": 5
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

Object.freeze(__GLOBALS);
Object.freeze(__GLOBALS.DYN_CLASSES);
Object.freeze(__GLOBALS.DYN_IDS);
Object.freeze(__GLOBALS.API);
Object.freeze(__GLOBALS.API.ROUTES);
Object.freeze(__GLOBALS.SIDE_EFFECTS);
Object.freeze(__GLOBALS.PAGES_URLS);
Object.freeze(__GLOBALS.SELECTORS);
Object.freeze(__GLOBALS.VOCAB);
Object.freeze(__GLOBALS.MODULES_CONFIG);
Object.freeze(__GLOBALS.LOCALSTORAGE_KEYS);
Object.freeze(__GLOBALS.CACHE_KEYS);
