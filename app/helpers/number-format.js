/**
 * This helper takes a number and formats it using numeral.js library
 * Usage:
 *  ``{{number-format someValue '0,0.[00000]'}}``
 * Possible formats may be found in numeral.js documentation at http://numeraljs.com/
 */
//noinspection NpmUsedModulesInstalled
import { helper } from '@ember/component/helper';
import numeral from 'npm:numeral';

export function numberFormat(params, hash) {
  const value = params[0];
  const format = params[1] || hash.format || '0,0.00';

  if (isNaN(value)) {
    return typeof hash.nanFormat === 'string' ? hash.nanFormat : '—';
  }

  let numeralObj = numeral(value);

  if (hash.percentageAsIs && format.indexOf('%') >= 0) {
    numeralObj = numeralObj.divide(100);
  }

  return numeralObj.format(format);
}

export default helper(numberFormat);
