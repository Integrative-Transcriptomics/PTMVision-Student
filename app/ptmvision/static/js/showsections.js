/*
Javascript code for handling html section behavior (showing/hiding)
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


function showModificationDetails(){
    document.getElementById("ModificationDetailsSection").style.display = "block";
}
