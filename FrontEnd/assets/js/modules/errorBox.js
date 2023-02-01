/*
#=================================================
# * ... Error Boxes
#-------------------------------------------------
# * ... Error boxes drawer
#=================================================
*/

function generateBox(msg) {
    const box = document.createElement('div');
    const boxTxt = document.createTextNode(msg);
    box.classList.add(getDynamicClass("PREVENT_SELECT"));
    box.classList.add(getDynamicClass("BOX"));
    box.appendChild(boxTxt);

    return box;
}

function drawErrorBox(node, errorMessage) {
    function generateErrorBox(errorMessage) {
        const box = generateBox(errorMessage);
        box.classList.add(getDynamicClass("ERROR_BOX"));

        return box;
    }
    const errorBox = generateErrorBox(errorMessage);
    node.appendChild(errorBox);
}

function drawWarningBox(node, warningMessage) {
    function generateWarningBox(warningMessage) {
        const box = generateBox(warningMessage);
        box.classList.add(getDynamicClass("WARNING_BOX"));

        return box;
    }
    const warningBox = generateWarningBox(warningMessage);
    node.appendChild(warningBox);
}
