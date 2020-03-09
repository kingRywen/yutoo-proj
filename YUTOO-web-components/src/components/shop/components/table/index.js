import YtTable from './src/table.vue'
import YtTableSelect from './src/TableSelect.vue'

YtTable.install = function(Vue) {
  Vue.component(YtTable.name, YtTable)
  Vue.component(YtTableSelect.name, YtTableSelect)
}

export default YtTable
