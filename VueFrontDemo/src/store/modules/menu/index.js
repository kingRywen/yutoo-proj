import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const state = {
  mainMenus: [],
  subMenus: []
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
