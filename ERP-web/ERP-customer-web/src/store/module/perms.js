const state = {
  merchantMenuList: [] // 主菜单
}
const getters = {}
const actions = {
  initMenu({ commit }) {
    GLOBAL.ajax['perms/merchantmenu']({}).then(data => {
      commit('setMenuList', data.rows)
    })
  }
}
const mutations = {
  setMenuList(state, data) {
    state.merchantMenuList = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
