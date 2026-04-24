/**
 * *******************************************
 * ------------Chart Definition---------------
 * *******************************************
 * This script file only contains the chart class
 * which is needed by:
 * - overview
 * - proteinview
 * - dashboard
 */

/**
 * Internal class for handling EChart instances.
 */
class Chart {
  /**
   * EChart instance.
   */
  instance = null;
  /**
   * DOM id of the element to bind the chart to.
   */
  #instanceDomId = null;
  /**
   * ResizeObserver instance for the chart.
   */
  #resizeObserver = null;

  /**
   * Class constructor.
   *
   * @param {String} id DOM id of the element to bind the component to.
   */
  constructor(id) {
    this.#instanceDomId = id;
    this.instance = echarts.init($("#" + this.#instanceDomId)[0], {
      devicePixelRatio: 2,
      renderer: "canvas",
      width: "auto",
      height: "auto",
    });
    this.#resizeObserver = new ResizeObserver((entries) => {
      this.instance.resize({
        width: entries[0].width,
        height: entries[0].height,
      });
    });
    this.#resizeObserver.observe($("#" + this.#instanceDomId)[0]);
  }

  /**
   *
   * @param {Object} option An ECharts option object (https://echarts.apache.org/en/option.html).
   * @param {Boolean} replace Handles the replace/merge behavior of the setOption method (https://echarts.apache.org/en/api.html#echartsInstance.setOption).
   */
  setOption(option, replace) {
    this.instance.setOption(option, replace);
  }
}