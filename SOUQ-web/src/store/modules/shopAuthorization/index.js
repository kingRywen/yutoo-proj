import getters from "./getters"
import actions from "./actions"
import mutations from "./mutations"

const state = {
  shopAuthorizationLists: [], //店铺授权列表获取
  getSiteLists: [], //站点数据获取
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
