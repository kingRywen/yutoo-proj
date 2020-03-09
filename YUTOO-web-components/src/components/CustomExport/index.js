import CustomExport from './src/CustomExport.vue'

CustomExport.install = function(Vue) {
  Vue.component(CustomExport.name, CustomExport)
}

// module.exports = CustomExport
export default CustomExport
