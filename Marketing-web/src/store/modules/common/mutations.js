export default {
  pathFromCheckProductAnalysis(state, poyload) {
    state.pathFromCheckProductAnalysis = poyload
  },
  setBreadList(state, poyload) {
    state.breadList = poyload
  },
  setLoginData(state, poyload) {
    state.setLoginData = poyload
  },
  savePageId(state, poyload) {
    state.pageId = poyload
  },
  savePlatformIdAndSiteId(state, poyload) {
    state.savePlatformIdAndSiteId = poyload
  },
  type_keyword(state, poyload) {
    state.type_keyword = poyload
  },
  key_index_charge(state, poyload) {
    state.key_index_charge = poyload
  },
  userSelect(state, poyload) {
    state.userSelect = poyload
  },
  unreadCnt(state, poyload) {
    state.unreadCnt = poyload
  },
  messageArr(state, poyload) {
    state.messageArr = poyload
  },
  // 点击消息的时候存路由，message
  messageUrl(state, poyload) {
    state.messageUrl = poyload
  },
  num(state, poyload) {
    state.num = poyload
  },
  groupingVOS(state, poyload) {
    state.groupingVOS = poyload
  },
  //保存店铺的下载名字
  downName(state, poyload) {
    state.downName = poyload
  },
  //图片空间在admin上是否开启空间
  showResidualCapacity(state, poyload) {
    state.showResidualCapacity = poyload
  },
  // 图片空间扣点在admin上的点数
  residualCapacity(state, poyload) {
    state.residualCapacity = poyload
  },
}
