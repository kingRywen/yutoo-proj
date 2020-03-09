const state = {
  salemanList: [
    {
      label: '管理',
      value: 1
    },
    {
      label: 'APP测试用户',
      value: 2
    },
    {
      label: 'app测试用户2',
      value: 3
    }
  ], // 主菜单
  allShopList: [], //所有平台的店铺
  countryList: [] // 国家列表
}
const getters = {}
const actions = {
  getSalemanList({ commit }) {
    GLOBAL.ajax['order/getUserList']({}).then(data => {
      commit('setSalemanList', data.rows)
    })
  },
  //获取所有平台 以及所有的店铺
  getAllShopList({ commit }) {
    return GLOBAL.ajax['product/store_list_all']()
      .then(res => {
        let data = res.rows
        let list = []
        let ebayStoreList = []
        data.forEach(i => {
          list = list.concat(i.stores.map(j => j))
        })
        ebayStoreList = data.filter(item => item.platformId == 2)
        commit('setAllShopList', {
          list,
          data,
          ebayStoreList
        })
        return Promise.resolve(list)
      })
      .catch(() => {
        return false
      })
  },
  initCountryList({ commit }) {
    GLOBAL.ajax['order/getCountryList']().then(data => {
      data = data.rows.map(el => ({
        label: el.countryName,
        value: el.countryId
      }))
      commit('setCountryList', data)
    })
  }
}
const mutations = {
  setSalemanList(state, data) {
    let salemanList = []
    if (data && data.saleman && data.saleman.length) {
      data.saleman.map(item => {
        let obj = {
          label: item.nickName,
          value: item.userId
        }
        salemanList.push(obj)
      })
    }
    if (salemanList.length) {
      state.salemanList = salemanList
    }
  },

  setAllShopList(state, { list, data, ebayStoreList }) {
    state.allShopList = list
    state.platformList = data
    function formatData(data) {
      return data.map(item => {
        let obj = {
          label: item.name,
          value: item.platformId
        }
        if (item.stores && Array.isArray(item.stores)) {
          obj.children = item.stores.map(el => {
            return {
              label: el.name,
              value: el.storeId
            }
          })
        }
        return obj
      })
    }
    state.ebayStoreList = formatData(ebayStoreList)
    state.platformShopList = formatData(data)
  },
  setCountryList(state, data) {
    state.countryList = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
