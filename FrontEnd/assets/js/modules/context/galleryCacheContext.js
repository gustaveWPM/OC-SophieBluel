/*
#================================================================
# * ... Gallery Cache Context (Cache instance)
#----------------------------------------------------------------
# * ... Coordinates the cache context.
#================================================================
*/

/*** 📝 [§ Cache] */
const __GALLERY_CACHE = {
    "WORKS": null
}

function cacheIsEmpty() {
    return __GALLERY_CACHE.WORKS === null;
}
