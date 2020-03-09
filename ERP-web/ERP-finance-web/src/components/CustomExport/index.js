import CustomExport from './src/CustomExport.vue'

CustomExport.install = function(Vue) {
  Vue.component(CustomExport.name, CustomExport)
}

export default CustomExport
