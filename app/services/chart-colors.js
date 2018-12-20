import Service from '@ember/service';
import { computed, get, set } from '@ember/object';

/**
 * Colors generated with http://tools.medialab.sciences-po.fr/iwanthue/
 *
 * @type {string[]}
 */
const colors = [
  '#00bfc8',
  '#ff1c63',
  '#a0d80e',
  '#816dff',
  '#5ebc4b',
  '#e277ff',
  '#548030',
  '#5a2da1',
  '#afa44b',
  '#ce4ab7',
  '#63a97f',
  '#ac0069',
  '#515729',
  '#7177d3',
  '#d58a36',
  '#464377',
  '#d94432',
  '#6096c7',
  '#8b4227',
  '#cf80d1',
  '#cf8a75',
  '#743179',
  '#d65e88',
  '#bd8db9',
  '#7a3044',
];
const colorsCache = {},
  categoriesCache = {};

export default Service.extend({
  colors: computed(function() {
    return colors;
  }),

  getColor(category, key) {
    const cat = this._escapePathPart(category);
    const k = this._escapePathPart(key);
    if (get(colorsCache, `${cat}.${k}`)) {
      return get(colorsCache, `${cat}.${k}`);
    }

    if (!colorsCache[cat]) {
      colorsCache[cat] = {};
    }

    if (!categoriesCache[cat]) {
      categoriesCache[cat] = [];
    }

    const color = this._colorByIndex(categoriesCache[cat].length);

    categoriesCache[cat].push(k);
    if (color) {
      set(colorsCache, `${cat}.${k}`, color);
    }

    return color;
  },

  _colorByIndex(index) {
    return index < colors.length ? colors[index] : undefined;
  },

  _escapePathPart(category) {
    return String(category).replace(/\./gi, '__dot__');
  },
});
