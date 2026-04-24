/**
 * *******************************************
 * ------------Proteinview Section---------------
 * *******************************************
 * Everything related to the Proteinview Section
 */


/**
 * Instance of the Proteinview table of proteins.
 */
var _proteinTable = null;

/**
 * Instance of the ProteinviewChart class.
 */
var _proteinviewChart = null;


/**
 * Sorting option for protein charts
 * one of:
 * - "Modified_positions"
 * - "Unique_modifications"
 * - "Protein_length"
 */
var _proteinChartSortOpt = null;

/**
 * User selected Uniprot protein ID
 */
var _uniprotID = null;


/**
 * function: proteinChartSortOptChange()
 * Returns the user selected option from the drop down menu in the protein view. Is used
 * to specify the sorting of the data in the Protein view
 */
function proteinChartSortOptChange() {
    var selectedOption = document.getElementById("InputSortProtTree").value;
    _proteinChartSortOpt = selectedOption;
    // decide which sorting function should be called:
    if (_dualMode == false) {
        // case: dual mode disabled
        _proteinviewChart.clear();
        displayNotification("Sorting option change in progress");
        proteinChartInitialize();

    } else {
        _proteinviewChart.clear();
        displayNotification("Sorting option change in progress");
        proteinChartCompInit();
    }
}


/**
 * function userSelection()
 * changes the value of the _uniprotID as the
 * user selected the elements from the proteintable/proteinchart
 * TODO: Work in progress...
 */
function userSelection() {
    _proteinviewChart.on("click", function (params) {
        // saves selected protein id:
        _uniprotID = params.data.id;
        console.log(params.data.id);

        let text2Show = "<p> Selected: " + params.data.name + "</p>" + "<p>Modifications: " + params.data.value + "</p>" + "<p>Uniprot ID: " + params.data.id + "</p>";
        document.getElementById("ProteinSelectionText").innerHTML = text2Show;
    });
}



/**
 * Internal class for handling the overview table component.
 */
class ProteinTable {
    /**
     * Tabulator instance.
     */
    tabulator = null;
    /**
     * Available identifiers for filtering.
     */
    availableIdentifiers = [];
    /**
     * Available modifications for filtering.
     */
    availableModifications = [];

    /**
     * Class constructor.
     *
     * @param {String} id DOM id of the element to bind the component to (#ProtTable).
     */
    constructor(id) {
        this.tabulator = new Tabulator("#" + id, {
            height: "450px",
            layout: "fitColumns",
            columns: [
                {
                    title: "ID",
                    field: "id",
                    sorter: "string"
                },
                {
                    title: "Name",
                    field: "name"
                },
                {
                    title: "Primary Sequence Length",
                    field: "length",
                    sorter: "number"
                },
                {
                    title: "No. modified positions",
                    field: "modified_positions",
                    sorter: "number"
                },
                {
                    title: "No. distinct modifications",
                    field: "unique_modifications",
                    sorter: "number"
                },
                {
                    title: "Modifications",
                    field: "modifications",
                    visible: false,
                    download: false,
                },
            ],
        });
    }

    /**
     * Exposes the Tabulator rowSelectionChanged event handler.
     *
     * @param {Function} action Function to be executed on row selection change.
     */
    registerSelectionAction(action) {
        this.tabulator.on(
            "rowSelectionChanged",
            function (data, rows, selected, deselected) {
                action(data);
            }
        );
    }

    /**
     * Sets the filters for the table.
     *
     * @param {Array} idValues List of identifiers to filter for.
     * @param {Array} modValues List of modifications to filter for.
     */
    setFilters(idValues, modValues) {
        this.tabulator.clearFilter(true);
        const filters = [];
        for (let _ of modValues) {
            filters.push({
                field: "modifications",
                type: "like",
                value: _,
            });
        }
        for (let _ of idValues) {
            let idValueFields = _.split("$");
            filters.push({
                field: idValueFields[0] == "id" ? "id" : "name",
                type: "like",
                value: idValueFields[1],
            });
        }
        this.tabulator.setFilter(filters);
    }

