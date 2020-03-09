import YtTable from "./src/table.vue";
import TableColvalue from "./src/table-colvalue";

YtTable.install = function(Vue) {
  Vue.component(TableColvalue.name, TableColvalue);
  Vue.component(YtTable.name, YtTable);
};

export default YtTable;
