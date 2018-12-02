import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';

export default Helper.extend({
  backend: service(),

  compute([key]) {
    return this.backend.datumKeyToName(key);
  },

  _recomputeOnLocaleChange: observer(
    'backend.columns.@each.{name,datumKey}',
    function() {
      this.recompute();
    }
  ),
});
