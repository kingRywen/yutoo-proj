import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'
import tab from './modules/tab'
import createLogger from '../plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    menu,
    tab
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
