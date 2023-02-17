/*
#=================================================
# * ... Error Handling
#-------------------------------------------------
# * ... Fetch failures management helpers
#=================================================
*/

/*** 📐 Errors States Manager */
function failedToLoadElement(itemSelector) {
    const failedToLoadItemSelector = `${itemSelector}.${getDynamicClass("FAILED_TO_FETCH")}`;
    const failedToLoadElement = document.querySelector(failedToLoadItemSelector);

    return failedToLoadElement !== null;
}

function failedToGetFromApi(collection) {
    return !collection;
}
