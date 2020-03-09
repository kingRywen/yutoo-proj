// import Vue from "vue";
// import AppComponent from "./App/App.vue";

// Vue.component("app-component", AppComponent);

import Vue from 'vue'
import '@/assets/font.scss'
import VueClipboard from 'vue-clipboard2'
import {
  Button,
  Select,
  Form,
  FormItem,
  Option,
  InputNumber,
  RadioGroup,
  Radio,
  Card,
  Tabs,
  TabPane,
  Message,
  Input,
  Loading,
  MessageBox,
  Tooltip
} from 'element-ui'
import App from './App/App.vue'
// import 'element-ui/lib/theme-chalk/index.css';
import NonePage from './NonePage/index'

Vue.use(VueClipboard)
Vue.use(Button)
Vue.use(Input)
// Vue.use(Message)
Vue.use(NonePage)
Vue.use(Select)
Vue.use(Form)
Vue.use(Tooltip)
Vue.use(FormItem)
Vue.use(Option)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Card)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(InputNumber)
Vue.use(Loading.directive)

Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$confirm = MessageBox.confirm

chrome.storage.sync.get({ amazon: null, aliexpress: null }, function(items) {
  window.items = items
  window.vm = new Vue({
    el: '#app',
    render: createElement => {
      return createElement(App)
    }
  })
})
