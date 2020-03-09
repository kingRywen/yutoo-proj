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

  // 添加描述   第三步
  addDescribess(state, data) { //state 是默认参数，第二个是要保存的数据
    state.addDescribeLists = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。
  },
  // 添加描述版本列表   第三步
  editionLists(state, data) { //state 是默认参数，第二个是要保存的数据
    state.editionListget = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。
  }
}
