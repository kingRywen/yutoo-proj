export default {
    product_charge(state, arg) {
        state.product_charge = arg
    },
    type_textarea(state, arg) {
        state.type_textarea = arg
    },
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
    // 查看页的日新增评价数的echart数据
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
    // 存整个路径给子组件面包屑使用
    saveMatchedForChild(state, arg) {
        state.saveMatchedForChild = arg
    },
    // 从店铺的产品跳到竞品，keepShopBreadcrumb
    keepShopBreadcrumb(state, arg) {
        state.keepShopBreadcrumb = arg
    },
    // 是否经过店铺
    goCrossShopCheck(state, arg) {
        state.goCrossShopCheck = arg
    },
    // shop total
    setShopTotal(state, arg) {
        state.shopTotal = arg
    },
    // 店铺详情9个图的页面存fullpath
    shopFullPath(state, arg) {
        state.shopFullPath = arg
    },
    // 店铺分析——查看——切换新品时间
    saveDay(state, arg) {
        state.newProDay = arg
    },
    // 店铺分析——查看——chart3上新情况
    getShopNewestList(state, arg) {
        state.getShopNewestList = arg
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
    // 弹窗chart7的日期
    saveChartDate(state, arg) {
        state.ChartDate = arg
    },
    // 个人中心
    // 保存我的订单
    saveMyPay(state, arg) {
        state.saveMyPay = arg
    },
    // 隐藏更改手机号码的第一个弹窗
    changePhoneShow(state, arg) {
        state.changePhoneShow = arg
    }
}
