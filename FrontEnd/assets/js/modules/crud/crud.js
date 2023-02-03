// * § ... Add work

async function processCreateWork(payload) {
    const body = JSON.stringify(payload);
    const worksRoute = getRoute("WORKS");
    const offlineReturnValue = {"status": -1};
    const token = getLocalStorageUserToken();

    try {
        const response = await fetch(worksRoute, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `hackMeIfYouCan: ${token}`
            },
            body
        });
        if (response?.ok) {
            const responseBody = await response.json();
            console.log(responseBody); // * ... ToDo: code this happy path's ending
        } else {
            ; // * ... ToDo: error handling
        }
        return response;
    } catch {
        return offlineReturnValue;
    }
}

async function createWork(image, title, category) {
    const userId = getLocalStorageUserId();
    const payload = {image, title, category, userId};

    return await processCreateWork(payload);
}

// * § ... Delete work
// {ToDo}
