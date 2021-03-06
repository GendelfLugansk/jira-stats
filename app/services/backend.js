import Service from '@ember/service';
import Papa from 'papaparse';
import { Promise as EmberPromise } from 'rsvp';
import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import math from 'npm:mathjs';
import ChartsCommon from './backend/charts/common';
import ChartsByLastSprint from './backend/charts/by-last-sprint';
import ChartsByLabel from './backend/charts/by-label';
import ChartsByLabelsCombined from './backend/charts/by-labels-combined';
import arrayUnique from 'jira-stats/utils/array-unique';

/* global ForerunnerDB */
const fdb = new ForerunnerDB();
const db = fdb.db('jira-stats-main');

db.persist.addStep(
  new db.shared.plugins.FdbCrypto({
    pass: 'You Know Nothing, Jon Snow',
  })
);

const aliases = {
  'Affects Version/s': 'affects_versions',
  Assignee: 'assignee',
  Created: 'created',
  Creator: 'creator',
  'Due date': 'due_date', //string in exporter timezone
  'Fix Version/s': 'fix_versions',
  'Issue Type': 'issue_type',
  'Issue id': 'issue_id',
  'Issue key': 'issue_key',
  Labels: 'labels',
  'Log Work': 'log_work',
  'Original Estimate': 'original_estimate',
  'Parent id': 'parent_id',
  Priority: 'priority',
  'Project name': 'project_name',
  'Remaining Estimate': 'remaining_estimate',
  Reporter: 'reporter',
  Resolution: 'resolution',
  Resolved: 'resolved', //date when resolved, string in exporter timezone
  Sprint: 'sprint',
  Status: 'status',
  Summary: 'summary',
  'Time Spent': 'time_spent',
  Updated: 'updated', //date when updated, string in exporter timezone
  'Work Ratio': 'work_ratio',
  'Σ Original Estimate': 'total_original_estimate',
  'Σ Remaining Estimate': 'total_remaining_estimate',
  'Σ Time Spent': 'total_time_spent',
};

const aliasesInverted = {};
for (let k in aliases) {
  if (aliases.hasOwnProperty(k)) {
    aliasesInverted[aliases[k]] = k;
  }
}

const whitelistedColumns = Object.keys(aliases);

const requiredColumns = ['issue_id', 'original_estimate', 'time_spent'].map(
  alias => aliasesInverted[alias] || alias
);

const ensureMultipleValuesForAliases = [
  'affects_versions',
  'fix_versions',
  'labels',
  'log_work',
  'sprint',
];

const computedKeysI18n = {
  __labels_combined: 'Labels (combined)',
  __first_sprint: 'First Sprint',
  __last_sprint: 'Latest Sprint',
  __work_ratio: 'Spent / Est.',
};

const datumKeyToName = function(datumKey) {
  return aliasesInverted[datumKey] || computedKeysI18n[datumKey] || datumKey;
};

const filtersConfig = [
  {
    key: 'labels',
    name: datumKeyToName('labels'),
    enableEmptyStrValue: false,
  },
  {
    key: '__labels_combined',
    name: datumKeyToName('__labels_combined'),
    enableEmptyStrValue: true,
    emptyStrValueText: 'Unlabeled',
  },
  {
    key: 'assignee',
    name: datumKeyToName('assignee'),
    enableEmptyStrValue: true,
    emptyStrValueText: 'Unassigned',
  },
  {
    key: 'status',
    name: datumKeyToName('status'),
    enableEmptyStrValue: false,
  },
  {
    key: 'sprint',
    name: datumKeyToName('sprint'),
    enableEmptyStrValue: false,
    valueSortFunc(a, b) {
      const re = /\d+/g;
      const matchA = String(a).match(re);
      const matchB = String(b).match(re);
      return Number(matchA[0] || 0) - Number(matchB[0] || 0);
    },
  },
  {
    key: '__first_sprint',
    name: datumKeyToName('__first_sprint'),
    enableEmptyStrValue: false,
    valueSortFunc(a, b) {
      const re = /\d+/g;
      const matchA = String(a).match(re);
      const matchB = String(b).match(re);
      return Number(matchA[0] || 0) - Number(matchB[0] || 0);
    },
  },
  {
    key: '__last_sprint',
    name: datumKeyToName('__last_sprint'),
    enableEmptyStrValue: false,
    valueSortFunc(a, b) {
      const re = /\d+/g;
      const matchA = String(a).match(re);
      const matchB = String(b).match(re);
      return Number(matchA[0] || 0) - Number(matchB[0] || 0);
    },
  },
  {
    key: 'project_name',
    name: datumKeyToName('project_name'),
    enableEmptyStrValue: false,
  },
  {
    key: 'creator',
    name: datumKeyToName('creator'),
    enableEmptyStrValue: false,
  },
  {
    key: 'reporter',
    name: datumKeyToName('reporter'),
    enableEmptyStrValue: false,
  },
  {
    key: 'issue_type',
    name: datumKeyToName('issue_type'),
    enableEmptyStrValue: false,
  },
  {
    key: 'priority',
    name: datumKeyToName('priority'),
    enableEmptyStrValue: false,
  },
  {
    key: 'resolution',
    name: datumKeyToName('resolution'),
    enableEmptyStrValue: false,
  },
];

