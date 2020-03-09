import request from './axios'

export function getMainIcon(path) {
  if (path === '/admin/dashboard') {
    return request.get('/sys/menu/user').then(res => res.data.menuList)
  }
  if (path === '/admin/center') {
    return request.get('/sys/menu/user').then(res => res.data.menuList)
  }
}

export function getSubMenu(path) {
  return Promise.resolve({
    data: {
      menuList: [
        //   {
        //   'name': '选品工具',
        //   'type': 0,
        //   'show': true,
        //   'icon': 'iconfont icon-menu4caidan4',
        //   'orderNum': 0,
        //   'list': [{
        //     'name': '关键词竞争分析',
        //     'type': true,
        //     'show': true,
        //     'url': 'admin/center',
        //     'orderNum': 0
        //   },
        //   {
        //     'name': '关键词查询',
        //     'type': true,
        //     'show': true,
        //     'url': 'admin/center/keyQuery',
        //     'orderNum': 1
        //   },
        //   {
        //     'name': '类目查询',
        //     'type': true,
        //     'show': true,
        //     'url': 'admin/center/CatalogQuery',
        //     'orderNum': 2
        //   }
        //   ]
        // },
        // {
        //   'name': '关键词挖掘',
        //   'type': 0,
        //   'show': true,
        //   'icon': 'iconfont icon-guanjianci',
        //   'url': 'admin/keywordExcavateIndex',
        //   'orderNum': 0
        // },
        // {
        //   'name': '排名查询',
        //   'type': 0,
        //   'show': true,
        //   'icon': 'iconfont icon-nenghaopaiming',
        //   'orderNum': 0,
        //   'NotKeywordRank': '1',
        //   'list': [{
        //     'name': '关键词排名',
        //     'type': true,
        //     'show': true,
        //     'orderNum': 0,
        //     'url': 'admin/rankingQuery/keywordQuery'
        //   },
        //   {
        //     'name': '类目排名',
        //     'type': true,
        //     'show': true,
        //     'orderNum': 1,
        //     'url': 'admin/rankingQuery/categoryRanking'
        //   },
        //   {
        //     'name': '广告关键词排名',
        //     'type': true,
        //     'show': true,
        //     'orderNum': 2,
        //     'url': 'admin/rankingQuery/adkeywordRanking'
        //   }
        //   ]
        // },
        // {
        //   'name': '竞争分析',
        //   'type': 1,
        //   'icon': 'iconfont icon-shebeileijiankongdian',
        //   'orderNum': 1,
        //   'list': [{
        //     'name': '竞品分析',
        //     'type': true,
        //     'show': true,
        //     'orderNum': 0,
        //     'url': 'admin/competitive/productAnalysis'
        //   },
        //   {
        //     'name': '店铺分析',
        //     'type': true,
        //     'show': true,
        //     'orderNum': 0,
        //     'url': 'admin/competitive/shopAnalysis'
        //   }
        //   ]
        // },
        // {
        //   'name': '监控分析',
        //   'type': 1,
        //   'icon': 'iconfont icon-Analysis',
        //   'orderNum': 1,
        //   'list': [{
        //     'name': '跟卖监控',
        //     'type': true,
        //     'show': true,
        //     'orderNum': 0,
        //     'url': 'admin/monitoringCenter/salesMonitoring'
        //   },
        //   {
        //     'name': '差评监控',
        //     'type': true,
        //     'show': true,
        //     'orderNum': 0,
        //     'url': 'admin/monitoringCenter/negativeCommentMonitoring'
        //   }
        //   ]
        // },
        // {
        //   'name': '描述编辑工具',
        //   'type': 0,
        //   'show': true,
        //   'icon': 'iconfont icon-miaoshu',
        //   'url': 'admin/descriptionEditing',
        //   'orderNum': 0
        // },
        // {
        //   'name': '图片空间',
        //   'type': 0,
        //   'show': true,
        //   'icon': 'iconfont icon-tupian',
        //   'url': 'admin/imgSpace',
        //   'orderNum': 0
        // },

        // {
        //   'name': '店铺授权',
        //   'type': 1,
        //   'show': true,
        //   'icon': 'iconfont icon-jinrudianpu',
        //   'url': 'admin/shopAuthorization',
        //   'orderNum': 0
        // }
      ]
    }
  })
  // return request.get('/sys/menu/user').then(res => res.data.menuList)
}
// 关键词竞争分析添加的请求写法
export function addCompeteKeywordAnalysis(params) {
  return request.post('/TaskKeywordCompete/save', params)
    .then(res => res)
    .catch(err => {
      console.log(err)
    })
}

// 关键词排名添加任务
export function addKeywordRankingTask(params) {
  return request.post('/TaskKeywordRank/save', params)
    .then(res => res.data.rows)
}

// 关键词排名添加监控
export function addKeywordRankingMonitor(params) {
  return request.post('/TaskKeywordRank/save', params)
    .then(res => res.data.rows)
}
// 关键词排名列表111111
// export function getkeywordRankingList(params) {
//   let defaults = {
//     "platformId": 2,
//     "adFlag": 0,
//     "pageNumber": "1",
//     "pageSize": "10"
//   }
//   let opts = { ...defaults,
//     ...params
//   }
//   return request.get('/taskKeywordRank/list', {
//       params: opts
//     })
//     .then(res => res.data.rows)
// }
// 类目排名列表111222
// export function getCategoryRankingList(params) {
//   let defaults = {
//     "platformId": 2,
//     "pageNumber": 1,
//     "pageSize": "10"
//   }
//   let opts = { ...defaults,
//     ...params
//   }
//   return request.get('/taskCategoryRank/list', {
//       params: opts
//     })
//     .then(res => res.data.rows)
// }

