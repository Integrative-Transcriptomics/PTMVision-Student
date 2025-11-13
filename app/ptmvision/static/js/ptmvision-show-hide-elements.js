/*
Javascript code for handling html behavior (showing/hiding)
*/


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
    const fstDataSet = document.getElementById("input-data-set-1");
    const sndDataSet = document.getElementById("input-data-set-2");
    const modeSwitch = document.getElementById("dual-mode-switch");

    if(modeSwitch.checked){
        // mode selector checked -> Enable both data input fields visible
        sndDataSet.style.display = "block";
    }else{
        // mode selector unchecked -> only 1 data input field
        sndDataSet.style.display = "none";

    }
}

inputHider();