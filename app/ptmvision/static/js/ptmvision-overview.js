/**
 * *******************************************
 * ------------Overview Section---------------
 * *******************************************
 * Everything related to the Overview Section
 */


/**
 * Instance of the OverviewTable class.
 */
var _overviewTable = null;
/**
 * Instance of the OverviewChart class.
 */
var _overviewChart = null;



/**
 * Internal class for handling the overview chart component.
 */
class OverviewChart {
  /**
   * Chart instance.
   */
  chart = null;
  /**
   * Internal data object.
   */
  #data;
  /**
   * Internal ECharts option object.
   */
  #option;
  /**
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
   * Restores the zoom level of the chart.
   *
   * @returns None if no option is set.
   */
  restoreZoom() {
    if (this.#option == undefined) return;
    [0, 1].forEach((_) =>
      this.chart.instance.dispatchAction({
        type: "dataZoom",
        dataZoomIndex: _,
        start: 0,
        end: 100,
      })
    );
  }

  /**
   * Highlights the provided indices in the chart.
   *
   * @param {Array} indices
   * @returns None if no option is set.
   */
  highlight(indices) {
    if (this.#option == undefined) return;
    let markLineOption = {
      silent: true,
      symbol: [null, null],
      lineStyle: {
        color: "#333333",
      },
      label: {
        formatter: (params) => {
          let name =
            this.#data.modificationNamesSorted[this.#sortingIndex][
            params.data.value
            ];
          return this.#data.modifications[name].display_name;
        },
        fontWeight: "lighter",
        fontSize: 9,
        position: "insideEndBottom",
      },
    };
    this.#option.series[0].markLine = {
      ...markLineOption,
      data: indices
        .map((i) => {
          return { yAxis: i };
        })
        .concat(
          indices.map((i) => {
            return { xAxis: i };
          })
        ),
    };
    this.#option.series[1].markLine = {
      ...markLineOption,
      data: indices.map((i) => {
        return { yAxis: i };
      }),
    };
    this.#option.series[2].markLine = {
      ...markLineOption,
      data: indices.map((i) => {
        return { yAxis: i };
      }),
    };
    this.#updateOption(false);
  }

  /**
   * Switches the sorting of the chart.
   *
   * @returns None if no option is set.
   */
  resort() {
    if (this.#option == undefined) return;
    if (this.#sortingIndex == 1) {
      this.#sortingIndex = 0;
      this.fill();
    } else if (this.#sortingIndex == 0) {
      this.#sortingIndex = 1;
      this.fill();
    }
  }

  /**
   * Returns the modification names of the data wrt. to the current sorting index.
   *
   * @returns The names of the data or an empty list if no data is set.
   */
  getDataNames() {
    if (this.#data != undefined)
      return this.#data.modificationNamesSorted[this.#sortingIndex];
    else return [];
  }

  /**
   * Returns the data URL of the chart used for exporting images.
   *
   * @returns The data URL of the chart or None if no option is set.
   */
  getDataUrl() {
    if (this.#option == undefined) return;
    return this.chart.instance.getDataURL({
      pixelRatio: 4,
      backgroundColor: "#fff",
    });
  }

  /**
   * Fills the chart with data; I.e., generates the ECharts option object from the data.
   *
   * @param {Object} data Contains the data to be displayed.
   */
  fill(data) {
    if (data != undefined)
      this.#data = {
        modifications: data[0],
        modificationNamesSorted: data[1],
        coOccurrence: data[2],
        classCounts: Object.entries(data[3]) // Sort class counts by value.
          .sort(([, v1], [, v2]) => v2 - v1)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        meta: data[4],
      };
    let r = this.chart.instance.getWidth() / this.chart.instance.getHeight(); // Approximate quadratic aspect ratio.
    // Generate series data from data.
    let dataAxis = this.#data.modificationNamesSorted[this.#sortingIndex];
    let dataMassShift = dataAxis.map((name) => {
      return this.#data.modifications[name]["mass_shift"];
    });
    let dataCount = dataAxis.map((name) => {
      return this.#data.modifications[name]["count"];
    });
    let dataCoOccurrence = [];
    for (let i = 0; i < dataAxis.length; i++) {
      for (let j = 0; j < dataAxis.length; j++) {
        if (i == j) continue;
        let _ = [dataAxis[i], dataAxis[j]].sort().join("@");
        if (this.#data.coOccurrence.hasOwnProperty(_))
          dataCoOccurrence.push([i, j, this.#data.coOccurrence[_]]);
      }
    }
    // Fill in option.
    this.#option = {
      title: [
        {
          text:
            "Total modifications: " +
            Object.values(this.#data.classCounts).reduce((a, b) => a + b, 0) +
            " | Distinct modification types: " +
            Object.keys(this.#data.modifications).length +
            " | Distinct UniMod modification classes: " +
            Object.keys(this.#data.classCounts).length,
          top: "top",
          left: "center",
          ...STYLE_TITLE,
        },
        {
          text: "Shared PTM Sites between Modification Types",
          top: 35,
          left: "10%",
          ...STYLE_TITLE,
        },
        {
          text: "Mass shift in Dalton",
          top: 54,
          left: 10 + 1 + 65 / r + "%",
          ...STYLE_TITLE,
        },
        {
          text: "Site count",
          top: 54,
          left: 10 + 1 + 15 + 1 + 65 / r + "%",
          ...STYLE_TITLE,
        },
        {
          text: "Unimod PTM class counts",
          top: 54,
          left: 10 + 1 + 15 + 1 + 15 + 1 + 5 + 65 / r + "%",
          ...STYLE_TITLE,
        },
      ],
      grid: [
        {
          top: 80,
          left: "10%",
          height: "65%",
          width: 65 / r + "%",
          show: true,
        },
        {
          top: 80,
          left: 10 + 1 + 65 / r + "%",
          height: "65%",
          width: "15%",
          show: true,
        },
        {
          top: 80,
          left: 10 + 1 + 15 + 1 + 65 / r + "%",
          height: "65%",
          width: "15%",
          show: true,
        },
        {
          top: 80,
          left: 10 + 1 + 15 + 1 + 15 + 1 + 5 + 65 / r + "%",
          right: "1%",
          height: "60%",
          width: "auto",
          show: true,
        },
      ],
      xAxis: [
        {
          gridIndex: 0,
          type: "category",
          name: "Modification",
          data: dataAxis,
          ...STYLE_AXIS,
          nameGap: 100,
          axisLabel: {
            show: true,
            rotate: 50,
            formatter: (i) => {
              let displayName = this.#data.modifications[i]["display_name"];
              displayName = displayName.replace(
                "Unannotated mass-shift",
                "Mass-shift"
              );
              return displayName.length > 12
                ? displayName.slice(0, 12) + "..."
                : displayName;
            },
            ...STYLE_AXIS_LABEL,
          },
          axisPointer: {
            show: true,
            triggerEmphasis: false,
            triggerTooltip: false,
            ...STYLE_POINTER,
          },
        },
        {
          gridIndex: 1,
          type: "value",
          name: "Mass shift [Da]",
          ...STYLE_AXIS,
          nameGap: 100,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 50,
            ...STYLE_AXIS_LABEL,
          },
          axisPointer: {
            show: true,
            triggerEmphasis: false,
            triggerTooltip: false,
            ...STYLE_POINTER,
          },
        },
        {
          gridIndex: 2,
          type: "value",
          name: "Count",
          ...STYLE_AXIS,
          nameGap: 100,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 50,
            ...STYLE_AXIS_LABEL,
          },
          axisPointer: {
            show: true,
            triggerEmphasis: false,
            triggerTooltip: false,
            ...STYLE_POINTER,
          },
        },
        {
          gridIndex: 3,
          type: "category",
          name: "Class",
          ...STYLE_AXIS,
          nameGap: 130,
          data: Object.keys(this.#data.classCounts),
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 50,
            ...STYLE_AXIS_LABEL,
          },
          axisPointer: {
            show: true,
            triggerEmphasis: false,
            ...STYLE_POINTER,
          },
        },
      ],
      yAxis: [
        {
          gridIndex: 0,
          type: "category",
          name: "Modification",
          ...STYLE_AXIS,
          nameGap: 120,
          data: dataAxis,
          inverse: true,
          axisLabel: {
            show: true,
            formatter: (i) => {
              let displayName = this.#data.modifications[i]["display_name"];
              displayName = displayName.replace(
                "Unannotated mass-shift",
                "Mass-shift"
              );
              return displayName.length > 12
                ? displayName.slice(0, 12) + "..."
                : displayName;
            },
            ...STYLE_AXIS_LABEL,
          },
          axisPointer: {
            show: true,
            triggerEmphasis: false,
            triggerTooltip: false,
            ...STYLE_POINTER,
          },
        },
        {
          gridIndex: 1,
          type: "category",
          data: dataAxis,
          show: false,
          inverse: true,
          axisPointer: {
            show: true,
            triggerEmphasis: false,
            ...STYLE_POINTER,
          },
        },
        {
          gridIndex: 2,
          type: "category",
          data: dataAxis,
          show: false,
          inverse: true,
          axisPointer: {
            show: true,
            triggerEmphasis: false,
            ...STYLE_POINTER,
          },
        },
        {
          gridIndex: 3,
          type: "value",
          name: "Count",
          ...STYLE_AXIS,
          axisLabel: {
            show: true,
            ...STYLE_AXIS_LABEL,
          },
          axisPointer: {
            show: true,
            triggerEmphasis: false,
            triggerTooltip: false,
            ...STYLE_POINTER,
          },
        },
      ],
      tooltip: {
        ...STYLE_TOOLTIP,
        formatter: (params) => {
          if (Array.isArray(params)) params = params[0];
          if (params.seriesIndex == 0) {
            let yModName =
              this.#data.modificationNamesSorted[this.#sortingIndex][
              params.data[1]
              ];
            let xModName =
              this.#data.modificationNamesSorted[this.#sortingIndex][
              params.data[0]
              ];
            return (
              "<code>" +
              params.data[2] +
              "</code> sites have been modified by both <code>" +
              this.#data.modifications[yModName].display_name +
              "</code> (" +
              parseFloat(
                String(this.#data.modifications[yModName].mass_shift)
              ).toFixed(2) +
              " Da) and <code>" +
              this.#data.modifications[xModName].display_name +
              "</code> (" +
              parseFloat(
                String(this.#data.modifications[xModName].mass_shift)
              ).toFixed(2) +
              " Da)."
            );
          }
          if (params.seriesIndex == 1) {
            return (
              "Modification <code>" +
              this.#data.modifications[params.name].display_name +
              "</code> assigned mass shift is <code>" +
              params.data +
              "</code> Da."
            );
          }
          if (params.seriesIndex == 2)
            return (
              "Modification <code>" +
              this.#data.modifications[params.name].display_name +
              "</code> observed on <code>" +
              params.data +
              "</code> different sites, spread across <code>" +
              this.#data.modifications[params.name].frequency +
              "%</code> of proteins in data."
            );
          if (params.seriesIndex == 3)
            return (
              "Modification class <code>" +
              params.name +
              "</code> assigned <code>" +
              params.data +
              "</code> times."
            );
        },
      },
      visualMap: [
        dataCoOccurrence.length > 0
          ? {
            type: "continuous",
            seriesIndex: [0],
            inRange: {
              color: [
                "#dddddd",
                "#cccccc",
                "#888888",
                "#666666",
                "#444444",
                "#222222",
                "#000000",
              ],
            },
            outOfRange: {
              color: ["#444444"],
            },
            min: 1,
            max: Math.max(...Object.values(this.#data.coOccurrence)),
            orient: "horizontal",
            top: 54,
            left: "10%",
            itemHeight: 50,
            itemWidth: 11,
            text: [
              Math.max(...Object.values(this.#data.coOccurrence)),
              "No. shared sites 1",
            ],
            textStyle: { fontWeight: "normal", fontSize: 12 },
          }
          : null,
      ],
      dataZoom: [
        {
          type: "inside",
          yAxisIndex: [0, 1, 2],
          brushSelect: false,
          throttle: 0,
        },
        {
          type: "inside",
          xAxisIndex: [0],
          throttle: 0,
        },
      ],
      series: [
        {
          type: "heatmap",
          xAxisIndex: 0,
          yAxisIndex: 0,
          progressive: 1000,
          progressiveThreshold: 1500,
          animation: false,
          itemStyle: {
            borderWidth: 0.2,
            borderRadius: 2,
            borderColor: "#fbfbfb",
          },
          data: dataCoOccurrence,
          markLine: {},
        },
        {
          type: "scatter",
          xAxisIndex: 1,
          yAxisIndex: 1,
          animation: false,
          symbolSize: 8,
          symbol: "diamond",
          itemStyle: {
            color: "#111111",
          },
          data: dataMassShift,
          cursor: "default",
          markLine: {},
          markArea: {},
        },
        {
          type: "bar",
          xAxisIndex: 2,
          yAxisIndex: 2,
          animation: false,
          itemStyle: {
            color: "#111111",
          },
          barWidth: "50%",
          data: dataCount,
          cursor: "default",
          markLine: {},
        },
        {
          type: "bar",
          xAxisIndex: 3,
          yAxisIndex: 3,
          animation: false,
          itemStyle: {
            color: "#111111",
          },
          barWidth: "50%",
          data: Object.values(this.#data.classCounts),
          cursor: "default",
        },
      ],
    };
    // Highlight PTMs that fall within mass shift tolerance, when sorting by mass shift.
    if (this.#sortingIndex == 0) {
      let segments = [];
      let segment = new Set();
      let areas = [];
      let markAreaOption = {
        silent: true,
        animation: false,
        itemStyle: {
          color: "#ff6663",
          opacity: 0.42,
        },
      };
      for (let i = dataMassShift.length - 1; i >= 0; i--) {
        let j = i - 1;
        if (j < 0) break;
        if (dataMassShift[i] == "null" || dataMassShift[j] == "null") continue;
        if (
          dataMassShift[i] + this.#data.meta.mass_shift_tolerance >=
          dataMassShift[j]
        ) {
          segment.add(i);
          segment.add(j);
        } else {
          if (segment.size > 0) {
            segments.push(segment);
            segment = new Set();
          }
        }
      }
      if (segments.length > 0) {
        for (let S of segments) {
          let s = Array.from(S);
          let l = s.slice(0)[0];
          let u = s.slice(-1)[0];
          areas.push([{ coord: ["min", u] }, { coord: ["max", l] }]);
        }
        this.#option.series[1].markArea = {
          ...markAreaOption,
          data: areas,
        };
      }
    }
    this.#updateOption(true);
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
 * Initializes the overview chart by fetching the data from the server.
 *
 * @param {Function} afterResponse Optional callback function to execute after the response was received.
 */
function overviewChartInitialize(afterResponse) {
  displayNotification("Retrieving session data.");
  axios
    .get(window.location.origin + "/overview_data")
    .then((response) => {
      _overviewChart.fill(response.data);
      if (afterResponse != undefined) afterResponse();
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

/**
 * Downloads the image of the overview chart.
 */
function overviewChartDownloadImage() {
  const _ = document.createElement("a");
  document.body.appendChild(_);
  _.setAttribute("download", "overview.png");
  _.href = _overviewChart.getDataUrl();
  if (!_.href.endsWith("undefined")) _.click();
  _.remove();
}

/**
 * Restores the zoom of the overview chart.
 */
function overviewChartRestoreZoom() {
  _overviewChart.restoreZoom();
}

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

/**
 * Resorts the overview chart.
 */
function overviewChartSort() {
  _overviewChart.resort();
}

