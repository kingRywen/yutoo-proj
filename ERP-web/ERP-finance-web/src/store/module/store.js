const state = {
  storeAllList: [] // 主菜单
}
const getters = {}
const actions = {
  initStoreAllList({
    commit
  }) {
    GLOBAL.ajax['product/store_list_all']({}).then((data) => {
      commit('setStoreAllList', data.rows)
    })
  }
}
const mutations = {
  setStoreAllList(state, data) {
    state.storeAllList = data.map(el => ({ ...el,
      storeId: el.platformId,
      name: el.name
    }))
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}