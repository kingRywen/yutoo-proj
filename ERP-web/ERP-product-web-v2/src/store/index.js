import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

import modules from './module'

console.log(modules);
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules
})

export default store
