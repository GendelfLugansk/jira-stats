import Component from '@ember/component';
import ChartMixin from './chart-mixin';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import { next } from '@ember/runloop';

export default Component.extend(ChartMixin, {
  backend: service(),
  chartColors: service(),

  fetch: task(function*() {
    const traces = yield this.backend.chartMeanWorkRatioByLastSprint({
      filters: this.filters,
    });

    if (traces.length === 0) {
      this.set('plotlyData', undefined);
      return;
    }

    traces.forEach(trace => {
      trace.textposition = 'outside';
      trace.text = trace.y;
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
      barmode: 'group',
      hovermode: 'closest',
      colorway: this.get('chartColors.colors'),
      bargap: 0.2,
      bargroupgap: 0.1,
      shapes: [
        {
          type: 'line',
          xref: 'paper',
          yref: 'y',
          x0: 0,
          y0: 1,
          x1: 1,
          y1: 1,
          line: {
            width: 1,
            dash: 'dash',
            color: '#6aab65',
          },
        },
        {
          type: 'line',
          xref: 'paper',
          yref: 'y',
          x0: 0,
          y0: 1.5,
          x1: 1,
          y1: 1.5,
          line: {
            width: 1,
            dash: 'dash',
            color: '#fa5457',
          },
        },
      ],
      xaxis: { title: 'Sprint' },
      yaxis: { title: 'Mean Work Ratio' },
      showlegend: true,
    });
  }).drop(),

  _filtersObserver: observer('filters', function() {
    next(this.fetch, 'perform');
  }),
});
