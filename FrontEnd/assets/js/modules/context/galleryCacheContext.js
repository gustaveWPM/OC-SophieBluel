/*
#================================================================
# * ... Gallery Cache Context (Cache instance)
#----------------------------------------------------------------
# * ... Coordinates the cache context.
#================================================================
*/

/*** 📝 [§ Cache] */
/* 📋 [§ Cache -> Context] */
const __GALLERY_CACHE = {
    "WORKS": null
}

function cacheIsNotInitialized() {
    return __GALLERY_CACHE.WORKS === null;
}

/* 🔄 [§ Cache -> Update functions] */
function updateCacheValue(key, value) {
    const currentValue = __GALLERY_CACHE[key];

    if (currentValue === undefined) {
        console.error(`No configured cache value found with this key: ${key}`)
        return false;
    }

    __GALLERY_CACHE[key] = value;
    return true;
}

/* 💉 [§ Cache -> Setters functions] */
function setCacheValue(key, value) {
    const currentValue = __GALLERY_CACHE[key];

    if (currentValue !== undefined) {
        console.error(`Already setted a cache value with this key: ${key}`)
        return false;
    }

    __GALLERY_CACHE[key] = value;
    return true;
}

/* 🎣 [§ Cache -> Getters functions] */
function getCacheValue(key) {
    const value = __GALLERY_CACHE[key];

    if (value === undefined) {
        console.error(`No configured cache value found with this key: ${key}`)
    }

    return value;
}
