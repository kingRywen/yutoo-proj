import storage from 'Utils/saver';
import { addRoutes, resetRoutes } from '@/router';

export const setKeys = (name, val) => {
    storage.set('local', name, val);
};

export const getKeys = key => {
    return storage.get('local', key);
};

export const removeKeys = key => {
    storage.remove('local', key);
};

export const state = {
    // 登录token
    token: getKeys('token'),
    // 用户信息
    userInfo: getKeys('auth.userInfo'),
    // 是否有权限菜单
    hasPermsRoute: false,
    // 子菜单
    subMenu: {},
    // 主菜单
    mainMenu: {},
    // 主菜单对应主路由
    mainMenuRoute: {}
};
export const actions = {
    // 登录
    loggIn({ commit }, loginData) {
        return GLOBAL.ajax['login/userlogin'](loginData).then(data => {
            const token = data.rows ? data.rows.token : data.token
            commit('SET_TOKEN', token);
            commit('SET_USER', data.rows.user)
            return data;
        });
    },
    // 登出
    loggOut({ commit }) {
        commit('SET_TOKEN');
        commit('SET_USER');
        commit('SET_ROUTES', false);
        commit('RESET_MENU');
        resetRoutes();
    },
    // 获取权限路由
    getPermsRoutes(
        {
            commit
            // eslint-disable-next-line no-unused-vars
        },
        userInfo
    ) {
        return new Promise(resolve => {
            addRoutes();
            commit('SET_ROUTES', true);
            resolve({});
        });
        // return GLOBAL.ajax['perms/permsRoutes'](userInfo).then((data) => {
        //   addRoutes(data.data)
        //   commit('SET_ROUTES', true)
        //   return data
        // })
    },
    // 验证用户是否登录有效
    validate({
        // eslint-disable-next-line no-unused-vars
        dispatch
    }) {
        return Promise.resolve();
        // return GLOBAL.ajax['perms/permsValidateToken']({
        //   token: state.token
        // }).then(async () => {
        //   return await Promise.resolve()
        // }).catch(async () => {
        //   await dispatch('loggOut')
        //   return Promise.reject()
        // })
    }
};

export const mutations = {
    SET_TOKEN(state, val) {
        state.token = val;
        if (val == undefined) {
            removeKeys('token');
        } else {
            setKeys('token', val);
        }
        
    },
    SET_USER(state, user) {
        state.userInfo = user
        if (user == undefined) {
            removeKeys('auth.userInfo');
        } else {
            setKeys('auth.userInfo', user);
        }
    },
    SET_ROUTES(state, val) {
        state.hasPermsRoute = val;
    },
    SET_SUBMENU(state, { path, subMenu }) {
        state.subMenu[path] = subMenu;
    },
    SET_MAINMENU(state, menu) {
        state.mainMenu = menu;
        // state.mainMenuRoute[menu.activeIndex] = menu.index
    },
    RESET_MENU(state) {
        state.subMenu = {};
        state.mainMenu = {};
        state.mainMenuRoute = {};
    }
};
export const getters = {
    logged(state) {
        return !!state.token;
    }
};
