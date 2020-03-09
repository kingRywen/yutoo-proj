/**
 * trim掉数据头尾指定字段数据为 0/空的数据
 * @param {Array} list 要trim的数据
 * @param {String} keyName 字段名
 */
export function trimData(list, keyName = "cnt") {
  function isEm(cur) {
    return cur[keyName] == null || cur[keyName] === 0;
  }
  let first = 0,
    notFirst,
    notLast,
    last;
  list.reduce((prev, cur, index) => {
    if (prev) {
      if (isEm(list[0]) && first == 0) {
        first = 1;
      }
      if (isEm(cur) && isEm(prev) && isEm(list[0]) && !notFirst) {
        first = index + 1;
      } else {
        notFirst = true;
      }
    }
    return cur;
  }, null);
  list.reduceRight((prev, cur, index) => {
    if (prev) {
      if (isEm(list[list.length - 1]) && !last) {
        last = list.length - 1;
      }
      if (isEm(cur) && isEm(prev) && isEm(list[list.length - 1]) && !notLast) {
        last = index;
      } else {
        notLast = true;
      }
    }
    return cur;
  }, null);
  return list.slice(first, last);
}

export default {
  methods: {
    trimData
  }
};
