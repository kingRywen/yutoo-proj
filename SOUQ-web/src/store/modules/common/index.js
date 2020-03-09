import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const state = {
  pathFromCheckProductAnalysis: '', // 竞品分析查看高亮path
  breadList: []
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
