const state = {
  allMenuList: [], //所有权限
  merchantRoleAllList: [],  // 商户所有角色
  AllStores: [],  // 所有店铺
  userAllList: [],  // 商户所有用户
}
const getters = {}
const actions = {
  async pullAllMenuList({
    commit
  }) {
    commit('setAllMenuList', await GLOBAL.ajax[`perms/menuListAll`]({}))
  },
  async pullAllRoleList({
    commit
  }, roleIds) {
    commit('setAllRoleList', await GLOBAL.ajax[`perms/merchantRoleAllList`]({roleIds}))
  },
  async pullAllStores({
    commit
  }) {
    commit('setAllStores', await GLOBAL.ajax[`product/storeGetAllStore`]({}))
  },
  async pullUserAllList({
    commit
  }) {
    commit('setUserAllList', await GLOBAL.ajax[`login/merchantUserAllList`]({}))
  }
}
const mutations = {
  setAllMenuList(state, data) {
    state.allMenuList = data.rows
  },
  setAllStores(state, data) {
    state.AllStores = data.data.map(el => ({label: el.allName, value: el.storeId}))
  },
  setUserAllList(state, data) {
    state.userAllList = data.data.map(el => ({label: el.name, value: el.id}))
  },
  setAllRoleList(state, data) {
    state.merchantRoleAllList = data.data.map(el => ({label: el.name, value: el.id}))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}