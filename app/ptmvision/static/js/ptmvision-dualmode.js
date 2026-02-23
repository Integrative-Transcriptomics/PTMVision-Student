/**
 * Needed dom elements for displaying dual mode in header
 */
const dualModeSwitch = document.getElementById("DualmodeSwitch"); // Switch to toggle Dualmode on and of (in Overview section)
const dualStatusDisplay = document.getElementById("DualModeStatusDot"); // the dot which should turn green/red if enabled disabled
const datasetDisplayContainer = document.getElementById("HeaderSecDSTextContainer"); // Container of the dataset display (needed to change display time)

// sidebar elements:
const navDualModeButtons = document.getElementById("ViewSelector"); // Container for the Dataset Buttons
const navDualModeHeading = document.getElementById("ViewSelectorHeading"); // "Select View" line in the side bar menu

// 2 dataset input, 2nd dataset elements
const sndDataSet = document.getElementById("input-data-set-2");
const yLine = document.getElementById("input-data-y-line");


/**
 * Global dual mode variable, default = false (disabled)
 */
var _dualMode = false;

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
    
    // must be executed when pressing submit button!!!

    switch(dualModeGetState()){
        case true:
            console.log("True status");
            axios.post(
                window.location.origin + "/dualmodestatus",
                {
                    dualMode: "true"
                }
            )
            .then((res) => console.log(res))
            .catch((err) => console.log(err)); // TODO: MSG Display
            break;
        case false:
            console.log("False status");
            axios.post(
                window.location.origin + "/dualmodestatus",
                {
                    dualMode: "false"
                }
            )
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
            break;
    }
}

/**
 * changes the display of the dual mode indicator on in the header
 * if the state of the dual mode variable changes
 */
function dualModeChangeDisplay() {

    if (dualModeGetState() === false) {
        // Dual mode disabled case
        
        // change color of dual mode indicator
        dualStatusDisplay.style.backgroundColor = "#FF0000";
        
        // Header "Selected View" field
        datasetDisplayContainer.style.display = "none";

        // hide dual mode related side bar elements
        navDualModeButtons.style.display = "none";
        navDualModeHeading.style.display = "none";

        // hide 2nd dataset input
        dualInputDisplay("hide");
    }else if (dualModeGetState() === true) {
        // Dual mode enabled case

        // change color of dual mode indicator
        dualStatusDisplay.style.backgroundColor = "#36FF3B";

        // Header "Selected View" field
        datasetDisplayContainer.style.display = "inline";

        // show dual mode related side bar elements
        navDualModeButtons.style.display = "flex";
        navDualModeHeading.style.display = "block";

        // show 2nd dataset input
        dualInputDisplay("show");
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
    }else if(dualModeGetState() === true){
        // dual mode was disabled and get enabled now
        dualModeSetOff();
    }else{
        // this should not be enterable
        console.error("reached unreachable state of dualmode...");
    }

    dualModeChangeDisplay();
    dualModeSendState(); // TODO: remove later!!! (keep for now for debugging)
}


/**
 * Show the correct input and hide the wrong input option when selecting input methods!
 * @param String action, one of:
 * - "hide"
 * - "show"
 * - else error
 */
function dualInputDisplay(action){
    if(action === "hide"){
        // dual mode disabled
        sndDataSet.style.display = "none";
        yLine.style.display = "none";
    }else if(action === "show"){
        // dual mode enabled
        sndDataSet.style.display = "block";
        yLine.style.display = "block";
    }else{
        // error case
        console.error("Problem at displaying 2nd Dataset input correctly");
        // TODO change to error...
    }
}
