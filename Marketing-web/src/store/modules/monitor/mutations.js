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
  // 获取跟卖监控列表   第三步
  saveSalesLists(state, data) { //state 是默认参数，第二个是要保存的数据
    state.salesLists = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。
  },
  // 获取跟卖监控列表   第三步
  saveSalesMonitoringSeeList(state, data) { //state 是默认参数，第二个是要保存的数据
    state.salesMonitoringSeeList = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。
  },
  // 获取差评监控   第三步
  saveNoGoodMonitoringList(state, data) { //state 是默认参数，第二个是要保存的数据
    state.noGoodMonitoringLists = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。
  },
  // 保存面包屑
  saveSkuMatchedForChild(state, data) { //state 是默认参数，第二个是要保存的数据
    state.saveSkuMatchedForChild = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。
  },
}
