
/*
function to open the navigation bar (sidebar)
*/
function openNavBar(){
    // move main content to the right:
    document.getElementById("MainContent").style.marginLeft = "15.5%";

    //show panel:
    document.getElementById("NavBlock").style.width = "15%";

}

/*
function to close the navigation bar (sidebar)
*/
function closeNavBar(){
    // move content back:
    document.getElementById("MainContent").style.marginLeft = "2.1%";
    // hide panel:
    document.getElementById("NavBlock").style.width = "0%";
}