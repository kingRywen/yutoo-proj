import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const state = {
  shopWarnings: [
  ], // 店铺预警信息
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
