/**
 * //去除对象的空字符等
 * @param {obj}
 * @return {}
 */
export const filterObj = obj => {
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    let result = {}
    for (let k in obj) {
      if (
        obj[k] !== '' &&
        obj[k] != undefined &&
        obj[k] != null &&
        obj[k].length != 0
      ) {
        result[k] = obj[k]
      } else {
        continue
      }
    }
    return result
  } else {
    console.error('The incoming value is not an object')
    return {}
  }
}
