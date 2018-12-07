import Service from '@ember/service';
import { computed, get, set } from '@ember/object';

/**
 * Colors generated with http://tools.medialab.sciences-po.fr/iwanthue/
 *
 * @type {string[]}
 */
const colors = [
  '#57b0c8',
  '#cbee2f',
  '#ec6eec',
  '#a0f148',
  '#cc86f1',
  '#83d528',
  '#a18ff8',
  '#40bc27',
  '#ee7fd6',
  '#46e470',
  '#f679ad',
  '#8af46c',
  '#7d9af7',
  '#ede936',
  '#ab98ed',
  '#bef451',
  '#e195de',
  '#6bcd3c',
  '#d09dde',
  '#a8df3a',
  '#58a9ee',
  '#dbcf12',
  '#9daaea',
  '#daf759',
  '#b69ed8',
  '#35bc42',
  '#f8b6f1',
  '#87bb1d',
  '#d8bbf0',
  '#b5d333',
  '#75a6d8',
  '#e3b719',
  '#36b1da',
  '#f08825',
  '#4ed1f8',
  '#e49820',
  '#4deef1',
  '#f87d53',
  '#38f0ac',
  '#fa756b',
  '#40e18c',
  '#f57685',
  '#6bd45b',
  '#df90bb',
  '#5bb943',
  '#f3aecf',
  '#9dd84e',
  '#9cc2f7',
  '#eed13f',
  '#79c1ef',
  '#e5ad33',
  '#2bbcce',
  '#f0a44a',
  '#30f1db',
  '#ee915a',
  '#4ef1c3',
  '#e7898b',
  '#79f798',
  '#e793ac',
  '#39bb5f',
  '#f08f74',
  '#72f3b4',
  '#db9553',
  '#6edff4',
  '#e7ed5f',
  '#74cce4',
  '#b0ba2d',
  '#84eced',
  '#bdb02d',
  '#47d4c7',
  '#efb95d',
  '#31b7a3',
  '#dfbc4b',
  '#5bbab3',
  '#ecde65',
  '#7fdbd0',
  '#c59d3e',
  '#82f1dc',
  '#e5a37c',
  '#2ec696',
  '#e8a292',
  '#76dd78',
  '#e4af6f',
  '#54d699',
  '#cea878',
  '#5ccf7f',
  '#edcd99',
  '#41b178',
  '#fef48e',
  '#52be98',
  '#cfd154',
  '#7ee8c0',
  '#e9cb78',
  '#8be8ad',
  '#c2a962',
  '#b1f073',
  '#79c09f',
  '#d5f771',
  '#75bd88',
  '#e8de7a',
  '#6dbd73',
  '#ecedaf',
  '#75b544',
  '#d6f6be',
  '#8cb139',
  '#a4e6b8',
  '#b1d34f',
  '#aed0a0',
  '#afa746',
  '#b7faae',
  '#b1aa72',
  '#98e48b',
  '#c9c36a',
  '#75bc5f',
  '#e9f09b',
  '#7fb26d',
  '#d2ea7d',
  '#90ad76',
  '#cffa96',
  '#a0a955',
  '#b5eaa1',
  '#b2c159',
  '#cae5a1',
  '#9bcf5e',
  '#d4d390',
  '#85b159',
  '#a4cb87',
  '#b2d27a',
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