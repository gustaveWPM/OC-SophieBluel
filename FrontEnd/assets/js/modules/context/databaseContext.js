/*
#================================================================
# * ... Database Context
#----------------------------------------------------------------
# * ... Coordinates database operations.
#================================================================
*/

/*** 🎣 [§ Database's collections getter] */
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