// AdWords排名列表获取111333
// export function getAdvertisementRankingList(params) {
//   let defaults = {
//     "platformId": 2,
//     "adFlag": 1,
//     "pageNumber": 1,
//     "pageSize": 10
//   }
//   let opts = { ...defaults,
//     ...params
//   }
//   return request.get('/adKeywordRank/list', {
//       params: opts
//     })
//     .then(res => res.data.rows)
// }
// 跟卖监控列表    第一步，请求的接口222111
// export function getSalesMonitoringList(params) {
//   let defaults = {

//     "platformId": 2,
//     "pageNumber": 1,
//     "pageSize": 10
//   }
//   let opts = { ...defaults,
//     ...params
//   }
//   return request.get('/taskProductSelling/list', {
//       params: opts
//     })
//     .then(res => res.data.rows)
// }
// 跟卖监控查看      第一步，请求的接口
export function getSalesMonitoringSeeList(params) {
  let defaults = {
    'taskId': 93,
    'pageNumber': 1,
    'pageSize': 10

  }
  let opts = {
    ...defaults,
    ...params
  }
  return request.post('/TaskProductSelling/queryDetails', opts)
    .then(res => {
      // console.log(res)
      return res.data.rows
    }).catch(err => {
      console.log('错误信息', err)
    })
}

// 差评监控   第一步，请求接口
export function getNoGoodMonitoringList(params) {
  return request.post('/ShopReviewMonitor/list', params)
    .then(res => res.data.rows)
}
// 添加描述
export async function addDescribe(params) {
  let defaults = {
    'platformId': 1,
    'versionName': 'v2.0',
    'content': '<p></p>'
  }
  let opts = {
    ...defaults,
    ...params
  }
  return request.post('/Description/save', opts)
    .then(res => res.data)
}
// // 版本列表数据请求
// export function getEditionList(params) {
//   let defaults = {
//     "platformId": 1,
//     "pageNumber": 1,
//     "pageSize": 10,
//   }
//   let opts = {
//     ...defaults,
//     ...params
//   }
//   return request.post('/Description/list', {
//       opts
//     })
//     .then(res => res.data.rows)
// }
// 店铺授权--->列表获取
// export function getShopAuthorization(params) {
//   let defaults = {
//     "platformId": 1,
//     "pageNumber": 1,
//     "pageSize": 10,
//   }
//   let opts = { ...defaults,
//     ...params
//   }
//   return request.post('/SellerAuth/list', {
//       opts
//     })
//     .then(res => res.data.rows)
// }
// 图片空间--->列表获取
export function getImgsLists(params) {
  let defaults = {
    'platformId': 2,
    'pageNumber': 1,
    'pageSize': 10
  }
  let opts = {
    ...defaults,
    ...params
  }
  return request.get('/Img/list', {
    params: opts
  })
    .then(res => res.data.rows)
}
// 获取站点
export function getSite(params) {
  let defaults = {
    'platformId': 2
  }
  let opts = {
    ...defaults,
    ...params
  }
  return request.post('/TaskSiteShare/list',
    opts
  )
    .then(res => res.data.rows)
}
// 选品工具  关键词竞争分析列表
export function getKeywordAnalysisList(params) {
  let defaults = {
    platformId: 2,
    pageNumber: 1,
    pageSize: 10
  }
  let opts = {
    ...defaults,
    ...params
  }
  return request.get('/TaskKeywordCompete/list', {
    params: opts
  })
    .then(res => res.data.rows)
}
// 选品工具 关键词查询列表
export function getKeywordQueryList(params) {
  let defaults = {
    'platformId': 2,

    'pageNumber': 1,
    'pageSize': 10
  }
  let opts = {
    ...defaults,
    ...params
  }
  return request.get('/TaskKeywordQuery/list', {
    params: opts
  })
    .then(res => res.data.rows)
}
// 选品工具 类目查询列表
// export function getCategoryList(params) {
//   let defaults = {
//     "platformId": 2,
//     "pageNumber": 1,
//     "pageSize": 10
//   }
//   let opts = { ...defaults,
//     ...params
//   }
//   return request.get('taskCategoryQuery/list', {
//       params: opts
//     })
//     .then(res => res.data.rows)
// }
// 关键词挖掘列表获取
export function getKeywordMiningLists(params) {
  let defaults = {
    'platformId': 2,
    'pageNumber': 1,
    'pageSize': 10
  }
  let opts = {
    ...defaults,
    ...params
  }

  return request.get('/TaskKeywordDig/list', {
    params: opts
  })
    .then(res => res.data.rows)
}

// 选择平台  平台切换
export function getSelectPlatform(params) {
  let defaults = {

    'pageNumber': 1,
    'pageSize': 10
  }
  let opts = {
    ...defaults,
    ...params
  }
  return request.post('/Platform/list',
    opts
  )
    .then(res => res.data.rows)
}

// 点数获取
export function getPoint(params) {
  let defaults = {
    // "functionMark": "F0001",
    // "merchantId": 1
  }
  let opts = {
    ...defaults,
    ...params
  }

  return request.post('/FunctionMkt/keywordCompete/list', {
    params: opts
  })
    .then(res => res.data.data)
}
export default request
