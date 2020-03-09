import {


  getShopAuthorization, //引入获取店铺授权列表
  getSite, //引入获取站点数据

} from '../../../api/get'


export default {
  //  第二步 定义一个action方法

  // 版本列表获取
  async getShopAuthorizationApi({
    commit
  }, params) {
    let res = await getShopAuthorization(params) //等待请求回来之后，执行MUTATIONS   先拿再存  拿 get 、后台接口,  存 通过commit 触发 MUTATIONS 方法，存入到 state 里面
    commit('shopAuthorization', res) //调用mutations的方法传入请求回来的有用数据  -getSalesLists-这是一个方法
  },
  // 站点数据获取
  async getSiteApi({
    commit
  }, params) {
    let res = await getSite(params) //等待请求回来之后，执行MUTATIONS   先拿再存  拿 get 、后台接口,  存 通过commit 触发 MUTATIONS 方法，存入到 state 里面
    commit('getSiteList', res) //调用mutations的方法传入请求回来的有用数据  -getSalesLists-这是一个方法
  },






}
