/*
#=================================================
# * ... Local storage manager
#-------------------------------------------------
# * ... Handles local storages mutations
#=================================================
*/

function localStorageUserInfos(userInfos = null) {
    if (userInfos === null) {
        const data = window.localStorage.getItem(getLocalStorageKey("USER_INFOS"));
        return JSON.parse(data);
    }
    window.localStorage.setItem(getLocalStorageKey("USER_INFOS"), userInfos);
}

function getLocalStorageUserId() {
    const userInfos = localStorageUserInfos();
    return userInfos.userId;
}

function getLocalStorageUserToken() {
    const userInfos = localStorageUserInfos();
    return userInfos.token;
}

function deleteLocalStorageUserInfos() {
    window.localStorage.removeItem(getLocalStorageKey("USER_INFOS"));
}
