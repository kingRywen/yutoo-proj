import getters from "./getters"
import actions from "./actions"
import mutations from "./mutations"

const state = {
  selectPlatformData: [], //选择平台ID
  platformId: 1,

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
