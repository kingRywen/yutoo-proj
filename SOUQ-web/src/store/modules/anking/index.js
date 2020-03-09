import getters from "./getters"
import actions from "./actions"
import mutations from "./mutations"

const state = {
  //  获取关键词排名
  keywordRankings: [],
  //关键词排名_添加任务
  keywordRankingTasks: "",
  //获取类目排名列表
  categoryRankings: [],
  //   搜索
  searchCategoryRankings: null,
  // 获取广告词排名
  advertisementRanking: [],


}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
