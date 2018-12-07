import Mixin from '@ember/object/mixin';
import math from 'npm:mathjs';
import arrayUnique from 'jira-stats/utils/array-unique';

export default Mixin.create({
  async chartMedianWorkRatioByLastSprint() {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      {
        status: 'Done',
        __work_ratio: {
          $exists: true,
        },
        __last_sprint: {
          $exists: true,
        },
      },
      {
        $groupBy: {
          assignee: 1,
        },
      }
    );
    const sprints = arrayUnique(
      Object.values(groupedIssues)
        .filter(issues => Array.isArray(issues))
        .reduce(
          (acc, issues) => acc.concat(issues.map(issue => issue.__last_sprint)),
          []
        )
    );
    sprints.sort((a, b) => {
      const re = /\d+/g;
      const matchA = String(a).match(re);
      const matchB = String(b).match(re);
      return Number(matchA[0] || 0) - Number(matchB[0] || 0);
    });

    const traces = [];
    for (let k in groupedIssues) {
      if (groupedIssues.hasOwnProperty(k) && Array.isArray(groupedIssues[k])) {
        traces.push({
          name: k === '' ? 'unassigned' : k,
          type: 'bar',
          x: sprints,
          y: sprints.map(sprint => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.__last_sprint === sprint)
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

  async chartMeanWorkRatioByLastSprint() {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      {
        status: 'Done',
        __work_ratio: {
          $exists: true,
        },
        __last_sprint: {
          $exists: true,
        },
      },
      {
        $groupBy: {
          assignee: 1,
        },
      }
    );
    const sprints = arrayUnique(
      Object.values(groupedIssues)
        .filter(issues => Array.isArray(issues))
        .reduce(
          (acc, issues) => acc.concat(issues.map(issue => issue.__last_sprint)),
          []
        )
    );
    sprints.sort((a, b) => {
      const re = /\d+/g;
      const matchA = String(a).match(re);
      const matchB = String(b).match(re);
      return Number(matchA[0] || 0) - Number(matchB[0] || 0);
    });

    const traces = [];
    for (let k in groupedIssues) {
      if (groupedIssues.hasOwnProperty(k) && Array.isArray(groupedIssues[k])) {
        traces.push({
          name: k === '' ? 'unassigned' : k,
          type: 'bar',
          x: sprints,
          y: sprints.map(sprint => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.__last_sprint === sprint)
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

  async chartMinWorkRatioByLastSprint() {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      {
        status: 'Done',
        __work_ratio: {
          $exists: true,
        },
        __last_sprint: {
          $exists: true,
        },
      },
      {
        $groupBy: {
          assignee: 1,
        },
      }
    );
    const sprints = arrayUnique(
      Object.values(groupedIssues)
        .filter(issues => Array.isArray(issues))
        .reduce(
          (acc, issues) => acc.concat(issues.map(issue => issue.__last_sprint)),
          []
        )
    );
    sprints.sort((a, b) => {
      const re = /\d+/g;
      const matchA = String(a).match(re);
      const matchB = String(b).match(re);
      return Number(matchA[0] || 0) - Number(matchB[0] || 0);
    });

    const traces = [];
    for (let k in groupedIssues) {
      if (groupedIssues.hasOwnProperty(k) && Array.isArray(groupedIssues[k])) {
        traces.push({
          name: k === '' ? 'unassigned' : k,
          type: 'bar',
          x: sprints,
          y: sprints.map(sprint => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.__last_sprint === sprint)
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

  async chartMaxWorkRatioByLastSprint() {
    const { issuesCollection } = await this.ensureCollections();
    const groupedIssues = issuesCollection.find(
      {
        status: 'Done',
        __work_ratio: {
          $exists: true,
        },
        __last_sprint: {
          $exists: true,
        },
      },
      {
        $groupBy: {
          assignee: 1,
        },
      }
    );
    const sprints = arrayUnique(
      Object.values(groupedIssues)
        .filter(issues => Array.isArray(issues))
        .reduce(
          (acc, issues) => acc.concat(issues.map(issue => issue.__last_sprint)),
          []
        )
    );
    sprints.sort((a, b) => {
      const re = /\d+/g;
      const matchA = String(a).match(re);
      const matchB = String(b).match(re);
      return Number(matchA[0] || 0) - Number(matchB[0] || 0);
    });

    const traces = [];
    for (let k in groupedIssues) {
      if (groupedIssues.hasOwnProperty(k) && Array.isArray(groupedIssues[k])) {
        traces.push({
          name: k === '' ? 'unassigned' : k,
          type: 'bar',
          x: sprints,
          y: sprints.map(sprint => {
            let ratios = groupedIssues[k]
              .filter(issue => issue.__last_sprint === sprint)
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
