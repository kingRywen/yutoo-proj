import getters from "./getters"
import actions from "./actions"
import mutations from "./mutations"

const state = {


  KeywordMiningData: [], //关键词挖掘列表
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
