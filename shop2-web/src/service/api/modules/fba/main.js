export default [
  // {
  //   name: "test",
  //   method: "POST",
  //   desc: "获取平台站点",
  //   path: "/platformSite/list",
  //   mock: false,mockBaseURL:"http://120.79.124.232:8001/mock/250/",
  //   mockBaseURL: "http://120.79.124.232:8001/mock/235/platformSite/list",
  //   params: {},
  //   mockData: {
  //     "rows|1-10": [
  //       {
  //         // 属性 id 是一个自增数，起始值为 1，每次增 1
  //         "id|+1": 1,
  //         sku: "B07W6YY9C8",
  //         "cnt|+1": 2,
  //         asin: "Sport bra-314-Blacke-M",
  //         fnsku: "B07W6YY9C8",
  //         imageUrl: null,
  //         storeName: "BL9",
  //         price: "￥2.00",
  //         transportType: "海运",
  //         invokeNum: 45,
  //         waitNum: 30,
  //         c: 600,
  //         d: 45
  //       }
  //     ]
  //   }
  // },

  {
    path: "/fbmOrderInfo/view/items",
    name: "FbmOrderInfoViewItems",
    method: "POST",
    desc: "FBM管理 - 查看订单产品信息列表",
    mock: false
  },
  {
    path: "/fbmOrderInfo/batchSend",
    name: "FbmOrderInfoBatchSend",
    method: "POST",
    desc: "FBM管理 - 批量发货",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbmOrderInfo/updateSendStatus",
    name: "FbmOrderInfoUpdateSendStatus",
    method: "POST",
    desc: "FBM管理 - 批量设置为已发货或者未发货",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbmOrderInfo/view/order",
    name: "FbmOrderInfoViewOrder",
    method: "POST",
    desc: "FBM管理 - 查看订单详情(预留)",
    mock: false
  },
  {
    path: "/fbmOrderInfo/list",
    name: "FbmOrderInfoList",
    method: "POST",
    desc: "FBM管理 - 列表",
    mock: false
  },
  {
    path: "/fbmOrderInfo/import/trankingNumberConfirm",
    name: "FbmOrderInfoImportTrankingNumberConfirm",
    method: "POST",
    desc: "FBM管理 - 批量导入运单号（确认）",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbmOrderInfo/import/trankingNumber",
    name: "FbmOrderInfoImportTrankingNumber",
    method: "POST",
    desc: "FBM管理 - 批量导入运单号",
    mock: false
  },
  {
    path: "/fbmOrderInfo/updateTrackingNumber",
    name: "FbmOrderInfoUpdateTrackingNumber",
    method: "POST",
    desc: "FBM管理 - 批量修改运单号",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbmOrderInfo/refund",
    name: "FbmOrderInfoRefund",
    method: "POST",
    desc: "FBM管理 - 批量退款",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbmOrderInfo/export",
    name: "FbmOrderInfoExport",
    method: "POST",
    desc: "FBM管理 - 导出",
    mock: false,
    showSuccess: true
  },
  {
    path: "/fbaReplenishInfo/cancel",
    name: "FbaReplenishInfoCancel",
    method: "POST",
    desc: "补货记录 - 取消补货记录",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishInfo/view",
    name: "FbaReplenishInfoView",
    method: "POST",
    desc: "补货记录 - 补货记录-查看",
    mock: false
  },
  {
    path: "/fbaReplenishInfo/download",
    name: "FbaReplenishInfoDownload",
    method: "POST",
    // config: {
    //   responseType: "blob"
    // },
    desc: "补货记录 - 批量下载",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishInfo/view/update",
    name: "FbaReplenishInfoViewUpdate",
    method: "POST",
    desc: "补货记录 - 补货记录-查看-批量修改补货数量",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishInfo/list",
    name: "FbaReplenishInfoList",
    method: "POST",
    desc: "补货记录 - 列表",
    mock: false
  },
  {
    path: "/fbaReplenishTransport/list",
    name: "FbaReplenishTransportList",
    method: "POST",
    desc: "运输方式管理 - 列表-工具-不分页",
    mock: false
  },
  {
    path: "/fbaReplenishTransport/and",
    name: "FbaReplenishTransportAnd",
    method: "POST",
    desc: "运输方式管理 - 添加",
    mock: false,
    showSuccess: true
  },
  {
    path: "/fbaReplenishTransport/page",
    name: "FbaReplenishTransportPage",
    method: "POST",
    desc: "运输方式管理 - 列表-分页",
    mock: false
  },
  {
    path: "/fbaReplenishTransport/delete",
    name: "FbaReplenishTransportDelete",
    method: "POST",
    desc: "运输方式管理 - 批量删除",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishTransport/edit",
    name: "FbaReplenishTransportEdit",
    method: "POST",
    desc: "运输方式管理 - 编辑",
    mock: false,
    showSuccess: true
  },
  {
    path: "/fbaReplenishInfoCalculate/edit",
    name: "FbaReplenishInfoCalculateEdit",
    method: "POST",
    desc: "计算公式管理 - 编辑",
    mock: false,
    showSuccess: true
  },
  {
    path: "/fbaReplenishInfoCalculate/view",
    name: "FbaReplenishInfoCalculateView",
    method: "POST",
    // singleLoading: true,
    desc: "计算公式管理 - 查看",
    mock: false
  },
  {
    path: "/fbaReplenishInfoCalculate/list",
    name: "FbaReplenishInfoCalculateList",
    method: "POST",
    desc: "计算公式管理 - 列表",
    mock: false
  },
  {
    path: "/fbaReplenishRecordMws/list",
    name: "FbaReplenishRecordMwsList",
    method: "POST",
    desc: "同步记录 - 列表",
    mock: false
  },
  {
    path: "/fbaReplenishRecordMws/again",
    name: "FbaReplenishRecordMwsAgain",
    method: "POST",
    showSuccess: true,
    desc: "同步记录 - 重试",
    mock: false
  },
  {
    path: "fbaReplenishShipping/confirmUnSend",
    name: "fbaReplenishShippingConfirmUnSend",
    method: "POST",
    desc: "发货计划 - 批量设置为未发货"
  },
  {
    path: "/fbaReplenishShipping/list",
    name: "FbaReplenishShippingList",
    method: "POST",
    desc: "货件管理 - 列表",
    mock: false
  },
  {
    path: "/fbaReplenishShipping/export",
    name: "FbaReplenishShippingExport",
    method: "POST",
    // config: {
    //   responseType: "blob"
    // },
    desc: "货件管理 - 批量导出发货计划",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishShipping/confirmSend",
    name: "FbaReplenishShippingConfirmSend",
    method: "POST",
    desc: "货件管理 - 批量确认发货",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishShipping/setBatchNumber",
    name: "FbaReplenishShippingSetBatchNumber",
    method: "POST",
    desc: "货件管理 - 批量关联批次号（补货记录）",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishShipping/setTransport",
    name: "FbaReplenishShippingSetTransport",
    method: "POST",
    desc: "货件管理 - 批量设置运输方式",
    showSuccess: true,
    mock: false
  },
  {
    path: "fbmOrderInfo/import/trankingNumberDownload",
    name: "fbmOrderInfoImportTrankingNumberDownload",
    method: "POST",
    desc: "FBM管理 - 批量导入运单号（下载）",
    mock: false
  },
  {
    path: "/fbaReplenishShipping/download/sku",
    name: "FbaReplenishShippingDownloadSku",
    method: "POST",
    config: {
      responseType: "blob"
    },
    desc: "货件管理 - 下载计划SKU列表",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishShipping/download/receiving",
    name: "FbaReplenishShippingDownloadReceiving",
    method: "POST",
    // config: {
    //   responseType: "blob"
    // },
    desc: "货件管理 - 签收情况下载",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishShipping/view/items",
    name: "FbaReplenishShippingViewItems",
    method: "POST",
    desc: "货件管理 - 查看发货计划详细",
    mock: false
  },
  {
    path: "/fbaReplenishShipping/update/qty",
    name: "FbaReplenishShippingUpdateQty",
    method: "POST",
    desc: "货件管理 - 修改发货计划真实数量",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishShipping/view/receiving",
    name: "FbaReplenishShippingViewReceiving",
    method: "POST",
    desc: "货件管理 - 签收情况预览",
    mock: false
  },
  {
    path: "/fbaReplenishShipping/setTrackingNumber",
    name: "FbaReplenishShippingSetTrackingNumber",
    method: "POST",
    desc: "货件管理 - 设置运单号",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishShipping/import/sendQty/confirm",
    name: "FbaReplenishShippingImportSendQtyConfirm",
    method: "POST",
    desc: "货件管理 - 导入实际发货数量-确认",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishShipping/import/transport/download",
    name: "FbaReplenishShippingImportTransportDownload",
    method: "POST",
    config: {
      responseType: "blob"
    },
    desc: "货件管理 - 导入运输方式-下载",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishShipping/import/transport",
    name: "FbaReplenishShippingImportTransport",
    method: "POST",
    desc: "货件管理 - 导入运输方式-上传",
    mock: false
  },
  {
    path: "/fbaReplenishShipping/import/transport/confirm",
    name: "FbaReplenishShippingImportTransportConfirm",
    method: "POST",
    desc: "货件管理 - 导入运输方式-确认",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishShipping/import/sendQty",
    name: "FbaReplenishShippingImportSendQty",
    method: "POST",
    desc: "货件管理 - 导入实际发货数量-上传",
    mock: false
  },
  {
    path: "/fbaReplenishShipping/import/sendQty/download",
    name: "FbaReplenishShippingImportSendQtyDownload",
    method: "POST",
    config: {
      responseType: "blob"
    },
    desc: "货件管理 - 导入实际发货数量-下载",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenish/list",
    name: "FbaReplenishList",
    method: "POST",
    desc: "补货功能页面 - 列表-兼并选择运输方式",
    mock: false
  },
  {
    path: "/fbaReplenish/setAvgSale",
    name: "FbaReplenishSetAvgSale",
    method: "POST",
    singleLoading: true,
    desc: "补货功能页面 - 算法-设置平均销量",
    showSuccess: false,
    // noShowDefaultError: true,
    mock: false
  },
  {
    path: "/fbaReplenish/export",
    name: "FbaReplenishExport",
    method: "POST",
    // config: {
    //   responseType: "blob"
    // },
    singleLoading: true,
    desc: "补货功能页面 - 导出当前列表",
    // showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenish/setParentQty",
    name: "FbaReplenishSetParentQty",
    method: "POST",
    singleLoading: true,
    desc: "补货功能页面 - 设置父产品补货数量",
    showSuccess: false,
    // noShowDefaultError: true,
    mock: false
  },
  {
    path: "/fbaReplenishProduct/list",
    name: "FbaReplenishProductList",
    method: "POST",
    desc: "补货列表页面 - 列表",
    mock: false
  },
  {
    path: "/fbaReplenishProduct/warningDays/set",
    name: "FbaReplenishProductWarningDaysSet",
    method: "POST",
    showSuccess: true,
    desc: "补货列表页面 - 滞销预警天数-批量编辑",
    mock: false
  },
  {
    path: "/fbaReplenishProduct/price/find",
    name: "FbaReplenishProductPriceFind",
    method: "POST",
    desc: "补货列表页面 - 价格-批量查询",
    mock: false
  },
  {
    path: "/fbaReplenishProduct/price/set",
    name: "FbaReplenishProductPriceSet",
    method: "POST",
    showSuccess: true,
    desc: "补货列表页面 - 价格-批量编辑",
    mock: false
  },
  {
    path: "/fbaReplenishProduct/setLifeCycle",
    name: "FbaReplenishProductSetLifeCycle",
    method: "POST",
    desc: "补货列表页面 - 设置生命周期",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishProduct/warningDays/find",
    name: "FbaReplenishProductWarningDaysFind",
    method: "POST",
    desc: "补货列表页面 - 滞销预警天数-批量查询",
    mock: false
  },
  {
    path: "/fbaReplenishProduct/delete",
    name: "FbaReplenishProductDelete",
    showSuccess: true,
    method: "POST",
    desc: "补货列表页面 - 批量删除",
    mock: false
  },
  {
    path: "/fbaReplenishProduct/export/list",
    name: "FbaReplenishProductExportList",
    method: "POST",
    config: {
      responseType: "blob"
    },
    desc: "补货列表页面 - 导出当前列表",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishProduct/getDailySales",
    name: "FbaReplenishProductGetDailySales",
    method: "POST",
    singleLoading: true,
    desc: "补货列表页面 - 查询30天当日和日均销量",
    mock: false
  },
  {
    path: "/fbaReplenishProduct/and/import",
    name: "FbaReplenishProductAndImport",
    method: "POST",
    desc: "补货列表页面 - 导入产品到补货工具",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishProduct/add",
    name: "FbaReplenishProductAdd",
    method: "POST",
    desc: "补货列表页面 - 添加产品到补货工具",
    showSuccess: true,
    mock: false
  },
  {
    path: "/fbaReplenishProduct/and/import",
    name: "FbaReplenishProductAndImport_1581321280321",
    method: "POST",
    desc: "补货列表页面 - 查询未导入补货工具的产品列表",
    mock: false
  },
  {
    path: "/fbaReplenishProduct/nowReplenishList",
    name: "FbaReplenishProductNowReplenishList",
    method: "POST",
    singleLoading: true,
    desc: "补货列表页面 - 在补计划列表",
    mock: false
  },
  {
    path: "fbaReplenishProduct/list/variation",
    name: "fbaReplenishProductListVariation",
    method: "POST",
    desc: "补货列表页面 - 列表(变体)",
    mock: false
  },
  {
    path: "fbaReplenishProduct/and/import/variation",
    name: "fbaReplenishProductAndImportVariation",
    method: "POST",
    desc: "补货列表页面 - 查询未导入补货工具的产品列表(查询变体)",
    mock: false
  },
  {
    path: "fbaReplenishProduct/localInventory/confirm",
    name: "fbaReplenishProductLocalInventoryConfirm",
    method: "POST",
    desc: "补货列表页面 - 导入本地库存-确认",
    showSuccess: true,
    mock: false
  },
  {
    path: "fbaReplenishProduct/localInventory/downlocad",
    name: "fbaReplenishProductLocalInventoryDownlocad",
    method: "POST",
    config: {
      responseType: "blob"
    },
    desc: "补货列表页面 - 导入本地库存-下载",
    showSuccess: true,
    mock: false
  },
  {
    path: "fbaReplenishProduct/warningDays/view",
    name: "fbaReplenishProductWarningDaysView",
    method: "POST",
    desc: "补货列表页面 - 滞销预警天数-查询店铺"
  },
  {
    path: "fbaReplenishProduct/localInventory/import",
    name: "fbaReplenishProductLocalInventoryImport",
    method: "POST",
    desc: "补货列表页面 - 导入本地库存-导入",
    mock: false
  },
  {
    path: "fbaReplenishProduct/syn",
    name: "fbaReplenishProductSyn",
    showSuccess: true,
    method: "POST",
    desc: "补货列表页面 - 手动同步",
    mock: false
  },
  {
    path: "fbaReplenishProduct/and/have/import/variation",
    name: "fbaReplenishProductAndHaveImportVariation",
    method: "POST",
    desc: "补货列表页面 - 查询已导入补货工具的产品列表(查询变体)",
    mock: false
  },
  {
    path: "fbaReplenishProduct/and/have/import",
    name: "fbaReplenishProductAndHaveImport",
    method: "POST",
    desc: "补货列表页面 - 查询已导入补货工具的产品列表(分页)",
    mock: false
  },
  {
    path: "fbaShipmentCreate/carton/list",
    name: "fbaShipmentCreateCartonList",
    method: "POST",
    desc: "FBA补货预处理 - 查询商品装箱信息"
  },
  {
    path: "fbaShipmentCreate/shipment/list",
    name: "fbaShipmentCreateShipmentList",
    method: "POST",
    desc: "FBA补货计划 - 计划中的货件列表"
  }
];
