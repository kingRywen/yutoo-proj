export const state = {
  // 商户的所有平台
  platList: [],
  // 选择的站点
  siteList: [],
  // 语种列表
  langList: [],
  variantList: [], // 变体属性下拉框
  matrixList: [], // 根据类目id。获取母体集合
  glWarehouseGetComboBox: [], // 仓库下拉框
  glBrandGetComboBox: [], // 获取品牌下拉框

  //店铺下拉列表
  shopList: [],

  //仓库下拉列表
  warehouseList: [],

  //供应商下拉列表
  supplierList: [],


  productTypeList: [], // 产品类型 下拉框
  weightUnitList: [], // 重量单位 下拉框
  lengthUnitList: [], // 长度单位 下拉框
  currencyUnitList: [], // 货币单位 下拉框
  cubeUnitList: [], // 体积单位 下拉框
  logisticTypeList: [], // 物流属性 下拉框
  plugTypeList: [], // 插头规格 下拉框
  riskTypeList: [], // 侵权风险 下拉框

}

export const actions = {
  // 获取语种列表
  getLangList({
    commit
  }) {
    return GLOBAL.ajax['product/glLanguageList']({}).then((data) => {
      data = data.row.map(el => ({
        label: el.name,
        value: el.id
      }))
      commit('setlangList', data)
      return data
    })
  },
  // 获取商户所有平台列表
  getPlatList({
    commit
  }, payload = {}) {
    return GLOBAL.ajax['product/glPlatList'](payload).then((data) => {
      data = data.rows.map(el => ({
        label: el.platName,
        value: el.platId
      }))
      commit('setPlatList', data)
      return data
    })
  },
  // 根据平台获取站点
  getSiteByPlatId({
    commit
  }, platId) {
    return GLOBAL.ajax['product/glPlatSiteList']({
      platId
    }).then((data) => {
      data = data.rows.map(el => ({
        label: el.siteNameCn,
        value: el.platSiteId,
        imgUrl: el.logoPath
      }))
      commit('setSiteList', data)
      return data
    })
  },
  // 仓库下拉框
  getGlWarehouseGetComboBox({
    commit
  }) {
    return GLOBAL.ajax['product/glWarehouseGetComboBox']({}).then((data) => {
      data = data.rows.map(el => ({
        label: el.name,
        value: el.id
      }))
      commit('setGlWarehouseGetComboBox', data)
      return data
    })
  },
  // 获取品牌下拉框
  getGlBrandGetComboBox({
    commit
  }) {
    return GLOBAL.ajax['product/glBrandGetComboBox']({}).then((data) => {
      data = data.rows.map(el => ({
        label: el.name,
        value: el.id
      }))
      commit('setGlBrandGetComboBox', data)
      return data
    })
  },
  // 枚举下拉框
  getGlEnumList({
    commit
  }, enumName) {
    return GLOBAL.ajax['product/glEnumList']({
      enumName
    }).then((data) => {
      data = data.rows.map(el => ({
        label: el.labelCn,
        value: el.value
      }))
      commit('setGlEnumList', {
        data,
        enumName
      })
      return data
    })
  },
  // 根据类目id。获取母体集合
  getMatrixList({
    commit
  }, systemCategoryId = null) {

    return GLOBAL.ajax['product/prProductRepoParentListByCategory']({
      systemCategoryId
    }).then((data) => {
      console.log(data)
      data = data.rows.map(el => ({
        label: el.repoSku,
        value: el.productRepoId
      }))
      commit('setMatrixList', data)
      return data
    })
  },
  getVariantList({
    commit
  }, params = {}) {
    return GLOBAL.ajax['product/cateSystemCategoryPropertyMDropDownVariation'](params).then(({
      rows = []
    }) => {
      commit('setVariantList', rows.map(item => {
        return {
          label: item.desc,
          value: item.key,
          desc: item.desc
        }
      }))
      return Promise.resolve()
    })
  },
  getShopList({
    commit
  }) {
    return GLOBAL.ajax['product/GlStoreDropDown']({}).then(({
      rows = []
    }) => {
      commit('setShopList', rows.map(item => {
        return {
          label: item.value,
          value: item.key
        }
      }))
    })
  },
  getWarehouseList({
    commit
  }) {
    return GLOBAL.ajax['product/glWarehouseGetComboBox']({}).then(({
      rows = []
    }) => {
      commit('setWarehouseList', rows.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      }))
    })
  },
  getSupplierList({
    commit
  }) {
    return GLOBAL.ajax['product/glSupplierGetComboBox']({}).then(({
      rows = []
    }) => {
      commit('setSupplierList', rows.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      }))
    })
  }
}

export const mutations = {
  setPlatList(state, val) {
    state.platList = val
  },
  setSiteList(state, val) {
    state.siteList = val
  },
  setGlWarehouseGetComboBox(state, val) {
    state.glWarehouseGetComboBox = val
  },
  setGlBrandGetComboBox(state, val) {
    state.glBrandGetComboBox = val
  },
  setGlEnumList(state, val) {
    switch (val.enumName) {
      case "Repo-Product-Type":
        state.productTypeList = val.data
        break;
      case "Repo-Weight-Unit":
        state.weightUnitList = val.data
        break;
      case "Repo-Length-Unit":
        state.lengthUnitList = val.data
        break;
      case "Repo-Currency-Unit":
        state.currencyUnitList = val.data
        break;
      case "Repo-Cube-Type":
        state.cubeUnitList = val.data
        break;
      case "Repo-Logistic-Type":
        state.logisticTypeList = val.data
        break;
      case "Repo-Plug-Type":
        state.plugTypeList = val.data
        break;
      case "Repo-Risk-Type":
        state.riskTypeList = val.data
        break;
    }

  },
  setMatrixList(state, val) {
    state.matrixList = val
  },
  setlangList(state, val) {
    state.langList = val
  },
  setVariantList(state, val) {
    state.variantList = val
  },
  setShopList(state, val) {
    state.shopList = val
  },
  setWarehouseList(state, val) {
    state.warehouseList = val
  },
  setSupplierList(state, val) {
    state.supplierList = val
  }
}