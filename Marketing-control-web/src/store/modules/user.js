import { getToken, setToken, removeToken } from '@/utils/auth'
import {login, httpPost } from '@/api/index'

const user = {
  namespaced: true,
  state: {
    token: getToken(),
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, info) => {
        state.info = info
    }
  },

  actions: {
    // 登录
    Login({ commit }, params) {
      return new Promise((resolve, reject) => {
        login(params).then(response => {
          const data = response
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit}) {
      return new Promise((resolve, reject) => {
        const reqData ={url:`/sys/user/info`}
        httpPost(reqData).then(response => {
          const data = response
            commit('SET_USER', data.user)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit}) {
      // 退出后台bug异常，都是报500
      return new Promise((resolve, reject) => {
        const reqData ={url:`/sys/user/info`}
        httpPost(reqData).then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          resolve()
        }).catch(error => {
          /****bug****/
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
         /****bug****/
          //reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
