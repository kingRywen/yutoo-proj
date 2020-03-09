const state = {
  departmentList: [] // 部门树
}
const getters = {}
const actions = {
  async pullDepartmentList({
    commit
  }) {
    commit('setDepartmentList', await GLOBAL.ajax[`perms/departmentList`]({}))
  }
}
const mutations = {
  setDepartmentList(state, data) {
    if (data.rows) {
      state.departmentList = data.rows
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}