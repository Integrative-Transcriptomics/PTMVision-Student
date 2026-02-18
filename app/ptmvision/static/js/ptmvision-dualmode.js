/**
 * Needed dom elements for displaying dual mode in header
 */
const dualModeSwitch = document.getElementById("DualmodeSwitch"); // Switch to toggle Dualmode on and of (in Overview section)
const dualStatusDisplay = document.getElementById("DualModeStatusDot"); // the dot which should turn green/red if enabled disabled
const datasetDisplay = document.getElementById("");
const datasetDisplayContainer = document.getElementById("HeaderSecDataset"); // Container of the dataset display (needed to change display time)
const navDualModeButtons = document.getElementById("ViewSelector"); // Container for the Dataset Buttons


console.log(dualModeSwitch);

/**
 * Global dual mode variable, default = false (disabled)
 */
var _dualMode;


/**
 * Class for dual mode related functions
 */



/***
 * Gets the state of _dualMode (boolean)
 * 
 * @return boolean
 */
function dualModeGetState() {
    return _dualMode;
}


/**
 * Changes the state of _dualMode to true
 */
function dualModeSetOn() {
    _dualMode = true;
}

/**
 * Changes the state of _dualMode to false
 */
function dualModeSetOff() {
    _dualMode = false;
}

/**
 * Sends dual mode state information to the backend
 */
function dualModeSendState() {
    //_dualMode
    // axios com
    //TODO
}

/**
 * changes the display of the dual mode indicator on in the header
 * if the state of the dual mode variable changes
 */
function dualModeChangeDisplay() {

    if (_dualMode == false) {
        dualStatusDisplay.style.backgroundColor = "red";
    }else if (_dualMode == true) {
        dualStatusDisplay.style.backgroundColor = "#36FF3B";
    }
}


/**
 * Function for changing the dual mode variable, triggers further functions
 * 
 */
function dualModeChangeState() {

    if ((dualModeGetState() === false) || (_dualMode == undefined)) {
        // dual mode was enabled and get disabled now
        dualModeSetOn();

        dualModeSendState();
        dualModeChangeDisplay();
    }else if(dualModeGetState() === true){
        // dual mode was disabled and get enabled now
        dualModeSetOff();

        dualModeSendState();
        dualModeChangeDisplay();
    }else{
        console.error("reached unreachable state of dualmode...");
    }
    console.log(_dualMode);
}

/**
 * Function for displaying dual mode relevant elements
 */
function dualModeShow() {

}

function dualModeHeaderCtl() {
    if (dualModeGetState() == false) {

        // no dataset display, because dual mode off
        datasetDisplay.style.display = "none";

        // dual mode display shows off
        dualStatusDisplay.style.backgroundColor = "red";

        // TODO: hide sidebar dataset selector
    }

    if (_dualMode == true) {
        // set dataset display
        datasetDisplay.style.display = "flex"; // TODO: check if flex is here really needed...

        // dual mode display shows on
        dualStatusDisplay.style.backgroundColor = "green";

        // show currently selected dataset!
        // TODO! (datasetDisplay)

        // TODO: show sidebar dataset selector
    }
}

/**
 * Functions for selecting which dataset (or comparative) should be displayed
 * 
 * @param domIDSet1 dom id of the element to click for displaying data set 1
 * @param domIDSet2 dom id of the element to click for displaying data set 2
 * @param domIDComp dom id of the element to click for displaying comparative view
*/
function dualModeSelectView(domIDSet1, domIDSet2, domIDComp){
    if (domIDSet1) {
        // TODO: Add Eventlistener
    }

    if (domIDSet2) {
        // TODO: Add Eventlistener
    }

    if (domIDComp) {
        // TODO: Add Eventlistener

    }
}
