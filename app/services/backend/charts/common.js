import Mixin from '@ember/object/mixin';

export default Mixin.create({
  async chartWorkRatioHistogram() {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      {
        status: 'Done',
        __work_ratio: {
          $exists: true,
        },
      },
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
