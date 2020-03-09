const state = {
  reasonsForNewOrders: [], // 新增订单原因
  currencyType: [], // 货币类型
  paymentMethod: [], // 支付方式
  transportTypeList: [], // 运输方式(所有)
  deadweightTransportTypeList: [], // 运输方式(重货)
  throwTransportTypeList: [], // 运输方式(抛货)
  countryList: [], // 国家列表

  allShopList: [], //所有平台的店铺

  platformList: [], //平台  //平台下有对应的店铺

  // printCompactList: [], // 选择合同模板时的平台列表

  supplierList: [], //供应商列表
  //procurement采购人员
  //saleman销单人员
  //delevlop开发人员
  //finance[财务人员
  //operator 操作人员
  //platformCharge平台负责人
  handleUser: {}, //==>所有操作人员

  warehouseList: [], //仓库列表

  purchaseList: [], //采购点列表

  distributionModeList: [], //配送方式

  bankList: [], //银行

  riskTypeList: [], // 侵权风险
  logisticTypeList: [], // 物流属性
  productPlugSpecList: [] // 插头规格
}
const getters = {
  printCompactList(state) {
    let lists = state.platformList.map(el => ({
      label: el.name,
      value: el.platformId
    }))
    lists.unshift({
      label: '全部',
      value: 0
    })

    return lists
  },
  shopList(state) {
    return state.allShopList
  },
  supplierList(state) {
    return state.supplierList
  },
  allHandleUser(state) {
    return state.handleUser
  },
  warehouseList(state) {
    return state.warehouseList
  },
  purchaseList(state) {
    return state.purchaseList
  },
  platformList(state) {
    return state.platformList
  },
  transportTypeList(state) {
    return state.transportTypeList
  },
  distributionModeList(state) {
    return state.distributionModeList
  },
  bankList(state) {
    return state.bankList
  },
  paymentMethod(state) {
    return state.paymentMethod
  },
  countryList(state) {
    return state.countryList
  }
}
const actions = {
  initReasonList({ commit }, type) {
    let params = {
      orderType: +type
    }
    if (type === 3) {
      params.reserveFlag = 1
    }
    return GLOBAL.ajax['order/createReasonGetOrderTypeList'](params).then(
      data => {
        commit('setReasonList', {
          payload: data.rows.map(el => ({
            label: el.name,
            value: el.orderCreateReasonId
          }))
        })
      }
    )
  },
  initCommonList({ commit, state }, type) {
    // eslint-disable-next-line
    let has = false

    switch (type) {
      case 1:
        if (state.reasonsForNewOrders.length) {
          has = true
        }
        break

      case 2:
        if (state.currencyType.length) {
          has = true
        }
        break

      case 3:
        if (state.paymentMethod.length) {
          has = true
        }
        break

      default:
        break
    }

    // if (has) {
    //   return
    // }
    // 1新增订单原因        2   货币类型    3    支付方式
    GLOBAL.ajax['order/getCommonList']({
      type
    }).then(data => {
      const payload = data.rows.map(el => ({
        label: el.value,
        value: el.key
      }))
      commit('setCommonList', {
        payload,
        type
      })
    })
  },

  // 获取产品库下拉
  /**
         *  PRODUCT_TYPE(1, "产品类型"),
            RISK_TYPE(2, "侵权风险"),
            SOURCE_TYPE(5, "产品来源"),
            PLUG_TYPE(4, "插头类型"),
            PRODUCT_STATUS(6, "产品状态"),
            LOGISTIC_TYPE(8, "物流属性"),
            UNIT_TYPE(11, "单位类型"),
         */
  getEnumList({ commit }, type) {
    let has = false

    switch (type) {
      case 2:
        if (state.riskTypeList.length) {
          has = true
        }
        break

      case 4:
        if (state.productPlugSpecList.length) {
          has = true
        }
        break

      case 8:
        if (state.logisticTypeList.length) {
          has = true
        }
        break

      default:
        break
    }

    if (has) {
      return
    }

    GLOBAL.ajax['product/globalEnumList']({
      type
    }).then(data => {
      data = data.map(el => ({
        label: el.value,
        value: el.key
      }))

      commit('setRiskTypeList', {
        data,
        type
      })
    })
  },

  // 获取运输方式
  initTransportTypeList({ commit }, type = 3) {
    GLOBAL.ajax['order/getTransportTypeList']({
      type
    }).then(data => {
      data = data.rows.map(el => ({
        label: el.transportTypeName,
        value: el.transportTypeId
      }))
      commit('setTransportTypeList', {
        data,
        type
      })
    })
  },
  // 获取运输方式
  initCountryList({ commit }) {
    GLOBAL.ajax['order/getCountryList']().then(data => {
      data = data.rows.map(el => ({
        label: el.countryName,
        value: el.countryId
      }))
      commit('setCountryList', data)
    })
  },
  //获取所有平台 以及所有的店铺
  getAllShopList({ commit }) {
    return GLOBAL.ajax['product/store_list_all']()
      .then(res => {
        let data = res.rows
        let list = []
        data.forEach(i => {
          list = list.concat(i.stores.map(j => j))
        })
        commit('setAllShopList', {
          list,
          data
        })
      })
      .catch(() => {
        return false
      })
  },
  // 获取 供应商列表
  getSupplierList({ commit }) {
    return GLOBAL.ajax['procurement/getSupplierList']()
      .then(res => {
        commit('setSupplierList', res.rows)
      })
      .catch(() => {
        return false
      })
  },
  //获取所有操作人
  getHandleUser({ commit }) {
    return GLOBAL.ajax['order/userListGetUserList']()
      .then(res => {
        commit('setHandleUser', res.rows)
        return Promise.resolve()
      })
      .catch(() => {
        return Promise.reject()
      })
  },
  //获取所有的仓库列表
  getWarehouseList({ commit }, type = 0) {
    //0 全部 1 本地仓 2 海外仓
    return GLOBAL.ajax['order/warehousesGetWarehouseList']({
      type
    })
      .then(res => {
        commit('setWarehouseList', res.rows)
      })
      .catch(() => {
        return false
      })
  },

  //获取采购点列表
  getPurchaseList({ commit }) {
    return GLOBAL.ajax['procurement/supplierGetAddressList']()
      .then(res => {
        commit('setPurchaseList', res.rows)
      })
      .catch(() => {
        return false
      })
  },

  //获取配送方式
  getDistributionMode({ commit }) {
    return GLOBAL.ajax['order/GetDistModeList']()
      .then(res => {
        commit('setDistributionMode', res.rows)
      })
      .catch(() => {
        return false
      })
  },
  getBankList({ commit }) {
    GLOBAL.ajax['order/getBankList']()
      .then(res => {
        commit('setBankList', res.rows)
      })
      .catch(() => {
        return false
      })
  }
}
const mutations = {
  setRiskTypeList(state, { data, type }) {
    /**
         *  PRODUCT_TYPE(1, "产品类型"),
            RISK_TYPE(2, "侵权风险"),
            SOURCE_TYPE(5, "产品来源"),
            PLUG_TYPE(4, "插头类型"),
            PRODUCT_STATUS(6, "产品状态"),
            LOGISTIC_TYPE(8, "物流属性"),
            UNIT_TYPE(11, "单位类型"),
         */
    if (type === 2) {
      state.riskTypeList = data
    }
    if (type === 4) {
      state.productPlugSpecList = data
    }

    if (type === 8) {
      state.logisticTypeList = data
    }
  },
  setReasonList(state, { payload }) {
    state.reasonsForNewOrders = payload
  },
  setCommonList(state, { payload, type }) {
    if (type == 1) {
      state.reasonsForNewOrders = payload
    }
    if (type == 2) {
      state.currencyType = payload
    }
    if (type == 3) {
      state.paymentMethod = payload
    }
  },
  setTransportTypeList(state, { data, type }) {
    if (type === 3) {
      state.transportTypeList = data
    }
    if (type === 2) {
      state.deadweightTransportTypeList = data
    }
    if (type === 1) {
      state.throwTransportTypeList = data
    }
  },
  setCountryList(state, data) {
    state.countryList = data
  },
  setAllShopList(state, { list, data }) {
    state.allShopList = list
    state.platformList = data
  },
  setSupplierList(state, list) {
    state.supplierList = list.map(el => ({
      ...el,
      value: el.supplierId,
      label: el.supplierName
    }))
  },
  setHandleUser(state, obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key]
        element.forEach(el => {
          el.label = el.nickName
          el.value = el.userId
        })
      }
    }
    state.handleUser = obj
  },
  setWarehouseList(state, list) {
    state.warehouseList = list.map(el => ({
      ...el,
      label: el.warehouseName,
      value: el.warehouseId
    }))
  },
  setPurchaseList(state, list) {
    list.forEach(i => {
      i['label'] = i.addressName
      i['value'] = i.addressId
    })
    state.purchaseList = list
  },
  setDistributionMode(state, list) {
    state.distributionModeList = list
  },
  setBankList(state, list) {
    state.bankList = list
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
