import axios from 'axios'

let request = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000
  // transformRequest: [function (data) {
  //   return querystring.stringify(data)
  // }]
})

// 设置请求细节
request.defaults.headers.post['Content-Type'] = 'application/json'

request.interceptors.request.use(config => {
  if (localStorage.getItem('token')) {
    config.headers.token = localStorage.getItem('token')
  }
  return config
})

// export function getMainIcon () {
//   return request.get('/v1/api/getMainIcon').then(res => res.data.data)
// }

// export function getSubMenu () {
//   return request.get('/v1/api/getSubMenu').then(res => res.data.menuList)
// }

export function getMainIcon (path) {
  if (path === '/admin/dashboard') {
    return request.get('/sys/menu/user').then(res => res.data.menuList)
  }
  if (path === '/admin/center') {
    return request.get('/sys/menu/user').then(res => res.data.menuList)
  }
}

export function getSubMenu (path) {
  if (path === '/admin/dashboard') {
    return request.get('/sys/menu/user')
  }
  if (path === '/admin/center') {
    return Promise.resolve({
      data: {
        menuList: [
          {
            'name': '产品管理',
            'type': 0,
            'icon': 'fa fa-coffee',
            'orderNum': 0,
            'list': [
              {
                'name': '产品listing',
                'type': 1,
                'icon': 'fa fa-coffee',
                'orderNum': 0,
                'list': [
                  {
                    'name': '产品listing',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/productList',
                    'orderNum': 0
                  },
                  {
                    'name': '平台listing',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/PlatformList',
                    'orderNum': 1
                  },
                  {
                    'name': '店铺listing',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/ShopList',
                    'orderNum': 2
                  }
                ]
              },
              {
                'name': '产品开发',
                'type': 1,
                'icon': 'fa fa-coffee',
                'orderNum': 1,
                'list': [
                  {
                    'name': '销售提报开发',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/SalesReport',
                    'orderNum': 0
                  },
                  {
                    'name': '平台产品采集',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/PlatformProductCollection',
                    'orderNum': 1
                  },
                  {
                    'name': '供应商产品审核',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/VendorProductReview',
                    'orderNum': 2
                  }
                ]
              },
              {
                'name': '相关设置',
                'type': 1,
                'icon': 'fa fa-coffee',
                'orderNum': 2,
                'list': [
                  {
                    'name': '店铺管理',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/StoreManagement',
                    'orderNum': 0
                  },
                  {
                    'name': '敏感关键词管理',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/SensitiveKeywordManagement',
                    'orderNum': 1
                  },
                  {
                    'name': '渠道SKU生成规则',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/ChannelSKUGenerationRules',
                    'orderNum': 2
                  },
                  {
                    'name': '渠道SKU管理',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/ChannelSKUManagement',
                    'orderNum': 3
                  },
                  {
                    'name': 'SKU平台标题管理',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/SKUPlatformTitleManagement',
                    'orderNum': 4
                  },
                  {
                    'name': '产品类目管理',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/BatchModificationOfChannelAssociation',
                    'orderNum': 5
                  },
                  {
                    'name': '批量修改渠道关联',
                    'type': 2,
                    'icon': 'fa fa-coffee',
                    'url': '/admin/center/ProductCategoryManagement',
                    'orderNum': 6
                  }
                ]
              }
            ]
          },
          {
            'name': '采购管理',
            'type': 0,
            'icon': 'fa fa-coffee',
            'orderNum': 0,
            'list': [
              {
                'name': '产品listing',
                'type': 1,
                'icon': 'fa fa-coffee',
                'orderNum': 0,
                'url': '/admin/center'
              },
              {
                'name': '平台listing',
                'type': 1,
                'icon': 'fa fa-coffee',
                'orderNum': 1,
                'url': '/admin/center'
              },
              {
                'name': '店铺listing',
                'type': 1,
                'icon': 'fa fa-coffee',
                'orderNum': 2,
                'url': '/admin/center'
              }
            ]
          },
          {
            'name': '供应商管理',
            'type': 0,
            'icon': 'fa fa-coffee',
            'orderNum': 1,
            'list': [
              {
                'name': '产品listing',
                'type': 1,
                'icon': 'fa fa-coffee',
                'orderNum': 0,
                'url': '/admin/center'
              },
              {
                'name': '平台listing',
                'type': 1,
                'icon': 'fa fa-coffee',
                'orderNum': 0,
                'url': '/admin/center'
              },
              {
                'name': '店铺listing',
                'type': 1,
                'icon': 'fa fa-coffee',
                'orderNum': 0,
                'url': '/admin/center'
              }
            ]
          }
        ]
      }
    })
  }
  // return request.get('/sys/menu/user').then(res => res.data.menuList)
}
