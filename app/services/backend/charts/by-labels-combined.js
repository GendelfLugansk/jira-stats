import Mixin from '@ember/object/mixin';
import math from 'npm:mathjs';
import arrayUnique from 'jira-stats/utils/array-unique';

export default Mixin.create({
  async chartMedianWorkRatioByLabelsCombined() {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      {
        status: 'Done',
        __work_ratio: {
          $exists: true,
        },
        __labels_combined: {
          $exists: true,
        },
      },
      {
        $groupBy: {
          assignee: 1,
        },
      }
    );
    const labels = arrayUnique(
      Object.values(groupedIssues)
        .filter(issues => Array.isArray(issues))
        .reduce(
          (acc, issues) =>
            acc.concat(issues.map(issue => issue.__labels_combined)),
          []
        )
    );
    labels.sort();

    const traces = [];
    for (let k in groupedIssues) {
      if (groupedIssues.hasOwnProperty(k) && Array.isArray(groupedIssues[k])) {
        traces.push({
          name: k === '' ? 'unassigned' : k,
          type: 'bar',
          x: labels.map(label => (label !== '' ? label : 'unlabeled')),
          y: labels.map(label => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.__labels_combined === label)
              .map(issue => math.bignumber(issue.__work_ratio));

            if (ratios.length === 0) {
              return undefined;
            }

            return math.number(math.round(math.median(ratios), 2));
          }),
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

  async chartMeanWorkRatioByLabelsCombined() {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      {
        status: 'Done',
        __work_ratio: {
          $exists: true,
        },
        __labels_combined: {
          $exists: true,
        },
      },
      {
        $groupBy: {
          assignee: 1,
        },
      }
    );
    const labels = arrayUnique(
      Object.values(groupedIssues)
        .filter(issues => Array.isArray(issues))
        .reduce(
          (acc, issues) =>
            acc.concat(issues.map(issue => issue.__labels_combined)),
          []
        )
    );
    labels.sort();

    const traces = [];
    for (let k in groupedIssues) {
      if (groupedIssues.hasOwnProperty(k) && Array.isArray(groupedIssues[k])) {
        traces.push({
          name: k === '' ? 'unassigned' : k,
          type: 'bar',
          x: labels.map(label => (label !== '' ? label : 'unlabeled')),
          y: labels.map(label => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.__labels_combined === label)
              .map(issue => math.bignumber(issue.__work_ratio));

            if (ratios.length === 0) {
              return undefined;
            }

            return math.number(math.round(math.mean(ratios), 2));
          }),
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

  async chartMinWorkRatioByLabelsCombined() {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      {
        status: 'Done',
        __work_ratio: {
          $exists: true,
        },
        __labels_combined: {
          $exists: true,
        },
      },
      {
        $groupBy: {
          assignee: 1,
        },
      }
    );
    const labels = arrayUnique(
      Object.values(groupedIssues)
        .filter(issues => Array.isArray(issues))
        .reduce(
          (acc, issues) =>
            acc.concat(issues.map(issue => issue.__labels_combined)),
          []
        )
    );
    labels.sort();

    const traces = [];
    for (let k in groupedIssues) {
      if (groupedIssues.hasOwnProperty(k) && Array.isArray(groupedIssues[k])) {
        traces.push({
          name: k === '' ? 'unassigned' : k,
          type: 'bar',
          x: labels.map(label => (label !== '' ? label : 'unlabeled')),
          y: labels.map(label => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.__labels_combined === label)
              .map(issue => math.bignumber(issue.__work_ratio));

            if (ratios.length === 0) {
              return undefined;
            }

            return math.number(math.round(math.min(ratios), 2));
          }),
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

  async chartMaxWorkRatioByLabelsCombined() {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      {
        status: 'Done',
        __work_ratio: {
          $exists: true,
        },
        __labels_combined: {
          $exists: true,
        },
      },
      {
        $groupBy: {
          assignee: 1,
        },
      }
    );
    const labels = arrayUnique(
      Object.values(groupedIssues)
        .filter(issues => Array.isArray(issues))
        .reduce(
          (acc, issues) =>
            acc.concat(issues.map(issue => issue.__labels_combined)),
          []
        )
    );
    labels.sort();

    const traces = [];
    for (let k in groupedIssues) {
      if (groupedIssues.hasOwnProperty(k) && Array.isArray(groupedIssues[k])) {
        traces.push({
          name: k === '' ? 'unassigned' : k,
          type: 'bar',
          x: labels.map(label => (label !== '' ? label : 'unlabeled')),
          y: labels.map(label => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.__labels_combined === label)
              .map(issue => math.bignumber(issue.__work_ratio));

            if (ratios.length === 0) {
              return undefined;
            }

            return math.number(math.round(math.max(ratios), 2));
          }),
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
