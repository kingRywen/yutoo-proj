import getters from "./getters"
import actions from "./actions"
import mutations from "./mutations"

const state = {
  //  获取跟卖监控列表
  salesLists: [], //定义存的数据  第四步
  salesMonitoringSeeList: [], //定义跟卖中心查看列表
  noGoodMonitoringLists: [], //定义差评监控数据列表
  saveSkuMatchedForChild: ''
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
