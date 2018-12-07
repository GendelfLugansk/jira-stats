import Component from '@ember/component';
import ChartMixin from './chart-mixin';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend(ChartMixin, {
  backend: service(),
  chartColors: service(),

  fetch: task(function*() {
    const traces = yield this.backend.chartWorkRatioHistogram();

    if (traces.length === 0) {
      return;
    }

    traces.forEach(trace => {
      trace.marker = {
        color: this.chartColors.getColor('assignee', trace.name),
      };
    });

    this.set('plotlyData', traces);
    this.set('plotlyLayout', {
      height: 500,
      margin: {
        r: 60,
        t: 50,
        b: 50,
        l: 40,
      },
      barmode: 'overlay',
      hovermode: 'closest',
      colorway: this.get('chartColors.colors'),
      bargap: 0.05,
      bargroupgap: 0.2,
      xaxis: { title: 'Work Ratio' },
      yaxis: { title: 'Percent of Issues' },
    });
  }).drop(),
});
