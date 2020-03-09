export default {
  // 更新分组数据-产品库
  updateGroupData(state, data) {
    state.productGrouping = data
  },
  // 更新分组数据- 关键词库
  updateGroupDataKeyword(state, data) {
    state.keywordGrouping = data
  },
  // 更新产品库列表
  updateProductLib(state, data) {
    state.productLib = data
  },
  // 更新关键词库列表
  updatekeywordLib(state, data) {
    state.keywordLib = data
  },

  setLoading(state, val) {
    state.keywordLoading = val
  }
}
