/**
 * var for the view mode
 * - "C" = comparative (default)
 * - "1" = show only dataset 1
 * - "2" = show only dataset 2:
*/
var _selectedView = "C";

/**
 * Function for manipulating the _selectedView variable with button input
 * @param String (input from the view select buttons) one of:
 * - "C"
 * - "1"
 * - "2"
 * else error
 */
function selectView(input){
    //defaultSelection.style.display = "none";
    
    switch(input){
        case "C":
            // comparative case
            console.log(input + " = C");
            $("#Selection").empty();
            $("#Selection").append("<p>Comparative</p>");
            break;
        case "1":
            // only dataset 1
            console.log(input + " = 1");
            $("#Selection").empty();
            $("#Selection").append("<p>Dataset 1</p>");
            break;
        case "2":
            // only dataset 2
            console.log(input + " = 2");
            $("#Selection").empty();
            $("#Selection").append("<p>Dataset 2</p>");
            break;
        default:
            // not sure if i want to print an error or go to comparative...
            $("#Selection").empty();
            $("#Selection").append("<p>Comparative</p>");
            break;
    }

}