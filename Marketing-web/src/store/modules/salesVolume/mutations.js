export default {
  // 更新分组数据
  updateGroupData (state, data) {
    state.groupData = data
  },
  // 获取销量分析列表
  setSalesAnalysisList (state, data) {
    state.analysisList = data
  },

  showLoading (state) {
    state.tableLoading = true
  },

  hideLoading (state) {
    state.tableLoading = false
  }
}