export default Service.extend(
  ChartsCommon,
  ChartsByLastSprint,
  ChartsByLabel,
  ChartsByLabelsCombined,
  {
    columns: readOnly('_columns'),

    async upload(file) {
      const rawCsvArray = await new EmberPromise((resolve, reject) => {
        Papa.parse(file.blob, {
          delimiter: ',',
          quoteChar: '"',
          header: false,
          complete: resolve,
          error: reject,
          skipEmptyLines: true,
        });
      });

      if (rawCsvArray.data.length < 2) {
        return;
      }

      const {
        issuesCollection,
        columnsCollection,
      } = await this.ensureCollections();

      const ensureMultipleValuesForColumnNames = Object.values(this._columns)
        .filter(col => col.multipleValues)
        .map(col => col.name);

      const rawHeader = rawCsvArray.data.shift();
      const columns = {};
      rawHeader.forEach((columnName, _index) => {
        if (whitelistedColumns.indexOf(columnName) === -1) {
          return;
        }

        if (columns[columnName] === undefined) {
          const forseMultiple =
            aliases[columnName] &&
            (ensureMultipleValuesForAliases.indexOf(aliases[columnName]) > -1 ||
              ensureMultipleValuesForColumnNames.indexOf(columnName) > -1);

          columns[columnName] = {
            name: columnName,
            multipleValues: forseMultiple,
            _index: forseMultiple ? [_index] : _index,
            datumKey: aliases[columnName] || columnName,
          };
        } else {
          columns[columnName].multipleValues = true;
          if (!Array.isArray(columns[columnName]._index)) {
            columns[columnName]._index = [columns[columnName]._index];
          }
          columns[columnName]._index.push(_index);
        }
      });
      const valid = requiredColumns.reduce(
        (acc, columnName) => acc && columns.hasOwnProperty(columnName),
        true
      );
      if (!valid) {
        throw new Error('File does not contain required columns');
      }
      const parsedData = [];
      while (rawCsvArray.data.length > 0) {
        const rawRow = rawCsvArray.data.shift();
        const datum = {};
        for (let k in columns) {
          if (columns.hasOwnProperty(k)) {
            const datumKey = columns[k].datumKey;
            if (columns[k].multipleValues) {
              datum[datumKey] = rawRow.reduce((acc, val, index) => {
                if (columns[k]._index.indexOf(index) > -1 && val !== '') {
                  acc.push(val);
                }

                return acc;
              }, []);
            } else {
              datum[datumKey] = rawRow[columns[k]._index];
            }
          }
        }

        datum._id =
          datum.issue_id ||
          datum.issue_key ||
          datum.created + datum.creator ||
          undefined;

        if (
          datum.original_estimate !== '' &&
          datum.time_spent !== '' &&
          math.larger(
            math.bignumber(datum.original_estimate),
            math.bignumber(0)
          )
        ) {
          datum.__work_ratio = math.number(
            math.divide(
              math.bignumber(datum.time_spent),
              math.bignumber(datum.original_estimate)
            )
          );
        }

        if (Array.isArray(datum.sprint) && datum.sprint.length > 0) {
          datum.__last_sprint = datum.sprint[datum.sprint.length - 1];
          datum.__first_sprint = datum.sprint[0];
        }

        if (Array.isArray(datum.labels)) {
          datum.__labels_combined = arrayUnique(datum.labels)
            .sort()
            .join('+');
        }

        parsedData.push(datum);
      }

      await new EmberPromise((resolve, reject) => {
        try {
          issuesCollection.upsert(parsedData, resolve);
        } catch (e) {
          reject(e);
        }
      });

      this._columns.setProperties(columns);
      this._columns.set('_id', this._columns.getWithDefault('_id', 'mainSet'));

      await new EmberPromise((resolve, reject) => {
        try {
          columnsCollection.upsert(
            this._columns.getProperties(...Object.keys(this._columns)),
            resolve
          );
        } catch (e) {
          reject(e);
        }
      });

      await EmberPromise.all([
        new EmberPromise((resolve, reject) => {
          issuesCollection.save(err => {
            if (!err) {
              return resolve();
            }
            reject(err);
          });
        }),
        new EmberPromise((resolve, reject) => {
          columnsCollection.save(err => {
            if (!err) {
              return resolve();
            }
            reject(err);
          });
        }),
      ]);
    },

    async getIssues(page = 1, pageSize = 15, sort, filters = {}) {
      const { issuesCollection } = await this.ensureCollections();

      const opts = {};

      const orders = {};
      if (Array.isArray(sort)) {
        sort.forEach(sortBy => {
          sortBy = Array.isArray(sortBy) ? sortBy : String(sortBy).split('|');
          if (sortBy.length === 2) {
            orders[sortBy[0]] = sortBy[1] === 'desc' ? -1 : 1;
          }
        });
      }
      if (Object.keys(orders).length > 0) {
        opts.$orderBy = orders;
      }

      const numberOfIssues = issuesCollection.count(
        this.filtersToQuery(filters)
      );

      pageSize = Math.max(15, Math.min(pageSize, 50));
      const maxPage = pageSize
        ? Math.max(1, Math.ceil(numberOfIssues / pageSize))
        : 1;
      page = Math.max(1, Math.min(page, maxPage));

      const pageNumbers = [];

      for (
        let i = Math.max(1, page - 5);
        i <= Math.min(maxPage, page + 5);
        i++
      ) {
        pageNumbers.push(i);
      }

      if (
        typeof pageSize === 'number' &&
        typeof page === 'number' &&
        !isNaN(pageSize) &&
        !isNaN(page)
      ) {
        opts.$page = page - 1;
        opts.$limit = pageSize;
      }

      const result = issuesCollection.find(this.filtersToQuery(filters), opts);

      result.meta = {
        pagination: {
          page,
          pageSize,
          numbers: pageNumbers,
          first: page > 1 ? 1 : undefined,
          last: page < maxPage ? maxPage : undefined,
          prev: page > 1 ? page - 1 : undefined,
          next: page < maxPage ? page + 1 : undefined,
        },
      };

      return result;
    },

    datumKeyToName(datumKey) {
      return datumKeyToName(datumKey);
    },

    async ensureCollections() {
      if (this._issuesCollection && this._columnsCollection) {
        return {
          issuesCollection: this._issuesCollection,
          columnsCollection: this._columnsCollection,
        };
      }

      const issuesCollection = db.collection('issues', {
        capped: true,
        size: 50000,
      });
      await new EmberPromise((resolve, reject) => {
        issuesCollection.load(err => {
          if (!err) {
            return resolve();
          }
          reject(err);
        });
      });

      const columnsCollection = db.collection('columnSet');
      await new EmberPromise((resolve, reject) => {
        columnsCollection.load(err => {
          if (!err) {
            return resolve();
          }
          reject(err);
        });
      });

      this.set('_issuesCollection', issuesCollection);
      this.set('_columnsCollection', columnsCollection);

      const columns = columnsCollection.find({ _id: 'mainSet' });
      if (columns.length > 0) {
        this._columns.setProperties(columns[0]);
      }

      return { issuesCollection, columnsCollection };
    },

    async dropDatabase() {
      await new EmberPromise((resolve, reject) => {
        try {
          db.drop(resolve);
        } catch (e) {
          reject(e);
        }
      });

      window.location.reload();
    },

    init() {
      this._super(...arguments);
      this.set('_columns', EmberObject.create());
    },

    async getAvailableFilters() {
      const { issuesCollection } = await this.ensureCollections();

      return filtersConfig
        .map(filterConfig => {
          const $distinct = {};
          $distinct[filterConfig.key] = 1;
          const values = issuesCollection.find(
            {
              $distinct,
            },
            {
              $aggregate: filterConfig.key,
            }
          );

          return {
            key: filterConfig.key,
            name: filterConfig.name,
            possibleValues: arrayUnique(
              values
                .reduce((acc, value) => {
                  if (Array.isArray(value)) {
                    return acc.concat(value);
                  }

                  acc.push(value);
                  return acc;
                }, [])
                .filter(
                  value => filterConfig.enableEmptyStrValue || value !== ''
                )
            ).sort(filterConfig.valueSortFunc),
            emptyStrValueText: filterConfig.emptyStrValueText,
          };
        })
        .filter(filterConfig => filterConfig.possibleValues.length > 0);
    },

    filtersToQuery(filters = {}) {
      filters = typeof filters === 'string' ? JSON.parse(filters) : filters;
      return filtersConfig.reduce((acc, filterConfig) => {
        const key = filterConfig.key;
        if (Array.isArray(filters[key]) && filters[key].length > 0) {
          acc[key] = {
            $in: filters[key],
          };
        }

        return acc;
      }, {});
    },
  }
);
