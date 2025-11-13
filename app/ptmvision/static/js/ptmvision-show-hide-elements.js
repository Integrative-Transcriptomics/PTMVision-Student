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

}