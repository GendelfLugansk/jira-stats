import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['page', 'pageSize', 'sort'],
  page: '1',
  pageSize: '15',

  init() {
    this._super(...arguments);
    this.set('sort', ['__work_ratio|desc']);
  },
});
