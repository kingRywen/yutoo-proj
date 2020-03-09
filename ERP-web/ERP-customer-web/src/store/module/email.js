const state = {
  protocolList: [], // 协议
  orderList: ['Ebay', 'Wish', 'Amazon', 'Aliexpress'],
  serviceList: [], // 客服人员列表
  emailAccountList: [], // 邮件账号列表
  ebayReturnStateList: [], // 退货状态列表
  ebayReturnReasonList: [], // 退货原因列表
  ebayDealCancelReasonList: [] // 取消交易列表
}
const getters = {}
const actions = {
  getProtocol({ commit }) {
    return GLOBAL.ajax['email/protocolList']({}).then(data => {
      commit('setProtocolList', data.rows)
    })
  },
  getEbayDealCancelReasonList({ commit }) {
    return GLOBAL.ajax['email/ebayDealCancelReasonList']({}).then(data => {
      commit('setEbayDealCancelReasonList', data.rows)
    })
  },
  getEbayReturnStateList({ commit }) {
    return GLOBAL.ajax['email/ebayReturnStateList']({}).then(data => {
      commit('setEbayReturnStateList', data.rows)
    })
  },
  getEbayReturnReasonList({ commit }) {
    return GLOBAL.ajax['email/ebayReturnReasonList']({}).then(data => {
      commit('setEbayReturnReasonList', data.rows)
    })
  },
  getservice({ commit }) {
    return GLOBAL.ajax['email/serviceList']({}).then(data => {
      commit('setServiceList', data.rows)
    })
  },
  getEmailAccountList({ commit }) {
    return GLOBAL.ajax['email/emailAccountList']({}).then(data => {
      commit('setEmailAccountList', data.rows)
    })
  }
}
const mutations = {
  setProtocolList(state, data) {
    state.protocolList = data
  },
  setEbayDealCancelReasonList(state, data) {
    state.ebayDealCancelReasonList = data.map(item => {
      return {
        label: item.name,
        value: item.id
      }
    })
  },
  setEbayReturnStateList(state, data) {
    state.ebayReturnStateList = data.map(item => {
      return {
        label: item.name,
        value: item.id
      }
    })
  },
  setEbayReturnReasonList(state, data) {
    state.ebayReturnReasonList = data.map(item => {
      return {
        label: item.name,
        value: item.id
      }
    })
  },
  setServiceList(state, data) {
    let serviceList = []
    if (data && data.length) {
      data.map(item => {
        let obj = {}
        obj.label = item.nickName
        obj.value = item.userId
        serviceList.push(obj)
      })
    }
    state.serviceList = serviceList
  },
  setEmailAccountList(state, data) {
    let emailAccountList = []
    if (data && data.length) {
      data.map(item => {
        let obj = {}
        obj.label = item.nick_name
        obj.value = item.email_account_id
        emailAccountList.push(obj)
      })
    }
    state.emailAccountList = emailAccountList
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
