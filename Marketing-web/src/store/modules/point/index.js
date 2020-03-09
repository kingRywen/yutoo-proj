import getters from "./getters"
import actions from "./actions"
import mutations from "./mutations"

const state = {
  getPointeData: null, //点数获取
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
