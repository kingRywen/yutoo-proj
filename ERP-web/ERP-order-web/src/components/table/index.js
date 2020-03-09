import YtTable from "./src/table.vue";
import TableSelect from "./src/TableSelect";
import page from "./src/page.vue";

YtTable.install = function (Vue) {
  Vue.component(YtTable.name, YtTable);
  Vue.component(TableSelect.name, TableSelect);
  Vue.component(page.name, page);
};

export default YtTable;