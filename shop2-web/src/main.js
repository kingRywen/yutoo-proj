// import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";
import Vue from "vue";
import ElementUI from "element-ui";
import VueLazyload from "vue-lazyload";
import Clipboard from "vue-clipboard2";
import "pl-table/themes/index.css";
import "pl-table/themes/plTableStyle.css";
import "../theme/index.css";
import "Components"; // 全局组件注册
import "Directives"; // 指令
import i18n from "./locales";
import App from "./App.vue";
import * as config from "Config";
import Interceptors from "Config/interceptors";
// 引入插件
import inject from "@yutoo/utils";
import { STORAGE_NAME } from "./_CONFIG";

// import yutoo from '@yutoo/yutoo'
import store from "@/store/index";
import router from "@/router/index";
import "@/assets/css/index.scss";
import mixins from "./mixins";
import cfuns from "./functions";
import "animate.css";

Vue.mixin(mixins);

Vue.prototype.cfuns = cfuns;

export const INJECT_CONFIG = {
  ...config,
  Interceptors,
  env: {
    NODE_ENV: process.env.NODE_ENV
  },
  STORAGE_NAME
};

// 全局 event bus 用来发布订阅
GLOBAL.vbus = new Vue();
Vue.use(Clipboard);
Vue.use(inject, INJECT_CONFIG);
// Vue.use(yutoo)
Vue.use(ElementUI);
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.meta.bread) {
    document.title =
      (to.meta.name
        ? to.meta.name + "-"
        : to.meta.showMetaProp
        ? `${to.query[to.meta.showMetaProp]}-`
        : "") +
      to.meta.bread
        .slice(0)
        .reverse()
        .map(el => el.name)
        .join("-") +
      " - 店铺系统";
  }
  next();
});

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 2
});

new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount("#app");
