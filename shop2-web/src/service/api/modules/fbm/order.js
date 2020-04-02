export default [
  {
    path: "fbm-order/order/fulfillment-import",
    name: "fbm-orderOrderFulfillment-import",
    method: "POST",
    showSuccess: true,
    type: "formdata",
    desc: "下载发货模板 - 导入模板发货"
  },
  {
    path: "fbm-order/order/edit",
    name: "fbm-orderOrderEdit",
    method: "POST",
    showSuccess: true,
    desc: "下载发货模板 - 修改订单状态"
  },
  {
    path: "fbm-order/order/fulfillment-template",
    name: "fbm-orderOrderFulfillment-template",
    method: "POST",
    showSuccess: true,
    config: {
      responseType: "blob"
    },
    desc: "下载发货模板 - 下载发货模板"
  },
  {
    path: "fbm-order/order/items",
    name: "fbm-orderOrderItems",
    method: "POST",
    desc: "下载发货模板 - 查询订单商品"
  },
  {
    path: "fbm-order/order/export",
    name: "fbm-orderOrderExport",
    method: "POST",
    config: {
      responseType: "blob"
    },
    desc: "下载发货模板 - 导出订单",
    showSuccess: true
  },
  {
    path: "fbm-order/order/page",
    name: "fbm-orderOrderPage",
    method: "POST",
    desc: "下载发货模板 - 查询订单"
  },
  {
    path: "fbm-order/order/adjustment",
    name: "fbm-orderOrderAdjustment",
    method: "POST",
    showSuccess: true,
    desc: "下载发货模板 - 订单退款"
  },
  {
    path: "fbm-order/order/syn",
    name: "fbm-orderOrderSyn",
    method: "POST",
    showSuccess: true,
    singleLoading: true,
    desc: "下载发货模板 - 同步订单"
  },
  {
    path: "fbm-order/order/fulfillment",
    name: "fbm-orderOrderFulfillment",
    method: "POST",
    showSuccess: true,
    desc: "下载发货模板 - 订单发货/修改运单"
  },
  {
    path: "fbm-order/order/logistics-template-ebo",
    name: "fbm-orderOrderLogistics-template-ebo",
    method: "POST",
    config: {
      responseType: "blob"
    },
    desc: "FBM订单管理 - 导出EBO模板",
    showSuccess: true
  },
  {
    path: "fbm-order/order/fulfillment-text",
    name: "fbm-orderOrderFulfillment-text",
    method: "POST",
    showSuccess: true,
    desc: "FBM订单管理 - 填写文本发货"
  }
  // {
  //   path: "fbm-order/order/syn",
  //   name: "fbm-orderOrderSyn",
  //   method: "POST",
  //   desc: "FBM订单管理 - 主动同步订单",
  //   // mock: true
  // }
];
