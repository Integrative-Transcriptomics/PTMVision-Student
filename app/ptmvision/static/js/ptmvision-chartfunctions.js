/*
------------------------------------------------------------------------------------------------------------

Overview

-> Funktionen für Erstes Chart/Overview Chart
-> hauptsächlich hier eben nur hervorheben von elementen! Rest in Overview Chart und Overview Table Klassen
------------------------------------------------------------------------------------------------------------
*/


// Hmm hat hier noch par funktionen aber bau mir das neu auf!

// Ok
/**
 * Highlights the selected PTMs in the overview chart.
 */
function overviewChartHighlight() {
  let options = [];
  let names = _overviewChart.getDataNames();
  for (let i = 0; i < names.length; i++) {
    options.push(`<option value="` + i + `">` + names[i] + `</option>`);
  }
  Swal.fire({
    backdrop: false,
    confirmButtonColor: "#607196",
    width: "35em",
    padding: "1em",
    position: "center",
    html:
      `<h4><small>Select PTMs to highlight:</small></h4>
    <select id="tmpSelect" data-role="select" class="input-small" multiple>` +
      options.join("") +
      `</select>`,
  }).then((result) => {
    if (result.isConfirmed) {
      _overviewChart.highlight(
        Metro.getPlugin("#tmpSelect", "select")
          .val()
          .map((_) => parseInt(_))
      );
    }
  });
}

// Vmtl sortieren nach meiste/ wenigste Modifikationen/ Modifikationstypen, etc. - Unsicher
/**
 * Resorts the overview chart.
 */
function overviewChartSort() {
  _overviewChart.resort();
}
//TODO: replace with my sorting funktion


/*
------------------------------------------------------------------------------------------------------------

Dashboard

Dashboard ist quasi der Protein/Modifikaitons teil gemeint
------------------------------------------------------------------------------------------------------------
*/

// Das die Dicke Funktion die Uniprot Protein Anfrage macht und diesen Protein View Chart startet - Umbau auf meins
/**
 * Initialies the dashboard chart by fetching the data of one protein from the server.
 *
 * @param {String} uniprotPaValue Optional UniProt accession value to initialize the dashboard chart with. If undefined, the selected protein from the overview table is used.
 * @param {Number} cutoffValue Distance cutoff value to use for defining residue contacts.
 * @param {String} pdbTextValue Optional PDB text value to initialize the dashboard chart with.
 * @param {Boolean} scrollTo Optional flag to indicate whether to scroll to the dashboard panel after initialization. Default is true.
 */
