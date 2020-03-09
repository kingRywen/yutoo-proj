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

  // 店铺授权列表获取   第三步
  imgsList(state, data) { //state 是默认参数，第二个是要保存的数据
    state.imgsGetLists = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。
  },

}