    /**
     * Fills the table with data.
     *
     * @param {Array} data List of Objects containing the data to be displayed.
     */
    setData(data) {
        this.tabulator.setData(data);
        this.availableModifications = new Set();
        this.availableIdentifiers = new Set();
        for (let entry of data) {
            entry.modifications
                .split("$")
                .forEach((m) => this.availableModifications.add(m));
            this.availableIdentifiers.add(entry.id + "$" + entry.name);
        }
        this.availableModifications = [...this.availableModifications];
        this.availableIdentifiers = [...this.availableIdentifiers];
    }

    /**
     * Returns the selected row's ID.
     *
     * @returns The selected row's ID.
     */
    getSelection() {
        let _ = this.tabulator.getSelectedData();
        if (_.length > 0) return this.tabulator.getSelectedData()[0].id;
        else return null;
    }
}


/**
 * Initializes the protein table by fetching the available proteins from the server.
 *
 * @param {Function} afterResponse Optional callback function to execute after the response was received.
 */
function proteinTableInitialize(afterResponse) {
    displayNotification("Retrieving session data for protein view.");
    axios
        .get(window.location.origin + "/available_proteins")
        .then((response) => {
            _proteinTable.setData(response.data);
            $("#ProtTableTitle").html(
                "Select single protein of interest (" +
                response.data.length +
                " available)"
            );
            if (afterResponse != undefined) afterResponse();
        })
        .catch((error) => {
            console.error(error);
            removeNotification();
            displayAlert(error.response.data);
        }
        );
};



/**
 * Internal class for handling the proteinview chart component. (Treemap for selection)
 */
class ProteinviewChart {
    /**
    * Chart instance.
    */
    chart = null;

    /**
    * Internal ECharts option object.
    */
    #data;

    /**
     * Internal ECharts option object.
     */
    #option;

    /**
    * Class constructor.
    *
    * @param {String} id DOM id of the element to bind the component to.
    */
    constructor(id) {
        this.chart = new Chart(id);
    }

    /**
    * function: prepareSingleData
    * preparing data of only a single dataset
    * as series input for the treemap
    * 
    * @param {Json} jsonInput (input JSON File)
    * @returns {[String][number][String]} dataOutput[], which contains only name, id, modification count
    */
    prepareSingleData(jsonInput) {
        let dataOutput = [];
        // cases: 3 sorting options
        switch (_proteinChartSortOpt) {
            case "Modified_positions":
                for (let i = 0; i < jsonInput.length; i++) {
                    dataOutput.push({
                        name: jsonInput[i].name,
                        value: jsonInput[i].modified_positions,
                        id: jsonInput[i].id
                    });
                };
                return dataOutput;
            case "Unique_modifications":
                for (let i = 0; i < jsonInput.length; i++) {
                    dataOutput.push({
                        name: jsonInput[i].name,
                        value: jsonInput[i].unique_modifications,
                        id: jsonInput[i].id
                    });
                };
                return dataOutput;
            case "Protein_length":
                for (let i = 0; i < jsonInput.length; i++) {
                    dataOutput.push({
                        name: jsonInput[i].name,
                        value: jsonInput[i].length,
                        id: jsonInput[i].id
                    });
                };
                return dataOutput;
            default:
                for (let i = 0; i < jsonInput.length; i++) {
                    dataOutput.push({
                        name: jsonInput[i].name,
                        value: jsonInput[i].modified_positions,
                        id: jsonInput[i].id
                    });
                };
                return dataOutput;
        };
    };




