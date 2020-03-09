import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const state = {
  product_charge: '',
  type_textarea: '',
  // 竞品分析loading状态
  tableLoading: true,
  // 竞品分析列表/ProductAnalysis/list
  ProductAnalysisList: '',
  total: 0,
  // 日新增评价数
  IncrScoreCount: null,
  // 竞品——查看——sku——跟卖弹窗——子组件分页
  sellingCntPage: {
    Size: 10,
    currentPage: 1
  },
  // 竞品——查看——追踪——list
  ProductReviewDayCurrentList: "",
  keepShopBreadcrumb: false,
  goCrossShopCheck: false,
  //店铺分析
  shopTableLoading: true,
  shopAnalysisList: '',
  shopTotal: 0,
  saveMatchedForChild: '',
  // 店铺分析——查看——切换新品时间
  newProDay: "60",
  getShopNewestList: '',// chart3
  reviewDetailList: "",// 日新增评价数-详情
  ShopReviewList: "",// 新增评价数
  ShopStarList: "",// 产品评分分布
  ShopRankList: "", // BRS 排名
  ShopReviewTotalList: "",// 评价数产品分布
  categoryChange: "",// 类目改变则重新发起图标请求
  taskStatusAndType: "", // 点击chart789弹出一个窗的时候，保存一下当前的类型和店铺状态，taskStatus,方便在table请求数据的时候拿到需要用的数据。
  DialogItem: "",
  ChartDate: "",
  saveMyPay: '',
  changePhoneShow: false
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
