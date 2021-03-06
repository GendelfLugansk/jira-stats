import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  this.route('import');
  this.route('issues');
  this.route('reports', function() {
    this.route('common');
    this.route('sprint');
    this.route('label');
    this.route('labels-combined');
    this.route('all');
  });

  this.route('dashboard-example');
});

export default Router;
