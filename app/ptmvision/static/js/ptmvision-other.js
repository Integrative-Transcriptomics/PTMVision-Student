
/**
 * ECharts option for global axis style.
 */
const STYLE_AXIS = {
  nameLocation: "center",
  nameGap: 40,
  nameTextStyle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  axisTick: {
    alignWithLabel: true,
    length: 4,
    interval: 0,
  },
};
/**
 * ECharts option for global axis label style.
 */
const STYLE_AXIS_LABEL = {
  fontWeight: "normal",
  fontSize: 12,
};
/**
 * ECharts option for global tooltip style.
 */
const STYLE_TOOLTIP = {
  backgroundColor: "#f0f5f5",
  borderColor: "#d4d4d4",
  textStyle: {
    color: "#333333",
    fontSize: 12,
  },
};
/**
 * ECharts option for global title style.
 */
const STYLE_TITLE = {
  textStyle: {
    fontSize: 14,
    fontWeight: "bold",
  },
};
/**
 * ECharts option for global pointer style.
 */
const STYLE_POINTER = {
  label: {
    show: true,
    fontWeight: "bold",
    fontSize: 11,
    color: "#333333",
    padding: [2, 4, 2, 4],
    backgroundColor: "#fbfbfbe6",
    borderColor: "#fbfbfb",
    margin: 1,
  },
};

/**
 * function: openMolView()
 * Opens pop up window for kekule js molecule viewer
 */
function openMolView() {
    let molName = selectionMenu.value;
    let cmlOut = moleculesLib[molName];

    // put input data together:
    let data = new URLSearchParams({
        molname: molName,
        cml: cmlOut,
    })

    window.open(`./molDisplay.html?${data.toString()}`, "_blank", "popup,width=800,height=800");
};