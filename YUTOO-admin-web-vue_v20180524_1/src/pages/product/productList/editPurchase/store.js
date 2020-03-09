import Vue from 'vue'
import Vuex from 'vuex';

Vue.use(Vuex)

const state = {
  added: [],
  checkoutStatus: null
}

const getters = {}

const actions = {}

const mutations = {}

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: debug,
  // plugins: debug ? [createLogger()] : []
})