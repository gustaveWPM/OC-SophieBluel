/*
#=================================================
# * ... Local storage manager
#-------------------------------------------------
# * ... Handles local storages mutations
#=================================================
*/

function getUserCookieObj() {
    const cookie = document.cookie;
    if (cookie === "") {
        return cookie;
    }
    const cookiePrefixLen = getMiscConf("USER_COOKIE_PREFIX").length; 
    const cookieObj = cookie.substring(cookiePrefixLen);

    return cookieObj;
}

function localStorageUserInfos(userInfos = null) {
    if (userInfos === null) {
        try {
            const data = getUserCookieObj();
            return JSON.parse(data);
        } catch {
            try {
                const data = window.localStorage.getItem(getLocalStorageKey("USER_INFOS"));
                return JSON.parse(data);
            } catch {
                return {};
            }
        }
    }
    const cookie = `${getMiscConf("USER_COOKIE_PREFIX")}${userInfos}${getMiscConf("USER_COOKIE_SUFFIX")}`;
    document.cookie = cookie;
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
    document.cookie = `${document.cookie}${getMiscConf("USER_COOKIE_SUFFIX")}${getMiscConf("KILL_COOKIE")}`;
    window.localStorage.removeItem(getLocalStorageKey("USER_INFOS"));
}
