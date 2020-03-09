export default {
    tableLoading(state, res) {
        state.tableLoading = res
    },
    // 竞品分析列表/ProductAnalysis/list
    ProductAnalysisList(state, data) {
        state.ProductAnalysisList = data
    },
    // total
    setTotal(state, arg) {
        state.total = arg
    },
    // 查看页的日新增评论数的echart数据
    saveIncrScoreCount(state, arg) {
        state.IncrScoreCount = arg
    },
    //店铺分析
    // tableloading
    shopTableLoading(state, res) {
        state.shopTableLoading = res
    },
    ///ProductAnalysis/list
    saveShopAnalysisList(state, data) {
        state.shopAnalysisList = data
    },
    // 竞品——查看——sku——跟卖弹窗——子组件分页Size
    saveSellingCntPageSize(state, data) {
        state.sellingCntPage.Size = data
    },
    // 竞品——查看——sku——跟卖弹窗——子组件分页currentPage
    saveSellingCntPageCurrentPage(state, data) {
        state.sellingCntPage.currentPage = data
    },
    // 竞品——查看——追踪——list
    saveProductReviewDayCurrentList(state, data) {
        state.ProductReviewDayCurrentList = data
    },
    // shop total
    setShopTotal(state, arg) {
        state.shopTotal = arg
    },
    // 店铺分析——查看——切换新品时间
    saveDay(state, arg) {
        state.newProDay = arg
    },
    // 店铺分析——查看——chart5日新增评价数，详情
    saveReviewDetailList(state, arg) {
        state.reviewDetailList = arg
    },
    // 店铺分析——查看——chart6 新增评价数
    saveShopReviewList(state, arg) {
        state.ShopReviewList = arg
    },
    // 店铺分析——查看——chart7 评分分布图
    saveShopStarList(state, arg) {
        state.ShopStarList = arg
    },
    // 店铺分析——查看——chart8 BSR排名
    saveShopRankList(state, arg) {
        state.ShopRankList = arg
    },
    // 店铺分析——查看——chart9 BRS排名柱状图
    saveShopReviewTotalList(state, arg) {
        state.ShopReviewTotalList = arg
    },
    // 类目改变则重新发起图标请求
    categoryChange(state, arg) {
        state.categoryChange = arg
    },
    // 点击chart789弹出一个窗的时候，保存一下当前的类型和店铺状态，taskStatus,方便在table请求数据的时候拿到需要用的数据。
    saveTaskStatusAndType(state, arg) {
        state.taskStatusAndType = arg
    },
    // 点击chart789弹窗上的新品或非新品数字时，保存一下用户当前点击的table的row，备用于跳转到新页面时作为参数之一使用。
    saveDialogItem(state, arg) {
        state.DialogItem = arg
    },
}
