import ChoseTemplate from "./src/index.vue";

ChoseTemplate.install = function (Vue) {
  Vue.component(ChoseTemplate.name, ChoseTemplate);
};

export default ChoseTemplate;