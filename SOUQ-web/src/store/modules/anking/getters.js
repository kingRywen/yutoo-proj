export default {

  // 获取关键词排名
  getWordRankingLists: state => {
    return state.keywordRankings
  },
  // 关键词排名_添加任务
  addKeywordRankingTasks: state => {
    return state.keywordRankingTasks
  },
  // 获取类目排名
  getCategoryRankingLists: state => {
    return state.categoryRankingLists
  },

  // 获取类目排名
  getCategoryRankingLists: state => {
    return state.categoryRankings
  },
  // 获取广告词排名
  getAdvertisementRankingList: state => { //第五步  state  如果需要计算，就需要用Getter, 
    return state.advertisementRanking
  },

}
