import storage from 'Utils/saver';
import { addRoutes, resetRoutes } from '@/router';

export const setKeys = (name, val) => {
  storage.set('local', name, val)
}


export const getKeys = (key) => {
  return storage.get('local', key)
}

export const removeKeys = (key) => {
  storage.remove('local', key)
}

export const state = {
  // 登录token
  token: getKeys('token'),
  // 用户信息
  userInfo: getKeys('auth.userInfo'),
  // 是否有权限菜单
  hasPermsRoute: false
}
export const actions = {
  // 登录
  loggIn({ commit }, userInfo) {
    return GLOBAL.ajax['perms/userlogin'](userInfo).then((data) => {
      commit('SET_TOKEN', data.token)
      return data
    })
  },
  // 登出
  loggOut({ commit }) {
    commit('SET_TOKEN')
    commit('SET_ROUTES', false)
    resetRoutes()
  },
  // 获取权限路由
  getPermsRoutes({ commit }, userInfo) {
    return GLOBAL.ajax['perms/permsRoutes'](userInfo).then((data) => {
      addRoutes(data.data)
      commit('SET_ROUTES', true)
      return data
    })
  },
  // 验证用户是否登录有效
  validate({ dispatch }) {
    return GLOBAL.ajax['perms/permsValidateToken']({ token: state.token }).then(async () => {
      return await Promise.resolve()
    }).catch(async () => {
      await dispatch('loggOut')
      return Promise.reject()
    })
  }
}


export const mutations = {
  SET_TOKEN(state, val) {
    state.token = val
    if (val == undefined) {
      removeKeys('token')
    } else {
      setKeys('token', val)
    }
  },
  SET_ROUTES(state, val) {
    state.hasPermsRoute = val
  }
}
export const getters = {
  logged(state) {
    return !!state.token
  }
}