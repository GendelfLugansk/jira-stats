import Mixin from '@ember/object/mixin';
import math from 'npm:mathjs';
import arrayUnique from 'jira-stats/utils/array-unique';
import $ from 'jquery';

const { extend } = $;

export default Mixin.create({
  async chartMedianWorkRatioByLabel({ filters } = {}) {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      extend({}, this.filtersToQuery(filters), {
        __work_ratio: {
          $exists: true,
        },
        labels: {
          $exists: true,
        },
      }),
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
            acc.concat(
              issues.reduce((acc, issues) => acc.concat(issues.labels), [])
            ),
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
          x: labels,
          y: labels.map(label => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.labels.indexOf(label) > -1)
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

  async chartMeanWorkRatioByLabel({ filters } = {}) {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      extend({}, this.filtersToQuery(filters), {
        __work_ratio: {
          $exists: true,
        },
        labels: {
          $exists: true,
        },
      }),
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
            acc.concat(
              issues.reduce((acc, issues) => acc.concat(issues.labels), [])
            ),
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
          x: labels,
          y: labels.map(label => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.labels.indexOf(label) > -1)
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

  async chartMinWorkRatioByLabel({ filters } = {}) {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      extend({}, this.filtersToQuery(filters), {
        __work_ratio: {
          $exists: true,
        },
        labels: {
          $exists: true,
        },
      }),
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
            acc.concat(
              issues.reduce((acc, issues) => acc.concat(issues.labels), [])
            ),
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
          x: labels,
          y: labels.map(label => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.labels.indexOf(label) > -1)
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

  async chartMaxWorkRatioByLabel({ filters } = {}) {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      extend({}, this.filtersToQuery(filters), {
        __work_ratio: {
          $exists: true,
        },
        labels: {
          $exists: true,
        },
      }),
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
            acc.concat(
              issues.reduce((acc, issues) => acc.concat(issues.labels), [])
            ),
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
          x: labels,
          y: labels.map(label => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.labels.indexOf(label) > -1)
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