function dashboardChartInitialize(
  uniprotPaValue,
  cutoffValue,
  pdbTextValue,
  scrollTo
) {
  displayNotification("Initializing dashboard.");
  let sel_protein_id = undefined;
  if (uniprotPaValue == undefined)
    sel_protein_id = _overviewTable.getSelection();
  else sel_protein_id = uniprotPaValue;
  if (cutoffValue == undefined) cutoffValue = 4.69;
  if (pdbTextValue == undefined) pdbTextValue = null;
  if (scrollTo == undefined) scrollTo = true;
  if (sel_protein_id == null) {
    removeNotification();
    displayAlert(
      `No protein was selected from panel <i class="fa-duotone fa-circle-3"></i>`
    );
    return;
  }
  request = {
    uniprot_pa: sel_protein_id,
    pdb_text: pdbTextValue,
    cutoff: cutoffValue,
  };
  axios
    .post(
      window.location.origin + "/protein_data",
      pako.deflate(JSON.stringify(request)),
      {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Encoding": "zlib",
        },
      }
    )
    .then((response) => {
      if (response.status == 303) {
        displayAlert("Failed to fetch protein structure.");
      } else {
        // TODO: Prune protein data to remove modifications at positions that exceed the protein's length.
        let primaryAccession = response.data.annotation.primaryAccession;
        let proteinName = response.data.annotation.hasOwnProperty(
          "proteinDescription"
        )
          ? response.data.annotation.proteinDescription.hasOwnProperty(
            "recommendedName"
          )
            ? response.data.annotation.proteinDescription.recommendedName
              .fullName.value
            : Object.values(response.data.annotation.proteinDescription)[0][0]
              .fullName.value
          : "N/A";
        let organismName = response.data.annotation.hasOwnProperty("organism")
          ? "<em>" + response.data.annotation.organism.scientificName + "</em>"
          : "N/A";
        $("#panel-dashboard-selection").html(
          "Selected Protein: <u>" +
          [primaryAccession, proteinName, organismName].join(" | ") +
          "</u> (Click for UniProt Information)"
        );
        $("#panel-dashboard-selection").css("cursor", "pointer");
        $("#panel-dashboard-selection").on("click", () =>
          Swal.fire({
            html: response.data.annotation.comments
              .filter((_) => {
                return _.hasOwnProperty("texts");
              })
              .map((_) => {
                return (
                  "<code>" +
                  _.commentType +
                  "</code><p class='text-just' style='font-size: smaller;'>" +
                  _.texts[0].value +
                  "</p>"
                );
              })
              .join("</br>"),
            confirmButtonColor: "#607196",
            confirmButtonText: "Close Info",
            width: "35vw",
            heightAuto: false,
          })
        );
        // console.log(response.data); // Uncomment for local development.
        _dashboardChart.fill(response.data);
        _dashboardContent = "modifications";
        $("#panel-dashboard-title").html("Explore detail - Modifications view");
        if (scrollTo) scroll_to("panel-dashboard");
      }
    })
    .catch((error) => {
      console.error(error);
      removeNotification();
      displayAlert(error.response.data);
    })
    .finally(() => {
      removeNotification();
    });
}


// Chart bild download... - Reuse / Reintegrate
/**
 * Downloads the image of the dashboard chart.
 */
function dashboardChartDownloadImage() {
  const _ = document.createElement("a");
  document.body.appendChild(_);
  _.setAttribute("download", "dashboard.png");
  _.href = _dashboardChart.getDataUrl();
  if (!_.href.endsWith("undefined")) _.click();
  _.remove();
}

// Zoom ok... vlt neu integrieren - Unsicher
/**
 * Restores the zoom of the dashboard chart.
 */
function dashboardChartRestoreZoom() {
  _dashboardChart.restoreZoom();
}


// Wenn ichs richtig verstehe teil der die dinger im Dashboard chart nur hervorhebt... aber nicht sure... - Unsicher
/**
 * Highlights the selected PTMs in the dashboard chart.
 */
function dashboardChartHighlight() {
  let options = [];
  let names = _dashboardChart.getDataNames();
  for (let i = 0; i < names.length; i++) {
    options.push(`<option value="` + i + `">` + names[i] + `</option>`);
  }
  Swal.fire({
    backdrop: false,
    confirmButtonColor: "#607196",
    width: "35em",
    padding: "1em",
    position: "center",
    html:
      `<h4><small>Select PTMs to highlight:</small></h4>
    <select id="tmpSelect" data-role="select" class="input-small" multiple>` +
      options.join("") +
      `</select>`,
  }).then((result) => {
    if (result.isConfirmed) {
      _dashboardChart.highlight(Metro.getPlugin("#tmpSelect", "select").val());
    }
  });
}


// Teil für umschalten Protein/Modifications view - eigentlich obsolet
/**
 * Switches the content of the dashboard chart between modifications and structure view.
 */
function dashboardChartSwitch() {
  if (_dashboardContent == "modifications") {
    _dashboardContent = "structure";
    $("#panel-dashboard-title").html("Explore detail - Structure view");
  } else if (_dashboardContent == "structure") {
    _dashboardContent = "modifications";
    $("#panel-dashboard-title").html("Explore detail - Modifications view");
  }
  _dashboardChart.switchContent();
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