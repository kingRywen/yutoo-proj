export default [
  {
    name: 'financeBooksAccountPage',
    method: 'POST',
    desc: '总账簿-列表',
    mock: false,
    path: '/finance/books/account/page',
    params: {}
  },
  {
    name: 'financeBooksAccountListExport',
    method: 'POST',
    desc: '列表导出(是否勾选导出)',
    mock: false,
    path: '/finance/books/account/list/export',
    params: {}
  },
  {
    name: 'financeBooksAccountDetailSave',
    method: 'POST',
    desc: '明细账-添加',
    mock: false,
    path: '/finance/books/account/detail/save',
    params: {}
  },
  {
    name: 'financeBooksAccountDetailListExport',
    method: 'POST',
    desc: '明细账-列表导出',
    mock: false,
    path: '/finance/books/account/detail/list/export',
    params: {}
  },
  {
    name: 'financeBooksAccountDetailPage',
    method: 'POST',
    desc: '明细账-列表',
    mock: false,
    path: '/finance/books/account/detail/page',
    params: {}
  },
  {
    name: 'financeBooksAccountDetailInvalid',
    method: 'POST',
    desc: '明细账-作废状态修改',
    mock: false,
    path: '/finance/books/account/detail/invalid',
    params: {}
  },
  {
    name: 'financeBooksAccountDetailUpload',
    method: 'POST',
    desc: '明细账-导入',
    mock: false,
    path: '/finance/books/account/detail/upload',
    params: {}
  },
  {
    name: 'financeBooksAccountDetailAccountList',
    method: 'POST',
    desc: '明细账-收款人 付款人模糊 查询列表',
    mock: false,
    path: '/finance/books/account/detail/account/list',
    params: {}
  },
  {
    name: 'financeBooksAccountDetailListTemplate',
    method: 'POST',
    desc: '明细账-导入模板下载',
    mock: false,
    path: '/finance/books/account/detail/list/template',
    params: {}
  },

  
  {
    name: 'financeBooksAdvertisementDetailPage',
    method: 'POST',
    desc: '利润报表-广告费用详情列表',
    mock: false,
    path: '/finance/books/advertisement/detail/page',
    params: {}
  },
  // {
  //   name: 'financeBooksAccountDetailListExport',
  //   method: 'POST',
  //   desc: '明细账-列表导出',
  //   mock: false,
  //   path: '/finance/books/account/detail/list/export',
  //   params: {}
  // },
  {
    name: 'financeBooksAdvertisementDetailExport',
    method: 'POST',
    desc: '利润报表-广告费用详情列表导出',
    mock: false,
    path: '/finance/books/advertisement/detail/export',
    params: {}
  },
  {
    name: 'financeBooksProfitData',
    method: 'POST',
    desc: '利润报表-利润报表数据',
    mock: false,
    path: '/finance/books/profit/data',
    params: {}
  },
  {
    name: 'financeBooksProfitDataExport',
    method: 'POST',
    desc: '利润报表-利润报表数据导出',
    mock: false,
    path: '/finance/books/profit/data/export',
    params: {}
  },
  {
    name: 'financeBooksCostDetailPage',
    method: 'POST',
    desc: '利润报表-产品费用详情列表',
    mock: false,
    path: '/finance/books/cost/detail/page',
    params: {}
  },
  {
    name: 'financeBooksCostDetailsExport',
    method: 'POST',
    desc: '利润报表-产品费用详情列表导出',
    mock: false,
    path: '/finance/books/cost/details/export',
    params: {}
  },
  {
    name: 'financeBooksSalesDetailPage',
    method: 'POST',
    desc: '利润报表-ASIN销售额详情 (FBA配送费详情, 正常订单佣金）',
    mock: false,
    path: '/finance/books/sales/detail/page',
    params: {}
  },
  {
    name: 'financeBooksSalesDetailExport',
    method: 'POST',
    desc: '利润报表-ASIN销售额详情 (FBA配送费详情, 正常订单佣金） 导出',
    mock: false,
    path: '/finance/books/sales/detail/export',
    params: {}
  },
  {
    name: 'financeBooksReimbursementDetailPage',
    method: 'POST',
    desc: '利润报表-ASIN赔偿详情列表',
    mock: false,
    path: '/finance/books/reimbursement/detail/page',
    params: {}
  },
  {
    name: 'financeBooksReimbursementDetailExport',
    method: 'POST',
    desc: '利润报表-ASIN赔偿详情列表导出',
    mock: false,
    path: '/finance/books/reimbursement/detail/export',
    params: {}
  },
  {
    name: 'financeBooksStorageFeeDetailPage',
    method: 'POST',
    desc: '利润报表-仓储费详情',
    mock: false,
    path: '/finance/books/storage/fee/detail/page',
    params: {}
  },
  {
    name: 'financeBooksStorageFeeDetailExport',
    method: 'POST',
    desc: '利润报表-仓储费详情导出',
    mock: false,
    path: '/finance/books/storage/fee/detail/export',
    params: {}
  },
  {
    name: 'financeBooksDrawBackDetailPage',
    method: 'POST',
    desc: '利润报表-asin退款详情 （退款金额 退款损失）',
    mock: false,
    path: '/finance/books/draw/back/detail/page',
    params: {}
  },
  {
    name: 'financeBooksDrawBackDetailExport',
    method: 'POST',
    desc: '利润报表-asin退款详情 （退款金额 退款损失）导出',
    mock: false,
    path: '/finance/books/draw/back/detail/export',
    params: {}
  },
  {
    name: 'financeBooksDisposalDetailPage',
    method: 'POST',
    desc: '利润报表-asin移除详情 （移除费用 销毁费用）',
    mock: false,
    path: '/finance/books/disposal/detail/page',
    params: {}
  },
  {
    name: 'financeBooksDisposalDetailExport',
    method: 'POST',
    desc: '利润报表-asin移除详情 （移除费用 销毁费用）导出',
    mock: false,
    path: '/finance/books/disposal/detail/export',
    params: {}
  },
  {
    name: 'financeBooksPurchaseDetailPage',
    method: 'POST',
    desc: '利润报表-asin采购成本详情',
    mock: false,
    path: '/finance/books/purchase/detail/page',
    params: {}
  },
  {
    name: 'financeBooksPurchaseDetailExport',
    method: 'POST',
    desc: '利润报表-asin采购成本导出',
    mock: false,
    path: '/finance/books/purchase/detail/export',
    params: {}
  },
  {
    name: 'financeBooksShopCostDetailExport',
    method: 'POST',
    desc: '利润报表-店铺费用详情列表导出',
    mock: false,
    path: '/finance/books/shop/cost/detail/export',
    params: {}
  },
  {
    name: 'financeBooksCostTypeDetailPage',
    method: 'POST',
    desc: '利润报表-通用成本数据详情列表',
    mock: false,
    path: '/finance/books/cost/type/detail/page',
    params: {}
  },
  {
    name: 'financeBooksCostTypeDetailExport',
    method: 'POST',
    desc: '利润报表-通用成本数据详情列表导出',
    mock: false,
    path: '/finance/books/cost/type/detail/export',
    params: {}
  },
  {
    name: 'financeBooksTransportDetailPage',
    method: 'POST',
    desc: '利润报表-运输成本详情',
    mock: false,
    path: '/finance/books/transport/detail/page',
    params: {}
  },
  {
    name: 'financeBooksTransportDetailExport',
    method: 'POST',
    desc: '利润报表-运输成本详情导出',
    mock: false,
    path: '/finance/books/transport/detail/export',
    params: {}
  },
  
  
  {
    name: 'financeBooksParentSkuList',
    method: 'POST',
    desc: '利润报表-获取所有父产品仓库自定义SKU列表',
    mock: false,
    path: '/finance/books/parent/sku/list',
    params: {}
  },
  {
    name: 'financeBooksVariantSkuList',
    method: 'POST',
    desc: '利润报表-根据父产品获取子产品自定义SKU',
    mock: false,
    path: '/finance/books/variant/sku/list',
    params: {}
  },
  {
    name: 'financeBooksShopCostDetailPage',
    method: 'POST',
    desc: '利润报表-店铺费用详情列表',
    mock: false,
    path: '/finance/books/shop/cost/detail/page',
    params: {}
  },
  // {
  //   name: 'financeBooksCostTypeDetailExport',
  //   method: 'POST',
  //   desc: '利润报表-通用成本数据详情列表 导出',
  //   mock: false,
  //   path: '/finance/books/cost/type/detail/export',
  //   params: {}
  // },
  // {
  //   name: 'financeBooksTransportDetailPage',
  //   method: 'POST',
  //   desc: '利润报表-运输成本详情',
  //   mock: false,
  //   path: '/finance/books/transport/detail/page',
  //   params: {}
  // },
  // {
  //   name: 'financeBooksTransportDetailExport',
  //   method: 'POST',
  //   desc: '利润报表-运输成本详情导出',
  //   mock: false,
  //   path: '/finance/books/transport/detail/export',
  //   params: {}
  // },
  
]
