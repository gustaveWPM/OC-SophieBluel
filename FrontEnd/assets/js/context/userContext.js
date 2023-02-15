/*
#================================================================
# * ... User Context (Token validator)
#----------------------------------------------------------------
# * ... Reject and delete invalid tokens from the localStorage
# * ... {REM} This is absolutely NOT bulletproof,
# * ... Just consider it as an helper for the Editor script.
# * ... The proper way to do this would be to code
# * ... a Session Manager in the backend, and edit the webpages
# * ... according to the user connection context IN BACKEND.
# * ... Security comes up on API calls, not in any JS execution.
#================================================================
*/

async function tokenValidator() {
    function noTokenFound(userInfos) {
        const noTokenFound = userInfos === null;
        return noTokenFound;
    }

    async function isValidUserIdAndTokenPair() {
        const invalidStatusCode = [getMiscConf("UNAUTHORIZED_CODE"), getMiscConf("SERVICE_UNAVAILABLE_CODE")];
        const response = await createWork('', '', '');

        return !invalidStatusCode.includes(response.status);
    }

    async function isValidToken(userInfos) {
        if (noTokenFound(userInfos)) {
            return false;
        }

        const validPair = await isValidUserIdAndTokenPair();
        if (!validPair) {
            deleteLocalStorageUserInfos();
        }
        return validPair;
    }

    const userInfos = localStorageUserInfos();
    return await isValidToken(userInfos);
}

async function isLoggedIn() {
    const isLogged = await tokenValidator();

    return isLogged;
}
