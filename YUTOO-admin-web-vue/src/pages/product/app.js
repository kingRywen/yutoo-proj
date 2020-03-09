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
import elementUI, {
  Message
} from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';



Vue.use(vueBeauty);
Vue.use(VueTabs);
Vue.use(elementUI);

Vue.prototype.$message = Message;

window.onload = function () {
  if (!sessionStorage.getItem('toggle')) {
    sessionStorage.setItem('toggle', 1)
  }

}


window.vm = new Vue({
  el: '#app',
  render: h => h(App)
})