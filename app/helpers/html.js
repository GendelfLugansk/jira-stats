import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import SanitizeHTML from 'npm:sanitize-html';

export function sanitizeHtml(params, hash) {
  let unescaped = params[0];
  if (hash.nl2br) {
    unescaped = unescaped.replace(/([^>])[\n]/g, '$1<br/>');
  }
  let escaped = SanitizeHTML(unescaped, {
    allowedTags: [
      'blockquote',
      'p',
      'a',
      'ul',
      'ol',
      'li',
      'b',
      'i',
      'strong',
      'em',
      'strike',
      'br',
      'div',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target'],
      img: ['src'],
    },
    // Lots of these won't come up by default because we don't allow them
    selfClosing: [
      'img',
      'br',
      'hr',
      'area',
      'base',
      'basefont',
      'input',
      'link',
      'meta',
    ],
    // URL schemes we permit
    allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
    allowedSchemesByTag: {},
  });
  return htmlSafe(escaped);
}

/**
 *`html` helper is a smart replacement for triple-mustache. It allows some safe html tags in passed argument and
 * strips all other tags. Should be used when we insert user input in template and need to allow simple html formatting
 *
 * @module
 * @augments Ember.Helper
 */
export default helper(sanitizeHtml);
