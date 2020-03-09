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
import {
  Message
} from "element-ui";

Vue.use(vueBeauty);
Vue.prototype.$message = Message;

window.vm = new Vue({
  el: '#app',
  render: h => h(App)
})