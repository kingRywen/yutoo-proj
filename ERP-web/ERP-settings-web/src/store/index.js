import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import {
    menu
} from '@/config/navConfig';
import perms from './module/perms';
import common from './module/common';
import management from './module/management';



const store = new Vuex.Store({
    modules: {
        common,
        management,
        perms
    },
    state: {
        nav: {
            menu
        },
        isSubmenuUnfold: false, //控制左侧菜单是否打开
        user: {
            merchantName: '', //商户名称
            merchantId: '', //商户id
            username: '', //用户名称
            nickname: '', //用户昵称
        },
        token: "",
        network: true, //是否有网
        isloading: false, //全局loading
        loading: false, //局部loading
    },
    mutations: {
        changeSubmenuUnfold(state) {
            state.isSubmenuUnfold = !state.isSubmenuUnfold
        },
        changUser(state, user) {
            state.user.merchantName = user.merchantName;
            state.user.merchantId = user.merchantId
            state.user.username = user.username
            state.user.nickname = user.nickname
        },
        changeNetwork(state, boole) {
            state.network = boole;
        },
        changeLoading(state, status = false) {
            state.isloading = status
            state.loading = status
        }
    },
    actions: {

    },
})

export default store