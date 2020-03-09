export default {
  // 选择平台   第三步
  addSelectPlatform(state, data) { //state 是默认参数，第二个是要保存的数据
    state.selectPlatformData = data //   data 是形参，可以取得自己想要的数据，可以多种类型，。。。
  },
  isGetFromSessionStorage(state, boolean) {
    state.isGetFromSessionStorage = boolean
  }
}
