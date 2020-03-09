import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const state = {
  oldPath: '', // 保存上一个路由path
  mainMenus: [],
  subMenus: [],
  // // 关键词竞争分析添加的state
  newKeywordAnalysis: ''
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
