import Vue from "vue";
import Vuex from "vuex";
import undoRedoPlugin from "./plugins/undo-redo/index";
Vue.use(Vuex);

import modules from "./module";

// console.log(modules);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    // 全局loading
    isloading: false,
    // 单独的loading
    loading: false
  },
  mutations: {
    SET_LOADING(state, payload) {
      state[payload.name] = payload.value;
    }
  },
  modules,
  plugins: [undoRedoPlugin]
});
// console.log(store);

export default store;
