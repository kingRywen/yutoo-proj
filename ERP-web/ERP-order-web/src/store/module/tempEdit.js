const state = {
  bgWidth: '600px',
  bgHeight: '870px',
  bgColor: '#eee',
  curRenderInfo: {}
}
const getters = {
  curRenderInfo(state) {
    return state.curRenderInfo
  }
}
const actions = {}
const mutations = {
  changeBgW(state, w) {
    state.bgWidth = w + 'px'
  },
  changeBgH(state, h) {
    state.bgHeight = h + 'px'
  },
  changeBgColor(state, val) {
    state.bgColor = val
  },
  setCurRenderInfo(state, info) {
    state.curRenderInfo = info
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
