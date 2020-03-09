export default {
  async getSellerWornCnt({ commit }, { platformId }) {
    function getData() {
      return GLOBAL.ajax['homeSellerWornCnt']({ platformId }).then(data => {
        return data.data.map(el => ({ name: el.sellerName, warningCnt: el.wornCnt, ...el, platformId }))
      })
    }

    commit('getSellerWornCnt', await getData())
  },
}