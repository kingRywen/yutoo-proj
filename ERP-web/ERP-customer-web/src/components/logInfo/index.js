import logInfo from "./src/index.vue";

logInfo.install = function (Vue) {
  Vue.component(logInfo.name, logInfo);
};

export default logInfo;