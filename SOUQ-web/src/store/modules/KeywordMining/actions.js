import {


  getKeywordMiningLists, //关键词挖掘列表

} from '../../../api/get'


export default {
  //  第二步 定义一个action方法


  // 选品工具  竞品分析列表获取
  async getKeywordMiningListsApi({
    commit
  }, params) {
    let res = await getKeywordMiningLists(params) //等待请求回来之后，执行MUTATIONS   先拿再存  拿 get 、后台接口,  存 通过commit 触发 MUTATIONS 方法，存入到 state 里面
    commit('getKeywordMiningData', res) //调用mutations的方法传入请求回来的有用数据  -getSalesLists-这是一个方法
  },
}
