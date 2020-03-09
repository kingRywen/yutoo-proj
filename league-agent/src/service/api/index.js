const _API = {}
// 遍历注入
const requireApi = require.context('./modules', true, /^.*\.js/);
requireApi.keys().forEach(filename => {
  let key = filename.match(/\.\/(((?!\/).)*)\/.*.js/)[1]
  const api = requireApi(filename);
  const arr = api.default || api || []
  if (!Array.isArray(arr)) {
    throw new Error(`${filename} 此路径的文件必须导出数组`)
  }
  if (_API[key]) {
    _API[key].push(...(arr))
  } else {
    _API[key] = arr
  }
})

export default _API