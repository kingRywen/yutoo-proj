export const state = {
  // 平台站点
  platSite: [],
  // 所有店铺列表
  storeList: [],
}

export const getters = {
  activeStoreList: state => state.storeList.filter(el => el.status == 1)
}



export const actions = {
  async getPlatSite({
    commit
  }) {
    let res = await GLOBAL.ajax[
      'agent/merchantPlatformSitePlatformSite'
    ]().then(data => {
      let {
        country,
        platform,
        platformSite
      } = data
      platform.forEach(element => {
        let childs = []
        let child = platformSite.filter(el => el.platformCode === element.code)
        child = JSON.parse(JSON.stringify(child))
        child.forEach(_el => {
          let _site = country.find(el => el.code === _el.countryCode)
          childs.push({
            ..._site,
            platformSiteId: _el.platformSiteId
          })
        })
        element.platformSiteId = element.enName.toLowerCase()
        element.childs = childs
      })
      return platform
    })
    commit('setPlatSite', res)
  },
  async getStore({
    commit
  }, payload) {

    let res = await GLOBAL.ajax['agent/merchantStoreDropdownList'](payload).then(
      data =>
      data.rows.map(el => ({
        label: el.value,
        value: el.key,
        status: el.status
      }))
    )
    commit('setStore', res)
    return res
  },
}
export const mutations = {
  setPlatSite(state, data) {
    state.platSite = data
  },
  setStore(state, data) {
    state.storeList = data
  }
}