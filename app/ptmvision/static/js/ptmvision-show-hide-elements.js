/*
Javascript code for handling html behavior (showing/hiding)
*/


/**
 * Show/Hide the DualModeViewSelector in the Navigation Menu
 * Default Off -> Turn On when dualMode == true
 */
function showDualModeViewSelector(){
    selector = document.getElementById("DualModeViewSelector");

    console.log(dualMode);
    
    if(dualMode == true){
        selector.style.display = "flex";
    }else{
        selector.style.display = "none";
    }
}

/**
 * General function for showing/hiding Elements function
 * @param id (id of the element)
 */
function showHideElementOnClick(id){

}


//show PTM Overview Section and Protein Selection Section
function showOverviewAndProtSelect(){
    overview = document.getElementById("OverviewSection");
    proteinSelect = document.getElementById("ProteinSelectionSection");
    
    // change to visible
    overview.style.display = "block";
    proteinSelect.style.display = "block";
}

//show Protein Details Section
function showProteinDetails(){
    document.getElementById("ProteinDetailsSection").style.display = "block";
}


//show Modification Details Section
function showModificationDetails(){
    document.getElementById("ModificationDetailsSection").style.display = "block";
}



/*
Show the correct input and hide the wrong input option when selecting input methods!
*/
function inputHider(){
    const sndDataSet = document.getElementById("input-data-set-2");
    const yLine = document.getElementById("input-data-y-line");
    const modeSwitch = document.getElementById("dual-mode-switch");

    if(modeSwitch.checked){
        // mode selector checked -> Enable both data input fields visible
        sndDataSet.style.display = "block";
        yLine.style.display = "block";
    }else{
        // mode selector unchecked -> only 1 data input field
        sndDataSet.style.display = "none";
        yLine.style.display = "none";

    }
}

inputHider();