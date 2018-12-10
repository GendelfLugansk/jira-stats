import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';

const selectionToStr = function(selection) {
  if (selection.filter(s => s.checked).length === selection.length) {
    return 'All';
  }

  if (selection.filter(s => s.checked).length === 0) {
    return 'Any';
  }

  return selection
    .filter(s => s.checked)
    .map(s => s.text)
    .join(', ');
};

export default Component.extend({
  classNames: ['issue-filters'],

  backend: service(),

  fetch: task(function*() {
    const availableFilters = yield this.backend.getAvailableFilters();
    const appliedFilters = JSON.parse(this.appliedFilters);
    availableFilters.forEach(availableFilter => {
      availableFilter.selection = availableFilter.possibleValues.map(value => ({
        value,
        text:
          value !== '' ? value : availableFilter.emptyStrValueText || 'Empty',
        checked:
          appliedFilters &&
          appliedFilters[availableFilter.key] &&
          Array.isArray(appliedFilters[availableFilter.key])
            ? appliedFilters[availableFilter.key].indexOf(value) > -1
            : false,
      }));
      availableFilter.selectedStr = selectionToStr(availableFilter.selection);
      availableFilter.hasChecked =
        availableFilter.selection.filter(s => s.checked).length > 0;
    });
    this.set('filters', availableFilters);
  }).drop(),

  applyFilters() {
    this.filters.forEach(filter => {
      set(filter, 'selectedStr', selectionToStr(filter.selection));
      set(
        filter,
        'hasChecked',
        filter.selection.filter(s => s.checked).length > 0
      );
    });
    (this.onApplyFilters || (() => {}))(
      JSON.stringify(
        this.filters.reduce((acc, filter) => {
          let selected = filter.selection.filter(s => s.checked);
          if (selected.length > 0) {
            acc[filter.key] = selected.map(s => s.value);
          }

          return acc;
        }, {})
      )
    );
  },

  didInsertElement() {
    this._super(...arguments);
    this.fetch.perform();
  },
});
