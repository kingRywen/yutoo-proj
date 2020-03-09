import 'vue-nav-tabs/themes/vue-tabs.css'
import 'vue-beauty/package/style/vue-beauty.css';

import 'vue-beauty/vb/style/core/index.less';
import 'vue-beauty/vb/components/button/style/index.less';
import 'vue-beauty/vb/components/form/style/index.less';
import 'vue-beauty/vb/components/grid/style/index.less';
import 'vue-beauty/vb/components/input/style/index.less';

import Vue from 'vue';
import vueBeauty from 'vue-beauty';
import App from './app.vue'
import 'assets/style/common.less'
import VueTabs from 'vue-nav-tabs'

import '../../../../../static/plugins/editor/ueditor.config.js'
import '../../../../../static/plugins/editor/ueditor.all.min.js'
import '../../../../../static/plugins/editor/lang/zh-cn/zh-cn.js'
import '../../../../../static/plugins/editor/ueditor.parse.min.js'


Vue.use(VueTabs)
Vue.use(vueBeauty);

new Vue({
  el: '#app',
  render: h => h(App)
})