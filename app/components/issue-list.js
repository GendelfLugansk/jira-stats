import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { next } from '@ember/runloop';

export default Component.extend({
  backend: service(),

  refreshModel: task(function*() {
    const issues = yield this.backend.getIssues(
      this.page,
      this.pageSize,
      this.sort
    );

    this.set('issues', issues);
  }).drop(),

  didReceiveAttrs() {
    this._super(...arguments);
    next(this, '_refreshModel');
  },

  _refreshModel() {
    this.refreshModel.perform();
  },
});
