export default {
  getmain (state, menus) {
    console.log('主菜单', menus)
    state.mainMenus = menus
  },
  getSubMenu (state, menus) {
    console.log('子菜单', menus)
    state.subMenus = menus
  }
}
