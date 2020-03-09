import 'vue-beauty/package/style/vue-beauty.css'

import 'vue-beauty/vb/style/core/index.less'
import 'vue-beauty/vb/components/button/style/index.less'
import 'vue-beauty/vb/components/form/style/index.less'
import 'vue-beauty/vb/components/grid/style/index.less'
import 'vue-beauty/vb/components/input/style/index.less'
import Vue from 'vue'
import vueBeauty from 'vue-beauty'
import App from './app.vue'
import Router from 'vue-router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//
import ToRecord from './to-record/to-record'
import Category from './category/category'
import TemplateManagement from './template-management/template-management'
import Uploading from './template-management/uploading/uploading'

Vue.use(vueBeauty)
Vue.use(ElementUI)
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Category
    }, //类目页
    {
      path: '/category',
      name: 'category',
      component: Category,
      meta: {
        title: '产品类目管理'
      }
    },
    {
      path: '/record',
      name: 'record',
      component: ToRecord,
      meta: {
        title: '导入记录'
      }
    }, //导入记录
    {
      path: '/templateManagement',
      name: 'templateManagement',
      component: TemplateManagement,
      meta: {
        title: '模板管理'
      }
    }, //模板管理
    {
      path: '/uploading',
      name: 'uploading',
      component: Uploading,
      meta: {
        title: '导入模板'
      }
    }
  ]
})

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
