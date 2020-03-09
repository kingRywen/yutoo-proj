import request from './axios'
let proDefaultDay = 30; // 竞品分析默认列表数据时间。实际上今日
let proChartDefaultDay = 30; // 竞品分析默认图表的时间
let shopIndexDefaultDay = 30; // 店铺首页默认列表数据时间。实际上今日
let shopDefaultDay = 15; //店铺分析图标数据默认时间。实际上15
//  竞品竞争分析列表
let ProductAnalysisListUrl = '/ProductAnalysis/list'
//  竞品竞争分析列表
export function getProductAnalysisList(params) {
  return request.post(ProductAnalysisListUrl,
    params
  ).then((res) => {
    return res
  })
}
// 添加产品
let ProductAnalysisSaveUrl = '/ProductAnalysis/save'
// 添加监控
let ProductMonitoringUrl = '/ProductAnalysis/addMonitor'
// 修改监控周期
let ProductAnalysisUpdateMonitorUrl = "/ProductAnalysis/updateMonitor"
// 取消监控
let cancelMonitoringUrl = '/ProductAnalysis/removeMonitor'
//删除竞争产品分析任务
let ProductAnalysisRemoveUrl = '/ProductAnalysis/remove'
// 竞品分析扣除点数
let FunctionMktProductAnalysisList = "FunctionMkt/productAnalysis/list"
//----查看产品.vue---///
let ProductDetailUrl = '/Product/detail'
// 产品状态详情
let ProductAnalysisInfoUrl = "/ProductAnalysis/info"
// 日新增评价数
let ProductReviewDayListUrl = '/ProductReviewDay/list'
// 评分变化
let ProductReviewDaystarListUrl = "/ProductReviewDay/starList"
// 评分/评价数
let ProductReviewStarListUrl = "/ProductReview/starList"
// sku列表
let ProductListUrl = "/Product/list"
// sku评分，排名 价格表格
let ProductDayListUrl = "/ProductDay/list"
// sku 排名变化
let ProductRankListUrl = "/ProductRank/list"
// sku 跟卖数量
let ProductSellingList = "/ProductSelling/list"
// 跟卖明细
let ProductSellingDetailList = "/ProductSelling/detailList"
//监控跟踪新增评价列表
let ProductReviewDayCurrentList = "/ProductReviewDay/currentList"
// 竞品分析mark点
let ProductEventList = "/ProductEvent/list"
//竞品分析——店铺分析
// 店铺列表
let ShopAnalysisListurl = "/ShopAnalysis/list"
export function getShopAnalysisList(params) {
  return request.post(ShopAnalysisListurl,
    params
  ).then((res) => {
    return res
  })
}
// 添加产品
let ShopAnalysisSaveUrl = '/ShopAnalysis/save'
// 添加监控
let ShopMonitoringUrl = '/ShopAnalysis/addMonitor'
// 修改监控周期
let changeShopMonitoringUrl = '/ShopAnalysis/updateMonitor'
// 取消监控
let ShopAnalysisRemoveMonitor = "/ShopAnalysis/removeMonitor"
//删除竞争产品分析任务
let ShopAnalysisRemoveUrl = '/ShopAnalysis/remove'
// 全局扣点
let allPoint = "/FunctionMkt/surplusPoints"
// 店铺分析扣除点数
let FunctionMktShopAnalysisList = "/FunctionMkt/shopAnalysis/list"
//店铺分析
// tab1
// 店铺状态,固定的店铺id能找到。
let ShopAnalysisInfoUrl = "/ShopAnalysis/info"
// 店铺详情
let ShopDetailUrl = "/Shop/info"
// 评价数，从类目跳过来需要带上。
let ShopReviewSummaryInfo = "/ShopReviewSummary/info"
// 产品评分分布图
let ShopReviewStarList = "/ShopReviewStar/list"
// 上新
let ShopNewestList = "/Shop/newestList"
// 总数量
let ShoPproductTotalList = "/Shop/productTotalList"
// 日新增评价数-详情
let ShopReviewDetailList = "/Shop/reviewDetailList"
// 新增评价数
let ShopReviewList = "/Shop/reviewList"
// 产品评分分布
let ShopStarList = "/Shop/starList"
// BRS排名柱状图
let ShopRankList = "/Shop/rankList"
// 评价数产品分布
let ShopReviewTotalList = "/Shop/reviewTotalList"
//店铺tab2
//类目详情
let ShopCategoryList = "/ShopCategory/list"
// tab3
// 获取当前产品列表
let ShopProductList = "/Shop/productList"
// 获取历史产品列表（点击chart789里面的新品数字和非新品数字）
let ShopProductHistoryList = "/Shop/productHistoryList"
// 充值
// 查看市场套餐
let MerchantPackagesMktPackagesMktList = "/MerchantPackagesMkt/packagesMkt/list"
// 根据id生成订单
let MerchantOrderSave = "/MerchantOrder/save"
// 获取功能点接口
let FunctionMktFunctionMktList = "/FunctionMkt/functionMkt/list"
// 获取支付二维码的接口
let ApiWxpayPay = "/api/wxpay/pay"
// 监听支付状态
let WxpayQueryStatus = "/wxpay/queryStatus"
// 我的订单
let MerchantOrderList = "/MerchantOrder/list"
// 根据订单号查询订单
let MerchantOrderInfo = "/MerchantOrder/info"
// 个人中心  我的订单
let MerchantPackagesMktListStatistics = "MerchantPackagesMkt/listStatistics"
let MerchantPackageRecList = "/MerchantPackageRec/list"
export { allPoint, proDefaultDay, proChartDefaultDay, shopIndexDefaultDay, shopDefaultDay, ProductAnalysisListUrl, ProductAnalysisSaveUrl, ProductAnalysisRemoveUrl, ProductMonitoringUrl, ProductAnalysisUpdateMonitorUrl, cancelMonitoringUrl, ProductDetailUrl, ProductAnalysisInfoUrl, ProductReviewDayListUrl, ProductSellingList, ProductSellingDetailList, ProductReviewDaystarListUrl, ProductReviewStarListUrl, ProductListUrl, ProductDayListUrl, ProductRankListUrl, ProductEventList, ProductReviewDayCurrentList, FunctionMktProductAnalysisList, ShopAnalysisListurl, ShopAnalysisSaveUrl, ShopMonitoringUrl, changeShopMonitoringUrl, ShopAnalysisRemoveMonitor, ShopAnalysisRemoveUrl, ShopAnalysisInfoUrl, ShopDetailUrl, ShopReviewSummaryInfo, ShopReviewStarList, ShopNewestList, ShoPproductTotalList, ShopReviewDetailList, ShopReviewList, ShopStarList, ShopRankList, ShopReviewTotalList, ShopCategoryList, ShopProductList, ShopProductHistoryList, FunctionMktShopAnalysisList, MerchantPackagesMktPackagesMktList, MerchantOrderSave, FunctionMktFunctionMktList, ApiWxpayPay, WxpayQueryStatus, MerchantOrderList, MerchantOrderInfo, MerchantPackagesMktListStatistics, MerchantPackageRecList }
