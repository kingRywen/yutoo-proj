export default [
  {
    name: "categoryTaskMerchantSave",
    method: "POST",
    desc: "添加任务",
    showSuccess: true,
    path: "/categoryTaskMerchant/save",
    mock: false
  },
  {
    name: "categoryTaskMerchantList",
    method: "POST",
    desc: "任务列表",
    path: "/categoryTaskMerchant/list",
    mock: false
  },
  {
    name: "categoryTaskMerchantRemove",
    method: "POST",
    desc: "删除",
    newShowSuccess: true,
    singleLoading: true,
    path: "/categoryTaskMerchant/remove",
    mock: false
  },
  {
    name: "categoryTaskMerchantDetails",
    method: "POST",
    desc: "数据详情列表",
    path: "/categoryTaskMerchant/details",
    mock: false
  },
  {
    name: "categoryTaskMerchantDetailsExport",
    method: "POST",
    desc: "数据详情列表-导出",
    config: {
      responseType: "blob"
    },
    singleLoading: true,
    showSuccess: true,
    path: "/categoryTaskMerchant/detailsExport",
    mock: false
  },
  {
    name: "categoryTaskMerchantHideCate",
    method: "POST",
    desc: "隐藏类目",
    showSuccess: true,
    path: "/categoryTaskMerchant/hideCate",
    mock: false
  },
  {
    name: "categoryTaskMerchantNoHideCate",
    method: "POST",
    desc: "显示类目",
    showSuccess: true,
    path: "/categoryTaskMerchant/noHideCate",
    mock: false
  },
  {
    name: "listToNewReviewCntByCate",
    method: "POST",
    desc: "类目新增评价数",
    path: "/categoryTaskMerchant/listToNewReviewCntByCate",
    mock: false
  },
  {
    name: "listToNewReviewCntByProduct",
    method: "POST",
    desc: "产品新增评价数",
    path: "/categoryTaskMerchant/listToNewReviewCntByProduct",
    mock: false
  },
  {
    name: "listToBsrByProduct",
    method: "POST",
    desc: "产品Bsr排名",
    path: "/categoryTaskMerchant/listToBsrByProduct",
    mock: false
  }
];
