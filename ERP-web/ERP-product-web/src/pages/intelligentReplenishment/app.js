import 'vue-beauty/package/style/vue-beauty.css';

import 'vue-beauty/vb/style/core/index.less';
import 'vue-beauty/vb/components/button/style/index.less';
import 'vue-beauty/vb/components/form/style/index.less';
import 'vue-beauty/vb/components/grid/style/index.less';
import 'vue-beauty/vb/components/input/style/index.less';

import Vue from 'vue';
import ElementUI, {
  Message
} from 'element-ui';

// import 'element-ui/lib/theme-chalk/index.css';
import './styles/elment-variables.scss';
import 'normalize.css/normalize.css';


import './styles/index.scss';
import App from './App.vue';
import router from './router';
import IRLayout from './layouts/IRLayout/index'
import store from './store'


import 'assets/style/common.less'

Vue.prototype.$message = Message;

Vue.use(ElementUI);
Vue.use(IRLayout);
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  console.log('before');
  router.app.$options.store.commit('setLoading', true)

  window.document.title = to.meta.title;
  next()
})


router.afterEach((to, from) => {
  router.app.$options.store.commit('setLoading', false)
})


Vue.mixin({
  filters: {
    _formatData(val) {
      return val == null || val === -1 || val === '' ? '-' : val
    }
  },
  methods: {
    // 格式华表格数据显示
    _formatter(row, column) {
      if (!row[column.property] || row[column.property] === "" || row[column.property] === -1) {
        return "-";
      } else {
        return row[column.property];
      }
    },
    // 格式化日期
    _formatterData(row, column) {
      let val = row[column.property]
      if (!val || val === "" || val === -1) {
        return "-";
      } else {
        return val.split(' ')[0]
      }
    },
  }
})



// window.vm = new Vue({
//   router,
//   store,
//   render: h => h(App),
// }).$mount('#app');

window.vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})