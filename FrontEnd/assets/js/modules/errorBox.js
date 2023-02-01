/*
#=================================================
# * ... Error Boxes
#-------------------------------------------------
# * ... Error boxes drawer
#=================================================
*/

function drawErrorBox(node, errorMessage) {
    function generateErrorBox(msg) {
        const errorBox = document.createElement('div');
        const errorBoxTxt = document.createTextNode(msg);

        errorBox.classList.add(getDynamicClass("PREVENT_SELECT"));
        errorBox.classList.add(getDynamicClass("BOX"));
        errorBox.classList.add(getDynamicClass("ERROR_BOX"));
        errorBox.appendChild(errorBoxTxt);

        return errorBox;
    }

    const errorBox = generateErrorBox(errorMessage);
    node.appendChild(errorBox);
}