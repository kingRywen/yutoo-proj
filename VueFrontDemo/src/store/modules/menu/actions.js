import {
  getMainIcon,
  getSubMenu
} from '../../../api/get'

export default {
  async getMain ({
    commit
  }, {
    route
  }) {
    console.log(route)
    commit('getmain', await getMainIcon(route))
  },

  async getSiderBar ({
    commit
  }, {
    route,
    mes,
    router
  }) {
    try {
      try {
        let res = await getSubMenu(route)
        if (res.data && res.data.code === 401) {
          mes.error(res.data.msg)
          router.push('/login')
          return
        }
        commit('getSubMenu', res.data.menuList)
      } catch (e) {
        mes.error(e.message)
      }
    } catch (e) {}
  }
}
