import Mixin from '@ember/object/mixin';
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
});
