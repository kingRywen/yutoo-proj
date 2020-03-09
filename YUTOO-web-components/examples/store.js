import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    isloading: false, // 全局loading
    loading: false // 局部loading
  }
})
export default store
