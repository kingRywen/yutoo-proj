export default [
  {
    name: 'userListGetUserList',
    method: 'POST',
    desc: '获取用户列表(所有操作人員)',
    path: '/user/list/getUserList',
    mockPath: '/',
    params: {}
  },
  {
    name: 'warehousesGetWarehouseList',
    method: 'POST',
    desc: '获取所有仓库',
    path: '/warehouses/getWarehouseList',
    mockPath: '/',
    params: {
      // type:0 全部 1 本地仓 2 海外仓
    }
  },
  {
    name: 'getBankList',
    method: 'POST',
    desc: '获取银行',
    path: '/bank/getBankList',
    mockPath: '/',
    params: {}
  },
  {
    name: 'receiptInfo',
    method: 'POST',
    desc: '支付信息-获取支付信息',
    path: '/order/receipt/info',
    mockPath: '/',
    params: {}
  },
  {
    name: 'receiptSave',
    method: 'POST',
    desc: '支付信息-添加',
    path: '/order/receipt/save',
    mockPath: '/',
    params: {},
    type: 'formdata'
  },
  {
    name: 'refundInfo',
    method: 'POST',
    desc: '退款-获取退款信息',
    path: '/order/refund/info',
    mockPath: '/',
    params: {}
  },
  {
    name: 'refundReasonList',
    method: 'POST',
    desc: '退款原因-列表',
    path: '/refund/reason/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'refundReasonRemove',
    method: 'POST',
    desc: '退款原因-批量删除',
    path: '/refund/reason/remove',
    mockPath: '/',
    params: {}
  },
  {
    name: 'refundReasonGetReasonList',
    method: 'POST',
    desc: '退款原因-列表 Copy(一级二级)',
    path: '/refund/reason/getReasonList',
    mockPath: '/',
    params: {}
  },
  {
    name: 'refundReasonSave',
    method: 'POST',
    desc: '退款原因-添加',
    path: '/refund/reason/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'refundReasonInfo',
    method: 'POST',
    desc: '退款原因-获取信息(编辑)',
    path: '/refund/reason/info',
    mockPath: '/',
    params: {}
  },
  {
    name: 'refundReasonUpdate',
    method: 'POST',
    desc: '退款原因-修改',
    path: '/refund/reason/update',
    mockPath: '/',
    params: {}
  },
  {
    name: 'refundGetReasonList',
    method: 'POST',
    desc: '获取平台退款原因',
    path: '/order/refund/platform/reason/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'refundSave',
    method: 'POST',
    desc: '退款-添加退款信息',
    path: '/order/refund/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'returnInfo',
    method: 'POST',
    desc: '退换货-获取信息',
    path: '/order/return/info',
    mockPath: '/',
    params: {}
  },

  {
    name: 'setOrderState',
    method: 'POST',
    desc: '设置订单状态',
    path: '/order/setOrderState',
    mockPath: '/',
    params: {}
  },

  {
    name: 'orderInfo',
    method: 'POST',
    desc: '订单-编辑前拉取信息和详情',
    path: '/order/info',
    mockPath: '/',
    singleLoading: true,
    params: {}
  },
  {
    name: 'GetConnection',
    method: 'POST',
    desc: '订单-获取关联产品',
    path: '/order/product/getConnection',
    mockPath: '/',
    params: {}
  },
  {
    name: 'GetDistModeList',
    method: 'POST',
    desc: '获取配送方式',
    path: '/dist/mode/getDistModeList',
    mockPath: '/',
    params: {}
  },
  {
    name: 'deliverSave',
    method: 'POST',
    desc: '配送信息-添加',
    path: '/order/deliver/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'deliverInfo',
    method: 'POST',
    desc: '发货-获取发货信息',
    path: '/order/deliver/info',
    mockPath: '/',
    params: {}
  },

  {
    name: 'deliverRemove',
    method: 'POST',
    desc: '配送信息-删除',
    path: '/order/deliver/remove',
    mockPath: '/',
    params: {}
  },
  {
    name: 'deliverUpdate',
    method: 'POST',
    desc: '配送信息-编辑',
    path: '/order/deliver/update',
    mockPath: '/',
    params: {}
  },
  {
    name: 'deliverDetail',
    method: 'POST',
    desc: '配送信息-(查询)',
    path: '/order/deliver/detail',
    mockPath: '/',
    params: {}
  },
  {
    name: 'updateRemark',
    method: 'POST',
    desc: '订单-修改备注',
    path: '/order/update/remark',
    mockPath: '/',
    params: {}
  },
  {
    name: 'orderClean',
    method: 'POST',
    desc: '订单-清除待审查原因',
    path: '/order/clean',
    mockPath: '/',
    params: {}
  },

  {
    name: 'receiptRecord',
    method: 'POST',
    desc: '收退款记录-获取支付记录（收款）',
    path: '/order/receipt/record',
    mockPath: '/',
    params: {}
  },
  {
    name: 'refundRecord',
    method: 'POST',
    desc: '收退款记录-获取退款记录（退款）',
    path: '/order/refund/record',
    mockPath: '/',
    params: {}
  },
  {
    name: 'deliverRecord',
    method: 'POST',
    desc: '收发货记录-获取发货记录（发货）',
    path: '/order/deliver/record',
    mockPath: '/',
    params: {}
  },
  {
    name: 'returnRecord',
    method: 'POST',
    desc: '收发货记录-获取退换货记录',
    path: '/order/return/record',
    mockPath: '/',
    params: {}
  },
  {
    name: 'afterEmailRecord',
    method: 'POST',
    desc: '客户售后处理-邮件往来记录',
    path: '/order/after/email/record',
    mockPath: '/',
    params: {}
  },
  {
    name: 'afterMessageRecord',
    method: 'POST',
    desc: '客户售后处理-买家留言',
    path: '/order/after/message/record',
    mockPath: '/',
    params: {}
  },
  {
    name: 'afterEvaluateRecord',
    method: 'POST',
    desc: '客户售后处理-买家评价记录',
    path: '/order/after/evaluate/record',
    mockPath: '/',
    params: {}
  },
  {
    name: 'serviceList',
    method: 'POST',
    desc: '客服日志-获取列表',
    path: '/order/service/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'serviceRemove',
    method: 'POST',
    desc: '客服日志-删除',
    path: '/order/service/remove',
    mockPath: '/',
    params: {}
  },
  {
    name: 'orderLogList',
    method: 'POST',
    desc: '订单日志-列表',
    path: '/order/log/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'orderLogSave',
    method: 'POST',
    desc: '订单日志-添加',
    path: '/order/log/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'orderProfitList',
    method: 'POST',
    desc: '订单利润-获取',
    path: '/order/profit/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'orderProfitUpdate',
    method: 'POST',
    desc: '订单利润-批量更改采购价',
    path: '/order/profit/update',
    mockPath: '/',
    params: {}
  },

  {
    name: 'list',
    method: 'POST',
    desc: '订单-搜索',
    path: '/order/list',
    mockPath: '/order/list',
    params: {
      sortOrder: 'asc',
      pageSize: 10,
      pageNumber: 1,
      merchantId: 1
    }
  },
  {
    name: 'getPlatOrderCount',
    method: 'POST',
    desc: '订单-获取每个平台的订单数量',
    path: '/order/getPlatOrderCount',
    mockPath: '/order/getPlatOrderCount',
    params: {}
  },
  {
    name: 'getOrderSystemNumber',
    method: 'POST',
    desc: '订单-获取订单号',
    path: '/order/getOrderSystemNumber',
    mockPath: '/order/getOrderSystemNumber',
    params: {}
  },
  {
    name: 'create',
    method: 'POST',
    desc: '订单-添加订单',
    path: '/order/create',
    showSuccess: true,
    singleLoading: true,
    mockPath: '/order/create',
    params: {}
  },
  {
    name: 'update',
    method: 'POST',
    desc: '订单-修改订单',
    path: '/order/update',
    showSuccess: true,
    singleLoading: true,
    mockPath: '/order/update',
    params: {}
  },
  {
    name: 'getWarehouseList',
    method: 'POST',
    desc: '订单-获取仓库列表',
    path: '/warehouses/getWarehouseList',
    mockPath: '/warehouses/getWarehouseList',
    singleLoading: true,
    params: {
      type: 1 // 1 本地仓 2  海外仓
    }
  },
  {
    name: 'getConnection',
    method: 'POST',
    desc: '订单-获取关联产品',
    path: '/order/product/getConnection',
    mockPath: '/order/product/getConnection',
    singleLoading: true,
    params: {
      sortOrder: 'asc',
      pageSize: 10,
      pageNumber: 1
    }
  },
  {
    name: 'addConnection',
    method: 'POST',
    desc: '订单-添加关联产品',
    path: '/order/product/addConnection',
    // mockPath: '/order/product/addConnection',
    singleLoading: true,
    params: {
      storeProductIds: null
    }
  },
  {
    name: 'getCommonList',
    method: 'POST',
    desc: '订单-获取通用',
    path: '/common/getCommonList',
    mockPath: '/common/getCommonList',
    singleLoading: true,
    params: {
      storeProductIds: null
    }
  },
  {
    name: 'getTransportTypeList',
    method: 'POST',
    desc: '订单-获取运输方式',
    path: '/transportType/getTransportTypeList',
    mockPath: '/transportType/getTransportTypeList',
    singleLoading: true,
    params: {
      storeProductIds: null
    }
  },
  {
    name: 'getCountryList',
    method: 'POST',
    desc: '订单-获取国家列表',
    path: '/country/getCountryList',
    mockPath: '/country/getCountryList',
    singleLoading: true,
    params: {
      storeProductIds: null
    }
  },
  {
    name: 'stockAddressList',
    method: 'POST',
    desc: '收货地址-列表',
    path: '/stock/up/address/list',
    mockPath: '/stock/up/address/list',
    singleLoading: true,
    params: {
      sortOrder: 'asc',
      pageSize: 10,
      pageNumber: 1
    }
  },
  {
    name: 'stockAddressSave',
    method: 'POST',
    desc: '收货地址-添加',
    path: '/stock/up/address/save',
    mockPath: '/stock/up/address/save',
    singleLoading: true,
    params: {
      sortOrder: 'asc',
      pageSize: 10,
      pageNumber: 1
    }
  },
  {
    name: 'stockAddressInfo',
    method: 'POST',
    desc: '收货地址-详情',
    path: '/stock/up/address/info',
    mockPath: '/stock/up/address/info',
    singleLoading: true,
    params: {
      sortOrder: 'asc',
      pageSize: 10,
      pageNumber: 1
    }
  },
  {
    name: 'stockAddressUpdate',
    method: 'POST',
    desc: '收货地址-修改',
    path: '/stock/up/address/update',
    mockPath: '/stock/up/address/update',
    singleLoading: true,
    params: {
      sortOrder: 'asc',
      pageSize: 10,
      pageNumber: 1
    }
  },
  {
    name: 'stockAddressRemove',
    method: 'POST',
    desc: '收货地址-删除',
    path: '/stock/up/address/remove',
    mockPath: '/stock/up/address/remove',
    showSuccess: true,
    singleLoading: true,
    params: {}
  },

  {
    name: 'importDownloadTemplate',
    method: 'POST',
    desc: '批量导入-下载模板',
    path: '/order/import/downloadTemplate',
    mockPath: '/',
    params: {}
  },
  {
    name: 'orderImportList',
    method: 'POST',
    desc: '批量导入-导单日志',
    path: '/order/import/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'GetDeliveryModeList',
    method: 'POST',
    desc: '获取发货方式',
    path: '/deliveryMode/getDeliveryModeList',
    mockPath: '/',
    params: {}
  },
  {
    name: 'importDownload',
    method: 'POST',
    desc: '批量导入-下载处理报告',
    path: '/order/import/download',
    mockPath: '/',
    params: {}
  },
  {
    name: 'senderList',
    method: 'POST',
    desc: '寄件人地址-列表',
    path: '/sender/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'senderSave',
    method: 'POST',
    desc: '寄件人地址-保存',
    path: '/sender/save',
    showSuccess: true,
    mockPath: '/',
    params: {}
  },
  {
    name: 'senderInfo',
    method: 'POST',
    desc: '寄件人地址-详情',
    path: '/sender/info',
    mockPath: '/',
    params: {}
  },
  {
    name: 'senderUpdate',
    method: 'POST',
    desc: '寄件人地址-修改',
    path: '/sender/update',
    mockPath: '/',
    params: {}
  },
  {
    name: 'senderRemove',
    method: 'POST',
    desc: '寄件人地址-删除',
    path: '/sender/remove',
    mockPath: '/',
    params: {}
  },

  {
    name: 'strategyPriorityInfo',
    method: 'POST',
    desc: '优先策略/非优先策略-查看',
    path: '/order/strategy/priority/info',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyPrioritySave',
    method: 'POST',
    desc: '优先策略/非优先策略-保存',
    path: '/order/strategy/priority/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyGiftList',
    method: 'POST',
    desc: '礼品策略-列表',
    path: '/order/strategy/gift/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyGiftRemove',
    method: 'POST',
    desc: '礼品策略-删除',
    path: '/order/strategy/gift/remove',
    mockPath: '/',
    params: {}
  },

  {
    name: 'strategyExamineSave',
    method: 'POST',
    desc: '审核策略-保存',
    path: '/order/strategy/examine/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyExamineInfo',
    method: 'POST',
    desc: '审核策略-查看',
    path: '/order/strategy/examine/info',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyDeliveryList',
    method: 'POST',
    desc: '发货策略-列表',
    path: '/order/strategy/delivery/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyDeliverySave',
    method: 'POST',
    desc: '发货策略-添加',
    showSuccess: true,

    path: '/order/strategy/delivery/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyDeliveryInfo',
    method: 'POST',
    desc: '发货策略-详情',
    path: '/order/strategy/delivery/info',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyDeliveryUpdate',
    method: 'POST',
    desc: '发货策略-修改',
    showSuccess: true,
    path: '/order/strategy/delivery/update',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyDeliveryRemove',
    method: 'POST',
    desc: '发货策略-删除',
    path: '/order/strategy/delivery/remove',
    showSuccess: true,
    singleLoading: true,
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyDeliveryCopy',
    method: 'POST',
    desc: '发货策略-复制添加',
    path: '/order/strategy/delivery/copy',
    mockPath: '/',
    showSuccess: true,
    singleLoading: true,
    params: {}
  },
  {
    name: 'strategyDeliveryExecuteDelivery',
    method: 'POST',
    desc: '发货策略-执行策略（测试）',
    path: '/order/strategy/delivery/executeDelivery',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyDeliveryUseStrategy',
    method: 'POST',
    desc: '发货策略-查看应用策略订单',
    path: '/order/strategy/delivery/query/use/strategy',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyGiftSavey',
    method: 'POST',
    desc: '礼品策略-添加',
    showSuccess: true,
    path: '/order/strategy/gift/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyGiftCopy',
    method: 'POST',
    desc: '礼品策略-复制添加',
    showSuccess: true,
    path: '/order/strategy/gift/copy',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyGiftUpdate',
    method: 'POST',
    desc: '礼品策略-修改',
    showSuccess: true,
    path: '/order/strategy/gift/update',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyGiftInfo',
    method: 'POST',
    desc: '礼品策略-详情',
    path: '/order/strategy/gift/info',
    mockPath: '/',
    params: {}
  },
  {
    name: 'blacklistList',
    method: 'POST',
    desc: '黑名单-列表',
    path: '/blacklist/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'blacklistSave',
    method: 'POST',
    desc: '黑名单-增加',
    path: '/blacklist/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'blacklistUpdate',
    method: 'POST',
    desc: '黑名单-修改',
    path: '/blacklist/update',
    mockPath: '/',
    params: {}
  },
  {
    name: 'blacklistRemove',
    method: 'POST',
    desc: '黑名单-删除',
    path: '/blacklist/remove',
    mockPath: '/',
    params: {}
  },
  {
    name: 'blacklistInfo',
    method: 'POST',
    desc: '黑名单-详情',
    path: '/blacklist/info',
    mockPath: '/',
    params: {}
  },
  {
    name: 'blacklistBatchImport',
    method: 'POST',
    desc: '黑名单-批量导入',
    path: '/blacklist/batch/import',
    mockPath: '/',
    params: {}
  },
  {
    name: 'orderStrategyTaskSave',
    method: 'POST',
    desc: '发货策略时间-保存',
    path: '/order/strategy/task/save',
    mockPath: '/',
    showSuccess: true,
    params: {}
  },
  {
    name: 'orderStrategyTaskList',
    method: 'POST',
    desc: '发货策略时间-列表',
    path: '/order/strategy/task/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyPriorityExecutePriority',
    method: 'POST',
    desc: '订单-重新计算',
    path: '/order/strategy/priority/executePriority',
    showSuccess: true,
    // singleLoading: true,
    mockPath: '/',
    params: {}
  },
  {
    name: 'synchronousOrder',
    method: 'POST',
    showSuccess: true,
    desc: '订单-订单同步',
    path: '/order/synchronous/order',
    mockPath: '/',
    params: {}
  },
  {
    name: 'strategyDeliveryGetStrategyName',
    method: 'POST',
    desc: '发货策略-策略名称',
    path: '/order/strategy/delivery/getStrategyName',
    mockPath: '/',
    params: {}
  },
  {
    name: 'setPriority',
    method: 'POST',
    desc: '批量操作-设置优先级别',
    path: '/order/setPriority',
    mockPath: '/',
    params: {}
  },
  {
    name: 'updateDeliveryWarehouse',
    method: 'POST',
    desc: '批量操作-修改发货仓库',
    singleLoading: true,
    path: '/order/update/delivery/warehouse',
    mockPath: '/',
    params: {}
  },
  {
    name: 'turnFbaDelivery',
    method: 'POST',
    desc: '批量操作-中国仓订单转fba发货',
    singleLoading: true,
    path: '/order/turn/fba/delivery',
    mockPath: '/',
    params: {}
  },
  {
    name: 'updateTransport',
    method: 'POST',
    desc: '批量操作-修改运输方式',
    singleLoading: true,
    path: '/order/update/transport',
    mockPath: '/',
    params: {}
  },
  {
    name: 'updateDelayDelivery',
    method: 'POST',
    desc: '批量操作-修改延迟发货原因',
    singleLoading: true,
    path: '/order/update/delay/delivery',
    mockPath: '/',
    params: {}
  },
  {
    name: 'getSku',
    method: 'POST',
    desc: '批量操作-提取sku',
    singleLoading: true,
    path: '/order/getSku',
    mockPath: '/',
    params: {}
  },
  {
    name: 'getOrderNumber',
    method: 'POST',
    desc: '批量操作-提取订单号',
    singleLoading: true,
    path: '/order/getOrderNumber',
    mockPath: '/',
    params: {}
  },
  {
    name: 'getMyTemplate',
    method: 'POST',
    desc: '获取自定义导出模板列表',
    singleLoading: true,
    path: '/global/template/getMyTemplate',
    mockPath: '/',
    params: {}
  },
  {
    name: 'globalTemplateRemove',
    method: 'POST',
    desc: '模板-删除',
    singleLoading: true,
    path: '/global/template/remove',
    mockPath: '/',
    params: {}
  },
  {
    name: 'globalTemplateInfo',
    method: 'POST',
    desc: '模板-选中',
    singleLoading: true,
    path: '/global/template/info',
    mockPath: '/',
    params: {}
  },
  {
    name: 'exportOrder',
    method: 'POST',
    desc: '批量导出-自定义导出/当前条件导出',
    singleLoading: true,
    path: '/order/export/order',
    mockPath: '/',
    params: {}
  },
  {
    name: 'exportOrderProduct',
    method: 'POST',
    desc: '批量导出-当前条件导出订单产品',
    // singleLoading: true,
    path: '/order/export/order/product',
    mockPath: '/',
    params: {}
  },
  {
    name: 'exportUnrelatedStore',
    method: 'POST',
    desc: '批量导出-导出未关联店铺sku',
    // singleLoading: true,
    path: '/order/export/unrelated/store',
    mockPath: '/',
    params: {}
  },
  {
    name: 'exportPackageTrackNumber',
    method: 'POST',
    desc: '批量导出-导出包裹追踪号',
    // singleLoading: true,
    path: '/order/export/package/track/number',
    mockPath: '/',
    params: {}
  },
  {
    name: 'exportPurchaseDelay',
    method: 'POST',
    desc: '批量导出-sku采购延迟导出统计',
    // singleLoading: true,
    path: '/order/export/purchase/delay',
    mockPath: '/',
    params: {}
  },
  {
    name: 'exportProfit',
    method: 'POST',
    desc: '批量导出-导出订单利润',
    // singleLoading: true,
    path: '/order/export/order/profit',
    mockPath: '/',
    params: {}
  },
  {
    name: 'productGetOrderPrice',
    method: 'POST',
    desc: '批量导出-计算总金额',
    singleLoading: true,
    path: '/order/product/getOrderPrice',
    mockPath: '/',
    params: {}
  },
  {
    name: 'exportOrderProductProfit',
    method: 'POST',
    desc: '批量导出-导出订单产品利润',
    // singleLoading: true,
    path: '/order/export/order/product/profit',
    mockPath: '/',
    params: {}
  },
  {
    name: 'globalTemplateGetSystemList',
    method: 'POST',
    desc: '模板-获取列表模板',
    // singleLoading: true,
    path: '/global/template/getSystemList',
    mockPath: '/',
    params: {}
  },
  {
    name: 'importUpload',
    method: 'POST',
    desc: '批量导入-导入',
    singleLoading: true,
    path: '/order/import/upload',
    mockPath: '/',
    type: 'formdata',
    params: {}
  },
  {
    name: 'returnSave',
    method: 'POST',
    desc: '退换货-添加信息',
    singleLoading: true,
    path: '/order/return/save',
    mockPath: '/',
    type: 'formdata',
    params: {}
  },
  {
    name: 'getListCount',
    method: 'POST',
    desc: '订单-订单列表统计',
    singleLoading: true,
    path: '/order/getListCount',
    mockPath: '/',
    params: {}
  },
  {
    name: 'globalTemplateSave',
    method: 'POST',
    desc: '模板-添加模板',
    singleLoading: true,
    showSuccess: true,
    path: '/global/template/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'tuneUp',
    method: 'POST',
    desc: '批量操作-选中订单调库生单',
    // singleLoading: true,
    showSuccess: true,
    path: '/order/tune/up',
    mockPath: '/',
    params: {}
  },
  {
    name: 'productDownloadTemplate',
    method: 'POST',
    desc: '订单-下载模板',
    singleLoading: true,
    showSuccess: true,
    path: '/order/product/downloadTemplate',
    mockPath: '/',
    params: {}
  },
  {
    name: 'productImportConnection',
    method: 'POST',
    desc: '订单-导入关联产品',
    type: 'formdata',
    singleLoading: true,
    // showSuccess: true,
    path: '/order/product/importConnection',
    mockPath: '/',
    params: {}
  },
  {
    name: 'inventoryExamine',
    method: 'POST',
    desc: '审核',
    showSuccess: true,
    path: '/order/inventory/examine',
    mockPath: '/',
    params: {}
  },
  {
    name: 'abolish',
    method: 'POST',
    desc: '取消订单作废状态',
    showSuccess: true,
    path: '/order/abolish',
    mockPath: '/',
    params: {}
  },
  {
    name: 'inventoryCheck',
    method: 'POST',
    desc: '检测亚马逊分仓',
    // showSuccess: true,
    path: '/order/inventory/check',
    mockPath: '/',
    params: {}
  },
  {
    name: 'inventoryCreate',
    method: 'POST',
    desc: '创建亚马逊分仓',
    showSuccess: true,
    path: '/order/inventory/create',
    mockPath: '/',
    params: {}
  },
  {
    name: 'getPrintData',
    method: 'POST',
    desc: '订单-打印订单',
    path: '/order/getPrintData',
    mockPath: '/',
    params: {}
  },
  {
    name: 'createReasonList',
    method: 'POST',
    desc: '新增订单原因-列表',
    path: '/order/create/reason/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'createReasonRemove',
    method: 'POST',
    desc: '新增订单原因-删除',
    path: '/order/create/reason/remove',
    mockPath: '/',
    params: {}
  },
  {
    name: 'createReasonSave',
    method: 'POST',
    desc: '新增订单原因-添加',
    path: '/order/create/reason/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'createReasonUpdate',
    method: 'POST',
    desc: '新增订单原因修改',
    path: '/order/create/reason/update',
    mockPath: '/',
    params: {}
  },
  {
    name: 'createReasonGetOrderTypeList',
    method: 'POST',
    desc: '新增订单原因-列表不分页',
    path: '/order/create/reason/getOrderTypeList',
    mockPath: '/',
    params: {}
  },
  {
    name: 'orderRefundBatchSave',
    method: 'POST',
    desc: '批量退款',
    path: '/order/refund/batchSave',
    mockPath: '/',
    params: {}
  },
  {
    name: 'productGetPurchaseing',
    method: 'POST',
    desc: '订单-根据订单产品id获取采购记录',
    path: '/order/product/getPurchaseing',
    mockPath: '/',
    params: {}
  },
  {
    name: 'refundDetail',
    method: 'POST',
    desc: '订单-查看退款详情',
    path: '/order/refund/detail',
    params: {}
  },
  {
    name: 'refundCancel',
    method: 'POST',
    desc: '订单-取消退款',
    path: '/order/refund/cancel',
    singleLoading: true,
    showSuccess: true,
    params: {}
  },
  {
    name: 'issueList',
    method: 'POST',
    desc: '客服问题-列表',
    path: '/customer/issue/list',
    params: {}
  }
]
