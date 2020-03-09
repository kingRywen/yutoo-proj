import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  // 分组数据 - 产品库
  productGrouping: {},
  // 列表 - 产品库
  productLib: {},
  // 分组数据 - 关键词库
  keywordGrouping: {},
  // 列表 - 关键词库
  keywordLib: {},

  keywordLoading: false
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
