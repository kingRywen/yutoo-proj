import Vue from 'vue'
import Router from 'vue-router'

// 异步加载组件
// 主页面
const Login = () => import('@/components/Login')
const Admin = () => import('@/components/Admin')

// 移植路由
const dashboard = () => import('@/components/routes/nothing/dashboard')
const Area = () => import('@/components/routes/nothing/Area')
const Menu = () => import('@/components/routes/nothing/Menu')
const Macro = () => import('@/components/routes/nothing/Macro')
const Log = () => import('@/components/routes/nothing/Log')
const Quartz = () => import('@/components/routes/nothing/Quartz')
const Generator = () => import('@/components/routes/nothing/Generator')
const Druid = () => import('@/components/routes/nothing/Druid')
const Org = () => import('@/components/routes/nothing/Org')
const Role = () => import('@/components/routes/nothing/Role')
const User = () => import('@/components/routes/nothing/User')

// 二级页面
const Hello = () => import('@/components/routes/two_level_routing/Hello')
const Center = () => import('@/components/routes/two_level_routing/Center')
const WarehouseLogistics = () => import('@/components/routes/two_level_routing/WarehouseLogistics')
const SalesManagement = () => import('@/components/routes/two_level_routing/SalesManagement')
const CRM = () => import('@/components/routes/two_level_routing/CRM')
const Settings = () => import('@/components/routes/two_level_routing/Settings')
const financialManagement = () => import('@/components/routes/two_level_routing/financialManagement')
const ReportCenter = () => import('@/components/routes/two_level_routing/ReportCenter')

// 三级页面
/**
 * 
 * 产品库中心
 * 
 */

// 产品管理 - 产品listing
const CenterIndex = () => import('@/components/routes/three_level_routing/Center')

const ProductList = () => import('@/components/routes/three_level_routing/Center/ProductList/ProductList')
const PlatformList = () => import('@/components/routes/three_level_routing/Center/ProductList/PlatformList')
const ShopList = () => import('@/components/routes/three_level_routing/Center/ProductList/ShopList')

// 产品管理 - 产品开发
const SalesReport = () => import('@/components/routes/three_level_routing/Center/ProductDev/SalesReport')
const PlatformProductCollection = () => import('@/components/routes/three_level_routing/Center/ProductDev/PlatformProductCollection')
const VendorProductReview = () => import('@/components/routes/three_level_routing/Center/ProductDev/VendorProductReview')

// 产品管理 - 相关设置
const StoreManagement = () => import('@/components/routes/three_level_routing/Center/settings/StoreManagement')
const SensitiveKeywordManagement = () => import('@/components/routes/three_level_routing/Center/settings/SensitiveKeywordManagement')
const ChannelSKUGenerationRules = () => import('@/components/routes/three_level_routing/Center/settings/ChannelSKUGenerationRules')
const ChannelSKUManagement = () => import('@/components/routes/three_level_routing/Center/settings/ChannelSKUManagement')
const SKUPlatformTitleManagement = () => import('@/components/routes/three_level_routing/Center/settings/SKUPlatformTitleManagement')
const ProductCategoryManagement = () => import('@/components/routes/three_level_routing/Center/settings/ProductCategoryManagement')
const BatchModificationOfChannelAssociation = () => import('@/components/routes/three_level_routing/Center/settings/BatchModificationOfChannelAssociation')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      component: Admin,
      children: [
        {
          path: '',
          redirect: 'dashboard'
        },
        {
          path: 'dashboard',
          component: Hello,
          // name: '主页',
          children: [
            {
              path: '',
              component: dashboard,
              meta: {
                shouldGet: true
              },
              name: '主页'
            },
            {
              path: '/base/area/list.html',
              component: Area
            },
            {
              path: '/base/menu/list.html',
              component: Menu
            },
            {
              path: '/base/macro/list.html',
              component: Macro
            },
            {
              path: '/base/log/list.html',
              component: Log
            },
            {
              path: '/base/quartz/list.html',
              component: Quartz
            },
            {
              path: '/base/generator/list.html',
              component: Generator
            },
            {
              path: '/druid/index.html',
              component: Druid
            },
            {
              path: '/base/org/list.html',
              component: Org
            },
            {
              path: '/base/role/list.html',
              component: Role
            },
            {
              path: '/base/user/list.html',
              component: User
            },
          ]
        },
        {
          path: 'center',
          component: Center,
          children: [
            {
              path: '',
              component: CenterIndex,
              meta: {
                shouldGet: true
              },
              name: '产品库中心'
            },
            {
              path: 'productList',
              component: ProductList,
              name: '产品列表'
            },
            {
              path: 'PlatformList',
              component: PlatformList,
              name: '平台列表'
            },
            {
              path: 'ShopList',
              component: ShopList,
              name: '店铺listing'
            },
            {
              path: 'SalesReport',
              component: SalesReport,
              name: '销售提报开发'
            },
            {
              path: 'PlatformProductCollection',
              component: PlatformProductCollection,
              name: '平台产品采集'
            },
            {
              path: 'VendorProductReview',
              component: VendorProductReview,
              name: '供应商产品审核'
            },
            {
              path: 'StoreManagement',
              component: StoreManagement,
              name: '店铺管理'
            },
            {
              path: 'SensitiveKeywordManagement',
              component: SensitiveKeywordManagement,
              name: '敏感关键词管理'
            },
            {
              path: 'ChannelSKUGenerationRules',
              component: ChannelSKUGenerationRules,
              name: '渠道SKU生成规则'
            },
            {
              path: 'ChannelSKUManagement',
              component: ChannelSKUManagement,
              name: '渠道SKU管理'
            },
            {
              path: 'SKUPlatformTitleManagement',
              component: SKUPlatformTitleManagement,
              name: 'SKU平台标题管理'
            },
            {
              path: 'BatchModificationOfChannelAssociation',
              component: BatchModificationOfChannelAssociation,
              name: '产品类目管理'
            },
            {
              path: 'ProductCategoryManagement',
              component: ProductCategoryManagement,
              name: '批量修改渠道关联'
            }
          ]
        },
        {
          path: 'WarehouseLogistics',
          component: WarehouseLogistics,
          name: '仓储物流管理'
        },
        {
          path: 'SalesManagement',
          component: SalesManagement,
          name: '销售管理'
        },
        {
          path: 'CRM',
          component: CRM,
          name: 'CRM客服管理'
        },
        {
          path: 'Settings',
          component: Settings,
          name: '系统管理'
        },
        {
          path: 'financialManagement',
          component: financialManagement,
          name: '财务管理'
        },
        {
          path: 'ReportCenter',
          component: ReportCenter,
          name: '报告中心'
        }
        // {
        //   path: '/base/area',
        //   component: Area
        // },
        // {
        //   path: '/base/Menu',

        //   component: Menu
        // },
        // {
        //   path: '/base/Macro',
        //   component: Macro
        // },
        // {
        //   path: '/base/Log',
        //   component: Log
        // },
        // {
        //   path: '/base/Quartz',
        //   component: Quartz
        // },
        // {
        //   path: '/base/Generator',
        //   component: Generator
        // },
        // {
        //   path: '/base/Druid',
        //   component: Druid
        // },
        // {
        //   path: '/druid/index.html',
        //   redirect: '/base/Druid'
        // },
        // {
        //   path: '/base/Org',
        //   component: Org
        // },
        // {
        //   path: '/base/Role',
        //   component: Role
        // },
        // {
        //   path: '/base/User',
        //   component: User
        // }
      ]
    }
  ]
})
