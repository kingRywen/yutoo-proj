export default [
  {
      name: 'homeSellerWornCnt',
      method: 'POST',
      desc: '店铺预警下拉列表',
      path: 'home/seller/wornCnt',
      common: true,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeItemConfigList',
      method: 'POST',
      desc: '栏目配置列表',
      path: 'home/item/config/list',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeItemConfigSave',
      method: 'POST',
      desc: '栏目配置【排序、关注、取消关注】',
      path: 'home/item/config/save',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeInventoryWornProductCnt',
      method: 'POST',
      desc: 'sku预警-产品数量',
      path: 'home/Inventory/worn/productCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeOrderRangeConfigInfo',
      method: 'POST',
      desc: '日订单波动-获取波动',
      path: 'home/order/range/configInfo',
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeOrderRangeConfig',
      method: 'POST',
      desc: '日订单波动-配置波动',
      path: 'home/order/range/config',
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homePerformanceNoticeCnt',
      method: 'POST',
      desc: '预警消息-数量',
      path: 'home/performance/noticeCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeCusMsgWornCnt',
      method: 'POST',
      desc: '客户消息-数量',
      path: 'home/cusMsg/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homePdWornStarWornCnt',
      method: 'POST',
      desc: '评分过低-产品数量',
      path: 'home/pd/worn/starWornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homePdWornAllWornCnt',
      method: 'POST',
      desc: '所有监控产品-产品数量',
      path: 'home/pd/worn/allWornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeClaimWornCnt',
      method: 'POST',
      desc: '亚马逊索赔预警-预警数量',
      path: 'home/claim/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeProductWornCnt',
      method: 'POST',
      desc: '产品信息监控-预警数量',
      path: 'home/product/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeInventoryWornCnt',
      method: 'POST',
      desc: '库存预警-预警数量',
      path: 'home/Inventory/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homePdWarnRefundRateWornCnt',
      method: 'POST',
      desc: '退货率异常-预警数量',
      path: 'home/pdWarn/refundRateWornCnt',
    //   mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeClaimLostWornCnt',
      method: 'POST',
      desc: '亚马逊丢件未赔偿-预警数量',
      path: 'home/claim/lost/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeClaimDamageWornCnt',
      method: 'POST',
      desc: '亚马逊损坏未赔偿-预警数量',
      path: 'home/claim/damage/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeClaimRefundWornCnt',
      method: 'POST',
      desc: '客户退款未退货未赔偿-预警数量',
      path: 'home/claim/refund/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeClaimFulfillmentWornCnt',
      method: 'POST',
      desc: 'FBA配送费不对-预警数量',
      path: 'home/claim/fulfillment/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeClaimCommissionWornCnt',
      method: 'POST',
      desc: '佣金不对-预警数量',
      path: 'home/claim/commission/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeClaimStorageWornCnt',
      method: 'POST',
      desc: '仓储费不对-预警数量',
      path: 'home/claim/storage/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeAdProductWornCnt',
      method: 'POST',
      desc: '子SKU广告被暂停-产品数量',
      path: 'home/ad/product/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeAdCostWornCnt',
      method: 'POST',
      desc: '广告花费占比过高-产品数量',
      path: 'home/ad/cost/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeBrProductWornCnt',
      method: 'POST',
      desc: '首页出现差评-产品数量',
      path: 'home/br/product/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeOrderRangeWornCnt',
      method: 'POST',
      desc: '日订单波动-产品数量',
      path: 'home/order/range/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeOsProductWornCnt',
      method: 'POST',
      desc: '出现非自己店铺跟卖-产品数量',
      path: 'home/os/product/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homeSalesRptList',
      method: 'POST',
      desc: '近30天销售情况',
      path: 'home/sales/rptList',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homePdWarnWornCnt',
      method: 'POST',
      desc: '产品数据预警监控-预警数量',
      path: 'home/pdWarn/wornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
  {
      name: 'homePdWarnRefundRateWornCn',
      method: 'POST',
      desc: '退货率异常-预警数量',
      path: 'home/pdWarn/refundRateWornCnt',
      mock: false,
      // showSuccess: true,
      params: {}
  },
]