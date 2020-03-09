const state = {
  inventoryType: [
    //盘点类型
    { label: '大盘', value: 1 },
    { label: '中盘', value: 2 },
    { label: '小盘', value: 3 }
  ],
  //盘点状态
  inventoryStatus: [
    { label: '待审核', value: 1 },
    { label: '待盘点', value: 2 },
    { label: '盘点中', value: 3 },
    { label: '已完成', value: 4 },
    { label: '审核不通过', value: 5 }
  ],
  //盘点库存范围
  inventoryRange: [
    { label: '所有库存', value: 1 },
    { label: '部分库存', value: 2 }
  ]
}
const getters = {}
const actions = {}
const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
