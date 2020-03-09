export default {
  allMenus: state => state.mainMenus,
  // 关键词竞争分析getters写法
  getNewKeywordAnalysis: state => state.newKeywordAnalysis,

  platformId: state => +state.savePlatformIdAndSiteId.split(',')[0],
  siteId: state => +state.savePlatformIdAndSiteId.split(',')[1]
}
