import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['page', 'pageSize', 'filters', 'sort'],
  page: '1',
  pageSize: '15',

  init() {
    this._super(...arguments);
    this.set('filters', JSON.stringify({}));
    this.set('sort', ['__work_ratio|desc']);
  },
});
