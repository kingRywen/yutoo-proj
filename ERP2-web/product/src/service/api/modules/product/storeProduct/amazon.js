export default [
  {
    name: 'prProductSellerAmzMove',
    method: 'POST',
    desc: '移动变体-移动',
    showSuccess: true,
    path: '/prProductSellerAmz/move',
    params: {}
  },
  {
    name: 'prProductSellerChangeAmzListForChild',
    method: 'POST',
    desc: '商品信息变动-子产品问题列表',
    path: '/prProductSellerChangeAmz/listForChild',
    params: {}
  },
  {
    name: 'prProductSellerChangeAmzListForParent',
    method: 'POST',
    desc: '商品信息变动-父产品问题列表',
    path: '/prProductSellerChangeAmz/listForParent',
    params: {}
  },
  {
    name: 'prProductSellerImproveAmzListCount',
    method: 'POST',
    desc: '商品信息待改善/禁止显示-table页数量',
    path: '/prProductSellerImproveAmz/listCount',
    params: {}
  },
  {
    name: 'prProductSellerChangeAmzListCount',
    method: 'POST',
    desc: '商品信息变动-table页数量',
    path: '/prProductSellerChangeAmz/listCount',
    params: {}
  },
  {
    name: 'prProductSellerAmzSaveSellProduct',
    method: 'POST',
    desc: '店铺产品-添加跟卖产品',
    showSuccess: true,
    path: '/prProductSellerAmz/saveSellProduct',
    params: {}
  },
  {
    name: 'prProductSellerAmzChangeDelivery',
    method: 'POST',
    desc: '店铺产品-切换配送方式',
    showSuccess: true,
    path: '/prProductSellerAmz/changeDelivery',
    params: {}
  },
  {
    name: 'prProductSellerImproveAmzList',
    method: 'POST',
    desc: '商品信息待改善/禁止显示-列表',
    path: '/prProductSellerImproveAmz/list',
    params: {}
  },
  {
    name: 'prProductSellerMoveRecordAmzList',
    method: 'POST',
    desc: '移动日志-列表',
    path: '/prProductSellerMoveRecordAmz/list',
    params: {}
  },
  {
    name: 'prProductSellerMoveRecordAmzDownloadErrorLog',
    method: 'POST',
    desc: '移动日志-下载错误报告',
    path: '/prProductSellerMoveRecordAmz/downloadErrorLog',
    params: {}
  },
  {
    name: 'prProductSellerAmzList',
    method: 'POST',
    desc: '店铺产品-列表',
    path: '/prProductSellerAmz/list',
    params: {}
  },
  {
    name: 'prProductSellerAmzAudit',
    method: 'POST',
    desc: '店铺产品-审核',
    showSuccess: true,
    path: '/prProductSellerAmz/audit',
    params: {}
  },
  {
    name: 'prProductSellerAmzRemove',
    method: 'POST',
    desc: '店铺产品-删除',
    showSuccess: true,
    path: '/prProductSellerAmz/remove',
    params: {}
  },
  {
    name: 'prProductSellerAmzRelateSku',
    method: 'POST',
    desc: '店铺产品-关联SKU',
    showSuccess: true,
    path: '/prProductSellerAmz/relateSku',
    params: {}
  },
  {
    name: 'prProductSellerAmzShelf',
    method: 'POST',
    desc: '店铺产品-上架/下架',
    showSuccess: true,
    path: '/prProductSellerAmz/shelf',
    params: {}
  },
  {
    name: 'prProductSellerAmzListCount',
    method: 'POST',
    desc: '店铺产品-table页数量',
    path: '/prProductSellerAmz/listCount',
    params: {}
  },
  {
    name: 'prProductSellerAmzUpdateQuantity',
    method: 'POST',
    desc: '店铺产品-更新库存(全局)',
    path: '/prProductSellerAmz/updateQuantity',
    params: {}
  },
  {
    name: 'prProductSellerAmzUpdateQuantityStatus',
    method: 'POST',
    desc: '店铺产品-库存更新状态',
    path: '/prProductSellerAmz/updateQuantityStatus',
    noShowDefaultError: true,
    params: {}
  },
  {
    name: 'prProductSellerChangeAmzList',
    method: 'POST',
    desc: '商品信息变动-列表',
    path: '/prProductSellerChangeAmz/list',
    params: {}
  },
  {
    name: 'prProductSellerAmzAuditInfo',
    method: 'POST',
    desc: '商品信息变动-查看审核报告',
    path: '/prProductSellerAmz/auditInfo',
    params: {}
  },
  {
    name: 'storeProductListStore',
    method: 'POST',
    desc: '新增店铺产品店铺下拉',
    path: '/storeProduct/listStore',
    params: {}
  },
  {
    name: 'storeProductAddToSell',
    method: 'POST',
    desc: '新增跟卖', showSuccess: true,
    path: '/storeProduct/addToSell',
    params: {}
  },
  {
    name: 'storeProductInfo',
    method: 'POST',
    desc: '亚马逊新增/编辑店铺产品请求详情页接口',
    path: '/storeProduct/info',
    params: {}
  },
  {
    name: 'storeProductSave',
    method: 'POST',
    desc: '亚马逊店铺产品编辑保存/提交', showSuccess: true,
    path: '/storeProduct/save',
    params: {}
  },
  {
    name: 'storeProductCustomPropertys',
    method: 'POST',
    desc: '亚马逊/eBay自定义导出选择属性列表也请求',
    path: '/storeProduct/customPropertys',
    params: {}
  },
  {
    name: 'storeProductExport',
    method: 'POST',
    desc: '导出', showSuccess: true,
    path: '/storeProduct/export',
    params: {}
  },
  {
    name: 'storeProductSaveBatch',
    method: 'POST',
    desc: '批量新增产品', showSuccess: true,
    path: '/storeProduct/saveBatch',
    params: {}
  },
  {
    name: 'repoProductVariant',
    method: 'POST',
    desc: '店铺产品新增生成变体',
    path: '/repoProduct/variant',
    params: {}
  },
  {
    name: 'storeProductToSellInfo',
    method: 'POST',
    desc: '新增跟卖详情页请求',
    path: '/storeProduct/toSellInfo',
    params: {}
  },
  {
    name: 'prProductSellerAmzListChildMovable',
    method: 'POST',
    desc: '店铺产品-可以移动子产品列表',
    path: '/prProductSellerAmz/listChildMovable',
    params: {}
  },
  {
    name: 'prProductSellerAmzListParentMovable',
    method: 'POST',
    desc: '平台产品-可移动父产品列表',
    path: '/prProductSellerAmz/listParentMovable',
    params: {}
  },
]