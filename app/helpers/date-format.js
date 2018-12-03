import { helper } from '@ember/component/helper';
import moment from 'npm:moment-timezone';

export function dateFormat(params, hash) {
  const date = moment.utc(params[0]);
  const tz = hash.tz || moment.tz.guess();
  const format = hash.format || 'YYYY-MM-DD HH:mm:ss';
  return tz ? date.tz(tz).format(format) : date.format(format);
}

export default helper(dateFormat);
