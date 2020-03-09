import 'vue-beauty/package/style/vue-beauty.css';

import 'vue-beauty/vb/style/core/index.less';
import 'vue-beauty/vb/components/button/style/index.less';
import 'vue-beauty/vb/components/form/style/index.less';
import 'vue-beauty/vb/components/grid/style/index.less';
import 'vue-beauty/vb/components/input/style/index.less';

import Vue from 'vue';
import vueBeauty from 'vue-beauty';
import App from './app.vue'

import element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/style/common.less'

Vue.use(vueBeauty);
Vue.use(element);

new Vue({
  el: '#app',
  render: h => h(App)
})