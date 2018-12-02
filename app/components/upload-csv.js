import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

export default Component.extend({
  classNames: ['upload-csv'],

  fileQueueService: service('file-queue'),
  backend: service(),
  router: service(),

  queueName: 'import-file',
  fileQueue: computed(
    'queueName',
    'fileQueueService.{queues,files}',
    function() {
      return this.fileQueueService.find(this.queueName);
    }
  ),
  isQueueFull: computed('fileQueue.files.length', function() {
    return this.get('fileQueue.files.length') > 0;
  }),

  upload: task(function*(file) {
    try {
      const extensions = ['csv', 'txt'];
      let extensionValid = false;
      for (let j = 0; j < extensions.length; j++) {
        if (
          String(get(file, 'name')).match(
            new RegExp(`\\.${extensions[j]}$`, 'i')
          )
        ) {
          extensionValid = true;
        }
      }

      if (!extensionValid) {
        throw new Error(
          `Wrong file extension. Only following extensions are allowed: ${extensions
            .map(ext => `*.${ext}`)
            .join('; ')}`
        );
      }

      yield this.backend.upload(file);
      file.queue.remove(file);

      next(this, 'transitionToRoute', 'issues');
    } catch (e) {
      file.queue.remove(file);
      throw e;
    }
  }).drop(),

  transitionToRoute() {
    this.router.transitionTo(...arguments);
  },
});
