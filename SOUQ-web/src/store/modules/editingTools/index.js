import getters from "./getters"
import actions from "./actions"
import mutations from "./mutations"

const state = {
  addDescribeLists: {}, //描述添加
  editionListget: [], //切换到版本列表
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
