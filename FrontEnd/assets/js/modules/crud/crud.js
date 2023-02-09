/*** 🎣 [§ Database's collections getters] */
/* [§ ... Read -> Abstract] */
async function getCollectionFromDatabase(req) {
    async function request() {
        try {
            const response = await fetch(req);
            const collection = await response.json();
            return collection;
        } catch {
            return false;
        }
    }

    const collection = await request();
    return collection;
}

/* [§ ... Read -> Work] */
async function getWorksFromDatabase() {
    const worksRoute = getRoute("WORKS");
    const worksCollection = await getCollectionFromDatabase(worksRoute);

    return worksCollection;
}

/* [§ ... Read -> Categories] */
async function getCategoriesFromDatabase() {
    const categoriesRoute = getRoute("CATEGORIES");
    const categoriesCollection = await getCollectionFromDatabase(categoriesRoute);

    return categoriesCollection;
}

/* [§ Create -> work] */
async function processCreateWork(payload) {
    const body = JSON.stringify(payload);
    const worksRoute = getRoute("WORKS");
    const offlineReturnValue = {"status": getMiscConf("UNAUTHORIZED_CODE")};
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

/* [§ Delete -> work] */
// {ToDo}
async function deleteWorkById(id) {
    const worksRoute = getRoute("WORKS");
    const deleteWorkByIdRoute = `${worksRoute}/${id}`;
    const offlineReturnValue = {"status": getMiscConf("UNAUTHORIZED_CODE")};
    const token = getLocalStorageUserToken();

    try {
        const response = await fetch(deleteWorkByIdRoute, {
            method: "DELETE",
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `hackMeIfYouCan: ${token}`
            }
        });
        return response;
    } catch {
        return offlineReturnValue;
    }
}

// * § ... Update (work)
// {ToDo: not the scope of the project's iteration}
