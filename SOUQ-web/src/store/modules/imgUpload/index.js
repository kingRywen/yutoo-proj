import getters from "./getters"
import actions from "./actions"
import mutations from "./mutations"

const state = {
  imgsGetLists: [], //图片空间  --->列表获取
  currentNum: 0
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
