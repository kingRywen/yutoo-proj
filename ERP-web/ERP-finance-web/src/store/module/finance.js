const state = {
  loadTypeList: [], //借款类型1
  loadStateList: [], //借款状态2
  repaymentStateList: [], //还款状态3
  paymentTypeList: [], //付款类型4
  purchaseStateList: [], //采购单状5
  rushStateList: [], //冲账状态6
  expenseStateList: [], //报销状态7
  paymentStateList: [], //付款状态8
  refundTypeList: [], //退款类型9
  //
  modelTypeList: [], //模板类型10
  paymentModeList: [], //支付方式11
  accountType: [], //账号类型13
  accountItems: [], //账目类型14

  // 商户下
  // 平台列表
  platformList: [],
  // 站点列表
  siteList: [],
  // 店铺列表
  storeList: [],
  // 发货仓库 采购仓库
  warehouseList: [],
  // 供应商
  supplierList: [],


  rApplyOperator: [], //  申请人
  rtHandleOperator: [], // 操作人,
  financeContractRuleGetComboBox: [] // 合同编号规则
}
/* eslint-disable */
const getters = {}
const actions = {
  // 获取发货仓库type 0 发货仓库，1 采购仓库
  getWarehouse({commit, state}, type) {
    let api, keyName
    if (type == 0) {
      api = 'warehouse/wmWarehouseGlobalList'
      keyName="warehouseList"
    } else if (type == 1) {
      api = 'product/productSupplierListAll'
      keyName="supplierList"
    }
    // if (state[keyName].length >0) {
    //   return state[keyName]
    // }
    return GLOBAL.ajax[`${api}`]({}).then(data => {
      let rows = data.rows.map(el => ({
        label: el.name || el.supplierName,
        value: el.value || el.supplierId
      }))
      commit('setWarehouse', {rows, name: keyName})
    })
  },
  // 获取商户type 0 平台，1 站点，2 店铺列表
  getMerchantList({commit, state}, {type, params}) {
    let api, keyName
    if (type == 0) {
      api = 'platformListAllActivatePlatform'
      keyName="platformList"
    } else if (type == 1) {
      api = 'siteListByPlatform'
      keyName="siteList"
    }  else if (type == 2) {
      api = 'storeSiteList'
      keyName="storeList"
    }
    // if (state[keyName].length >0) {
    //   return state[keyName]
    // }
    return GLOBAL.ajax[`product/${api}`](params).then(data => {
      let rows = data.rows.map(el => ({
        label: el.name || el.siteName || el.storeName,
        value: el.platformId || el.siteId || el.storeId
      }))
      commit('setMerchantList', {rows, type})
      return rows
    })
  },
  //获取所有的下拉选项
  getGlobalSelect({ commit, state }, keys = [...Array(15).keys()].splice(1)) {
    if (state.loadTypeList.length) return Promise.resolve()
    return GLOBAL.ajax['finance/financeGlobalSelect']({ keys }).then(res => {
      commit('setGlobalSelect', res.rows)
    })
  },
  //获取所有操作人员
  getOperator({ commit, state }, keys = [...Array(3).keys()].splice(1)) {
    GLOBAL.ajax['finance/financeOperatorType']({ keys }).then(res => {
      commit('setOperator', res.rows)
    })
  },
  getFinanceContractRuleGetComboBox({ commit, state }) {
    GLOBAL.ajax['finance/financeContractRuleGetComboBox']().then(res => {
      commit('setFinanceContractRuleGetComboBox', res.rows)
    })
  }
}

const mutations = {
  setWarehouse(state, {rows, type, name}) {
    state[name] = rows
  },
  setMerchantList(state, {rows, type}) {
    if (type == 0) {
      state.platformList = rows
    } else if (type == 1) {
      state.siteList = rows
    } else if (type == 2) {
      state.storeList = rows
    }
  },
  setGlobalSelect(state, allList) {
    let list = []
    allList.forEach(item => {
      list = item.list
      switch (item.key) {
        case 1:
          return (state.loadTypeList = list)
        case 2:
          return (state.loadStateList = list)
        case 3:
          return (state.repaymentStateList = list)
        case 4:
          return (state.paymentTypeList = list)
        case 5:
          return (state.purchaseStateList = list)
        case 6:
          return (state.rushStateList = list)
        case 7:
          return (state.expenseStateList = list)
        case 8:
          return (state.paymentStateList = list)
        case 9:
          return (state.refundTypeList = list)
        case 10:
          return (state.modelTypeList = list)
        case 11:
          return (state.paymentModeList = list)
        case 13:
          return (state.accountType = list)
        case 14:
          return (state.accountItems = list)
        default:
          return
      }
    })
  },
  setOperator(state, allOperator) {
    let list = []
    allOperator.forEach(item => {
      list = item.list.map(i => {
        return {
          label: i.nickName,
          value: i.userId
        }
      })
      switch (item.key) {
        case 1:
          return (state.rApplyOperator = list)
        case 2:
          return (state.rtHandleOperator = list)
        default:
          return
      }
    })
  },
  setFinanceContractRuleGetComboBox(state, rows) {
    state.financeContractRuleGetComboBox = rows.map(item => {
      return {
        label: item.name,
        value: item.id
      }
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
