import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['filters'],

  init() {
    this._super(...arguments);
    this.set('filters', JSON.stringify({ status: ['Done'] }));
  },
});
