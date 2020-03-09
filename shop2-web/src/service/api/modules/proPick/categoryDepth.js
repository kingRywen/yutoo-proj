export default [
  {
    name: "categoryDepthTaskMerchantSave",
    method: "POST",
    desc: "添加任务",
    showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/save",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantBatchSave",
    method: "POST",
    desc: "批量添加任务",
    newShowSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/batchSave",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantList",
    method: "POST",
    desc: "任务列表",
    path: "/categoryDepthTaskMerchant/list",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantRemove",
    method: "POST",
    desc: "删除",
    newShowSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/remove",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantReCrawl",
    method: "POST",
    desc: "重新抓取",
    newShowSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/reCrawl",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantProductDetails",
    method: "POST",
    desc: "产品列表",
    // showSuccess: true,
    // singleLoading: true,
    path: "/categoryDepthTaskMerchant/productDetails",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantProductDetailsExport",
    method: "POST",
    desc: "产品列表-导出",
    config: {
      responseType: "blob"
    },
    showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/productDetailsExport",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantSetSameStyle",
    method: "POST",
    desc: "设置同款(移到其他款)",
    showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/setSameStyle",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantStyleList",
    method: "POST",
    desc: "款式列表",
    must: ["merchantTaskId"],
    // showSuccess: true,
    // singleLoading: true,
    path: "/categoryDepthTaskMerchant/styleList",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantSetGroup",
    method: "POST",
    desc: "移动分组",
    showSuccess: true,
    must: ["merchantTaskId", "groupIds"],
    // singleLoading: true,
    path: "/categoryDepthTaskMerchant/setGroup",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantGroupList",
    method: "POST",
    desc: "分组列表",
    must: ["merchantTaskId"],
    // showSuccess: true,
    // singleLoading: true,
    path: "/categoryDepthTaskMerchant/groupList",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantUpdateGroupName",
    method: "POST",
    desc: "编辑分组名称",
    showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/updateGroupName",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantSameStyleProductList",
    method: "POST",
    desc: "同款产品列表",
    // showSuccess: true,
    // singleLoading: true,
    path: "/categoryDepthTaskMerchant/sameStyleProductList",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantSameStyleProductListExport",
    method: "POST",
    desc: "同款产品列表-导出",
    config: {
      responseType: "blob"
    },
    showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/sameStyleProductListExport",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantListToBsrByProduct",
    method: "POST",
    desc: "产品Bsr排名",
    // showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/listToBsrByProduct",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantListToNewReviewCntByProduct",
    method: "POST",
    desc: "产品新增评价数",
    // showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/listToNewReviewCntByProduct",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantListToBuyBoxSellerByProduct",
    method: "POST",
    desc: "产品跟卖卖家列表",
    // showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/listToBuyBoxSellerByProduct",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantSetProductMainStyle",
    method: "POST",
    desc: "设置产品主款",
    showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/setProductMainStyle",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantSetAloneProduct",
    method: "POST",
    desc: "设置独立产品",
    showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/setAloneProduct",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantRemoveProductAttr",
    method: "POST",
    desc: "清空属性值",
    showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/removeProductAttr",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantSaveProductAttr",
    method: "POST",
    desc: "添加/编辑属性值",
    showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/saveProductAttr",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantSellerDetails",
    method: "POST",
    desc: "卖家列表",
    // showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/sellerDetails",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantSellerDetailsExport",
    method: "POST",
    config: {
      responseType: "blob"
    },
    desc: "卖家列表-导出",
    showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/sellerDetailsExport",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantProductStat",
    method: "POST",
    desc: "统计分析-产品统计",
    // showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/productStat",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantGetProductStatPrice",
    method: "POST",
    desc: "统计分析-获取产品统计价格区间",
    // showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/getProductStatPrice",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantSaveProductStatPrice",
    method: "POST",
    desc: "统计分析-保存产品统计价格区间",
    showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/saveProductStatPrice",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantProductAttrStat",
    method: "POST",
    desc: "统计分析-属性统计",
    // showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/productAttrStat",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantProductAttrAnalysis",
    method: "POST",
    desc: "属性分析",
    // showSuccess: true,
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/productAttrAnalysis",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantProductAttrList",
    method: "POST",
    desc: "属性值列表",
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/productAttrList",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantAttrList",
    method: "POST",
    desc: "属性管理-属性列表",
    // singleLoading: true,
    path: "/categoryDepthTaskMerchant/attrList",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantRemoveAttr",
    method: "POST",
    desc: "属性管理-删除属性",
    // singleLoading: true,
    path: "/categoryDepthTaskMerchant/removeAttr",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantSaveAttr",
    method: "POST",
    desc: "属性管理-添加属性",
    // singleLoading: true,
    path: "/categoryDepthTaskMerchant/saveAttr",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantListToNewFeedbackCntBySeller",
    method: "POST",
    desc: "卖家feedback数曲线",
    singleLoading: true,
    path: "/categoryDepthTaskMerchant/listToNewFeedbackCntBySeller",
    mock: false
  },
  {
    name: "categoryDepthTaskMerchantProductAttrExport",
    method: "POST",
    desc: "属性值-导出",
    singleLoading: true,
    config: {
      responseType: "blob"
    },
    showSuccess: true,
    path: "/categoryDepthTaskMerchant/productAttrExport",
    mock: false
  }
];
