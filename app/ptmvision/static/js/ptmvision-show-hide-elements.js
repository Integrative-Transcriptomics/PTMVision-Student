/*
Javascript code for handling html behavior (showing/hiding)
*/

// TODO: This code is only temporary solution


//show PTM Overview Section and Protein Selection Section
function showOverviewAndProtSelect(){
    overview = document.getElementById("OverviewSection");
    proteinSelect = document.getElementById("ProteinSelectionSection");
    
    // change to visible
    overview.style.display = "block";
    proteinSelect.style.display = "block";
}

//show Protein Details Section
function showDashboard(){
    document.getElementById("DashboardSection").style.display = "block";
}