    /**
    * Fills the chart with data; I.e., generates the ECharts option object from the data.
    *
    * @param {Object} data Contains the data to be displayed. (Output of prepareSingleData)
    */
    fill(data) {
        if (data != undefined) {

            let processedData = this.prepareSingleData(data)

            // fill options (chart config)
            this.#option = {
                series: [
                    {
                        name: "Modified proteins",
                        type: "treemap",
                        label: {
                            show: true,
                            fontSize: 16,
                            formatter: "{b}",
                        },
                        upperLabel: {
                            // name of Category
                            fontSize: 24,
                            show: true,
                            height: 30,
                            color: "#FFFFFF",
                            backgroundColor: "#343434",
                        },
                        squareRatio: 1, // positioning of sets
                        data: [
                            {
                                name: dataName1,
                                itemStyle: {
                                    color: colorSet1,
                                },
                                upperLabel: {
                                    // name of Category
                                    show: true,
                                    fontSize: 18,
                                    color: "#ffffff",
                                    backgroundColor: "#435c9cbe",
                                },
                                value: processedData.length,           // how much space this category will get
                                children: processedData                // proteinsSet1 here
                            }
                        ]
                    },
                ],
                tooltip: {
                    show: true,
                    formatter: function (params) {
                        // Array which contains the name of non child elements:
                        let topCategories = ["Modified proteins", dataName1];
                        if (topCategories.includes(params.name)) {
                            return "Contains " + params.value + " Proteins";
                        } else {
                            return "ID: " + params.data.id;
                        }
                    },
                },
            }
            this.#updateOption();
        }
    }

    /**
    * Clears the chart option.
    */
    clear() {
        this.chart.instance.clear();
    }

    /**
    * Internal method for updating the chart option.
    *
    * @param {Boolean} replace Passed to the setOption method of the Chart instance.
    */
    #updateOption(replace) {
        if (this.#option != undefined)
            this.chart.setOption(this.#option, { notMerge: replace });
    }

}


/**
 * function: proteinChartInitialize
 * creates the protein treemap chart for use with
 * 1 dataset (dual mode disabled)
 * @param {Function} afterResponse Optional callback function to execute after the response was received.
 */
function proteinChartInitialize(afterResponse) {
    axios
        .get(window.location.origin + "/available_proteins")
        .then((response) => {
            _proteinviewChart.fill(response.data);

            if (afterResponse != undefined) afterResponse();
        })
        .catch((error) => {
            console.error(error);
            removeNotification();
            displayAlert(error.response.data);
        }
        );
}


/**
 * Internal class for handling the proteinview chart component. (Treemap for selection)
 * This class is for the Comparative/Dual mode
 */
class ProteinviewChartComp {
    /**
    * Chart instance.
    */
    chart = null;
    /**
     * Internal data objects.
     */
    #data1;
    #data2;
    /**
     * Internal ECharts option object.
     */
    #option;
    /**
     * TODO: check how it is used... dunno if i need this..
     * Internal sorting index.
     */
    #sortingIndex = 1;

    /**
    * Class constructor.
    *
    * @param {String} id DOM id of the element to bind the component to.
    */
    constructor(id) {
        this.chart = new Chart(id);
    }


    /**
 * function: checkOccurence()
 * checks if an Uniprot ID occurs in Both input data jsons
 * @param json1             (json object)
 * @param json2             (json object)
 * @returns {[String]} idBoth       array of Uniprot IDs (in both data inputs)
 */
    #checkOccurence(json1, json2) {

        // define return array
        let idBoth = [];

        for (let i = 0; i < json1.length; i++) {
            // i index of loop on json1 array

            let currentID1 = json1[i].id;


            for (let j = 0; j < json2.length; j++) {
                // j index of loop on json2 array
                let currentID2 = json2[j].id;

                if (currentID1 == currentID2) {
                    idBoth.push(currentID1);
                }


            }
        }

