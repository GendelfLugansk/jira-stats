import { isArray } from '@ember/array';

export default function(arr, sortBy) {
  const sorter = index => {
    return (a, b) => {
      let key, dir;
      [key, dir] = isArray(sortBy[index])
        ? sortBy[index]
        : sortBy[index].split('|');
      const r = dir === 'asc' ? -1 : 1;
      if (a[key] < b[key]) {
        return r;
      } else if (a[key] === b[key]) {
        return index >= sortBy.length - 1 ? 0 : sorter(index + 1)(a, b);
      } else {
        return -1 * r;
      }
    };
  };

  arr.sort(sorter(0));
}
