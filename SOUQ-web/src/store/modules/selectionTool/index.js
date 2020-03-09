import getters from "./getters"
import actions from "./actions"
import mutations from "./mutations"

const state = {

  getAnalysisList: [], //竞品分析结果列表
  geQueryList: [], //关键词查询列表
  getCategorys: [], //类目查询列表
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
