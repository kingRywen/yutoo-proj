export default [
  {
    name: "keywordLibSaveCategory",
    method: "POST",
    desc: "类目词库-添加类目",
    must: ["categoryName"],
    mock: false,
    path: "/keywordLib/saveCategory",
    showSuccess: true
  },
  {
    mock: false,
    name: "keywordLibImportIndicator",
    method: "POST",
    must: ["relatedId", "categoryFlag"],
    desc: "导入关键词指标数据",
    path: "/keywordLib/importIndicator",
    showSuccess: true
  },
  {
    mock: false,
    name: "keywordLibUpdateCategory",
    method: "POST",
    desc: "类目词库-编辑类目",
    must: ["categoryId", "categoryName"],
    path: "/keywordLib/updateCategory",
    showSuccess: true
  },
  {
    mock: false,
    name: "keywordLibRemoveCategory",
    method: "POST",
    desc: "类目词库-删除类目",
    must: ["categoryId"],
    path: "/keywordLib/removeCategory",
    showSuccess: true
  },
  {
    mock: false,
    name: "keywordLibCategoryList",
    method: "POST",
    desc: "类目词库-类目列表",
    path: "/keywordLib/categoryList"
  },
  {
    mock: false,
    name: "keywordLibSaveProduct",
    method: "POST",
    desc: "产品词库-添加产品",
    must: ["categoryId", "productName"],
    path: "/keywordLib/saveProduct",
    showSuccess: true
  },
  {
    mock: false,
    name: "keywordLibUpdateProduct",
    method: "POST",
    must: ["categoryId", "productName"],
    desc: "产品词库-编辑产品",
    path: "/keywordLib/updateProduct",
    showSuccess: true
  },
  {
    mock: false,
    name: "keywordLibRemoveProduct",
    method: "POST",
    must: ["productIds"],
    desc: "产品词库-删除产品",
    path: "/keywordLib/removeProduct",
    newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibProductList",
    method: "POST",
    must: ["categoryId"],
    desc: "产品词库-产品列表",
    path: "/keywordLib/productList"
  },

  {
    mock: false,
    name: "keywordLibRootSave",
    method: "POST",
    must: ["categoryId", "rootType", "rootTexts"],
    desc: "词根-添加",
    newShowSuccess: true,
    path: "/keywordLibRoot/save"
  },
  {
    mock: false,
    name: "keywordLibRootRemove",
    method: "POST",
    newShowSuccess: true,
    must: ["categoryId", "rootIds"],
    desc: "词根-删除",
    path: "/keywordLibRoot/remove"
  },
  {
    mock: false,
    newShowSuccess: true,
    name: "keywordLibRootUpdate",
    method: "POST",
    must: ["categoryId", "rootIds", "rootType"],
    desc: "词根-更改类型",
    path: "/keywordLibRoot/update"
  },
  {
    mock: false,
    name: "keywordLibRootList",
    method: "POST",
    must: ["categoryId"],
    desc: "词根-列表",
    path: "/keywordLibRoot/list"
  },
  {
    mock: false,
    name: "keywordLibNegativeSave",
    method: "POST",
    must: ["categoryId", "negativeType", "negativeTexts"],
    desc: "否定词-添加",
    newShowSuccess: true,
    path: "/keywordLibNegative/save"
  },
  {
    mock: false,
    name: "keywordLibNegativeRemove",
    method: "POST",
    must: ["categoryId", "negativeTexts"],
    desc: "否定词-删除",
    newShowSuccess: true,
    singleLoading: true,
    path: "/keywordLibNegative/remove"
  },
  {
    mock: false,
    name: "keywordLibNegativeList",
    method: "POST",
    must: ["relatedId", "categoryFlag"],
    desc: "否定词-列表",
    path: "/keywordLibNegative/list"
  },

  {
    mock: false,
    name: "keywordLibBrandSave",
    method: "POST",
    desc: "品牌词-添加",
    must: ["brandType", "brandNames", "categoryId"],
    path: "/keywordLibBrand/save",
    newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibBrandUpdate",
    method: "POST",
    desc: "品牌词-更改品牌类型",
    must: ["brandType", "brandIds", "categoryId"],
    path: "/keywordLibBrand/update",
    singleLoading: true,
    newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibBrandRemove",
    method: "POST",
    desc: "品牌词-删除",
    singleLoading: true,
    must: ["brandIds", "categoryId"],
    path: "/keywordLibBrand/remove",
    newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibBrandList",
    method: "POST",
    desc: "品牌词-列表",
    must: ["categoryId"],
    path: "/keywordLibBrand/list"
  },
  {
    mock: false,
    name: "keywordLibClassifySave",
    method: "POST",
    desc: "分类属性-添加",
    must: ["categoryId", "classifyName", "keywordTexts"],
    path: "/keywordLibClassify/save",
    newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibClassifySaveKeywordText",
    method: "POST",
    desc: "分类属性-添加关键词",
    must: ["categoryId", "keywordTexts", "classifyId"],
    path: "/keywordLibClassify/saveKeywordText",
    newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibClassifyUpdate",
    method: "POST",
    desc: "分类属性-编辑分类属性名称",
    must: ["categoryId", "classifyName", "classifyId"],
    path: "/keywordLibClassify/update"
    // newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibClassifyImport",
    method: "POST",
    must: ["categoryId"],
    desc: "分类属性-导入",
    singleLoading: true,
    path: "/keywordLibClassify/import",
    showSuccess: true
  },
  {
    mock: false,
    name: "keywordLibClassifyRemove",
    method: "POST",
    desc: "分类属性-删除",
    singleLoading: true,
    must: ["categoryId", "classifyIds"],
    path: "/keywordLibClassify/remove",
    newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibClassifyList",
    method: "POST",
    desc: "分类属性-列表",
    must: ["categoryId"],
    path: "/keywordLibClassify/list"
  },
  {
    mock: false,
    name: "keywordLibClassifyRemoveKeywordText",
    method: "POST",
    desc: "分类属性-删除关键词",
    must: ["classifyTextIds", "categoryId", "classifyId"],
    path: "/keywordLibClassify/removeKeywordText",
    newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibClassifyKeywordList",
    method: "POST",
    must: ["categoryId", "classifyId"],
    desc: "分类属性-关键词列表",
    path: "/keywordLibClassify/keywordList"
  },
  {
    mock: false,
    name: "keywordLibSaveKeyword",
    method: "POST",
    desc: "添加关键词",
    must: ["relatedId", "origin", "keywordTexts"],
    path: "/keywordLib/saveKeyword",
    newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibMoveKeyword",
    method: "POST",
    desc: "移动关键词",
    must: ["relatedId", "movedKeywordType", "categoryFlag"],
    path: "/keywordLib/moveKeyword",
    newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibRemoveKeyword",
    method: "POST",
    desc: "删除关键词",
    must: ["keywordIds"],
    path: "/keywordLib/removeKeyword",
    newShowSuccess: true
  },
  {
    mock: false,
    name: "keywordLibImportKeyword",
    method: "POST",
    desc: "未筛选词列表导入关键词",
    must: ["relatedId", "origin"],
    path: "/keywordLib/importKeyword",
    showSuccess: true
  },
  {
    mock: false,
    name: "keywordLibUnDisposedList",
    method: "POST",
    must: ["categoryId"],
    desc: "未筛选关键词列表",
    path: "/keywordLib/unDisposedList"
  },
  {
    mock: false,
    name: "keywordLibFilterKeyword",
    method: "POST",
    desc: "筛选关键词",
    must: ["categoryId", "keywordId"],
    path: "/keywordLib/filterKeyword",
    showSuccess: true
  },
  {
    mock: false,
    name: "keywordLibRevokeKeyword",
    method: "POST",
    desc: "撤销关键词",
    must: ["categoryId", "keywordId"],
    path: "/keywordLib/revokeKeyword",
    showSuccess: true
  },
  {
    mock: false,
    name: "keywordLibRelatedKeywordList",
    method: "POST",
    must: ["relatedId", "categoryFlag"],
    desc: "相关词列表",
    path: "/keywordLib/relatedKeywordList"
  },
  {
    mock: false,
    name: "keywordLibUnScreenedList",
    method: "POST",
    desc: "待筛选关键词列表",
    must: ["categoryId"],
    path: "/keywordLib/unScreenedList"
  },
  {
    mock: false,
    name: "keywordLibScreenedList",
    method: "POST",
    desc: "已筛选关键词列表",
    must: ["categoryId"],
    path: "/keywordLib/screenedList"
  },
  {
    mock: false,
    name: "keywordLibClassifySaveByProduct",
    method: "POST",
    showSuccess: true,
    desc: "分类属性-产品词库添加分类属性",
    must: ["categoryId"],
    path: "/keywordLibClassify/saveByProduct"
  }
];
