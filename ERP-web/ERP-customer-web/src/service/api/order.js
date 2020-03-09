import bargain from 'Views/Ebay/bargain/api.js'
import changingAddAdress from 'Views/Ebay/changing/addAdress/api.js'
export default [
  {
    name: 'setUrgentState',
    method: 'POST',
    desc: '加急',
    path: '/order/setUrgentState',
    params: {}
  },
  {
    name: 'getTransportTypeList',
    method: 'POST',
    desc: '获取运输方式',
    path: '/transportType/getTransportTypeList',
    params: {}
  },
  {
    name: 'getCountryList',
    method: 'POST',
    desc: '获取国家列表',
    path: '/country/getCountryList',
    params: {}
  },
  {
    name: 'orderInfo',
    method: 'POST',
    desc: '订单详情',
    path: '/order/info',
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
    name: 'getOrderIdByNumber',
    method: 'POST',
    desc: '根据订单号获取订单ID',
    path: '/order/getOrderIdByNumber',
    params: {}
  },
  {
    name: 'returnInfo',
    method: 'POST',
    desc: '根据订单ID获取信息',
    path: '/order/return/info',
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
    name: 'issueList',
    method: 'POST',
    desc: '客服问题-列表',
    path: '/customer/issue/list',
    params: {}
  },
  {
    name: 'issueSave',
    method: 'POST',
    desc: '客服问题-添加',
    path: '/customer/issue/save',
    params: {}
  },
  {
    name: 'issueRemove',
    method: 'POST',
    desc: '客服问题-删除',
    path: '/customer/issue/remove',
    params: {}
  },
  {
    name: 'issueInfo',
    method: 'POST',
    desc: '客服问题-查询',
    path: '/customer/issue/info',
    params: {}
  },
  {
    name: 'issueUpdate',
    method: 'POST',
    desc: '客服问题-修改',
    path: '/customer/issue/update',
    params: {}
  },
  {
    name: 'getFilePath',
    method: 'POST',
    desc: '客服售后记录-添加附件oss',
    path: '/order/service/getFilePath',
    params: {}
  },
  {
    name: 'serviceRemove',
    method: 'POST',
    desc: '客服日志-删除',
    path: '/order/service/remove',
    params: {}
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
    name: 'refundGetReasonList',
    method: 'POST',
    desc: '获取平台退款原因',
    path: '/order/refund/platform/reason/list',
    params: {}
  },
  {
    name: 'refundInfo',
    method: 'POST',
    desc: '退款-获取退款信息',
    path: '/order/refund/info',
    params: {}
  },
  {
    name: 'refundSave',
    method: 'POST',
    desc: '退款-添加退款信息',
    path: '/order/refund/save',
    params: {}
  },
  {
    name: 'orderAbolish',
    method: 'POST',
    desc: '取消订单作废状态',
    path: '/order/abolish',
    params: {}
  },
  {
    name: 'orderSetOrderState',
    method: 'POST',
    desc: '设置订单状态（作废，正常...）',
    path: '/order/setOrderState',
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
    name: 'userListGetUserList',
    method: 'POST',
    desc: '获取用户列表(所有操作人員)',
    path: '/user/list/getUserList',
    mockPath: '/',
    params: {}
  },
  {
    name: 'getUserList',
    method: 'POST',
    desc: '销售人员列表',
    path: '/user/list/getUserList',
    mockPath: '/user/list/getUserList',
    params: {}
  },
  // 议价
  ...bargain,
  ...changingAddAdress
]
