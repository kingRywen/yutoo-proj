import request from './axios'
let proDefaultDay = 0; // 竞品分析默认表格数据时间。实际上今日
let proChartDefaultDay = 30; // 竞品分析默认图表的时间
let shopIndexDefaultDay = 0; // 店铺首页默认表格数据时间。实际上今日
let shopDefaultDay = 30; //店铺分析表格数据默认时间。实际上15
//  竞品竞争分析列表
let ProductAnalysisListUrl = '/ProductAnalysis/list'
//  竞品竞争分析列表
export function getProductAnalysisList(params) {
  return request.get(ProductAnalysisListUrl, {
    params: params
  }).then((res) => {
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
//----查看产品.vue---///
let ProductDetailUrl = '/product/detail'
// 商品状态详情
let ProductAnalysisInfoUrl = "/productAnalysis/info"
// 日新增评价数
let ProductReviewDayListUrl = '/productReviewDay/list'
// 评分变化
let ProductReviewDaystarListUrl = "/productReviewDay/starList"
// 评价数
let ProductReviewStarListUrl = "/productReview/starList"
// sku列表
let ProductListUrl = "/product/skuList"
// sku评分，排名 价格表格
let ProductDayListUrl = "/productDay/list"
// sku 排名变化
let ProductRankListUrl = "/productRank/list"
// sku 跟卖数量
let ProductSellingList = "/ProductSelling/list"
// 跟卖明细
let ProductSellingDetailList = "/ProductSelling/detailList"
//监控跟踪新增评论列表
let ProductReviewDayCurrentList = "/productReviewDay/currentList"
// 竞品分析mark点
let ProductEventList = "/productEvent/list"
//竞品分析——店铺分析
// 店铺列表
let ShopAnalysisListurl = "/ShopAnalysis/list"
export function getShopAnalysisList(params) {
  return request.get(ShopAnalysisListurl, {
    params: params
  }).then((res) => {
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
//店铺分析
// tab1
// 店铺状态,固定的店铺id能找到。
let ShopAnalysisInfoUrl = "/ShopAnalysis/info"
// 店铺详情
let ShopDetailUrl = "/shop/info"
// 评价数，从类目跳过来需要带上。
let ShopReviewSummaryInfo = "/shopReviewSummary/info"
// 产品评分分布图
let ShopReviewStarList = "/shopReviewStar/list"
// 上新
let ShopNewestList = "/shop/newestList"
// 总数量
let ShoPproductTotalList = "/shop/productTotalList"
// 日新增评价数-详情
let ShopReviewDetailList = "/shop/reviewDetailList"
// 新增评价数
let ShopReviewList = "/shop/reviewList"
// 产品评分分布
let ShopStarList = "/shop/starList"
// BRS排名柱状图
let ShopRankList = "/Shop/rankList"
// 评价数产品分布
let ShopReviewTotalList = "/shop/reviewTotalList"
//店铺tab2
//类目详情
let ShopCategoryList = "/shopCategory/list"
// tab3
// 获取当前商品列表
let ShopProductList = "/shop/productList"
// 获取历史商品列表（点击chart789里面的新品数字和非新品数字）
let ShopProductHistoryList = "/Shop/productHistoryList"
export {
  proDefaultDay,
  proChartDefaultDay,
  shopIndexDefaultDay,
  shopDefaultDay,
  ProductAnalysisListUrl,
  ProductAnalysisSaveUrl,
  ProductAnalysisRemoveUrl,
  ProductMonitoringUrl,
  ProductAnalysisUpdateMonitorUrl,
  cancelMonitoringUrl,
  ProductDetailUrl,
  ProductAnalysisInfoUrl,
  ProductReviewDayListUrl,
  ProductSellingList,
  ProductSellingDetailList,
  ProductReviewDaystarListUrl,
  ProductReviewStarListUrl,
  ProductListUrl,
  ProductDayListUrl,
  ProductRankListUrl,
  ProductEventList,
  ProductReviewDayCurrentList,
  ShopAnalysisListurl,
  ShopAnalysisSaveUrl,
  ShopMonitoringUrl,
  changeShopMonitoringUrl,
  ShopAnalysisRemoveMonitor,
  ShopAnalysisRemoveUrl,
  ShopAnalysisInfoUrl,
  ShopDetailUrl,
  ShopReviewSummaryInfo,
  ShopReviewStarList,
  ShopNewestList,
  ShoPproductTotalList,
  ShopReviewDetailList,
  ShopReviewList,
  ShopStarList,
  ShopRankList,
  ShopReviewTotalList,
  ShopCategoryList,
  ShopProductList,
  ShopProductHistoryList
}
