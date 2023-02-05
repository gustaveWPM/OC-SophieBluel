/*
#===================================================
# * ... Local storage manager
#---------------------------------------------------
# * ... Handles local storages mutations
# * ... {REM} Obvs run the website on a Live Server
# * ... or yall get unexpected behaviours.
#===================================================
*/

function localStorageUserInfos(userInfos = null) {
    if (userInfos === null) {
        try {
            const data = window.localStorage.getItem(getLocalStorageKey("USER_INFOS"));
            return JSON.parse(data);
        } catch {
            return {};
        }
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
