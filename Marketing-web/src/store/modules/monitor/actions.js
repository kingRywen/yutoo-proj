import {

  getSalesMonitoringList, //跟卖监控列表获取
  getSalesMonitoringSeeList, //跟卖中心查看列表获取
  getNoGoodMonitoringList, //差评监控列表

} from '../../../api/get'


export default {
  //  第二步 定义一个action方法
  // 跟卖监控列表
  async getSalesMonitoringListApi({
    commit
  }, params) {
    let res = await getSalesMonitoringList(params) //等待请求回来之后，执行MUTATIONS   先拿再存  拿 get 、后台接口,  存 通过commit 触发 MUTATIONS 方法，存入到 state 里面
    commit('saveSalesLists', res) //调用mutations的方法传入请求回来的有用数据  -getSalesLists-这是一个方法
  },


  //  第二步 定义一个action方法
  // 跟卖中心查看 列表
  async getSalesMonitoringSeeListApi({
    commit
  }, params) {
    let res = await getSalesMonitoringSeeList(params) //等待请求回来之后，执行MUTATIONS   先拿再存  拿 get 、后台接口,  存 通过commit 触发 MUTATIONS 方法，存入到 state 里面
    commit('saveSalesMonitoringSeeList', res) //调用mutations的方法传入请求回来的有用数据  -getSalesLists-这是一个方法
  },



  //  第二步 定义一个action方法
  // 差评监控列表获取
  async getNoGoodMonitoringListApi({
    commit
  }, params) {
    let res = await getNoGoodMonitoringList(params)
    //等待请求回来之后，执行MUTATIONS   先拿再存  拿 get 、后台接口,  存 通过commit 触发 MUTATIONS 方法，存入到 state 里面
    commit('saveNoGoodMonitoringList', res) //调用mutations的方法传入请求回来的有用数据  -getSalesLists-这是一个方法
  },





}
