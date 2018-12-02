import stringifyError from 'jira-stats/utils/stringify-ajax-error';
import Helper from '@ember/component/helper';

export default Helper.extend({
  compute([error]) {
    return stringifyError(error, '<br />');
  },
});
