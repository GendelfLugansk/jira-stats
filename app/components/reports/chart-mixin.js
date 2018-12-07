import Mixin from '@ember/object/mixin';
import Plotly from 'plotly';
import { observer, computed } from '@ember/object';
import { next, debounce } from '@ember/runloop';
import $ from 'jquery';

/**
 * Mixin for chart components with Plotly
 */
export default Mixin.create({
  classNames: ['report-chart'],
  /**
   * If defined, this task will be performed on initialization
   * It should fetch plotlyData from API and set `plotlyData`, `plotlyLayout` and `plotlyConfig`
   *
   * @property fetch
   * @type {TaskProperty}
   */

  /**
   * Should contain plotlyData (array of traces). Will be passed as first argument of Plotly.plot
   *
   * @property plotlyData
   * @type {Array}
   */
  plotlyData: computed(function() {
    return [];
  }),

  /**
   * Will be passed as second argument of Plotly.plot
   *
   * @property plotlyLayout
   * @type {{}}
   */
  plotlyLayout: computed(function() {
    return {};
  }),

  /**
   * Will be passed as third argument of Plotly.plot
   *
   * @property plotlyConfig
   * @type {{}}
   */
  plotlyConfig: computed(function() {
    return {
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['sendplotlyDataToCloud', 'select2d', 'lasso2d'],
      locale: 'en',
    };
  }),

  /**
   * Id of element which will contain chart
   *
   * @property chartId
   * @type {string}
   */
  chartId: computed('elementId', function() {
    return this.elementId + '_chart';
  }),

  _mainObserver: observer(
    'plotlyData',
    'plotlyLayout',
    'plotlyConfig',
    function() {
      next(this, 'drawChart');
    }
  ),

  didInsertElement() {
    this._super(...arguments);
    $(window).on('resize', this.resizeHandler);

    if (this.fetch && this.fetch.perform) {
      this.fetch.perform();
    } else {
      //next for compatibility with modal
      next(this, 'drawChart');
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    $(window).off('resize', this.resizeHandler);
    Plotly.purge(this.chartId);
  },

  resizeHandler: computed(function() {
    const that = this;

    return function() {
      debounce(that, 'drawChart', 150);
    };
  }),

  purgeChart() {
    Plotly.purge(this.chartId);
  },

  drawChart() {
    this.purgeChart();

    if (this.plotlyData && this.plotlyLayout && this.plotlyConfig) {
      return Plotly.plot(
        this.chartId,
        this.plotlyData,
        this.plotlyLayout,
        this.plotlyConfig
      );
    }
  },
});
