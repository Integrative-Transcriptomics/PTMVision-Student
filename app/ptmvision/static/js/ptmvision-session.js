/**
 * *******************************************
 * -----------Session Control-----------------
 * *******************************************
 * All functions related to 
 * 
 * 
 */

/**
 * Variables for naming the data
 */

var dataName1 = "Data1";
var dataName2 = "Data2";

/**
 * Inizializes all client side elements of the PTMVision application.
 */
function init() {
  if (_dualMode == false) {
    // case: dual mode off
    _overviewChart = new OverviewChart("Overview");
    _proteinTable = new ProteinTable("ProtTable");
    _proteinTable.registerSelectionAction((data) => {
      if (data.length > 0) {
        $("#ConfirmProteinSelectionButton")[0].disabled = false;
      } else {
        $("#ConfirmProteinSelectionButton")[0].disabled = true;
      }
    });
    _proteinviewChart = new ProteinviewChart("ProteinTreemap");
    _dashboardChart = new DashboardChart(
    "DashboardChart1",
    "DashboardChart2"
  );
  } else {
    // case: dual mode on
    //_overviewChart = new 
    _proteinviewChart = new ProteinviewChartComp(ProteinTreemap);
  }
  checkSessionState();
}



/**
 * Reads a file-like blob object to its String content.
 *
 * @param {Blob} file File-like blob data to read.
 * @returns String content of the file-like input blob.
 */
function readFile(file) {
  return new Promise((resolve, reject) => {
    var fileReader = new FileReader();
    fileReader.onload = (event) => {
      resolve(event.target.result);
    };
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}


/**
 * function: changeDataName
 * Made for renaming data sets
 * 
 * @param {Number} set number to identify the dataset
 */
function changeDataName(set) {

  if (set == 1) {
    var name1 = document.getElementById("data-name-1").value;
    // prevent using blank names
    if (name1 != "") {
      dataName1 = name1;
    }
  } else if (set == 2) {
    var name2 = document.getElementById("data-name-2").value;

    // prevent using blank names
    if (name2 != "") {
      dataName2 = name2;
    }
  } else {
    // error case if set != 1/2
    // catch it by renaming to defaut names
    dataName1 = "Data 1";
    dataName2 = "Data 2";
  }
}


// Auf jeden Fall wiederverwenden! Anpassen!!!
// state wird in url/session_state gespeichert...
/**
 * Checks the current session state and updates the UI accordingly.
 */
function checkSessionState() {
  axios.get(window.location.origin + "/session_state").then((response) => {
    if (response.status == 200 && response.data.has_data) {
      proteinTableInitialize(proteinTableInitialize);
      proteinChartInitialize();
      if (response.data.hasOwnProperty("protein_selected"))
        dashboardChartInitialize(
          response.data.protein_selected,
          undefined,
          undefined,
          false
        );
    }
  });
}



// Normales Session Starten
/**
 * Sends the specified search enginge output data to the PTMVision backend to start a new session.
 */
async function startSession() {
  displayNotification("Transfer and process entered data.");
  if (_dualMode == false) {
    // case: dual mode is disabled -> normal 1 file session

    // sending state of dual mode:
    dualModeSendState();

    // No file input error case:
    if ($("#data-input-form-1")[0].files.length == 0) {
      displayAlert("No search engine output data was supplied.");
      $("body").css("cursor", "auto");
      removeNotification();
      return;
    }

    //define request:
    request = {
      massShiftTolerance1: 0.001,
      excludeClasses1: [],
      contentType1: null,
      content1: null,
    };


    // save input file via jQuery in file constant (data file 1):
    const file1 = $("#data-input-form-1")[0].files[0];


    // readFile -> file->String, String will be placed in request.content
    await readFile(file1).then((response) => {
      request.content1 = response;
    });


    // fills request meta:
    request.filename1 = file1.name;
    request.contentType1 = $("#data-type-form-1")[0].value;
    request.massShiftTolerance1 = parseFloat($("#data-tolerance-form-1")[0].value);

    //Exclude Classes
    request.excludeClasses1 = $("#data-excludecls-form-set-1").select2("data");


    // Axios Post Request with request content
    axios
      .post(
        window.location.origin + "/process_search_engine_output",
        pako.deflate(JSON.stringify(request)),
        {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Encoding": "zlib",
          },
        }
      )
      .then((_) => {

        // works until here!
        //TODO:
        //clearCharts();
        overviewChartInitialize();
        proteinTableInitialize(); // Init. table and chart.
        proteinChartInitialize();
      })
      .catch((error) => {
        console.error(error);
        removeNotification();
        displayAlert(error);
      });


  } else if (_dualMode == true) {
    // case: dual mode enabled -> 2 file session

    // sending state of dual mode:
    dualModeSendState();

    // No file input error cases:
    if ($("#data-input-form-1")[0].files.length == 0) {
      displayAlert("No search engine output data was supplied for file 1");
      $("body").css("cursor", "auto");
      removeNotification();

      return;
    }
    if ($("#data-input-form-2")[0].files.length == 0) {
      displayAlert("No search engine output data was supplied for file 2");
      $("body").css("cursor", "auto");
      removeNotification();

      return;
    }

    // Define request - Dual
    request = {
      massShiftTolerance1: 0.001,
      massShiftTolerance2: 0.001,
      excludeClasses1: [],
      excludeClasses2: [],
      contentType1: null,
      contentType2: null,
      content1: null,
      content2: null,
    }

    // save input file via jQuery in file constant (data file 1):
    const file1 = $("#data-input-form-1")[0].files[0];
    // file 2 for dualMode:
    const file2 = $("#data-input-form-2")[0].files[0];


    // readfile for dual Mode:
    await readFile(file1).then((response) => {
      request.content1 = response;
    });

    await readFile(file2).then((response) => {
      request.content2 = response;
    });


    // fill request meta:

    // Filenames - Dual
    request.filename1 = file1.name;
    request.filename2 = file2.name;

    // File Content - Dual
    request.contentType1 = $("#data-type-form-1")[0].value;
    request.contentType2 = $("#data-type-form-2")[0].value;

    // Mass Shift Tolerance - Dual
    request.massShiftTolerance1 = parseFloat($("#data-tolerance-form-1")[0].value);
    request.massShiftTolerance2 = parseFloat($("#data-tolerance-form-2")[0].value);

    // Excluded Classes - Dual
    request.excludeClasses1 = $("#data-excludecls-form-set-1").select2("data");
    request.excludeClasses2 = $("#data-excludecls-form-set-2").select2("data");

    // Axios POST request:
    axios
      .post(
        window.location.origin + "/process_search_engine_output",
        pako.deflate(JSON.stringify(request)),
        {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Encoding": "zlib",
          },
        }
      )
      .then((_) => {

        clearCharts();
        proteinChartCompInit();
      })
      .catch((error) => {
        console.error(error);

        //Todo
        //removeNotification();
        //displayAlert(error.response.data);
      });
  }
}



// Teil um charts zu clearen - Reusen!
/**
 * Clears the overview and dashboard charts.
 */
function clearCharts() {
  _overviewChart.clear();
  _proteinviewChart.clear();
  //_dashboardChart.clear();
}