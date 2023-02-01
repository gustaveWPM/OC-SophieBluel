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
        "ERROR_BOX": 'error-box',
        "PREVENT_SELECT": 'prevent-select',
        "FORCE_FLEX_COLUMN": 'js-monkey-patch-flex-column',
        "FILTERS_BUTTONS_CATEGORY_PREFIX": 'category-'
    },

    "DYN_IDS": {
        "DIDNT_UPDATE_GALLERY_FIGURES_TOAST": 'didnt-update-gallery-figures-toast',
        "STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST": 'still-failed-to-load-gallery-figures-toast',
        "FAILED_TO_LOGIN_TOAST": 'failed-to-login-toast',
        "CANT_LOGIN_TOAST": 'cant-login-toast',
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
Object.assign(__GLOBALS["API"],
    {
        "SERVLET_URL": `${__GLOBALS.API.HOST}/api`
    }
);

/* [§ API Routes] */
Object.assign(__GLOBALS["API"],
    {
        "ROUTES": {
            "WORKS": `${__GLOBALS.API.SERVLET_URL}/works`,
            "CATEGORIES": `${__GLOBALS.API.SERVLET_URL}/categories`,
            "LOGIN": `${__GLOBALS.API.SERVLET_URL}/users/login`
        }
    }
);

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
    "ERROR_BOXES": `.${getDynamicClass("ERROR_BOX")}`,
    "TOASTS_COMPONENT": `#${getDynamicId("TOASTS_COMPONENT")}`,
    [`${getDynamicId("DIDNT_UPDATE_GALLERY_FIGURES_TOAST")}`]: `#${getDynamicId("DIDNT_UPDATE_GALLERY_FIGURES_TOAST")}`,
    [`${getDynamicId("STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST")}`]: `#${getDynamicId("STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST")}`,
    [`${getDynamicId("FAILED_TO_LOGIN_TOAST")}`]: `#${getDynamicId("FAILED_TO_LOGIN_TOAST")}`,
    [`${getDynamicId("CANT_LOGIN_TOAST")}`]: `#${getDynamicId("CANT_LOGIN_TOAST")}`
}

/* [§ Vocab] */
__GLOBALS["VOCAB"] = {
    "GALLERY_FIGURES_UNAVAILABLE": 'Les images de la galerie sont indisponibles',
    "FAILED_TO_CONNECT_TO_THE_API": 'échec de la connexion !',
    "UNKNOWN_ERROR": 'Erreur inconnue',
    "RETRY_TO_LOAD_GALLERY": 'Afficher la galerie',
    "CRASH": 'La galerie n’a pas pu être affichée. Veuillez réessayer.',
    [`${getDynamicId("DIDNT_UPDATE_GALLERY_FIGURES_TOAST")}`]: 'Échec de la connexion : la galerie n’a pas été mise à jour.',
    [`${getDynamicId("STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST")}`]: 'Échec de la connexion. Merci de réessayer plus tard.',
    [`${getDynamicId("FAILED_TO_LOGIN_TOAST")}`]: 'Erreur dans l’identifiant ou le mot de passe.',
    [`${getDynamicId("CANT_LOGIN_TOAST")}`]: 'Impossible de se connecter pour le moment. Veuillez réessayer plus tard.'
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
