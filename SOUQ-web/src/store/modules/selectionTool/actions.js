import {
  getKeywordAnalysisList, // 引入竞品分析列表
  getKeywordQueryList, // 关键词查询列表
  getCategoryList // 类目查询列表
} from '../../../api/get'

export default {
  //  第二步 定义一个action方法

  // 选品工具  竞品分析列表获取
  async getKeywordAnalysisListApi ({
    commit
  }, params) {
    let res = await getKeywordAnalysisList(params) // 等待请求回来之后，执行MUTATIONS   先拿再存  拿 get 、后台接口,  存 通过commit 触发 MUTATIONS 方法，存入到 state 里面
    commit('getAnalysisLists', res) // 调用mutations的方法传入请求回来的有用数据  -getSalesLists-这是一个方法
  },

  // 选品工具 关键词查询列表
  async getKeywordQueryListApi ({
    commit
  }, params) {
    let res = await getKeywordQueryList(params) // 等待请求回来之后，执行MUTATIONS   先拿再存  拿 get 、后台接口,  存 通过commit 触发 MUTATIONS 方法，存入到 state 里面
    commit('getKeywordList', res) // 调用mutations的方法传入请求回来的有用数据  -getSalesLists-这是一个方法
  },

  // // 选品工具 类目查询列表
  // async getCategoryListApi ({
  //   commit
  // }, params) {
  //   let res = await getCategoryList(params) // 等待请求回来之后，执行MUTATIONS   先拿再存  拿 get 、后台接口,  存 通过commit 触发 MUTATIONS 方法，存入到 state 里面
  //   commit('getCategoryLists', res) // 调用mutations的方法传入请求回来的有用数据  -getSalesLists-这是一个方法
  // }

}
