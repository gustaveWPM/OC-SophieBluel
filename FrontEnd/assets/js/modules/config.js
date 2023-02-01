/*
#=================================================
# * ... Config
#-------------------------------------------------
# * ... Config values
#=================================================
*/

/*** 🌕 [§ Globals] */
/* [§ Dynamic classes, id, and API Host] */
let __GLOBALS = {
    "DYN_CLASSES": {
        "GALLERY_FIGURE": 'gallery-figure',
        "FILTERS_BUTTONS_COMPONENT_IS_ACTIVE": 'is-active',
        "FILTERS_BUTTONS_COMPONENT_BY_DEFAULT": 'by-default',
        "FAILED_TO_FETCH": 'failed-to-fetch',
        "PREVENT_SELECT": 'prevent-select',
        "TOAST": 'is-toast',
        "SHOW_TOAST": 'show',
        "BOX": 'is-box',
        "ERROR_BOX": 'error-box',
        "FILTERS_BUTTONS_CATEGORY_PREFIX": 'category-',
        "TOASTS_COMPONENT": "toasts-component"
    },

    "DYN_IDS": {
        "DIDNT_UPDATE_GALLERY_FIGURES_TOAST": 'didnt-update-gallery-figures-toast',
        "STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST": 'still-failed-to-load-gallery-figures-toast',
        "FAILED_TO_LOGIN": 'failed-to-login-toast',
        "CANT_LOGIN": 'cant-login-toast'
    },

    "API": {
        HOST: "http://localhost:5678",
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
    "FILTERS_BUTTONS_COMPONENT": '.filter-by-category-component>.btn',
    "ERROR_BOXES": `.${__GLOBALS.DYN_CLASSES.ERROR_BOX}`,
    [__GLOBALS.DYN_IDS.DIDNT_UPDATE_GALLERY_FIGURES_TOAST]: `#${__GLOBALS.DYN_IDS.DIDNT_UPDATE_GALLERY_FIGURES_TOAST}`,
    [__GLOBALS.DYN_IDS.STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST]: `#${__GLOBALS.DYN_IDS.STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST}`,
    [__GLOBALS.DYN_IDS.FAILED_TO_LOGIN]: `#${__GLOBALS.DYN_IDS.FAILED_TO_LOGIN}`,
    [__GLOBALS.DYN_IDS.CANT_LOGIN]: `#${__GLOBALS.DYN_IDS.CANT_LOGIN}`,
    [__GLOBALS.DYN_CLASSES.TOASTS_COMPONENT]: `#${__GLOBALS.DYN_CLASSES.TOASTS_COMPONENT}`
}

/* [§ Vocab] */
__GLOBALS["VOCAB"] = {
    "FILTERS_BUTTONS_UNAVAILABLE": 'Les filtres sont indisponibles',
    "GALLERY_FIGURES_UNAVAILABLE": 'Les images de la galerie sont indisponibles',
    "FAILED_TO_CONNECT_TO_THE_API": 'échec de la connexion !',
    "UNKNOWN_ERROR": 'Erreur inconnue',
    "CRASH": '⚠️ L’application a planté. Merci de recharger cette page.',
    [__GLOBALS.DYN_IDS.DIDNT_UPDATE_GALLERY_FIGURES_TOAST]: 'Échec de la connexion : la galerie n’a pas été mise à jour.',
    [__GLOBALS.DYN_IDS.STILL_FAILED_TO_LOAD_GALLERY_FIGURES_TOAST]: 'Échec de la connexion. Merci de réessayer plus tard.',
    [__GLOBALS.DYN_IDS.FAILED_TO_LOGIN]: 'Erreur dans l’identifiant ou le mot de passe.',
    [__GLOBALS.DYN_IDS.CANT_LOGIN]: 'Impossible de se connecter pour le moment. Veuillez réessayer plus tard.'
}

/* [§ Modules config] */
__GLOBALS["MODULES_CONFIG"] = {
    "MAX_TOASTS": 5
}

Object.freeze(__GLOBALS);

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
