/*
#=================================================
# * ... Login Manager
#-------------------------------------------------
# * ... Handles the login page's process
#=================================================
*/

/*** 📐 [§ DOM getters] */
function loginButtonGetter() {
    const selector = '#login-form';

    return document.querySelector(selector);
}

/*** 📐 [§ Process login] */
async function processLogin(payload) {
    const body = JSON.stringify(payload);
    const loginRoute = getRoute("LOGIN");
    try {
        const response = await fetch(loginRoute, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
        });
        if (response?.ok) {
            const responseBody = await response.json();
            const userInfos = JSON.stringify(responseBody);
            window.localStorage.setItem("userInfos", userInfos);
            window.location = getPageUrl("INDEX");
        } else {
            drawErrorToast(getDynamicId("FAILED_TO_LOGIN"), uniq=false);
        }
    } catch {
        drawErrorToast(getDynamicId("FAILED_TO_LOGIN"), uniq=false);
    }
}

/*** 📐 [§ Events Generator] */
async function generateEvents() {
    async function generateLoginButtonEvent() {
        const loginButton = loginButtonGetter();

        loginButton.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = event.target.querySelector("[name=email]").value;
            const password = event.target.querySelector("[name=password]").value;

            const payload = {email, password};
            processLogin(payload);
        });
    }

    generateLoginButtonEvent();
}

/*** 🚀 [§ Entry point] */
async function run() {
    generateEvents();
}

async function main() {
    try {
        await run();
    } catch (e) {
        console.log(e);
    }
}

main();