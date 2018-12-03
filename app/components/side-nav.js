import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: 'aside',
  elementId: 'left-col',
  classNames: ['uk-light'],

  backend: service(),

  dropDatabase: task(function*() {
    yield this.backend.dropDatabase();
  }),
});
