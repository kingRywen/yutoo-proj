export default {

  // 竞品分析列表获取
  AnalysisLists: state => {
    return state.getAnalysisList //这个是index的数据，要和index定义的一样
  },

  // 竞品分析列表获取
  geQueryLists: state => {
    return state.geQueryList //这个是index的数据，要和index定义的一样
  },

  // 竞品分析列表获取
  getCategoryList: state => {
    return state.getCategorys //这个是index的数据，要和index定义的一样
  },

}
