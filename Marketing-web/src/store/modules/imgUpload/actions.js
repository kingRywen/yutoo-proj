import {


  getImgsLists, //图片列表获取

} from '../../../api/get'


export default {
  //  第二步 定义一个action方法

  // 版本列表获取
  async getImgsListsApi({
    commit
  }, params) {
    let res = await getImgsLists(params) //等待请求回来之后，执行MUTATIONS   先拿再存  拿 get 、后台接口,  存 通过commit 触发 MUTATIONS 方法，存入到 state 里面
    commit('imgsList', res) //调用mutations的方法传入请求回来的有用数据  -getSalesLists-这是一个方法
  },






}
