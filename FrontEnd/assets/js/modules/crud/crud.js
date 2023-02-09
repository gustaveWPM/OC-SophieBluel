/*
#================================================================
# * ... CRUD
#----------------------------------------------------------------
# * ... Database CRUD.
#================================================================
*/

/*** 🎣 [§ Database's read (getters) functions] */
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

/*** 🆕 [§ Database create functions] */
/* [§ Create -> work] */
async function processCreateWork(payload) {
    const body = JSON.stringify(payload);
    const worksRoute = getRoute("WORKS");
    const offlineReturnValue = {"status": getMiscConf("SERVICE_UNAVAILABLE_CODE")};
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

/*** 🗑️ [§ Database delete functions] */
/* [§ Delete -> work] */
async function deleteWorkById(id) {
    const worksRoute = getRoute("WORKS");
    const deleteWorkByIdRoute = `${worksRoute}/${id}`;
    const offlineReturnValue = {"status": getMiscConf("SERVICE_UNAVAILABLE_CODE")};
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

/*** 🔄 [§ Database update functions] */
/* [§ Update -> ...] */
// {ToDo: not the scope of the project's iteration}
