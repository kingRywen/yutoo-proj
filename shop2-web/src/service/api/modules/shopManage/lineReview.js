export default [
  {
    name: "productReviewRequestList",
    method: "POST",
    desc: "列表",
    path: "/productReviewRequest/list",
    mock: true
  },
  {
    name: "sellerConfigInfo",
    method: "POST",
    desc: "获取自动索评状态",
    path: "/sellerConfig/info",
    mock: true
  },
  {
    name: "sellerConfigUpdate",
    method: "POST",
    desc: "开启关闭自动索评",
    path: "/sellerConfig/update",
    showSuccess: true,
    mock: true
  },
  {
    name: "productReviewRequestSendReviewRequest",
    method: "POST",
    desc: "索评",
    path: "/productReviewRequest/sendReviewRequest",
    newShowSuccess: true,
    mock: true
  },
  {
    name: "productReviewRequestExport",
    method: "POST",
    desc: "导出",
    path: "/productReviewRequest/export",
    showSuccess: true,
    config: {
      responseType: "blob"
    },
    mock: true
  }
];
