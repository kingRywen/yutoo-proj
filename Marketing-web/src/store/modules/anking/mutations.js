export default {
  getmain(state, menus) {
    // console.log('主菜单', menus)
    state.mainMenus = menus
  },
  getSubMenu(state, menus) {
    // console.log('子菜单', menus)
    state.subMenus = menus
  },
  saveOldPath(state, path) {
    state.oldPath = path
  },
  // 获取关键词排名列表
  getWordRankingLists(state, data) {

    state.keywordRankings = data
  },
  // 关键词排名_添加任务
  addKeywordRankingTasks(state, data) {
    state.keywordRankingTasks = data
  },
  // 类目排名_添加任务
  addLisRankings(state, data) {
    state.categoryRankings = data
  },
  // 类目
  getCategoryRankingLists(state, data) {
    state.categoryRankings = data
  },

  // AdWords排名列表获取
  getAdvertisementRankingList(state, data) {
    state.advertisementRanking = data
  },
  getData(state, data) {
    state.getData = data
  },
}
