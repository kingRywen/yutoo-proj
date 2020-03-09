import SimpleForm from "./src/SimpleForm.vue";

SimpleForm.install = function (Vue) {
  Vue.component(SimpleForm.name, SimpleForm);
};

export default SimpleForm;