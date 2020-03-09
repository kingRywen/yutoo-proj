import Vue from 'vue';
export const state = {
  quanLoading: false
}

export const mutations = {
  setQuanLoading(state, loading = false) {
    state.quanLoading = loading
  }
}
export const actions = {
  getQuanStatus({ commit }) {
    GLOBAL.ajax[`product/prProductSellerAmzUpdateQuantityStatus`]().then(() => {
      commit('setQuanLoading', false)
    }).catch((data) => {
      if (data.msg == '数据更新中,请勿频繁刷新') {
        commit('setQuanLoading', true)
      } else {
        commit('setQuanLoading', false)
        Vue.prototype.$message.error(data.msg)
      }
    });
  },
  setQuanStatus({ commit }) {
    GLOBAL.ajax[`product/prProductSellerAmzUpdateQuantity`]().then(() => {
      commit('setQuanLoading', true)
    })
  }
}