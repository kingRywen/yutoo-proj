import ImportExcel from './src/ImportFile'

ImportExcel.install = function(Vue) {
  Vue.component(ImportExcel.name, ImportExcel)
}

export default ImportExcel
