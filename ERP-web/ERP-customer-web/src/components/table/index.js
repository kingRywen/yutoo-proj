import YtTable from './src/table.vue'
import TableSelect from './src/TableSelect'

YtTable.install = function(Vue) {
  Vue.component(YtTable.name, YtTable)
  Vue.component(TableSelect.name, TableSelect)
}

export default YtTable
