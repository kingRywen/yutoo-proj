// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = []

const asideMenuConfig = [{
  path: '/WholeStationAnalysis',
  name: '整站分析',
  icon: 'el-icon-menu'
}, {
  path: '/cate',
  name: '类目分析',
  icon: 'el-icon-menu',
  children: [{
    path: '/CategoryAnalysis',
    name: '类目分析'
  },
  {
    path: '/ComparisonofCategories',
    name: '类目对比'
  }
  ]
}, {
  path: '/product',
  name: '商品分析',
  icon: 'el-icon-menu',
  children: [{
    path: '/ProductAnalysis',
    name: '商品分析'
  },
  {
    path: '/ProductHotSelling',
    name: '热销商品'
  },
  {
    path: '/ProductSoaring',
    name: '飙升商品'
  }
  ]
}, {
  path: '/shop',
  name: '店铺分析',
  icon: 'el-icon-menu',
  children: [{
    path: '/ShopAnalysis',
    name: '店铺分析'
  },
  {
    path: '/ShopHotSelling',
    name: '热销店铺'
  },
  {
    path: '/ShopSoaring',
    name: '飙升店铺'
  }
  ]
}]

export {
  headerMenuConfig,
  asideMenuConfig
}
