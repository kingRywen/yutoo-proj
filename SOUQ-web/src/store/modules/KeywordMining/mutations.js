export default {

  // 关键词挖掘  第三步
  getKeywordMiningData(state, data) { //state 是默认参数，第二个是要保存的数据
    state.KeywordMiningData = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。和state  getter 定义的数据一样
  },

}
