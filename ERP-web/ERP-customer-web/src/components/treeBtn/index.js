import TreeBtn from "./src/index.vue";

TreeBtn.install = function (Vue) {
  Vue.component(TreeBtn.name, TreeBtn);
};

export default TreeBtn;