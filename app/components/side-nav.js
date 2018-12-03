import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'aside',
  elementId: 'left-col',
  classNames: ['uk-light'],

  backend: service(),

  dropDatabase() {
    this.backend.dropDatabase();
  },
});
