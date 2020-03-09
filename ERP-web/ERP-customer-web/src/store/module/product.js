const state = {
  platformStoreList: [], //平台店铺l
  warehouseList: [], //获取仓库
  storeIdList: [], // 店铺列表
  storeEbayList: [], // ebay店铺列表
  platformList: [], //平台列表
  languageList: [], //语言列表
  siteList: [], //站点列表
  brandNameList: [] //获取品牌列表
}
const getters = {}
const actions = {
  getBrandNameList({ commit }) {
    return GLOBAL.ajax['product/getBrandNameList']({}).then(data => {
      commit('setBrandNameList', data.rows)
      return data.rows
    })
  },
  getSiteList({ commit }) {
    return GLOBAL.ajax['product/getSiteList']({
      platformId: 1
    }).then(data => {
      commit('setSiteList', data.rows)
    })
  },
  /**
   *
   * @param {*} type   0 全部店铺  1 亚马逊店铺  2  ebay 店铺
   */
  getPlatformStoreList({ commit }, type = 1) {
    let types = []
    if (type == 0) {
      types = [1, 2]
    } else if (type == 1) {
      types = [1]
    } else if (type == 2) {
      types = [2]
    }
    return GLOBAL.ajax['product/platformStoreList']({
      platformIds: types
    }).then(data => {
      commit('setPlatformStoreList', data.rows)
    })
  },
  getWarehouseList({ commit }) {
    return GLOBAL.ajax['product/warehouseList']({}).then(data => {
      commit('setWarehouseList', data)
    })
  },
  getPlatformList({ commit }) {
    return GLOBAL.ajax['product/platformList']({
      platformIds: [1, 2]
    }).then(data => {
      commit('setPlatformList', data.rows)
    })
  },
  getStoreId({ commit }) {
    return GLOBAL.ajax['product/storeList']().then(data => {
      commit('setStoreId', data.rows)
    })
  },
  getStoreEbayList({ commit }) {
    return GLOBAL.ajax['product/storeEbayList']().then(data => {
      commit('setStoreEbayList', data.rows)
    })
  },
  getLanguageList({ commit }) {
    return GLOBAL.ajax['product/languageList']().then(data => {
      commit('setLanguageList', data.rows)
    })
  }
}
const mutations = {
  setSiteList(state, data) {
    let siteList = []
    if (data && data.length) {
      data.map(item => {
        siteList.push({
          value: item.siteId,
          label: item.siteNameZh
        })
      })
    }
    state.siteList = siteList
  },
  setBrandNameList(state, data) {
    let brandNameList = []
    if (data && data.length) {
      data.map(item => {
        brandNameList.push({
          value: item.productBrandId,
          label: item.brandNameZh
        })
      })
    }
    state.brandNameList = brandNameList
  },
  setPlatformStoreList(state, data) {
    let platformStoreList = []
    if (data && data.length) {
      data.map(item => {
        if (item.stores && item.stores.length) {
          item.stores.map(el => {
            platformStoreList.push({
              label: el.storeName,
              value: el.storeId
            })
          })
        }
      })
    }
    state.platformStoreList = platformStoreList
  },
  setWarehouseList(state, data) {
    let warehouseList = []
    if (data && data.length) {
      data.map(item => {
        warehouseList.push({
          label: item.warehouseName,
          value: item.warehouseId
        })
      })
    }
    state.warehouseList = warehouseList
  },
  setPlatformList(state, data) {
    let platformList = []
    if (data && data.length) {
      data.map(item => {
        platformList.push({
          value: item.platformId,
          label: item.name
        })
      })
    }
    state.platformList = platformList
  },
  setStoreId(state, data) {
    let storeList = []
    data.map(item => {
      item.sites.map(el => {
        if (el.stores && el.stores.length) {
          el.stores.map(elm => {
            storeList.push({
              platformId: item.platformId,
              label: elm.storeName,
              value: elm.storeId
            })
          })
        }
      })
    })
    state.storeIdList = storeList
  },
  setStoreEbayList(state, data) {
    let storeEbayList = []
    if (
      data &&
      Array.isArray(data) &&
      data[0] &&
      data[0].stores &&
      Array.isArray(data[0].stores)
    ) {
      data[0].stores.map(item => {
        storeEbayList.push({
          label: item.storeName,
          value: item.storeId
        })
      })
    }
    state.storeEbayList = storeEbayList
  },
  setLanguageList(state, data) {
    let languageList = []
    data.map(item => {
      languageList.push({
        label: item.languageName,
        value: item.languageId
      })
    })
    state.languageList = languageList
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
