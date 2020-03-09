export default {

  // 获取跟卖监控
  getSalesLists: state => {
    return state.keywordRankings
  },
  // 获取跟卖监控查看列表
  getSalesSeeLists: state => {
    return state.salesMonitoringSeeLists
  },

  // 获取跟卖监控查看列表
  getnoGoodMonitoringLists: state => {
    return state.noGoodLists
  },



}
