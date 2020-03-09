export default {
  getmain (state, menus) {
    // console.log('主菜单', menus)
    state.mainMenus = menus
  },
  getSubMenu (state, menus) {
    // console.log('子菜单', menus)
    state.subMenus = menus
  },
  // 关键词竞争分析添加的mutation写法
  addKeywordAnalysis (state, data) {
    state.newKeywordAnalysis = data
  },
  saveOldPath (state, path) {
    state.oldPath = path
  }
}
