import {
  getMainIcon,
  getSubMenu
} from '../../../api/get'

export default {
  async getMain ({
    commit
  }) {
    commit('getmain', await getMainIcon())
  },

  async getSiderBar ({
    commit
  }) {
    commit('getSubMenu', await getSubMenu())
  }
}
