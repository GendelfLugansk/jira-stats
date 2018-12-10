import Mixin from '@ember/object/mixin';
import math from 'npm:mathjs';
import $ from 'jquery';

const { extend } = $;

export default Mixin.create({
  async chartWorkRatioHistogram({ filters } = {}) {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      extend({}, this.filtersToQuery(filters), {
        __work_ratio: {
          $exists: true,
        },
      }),
      {
        $groupBy: {
          assignee: 1,
        },
      }
    );

    const traces = [];
    for (let k in groupedIssues) {
      if (groupedIssues.hasOwnProperty(k) && Array.isArray(groupedIssues[k])) {
        traces.push({
          name: k === '' ? 'unassigned' : k,
          x: groupedIssues[k].map(issue => issue.__work_ratio),
          autobinx: false,
          histfunc: 'count',
          histnorm: 'percent',
          opacity: 0.6,
          type: 'histogram',
          xbins: {
            size: 0.1,
          },
        });
      }
    }

    traces.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    return traces;
  },

  async chartTimeSpentHistogram({ filters } = {}) {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      extend({}, this.filtersToQuery(filters), {
        time_spent: {
          $exists: true,
        },
      }),
      {
        $groupBy: {
          assignee: 1,
        },
      }
    );

    const traces = [];
    for (let k in groupedIssues) {
      if (groupedIssues.hasOwnProperty(k) && Array.isArray(groupedIssues[k])) {
        let x = groupedIssues[k]
          .map(issue => issue.time_spent)
          .filter(t => /^[\d]+(\\.\d+)?$/.test(t))
          .map(t =>
            math.number(math.divide(math.bignumber(t), math.bignumber(3600)))
          );
        if (x.length > 0) {
          traces.push({
            name: k === '' ? 'unassigned' : k,
            x,
            autobinx: false,
            histfunc: 'count',
            histnorm: 'percent',
            opacity: 0.6,
            type: 'histogram',
            xbins: {
              start: 0,
              size: 0.5,
            },
          });
        }
      }
    }

    traces.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    return traces;
  },
});
