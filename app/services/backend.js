import Service from '@ember/service';
import Papa from 'papaparse';
import { Promise as EmberPromise } from 'rsvp';
import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';
import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import complexSort from 'jira-stats/utils/complex-sort';
import math from 'npm:mathjs';

const aliases = {
  'Affects Version/s': 'affects_versions',
  Assignee: 'assignee',
  Created: 'created',
  Creator: 'creator',
  'Custom field (Start date)': 'start_date', //string in exporter timezone
  'Custom field (Story Points)': 'story_points',
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
const ensureMultipleValuesForAliases = [
  'affects_versions',
  'fix_versions',
  'labels',
  'log_work',
  'sprint',
];

export default Service.extend({
  columns: readOnly('_columns'),
  issues: readOnly('_issues'),

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

    const rawHeader = rawCsvArray.data.shift();
    const columns = {};
    rawHeader.forEach((columnName, _index) => {
      if (whitelistedColumns.indexOf(columnName) === -1) {
        return;
      }

      if (columns[columnName] === undefined) {
        const forseMultiple =
          aliases[columnName] &&
          ensureMultipleValuesForAliases.indexOf(aliases[columnName]) > -1;

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

      if (datum.original_estimate !== '' && datum.time_spent !== '') {
        datum.__work_ratio = math.number(
          math.divide(
            math.bignumber(datum.time_spent),
            math.bignumber(datum.original_estimate)
          )
        );
      }

      parsedData.push(datum);
    }

    const existingIssueIds = this._issues
      .map(issue => issue.issue_id)
      .filter(id => id !== undefined);

    this._issues.addObjects(
      parsedData.filter(
        datum => existingIssueIds.indexOf(datum.issue_id) === -1
      )
    );

    this._columns.setProperties(columns);
  },

  async getIssues(page = 1, pageSize = 15, sort) {
    pageSize = Math.max(15, Math.min(pageSize, 50));
    const maxPage = pageSize
      ? Math.max(1, Math.ceil(this.issues.length / pageSize))
      : 1;
    page = Math.max(1, Math.min(page, maxPage));

    const pageNumbers = [];

    for (let i = Math.max(1, page - 5); i <= Math.min(maxPage, page + 5); i++) {
      pageNumbers.push(i);
    }

    let result = this.issues.toArray();

    if (Array.isArray(sort)) {
      complexSort(result, sort);
    }

    result = result.filter(
      (issue, index) =>
        index >= (page - 1) * pageSize && index < page * pageSize
    );

    result.meta = {
      pagination: {
        page,
        pageSize,
        numbers: pageNumbers,
        first: 1,
        last: maxPage,
      },
    };

    return result;
  },

  init() {
    this._super(...arguments);
    this.set('_issues', ArrayProxy.create({ content: A([]) }));
    this.set('_columns', EmberObject.create());
  },
});
