export default {

  // 关键词竞争分析列表获取   第三步
  getAnalysisLists(state, data) { //state 是默认参数，第二个是要保存的数据
    state.getAnalysisList = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。和state  getter 定义的数据一样
  },

  // 关键词查询列表获取   第三步
  getKeywordList(state, data) { //state 是默认参数，第二个是要保存的数据
    state.geQueryList = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。和state  getter 定义的数据一样
  },



  // 类目查询列表获取   第三步
  getCategoryLists(state, data) { //state 是默认参数，第二个是要保存的数据
    state.getCategorys = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。和state  getter 定义的数据一样
  },

}
