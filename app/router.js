import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  this.route('import');
  this.route('issues');
  this.route('report');

  this.route('dashboard-example');
});

export default Router;