        return idBoth;
    }

    /**
    * Filters the json data to only the necessary elements
    * - name = Proteinname
    * - value = modified_positions (max)
    * - (id = protein uniprot id)
    * 
    * @param {Object} commonIDList = list (array of type: ["id1". "id2" ,...]) 
    * with common Uniprot IDs in Both data sets
    * @param {String} set = which set should be created, one of: 
    * - "1" (protiens only in 1)
    * - "2" (proteins only in 2)
    * - "B" (proteins in Both)
    * @param {Object} json1 (json array)
    * @param {Object} json2 (json array)
    */
    prepareData(idBoth, set, json1, json2) {

        let output = [];

        switch (set) {
            case "1":
                switch (_proteinChartSortOpt) {
                    case "Modified_positions":
                        for (let i = 0; i < json1.length; i++) {
                            if (!commonIDList.includes(json1[i].id)) {
                                output.push({
                                    name: json1[i].name,
                                    value: json1[i].modified_positions,
                                    id: json1[i].id
                                });
                            }
                        };
                        return output;
                    case "Unique_modifications":
                        for (let i = 0; i < json1.length; i++) {
                            if (!commonIDList.includes(json1[i].id)) {
                                output.push({
                                    name: json1[i].name,
                                    value: json1[i].unique_modifications,
                                    id: json1[i].id
                                });
                            }
                        };
                        return output;
                    case "Protein_length":
                        for (let i = 0; i < json1.length; i++) {
                            if (!commonIDList.includes(json1[i].id)) {
                                output.push({
                                    name: json1[i].name,
                                    value: json1[i].length,
                                    id: json1[i].id
                                });
                            }
                        };
                        return output;
                    default:
                        for (let i = 0; i < json1.length; i++) {
                            if (!commonIDList.includes(json1[i].id)) {
                                output.push({
                                    name: json1[i].name,
                                    value: json1[i].modified_positions,
                                    id: json1[i].id
                                });
                            }
                        };
                        return output;
                };

                break;
            case "2":
                switch (_proteinChartSortOpt) {
                    case "Modified_positions":
                        for (let i = 0; i < json2.length; i++) {
                            if (!commonIDList.includes(json2[i].id)) {
                                output.push({
                                    name: json2[i].name,
                                    value: json2[i].modified_positions,
                                    id: json2[i].id
                                });
                            }
                        };
                        return output;
                    case "Unique_modifications":
                        for (let i = 0; i < json2.length; i++) {
                            if (!commonIDList.includes(json2[i].id)) {
                                output.push({
                                    name: json2[i].name,
                                    value: json2[i].unique_modifications,
                                    id: json2[i].id
                                });
                            }
                        };
                        return output;
                    case "Protein_length":
                        for (let i = 0; i < json2.length; i++) {
                            if (!commonIDList.includes(json2[i].id)) {
                                output.push({
                                    name: json2[i].name,
                                    value: json2[i].length,
                                    id: json2[i].id
                                });
                            }
                        };
                        return output;
                    default:
                        for (let i = 0; i < json2.length; i++) {
                            if (!commonIDList.includes(json2[i].id)) {
                                output.push({
                                    name: json2[i].name,
                                    value: json2[i].modified_positions,
                                    id: json2[i].id
                                });
                            }
                        };
                        return output;
                };
                break;
            case "B":
                // need 2 Loops for max amount of modifications
                for (let i = 0; i < json1.length; i++) {
                    // loop over all elements in 1 $ 2

                    for (let j = 0; j < json2.length; j++) {
                        if (json1[i].id == json2[j].id) {
                            switch (_proteinChartSortOpt) {

                                case "Modified_positions":
                                    output.push({
                                        name: json1[i].name,
                                        value: Math.max(json1[i].modified_positions, json2[j].modified_positions),
                                        id: json1[i].id
                                    });
                                case "Unique_modifications":
                                    output.push({
                                        name: json1[i].name,
                                        value: Math.max(json1[i].unique_modifications, json2[j].unique_modifications),
                                        id: json1[i].id
                                    });
                                case "Protein_length":
                                    output.push({
                                        name: json1[i].name,
                                        value: Math.max(json1[i].length, json2[j].length),
                                        id: json1[i].id
                                    });

                                    break;
                                default:
                                    output.push({
                                        name: json1[i].name,
                                        value: Math.max(json1[i].modified_positions, json2[j].modified_positions),
                                        id: json1[i].id
                                    });
                                    break;
                            }

                        }
                    }
                }

                return output;
                break;
            default:
                console.error("Default Case Entered!!! This should not happen!!!");
                return output;
        }
    }

    /**
     * function: fill()
     * works through data preparation and
     * fills the chart with given data
     * @param {Object} data1
     * @param {Object} data2
     */
    fill(data1, data2) {

        this.#data1 = data1;
        this.#data2 = data2;


        var idBoth = this.#checkOccurence(data1, data2);

        var prepData1 = this.prepareData(idBoth, "1", data1, data2);
        var prepData2 = this.prepareData(idBoth, "2", data1, data2);
        var prepDataB = this.prepareData(idBoth, "B", data1, data2);

        this.#option = {
            series: [
                {
                    name: "Modified proteins",
                    type: "treemap",
                    label: {
                        show: true,
                        fontSize: 16,
                        formatter: "{b}",

                    },
                    upperLabel: {
                        // name of Category
                        fontSize: 24,
                        show: true,
                        height: 30,
                        color: "#FFFFFF",
                        backgroundColor: "#343434",
                    },
                    squareRatio: 1, // looks better (positioning of sets)
                    data: [
                        {
                            name: dataName1,
                            itemStyle: {
                                color: colorSet1,
                            },
                            upperLabel: {
                                // name of Category
                                show: true,
                                fontSize: 18,
                                color: "#ffffff",
                                backgroundColor: "#435c9cbe",   //TODO: this colors not hardcoded! (slightly lighter than default set)
                            },
                            value: prepData1.length, // how much space this category will get
                            children: prepData1             // proteinsSet1 here
                        },
                        {
                            name: "Contained in both datasets",
                            itemStyle: {
                                color: colorComp,
                            },
                            upperLabel: {
                                // name of Category
                                show: true,
                                fontSize: 18,
                                color: "#ffffff",
                                backgroundColor: "#558b60db",
                            },
                            value: prepDataB.length, // how much space this category will get
                            children: prepDataB             // proteinsBoth here

                        },
                        {
                            name: dataName2,
                            itemStyle: {
                                color: colorSet2,
                            },
                            upperLabel: {
                                // name of Category
                                show: true,
                                fontSize: 18,
                                color: "#ffffff",
                                backgroundColor: "#e9615ade",
                            },
                            value: prepData2.length, // how much space this category will get
                            children: prepData2             // proteinsSet2 here

                        }
                    ]
                }
            ]
        }
        this.#updateOption();
    }


    /**
    * Clears the chart option.
    */
    clear() {
        this.chart.instance.clear();
    }

    // TODO: check if updateOption can be used this way
    /**
    * Internal method for updating the chart option.
    *
    * @param {Boolean} replace Passed to the setOption method of the Chart instance.
    */
    #updateOption(replace) {
        if (this.#option != undefined)
            this.chart.setOption(this.#option, { notMerge: replace });
    }
}

/**
 * function: proteinChartCompInit
 * creates the protein treemap chart for use with
 * 2 datasets (dual mode enabled) - dual mode version of proteinChartInitialize()
 * @param {Function} afterResponse Optional callback function to execute after the response was received.
 */
async function proteinChartCompInit(afterResponse) {

    //TODO: this trows errors for second response
    // faulty data + cross origin
    var set1Data = null;
    var set2Data = null;

    axios.get(window.location.origin + "/available_proteins")
        .then(response1 => {
            set1Data = response1.data;
            return axios.get(window.location.origin + "/available_proteins2")
        })
        .then(response2 => {
            set2Data = response2.data;
            _proteinviewChart.fill(set1Data, set2Data);
        })
        .catch(error => {
            console.error(error);
            removeNotification();
        })
}