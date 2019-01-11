import Route from '@ember/routing/route';
import moment from 'npm:moment-timezone';

export default Route.extend({
  title(tokens) {
    return ['Jira Stats', tokens.join(' - '), moment().format()]
      .filter(part => part !== '' && part !== undefined)
      .join(' - ');
  },
});
