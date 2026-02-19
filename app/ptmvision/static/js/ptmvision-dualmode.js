/**
 * Needed dom elements for displaying dual mode in header
 */
const dualModeSwitch = document.getElementById("DualmodeSwitch"); // Switch to toggle Dualmode on and of (in Overview section)
const dualStatusDisplay = document.getElementById("DualModeStatusDot"); // the dot which should turn green/red if enabled disabled
const datasetDisplayContainer = document.getElementById("HeaderSecDSTextContainer"); // Container of the dataset display (needed to change display time)

// sidebar elements:
const navDualModeButtons = document.getElementById("ViewSelector"); // Container for the Dataset Buttons
const navDualModeHeading = document.getElementById("ViewSelectorHeading"); // "Select View" line in the side bar menu


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

    if (dualModeGetState() === false) {
        // Dual mode disabled case
        
        // change color of dual mode indicator
        dualStatusDisplay.style.backgroundColor = "red";
        
        // Header "Selected View" field
        datasetDisplayContainer.style.display = "none";

        // hide dual mode related side bar elements
        navDualModeButtons.style.display = "none";
        navDualModeHeading.style.display = "none";
    }else if (dualModeGetState() === true) {
        // Dual mode enabled case

        // change color of dual mode indicator
        dualStatusDisplay.style.backgroundColor = "#36FF3B";

        // Header "Selected View" field
        datasetDisplayContainer.style.display = "inline";

        // show dual mode related side bar elements
        navDualModeButtons.style.display = "flex";
        navDualModeHeading.style.display = "block";
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
 * Show the correct input and hide the wrong input option when selecting input methods!
 * TODO integrate!!!
 */
function inputHider(){
    const sndDataSet = document.getElementById("input-data-set-2");
    const yLine = document.getElementById("input-data-y-line");
    const modeSwitch = document.getElementById("DualmodeSwitch");

    if(!(_dualMode)){
        // dual mode enabled -> Enable both data input fields invisible
        sndDataSet.style.display = "none";
        yLine.style.display = "none";
    }else{
        // dual mode disabled -> only 1 data input field
        sndDataSet.style.display = "block";
        yLine.style.display = "block";

    }
}
