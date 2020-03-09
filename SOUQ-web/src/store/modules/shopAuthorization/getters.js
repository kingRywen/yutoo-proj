export default {
  // editionListAdd: function (state) {
  //   return state.shopAuthorizationLists
  // }
  // 店铺授权描述
  authorizationList: state => {
    return state.shopAuthorizationLists //这个是index的数据shopAuthorizationLists，要和index定义的一样
  },
  // 站点数据获取
  authorizationList: state => {
    return state.getSiteLists //这个是index的数据，要和index定义的一样
  },

}
