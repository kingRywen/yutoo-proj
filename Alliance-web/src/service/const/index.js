const _CONST = {}
// 遍历注入
const requireApi = require.context('.', false, /^((?!index).)*\.js/);
requireApi.keys().forEach(filename => {
    const api = requireApi(filename)
    _CONST[filename.match(/\.\/(.*).js/)[1]] = (api.default || api)
})
export default _CONST
