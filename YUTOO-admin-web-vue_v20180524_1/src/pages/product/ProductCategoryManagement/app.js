import Vue from 'vue';
import App from './app.vue';
import Router from 'vue-router';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//
import ToRecord from './to-record/to-record'
import Category from './category/category'
import TemplateManagement from './template-management/template-management'
import Uploading from './template-management/uploading/uploading'

Vue.use(ElementUI);
Vue.use(Router);

const router  = new Router({
    routes: [
        {path: '/',name: 'category',component: Category}, //类目页
        {path: '/record',name: 'record',component: ToRecord}, //导入记录
        {path: '/templateManagement',name: 'templateManagement',component: TemplateManagement}, //模板管理
        {path:'/uploading',name:'uploading',component:Uploading}
    ]
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
