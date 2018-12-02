export default function stringifyAjaxError(
  response,
  newLineSeparator = '<br />',
  unexpectedText = 'Something unexpected happened, try again and contact site admin'
) {
  console.log(response); //eslint-disable-line no-console
  if (response === undefined) {
    return unexpectedText;
  }

  if (response.errors !== undefined && Array.isArray(response.errors)) {
    return response.errors
      .map(function(item) {
        return String(item.detail || item);
      })
      .join(newLineSeparator);
  }

  if (response.json !== undefined) {
    if (response.json.message !== undefined) {
      return String(response.json.message);
    }

    if (response.json.error !== undefined) {
      return String(response.json.error);
    }
  }

  if (response.responseJSON !== undefined) {
    if (response.responseJSON.message !== undefined) {
      return String(response.responseJSON.message);
    }

    if (response.responseJSON.error !== undefined) {
      return String(response.responseJSON.error);
    }
  }

  if (response.message !== undefined) {
    return String(response.message);
  }

  if (response.error !== undefined && typeof response.error !== 'function') {
    return String(response.error);
  }

  if (response.statusText !== undefined) {
    return String(response.statusText);
  }

  if (response.body !== undefined && response.body.error !== undefined) {
    return String(response.body.error);
  }

  if (typeof response === 'string') {
    return response;
  }

  if (typeof response === 'object') {
    return JSON.stringify(response);
  }

  if (response.toString !== undefined) {
    return response.toString();
  }

  return unexpectedText;
}
