<template>

  <div>
    <v-data-table stripe :tree-option='treeOption' ref="table" :data='lists' :page-size="pageSize" :page-no="pageNo" :columns='columns' check-type="checkbox" class="margin-top-25"></v-data-table>
  </div>
</template>

<script>
import { fetchData } from "common/common";
import apis from "apis";

export default {
  inheritAttrs: false,
  data() {
    return {
      lists: data => {
        data.pageNumber = data.pageNo;
        delete data.pageNo;
        let reqData = Object.assign({}, data, this.params);

        let opts = Object.assign(
          {},
          { ...apis.PRODSRCDEVELOPLOG_LIST },
          { data: reqData }
        );

        return fetchData(opts).then(res => {
          let data = res.data;
          // if (data && data.rows && isArray(data.rows)) {
          //   data.rows.forEach((element, i) => {
          //     element.pid = 0;
          //   });
          // }
          console.log(data);
          return {
            result: data.rows,
            totalCount: data.total,
            pageSize: data.pageSize,
            pageNo: data.pageNo
          };
        });
      },
      params: {
        sortOrder: "asc",
        srcType: 1,
        srcId: this.$attrs.item.sourceId
      },
      pageNo: 1,
      pageSize: 10,
      columns: [
        {
          title: "操作时间",
          field: "modifyTime"
        },
        {
          title: "操作者",
          field: "userName"
        },
        {
          title: "操作",
          field: "logDesc"
        }
      ],
      treeOption: {
        isAsync: true
      }
      // tableData: []
    };
  },
  methods: {
    ok() {
      // this.$listeners.set(this);
      this.cancel();
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    }
  }
};
</script>

<style>
</style>
