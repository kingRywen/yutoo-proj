import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import modules from './module';

console.log(modules);

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        // 全局loading
        isloading: false,
        // 单独的loading
        loading: false
    },
    mutations: {
        SET_LOADING(state, payload) {
            state[payload.name] = payload.value
        }
    },
    modules
});

export default store;
