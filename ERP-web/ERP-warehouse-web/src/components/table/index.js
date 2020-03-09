import YtTable from './src/table.vue'
import SimpleTable from './src/SimpleTable.vue'
import TableSelect from './src/TableSelect'
import YtPage from './src/page'

YtTable.install = function (Vue) {
  Vue.component(YtTable.name, YtTable)
  Vue.component(TableSelect.name, TableSelect)
  Vue.component(SimpleTable.name, SimpleTable)
  Vue.component(YtPage.name, YtPage)
}

export default YtTable