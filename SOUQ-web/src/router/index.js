/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
// 异步加载组件
// 登陆
const Login = () =>
  import ('@/components/Login')
// 布局组件
const Layouts = () =>
  import ('@/layouts/HeaderAsideLayout')
const NotFound = () =>
  import ('@/pages/NotFound')
// 页面
// import WholeStationAnalysis from '@/pages/WholeStationAnalysis';
const WholeStationAnalysis = () =>
  import ('@/pages/WholeStationAnalysis')
const DepthAnalysis = () =>
  import ('@/pages/CategoryAnalysis/AccessoriesMain/DepthAnalysis') // 深度分析
const CatalogueGoods = () =>
  import ('@/pages/CategoryAnalysis/AccessoriesMain/CatalogueGoods') // 类目商品
const RelatedShops = () =>
  import ('@/pages/CategoryAnalysis/AccessoriesMain/RelatedShops') // 相关店铺
const CategoryAnalysis = () =>
  import ('@/pages/CategoryAnalysis/Index')
const CategoryAnalysisList = () =>
  import ('@/pages/CategoryAnalysis/List')


const AccessoriesMain = () =>
  import ('@/pages/CategoryAnalysis/AccessoriesMain')
const ComparisonofCategories = () =>
  import ('@/pages/ComparisonofCategories')

// 3.商品菜单——
// 3.1 商品分析
const ProductAnalysis = () =>
  import ('@/pages/ProductAnalysis')
const ProductList = () =>
  import ('@/pages/ProductAnalysis/Children/ProductList')
const ProductChart = () =>
  import ('@/pages/ProductAnalysis/Children/ProductChart')
// import ProductAnalysis from '@/pages/ProductAnalysis';
// import ProductList from '@/pages/ProductAnalysis/Children/ProductList';
// import ProductChart from '@/pages/ProductAnalysis/Children/ProductChart';

// 4.店铺菜单——
// 3.1 店铺分析
const ShopAnalysis = () =>
  import ('@/pages/ShopAnalysis')
const ShopList = () =>
  import ('@/pages/ShopAnalysis/Children/ShopList')
const ShopChart = () =>
  import ('@/pages/ShopAnalysis/Children/ShopChart')
// import ShopAnalysis from '@/pages/ShopAnalysis';
// import ShopList from '@/pages/ShopAnalysis/Children/ShopList';
// import ShopChart from '@/pages/ShopAnalysis/Children/ShopChart';

const storeList = () =>
  import ('@/pages/WholeStationAnalysis/shop-distribution/store-list/store-list')
const salesList = () =>
  import ('@/pages/WholeStationAnalysis/commodity-distribution/sales-list/sales-list')
// import storeList from '@/pages/WholeStationAnalysis/shop-distribution/store-list/store-list';
// import salesList from '@/pages/WholeStationAnalysis/commodity-distribution/sales-list/sales-list';


Vue.use(Router)
const router = new Router({
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    console.log(savedPosition);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          x: 0,
          y: 0
        })
      }, 500)
    })
  },
  routes: [{
    path: '',
    redirect: '/login'
  }, {
    path: '/login',
    name: '登陆',
    component: Login
  }, {
    path: '/',
    // name: '首页',
    component: Layouts,
    children: [{
        path: '',
        redirect: 'WholeStationAnalysis'
      }, {
        path: 'WholeStationAnalysis',
        name: '整站分析',
        component: WholeStationAnalysis
      },
      {
        path: 'storeList',
        name: '店铺列表',
        component: storeList
      },
      {
        path: 'salesList',
        name: '商品列表',
        component: salesList
      },

      {
        path: 'cate/CategoryAnalysis',
        component: CategoryAnalysis,
        children: [{
          path: '',
          name: '类目分析',
          component: CategoryAnalysisList
        }, {
          path: 'accessories',
          component: AccessoriesMain,
          children: [{
            path: '',
            components: {
              a: WholeStationAnalysis,
              b: DepthAnalysis, // 深度分析
              c: CatalogueGoods,
              d: RelatedShops
            },
            children: [{
              name: '类目分析详情',
              path: '',
              components: {
                d: ShopList
              }
            }]
          }]
        }]
      },
      // {
      //   path: 'cate',
      //   component: CategoryAnalysis,
      //   children: [{
      //     path: 'accessories',

      //     component: AccessoriesMain,
      //     children: [{
      //       path: '',
      //       components: {
      //         a: WholeStationAnalysis,
      //         b: DepthAnalysis, // 深度分析
      //         c: CatalogueGoods,
      //         d: RelatedShops
      //       },
      //       children: [{
      //         name: '类目分析详情',
      //         path: '',
      //         components: {
      //           a: ProductList,
      //           b: ProductList,
      //           c: ProductList,
      //           d: ShopList
      //         }
      //       }]
      //     }]
      //   }, {
      //     path: 'CategoryAnalysis',
      //     name: '类目分析',
      //     components: {
      //       default: CategoryAnalysisList
      //     }
      //   }]
      // },
      {
        path: 'cate/ComparisonofCategories',
        name: '类目对比',
        component: ComparisonofCategories
      },
      {
        path: 'product/ProductAnalysis',
        // name: '商品分析',
        component: ProductAnalysis,
        children: [{
          path: "",
          name: "商品分析",
          component: ProductList
        }, {
          path: "ProductChart",
          name: "商品图表分析",
          component: ProductChart
        }]
      }, {
        path: 'product/ProductHotSelling',
        // name: '热销商品',
        component: ProductAnalysis,
        children: [{
          path: "",
          name: "热销商品",
          component: ProductList
        }]
      }, {
        path: 'product/ProductSoaring',
        // name: '飙升商品',
        component: ProductAnalysis,
        children: [{
          path: "",
          name: "飙升商品",
          component: ProductList
        }]
      }, {
        path: 'shop/ShopAnalysis',
        // name: '店铺分析',
        component: ShopAnalysis,
        children: [{
          path: "",
          name: "店铺列表",
          component: ShopList
        }, {
          path: "ShopChart",
          name: "店铺图表分析",
          component: ShopChart
        }]
      }, {
        path: 'shop/ShopHotSelling',
        // name: '热销店铺',
        component: ShopAnalysis,
        children: [{
          path: "",
          name: "热销店铺",
          component: ShopList
        }]
      }, {
        path: 'shop/ShopSoaring',
        // name: '飙升店铺',
        component: ShopAnalysis,
        children: [{
          path: "",
          name: "飙升店铺",
          component: ShopList
        }]
      }, {
        path: '*',
        name: '404',
        component: NotFound
      }
    ]
  }]
})

export default router
