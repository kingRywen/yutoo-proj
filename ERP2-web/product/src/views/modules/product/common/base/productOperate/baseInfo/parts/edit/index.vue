<template>
  <div class="edit">
    <customTable
      :tableData="tableData"
      :columns="columns"
      :searchConfig="searchConfig"
      rowKey="accessoryId"
      v-model="selectData"
      :hideSearchBtn="false"
    ></customTable>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let vm = this;
    return {
      tableData: [{}],
      accessoryId: null,
      selectData: [],
      columns: [
        {
          label: "图片",
          value: "image",
          type: "image"
        },
        {
          label: "产品名称",
          value: "nameCn"
        },
        {
          label: "仓库SKU",
          value: "repoSku"
        },
        {
          label: "系统SKU",
          value: "sysSku"
        },
        {
          label: "数量",
          value: "num",
          input: true
        }
      ],
      searchConfig: [
        {
          name: "添加",
          type: "add",
          fn() {
            vm._dialog({
              title: "添加配件",
              fullscreen: true,
              component: () => import("../addparts"),
              params: {
                type: 1,
                getList() {
                  vm.getList();
                },
                select: vm.tableData,
                url: "product/prProductRepoPartsGet",
                isShowSku: false,
                params: {},
                accessoryId: vm.accessoryId
              }
            });
          }
        },
        {
          type: "dropDowm",
          btns: [
            {
              name: "删除",
              fn(data) {
                let params = {
                  ids: data.map(item => item.productRepoId),
                  accessoryIds: [vm.params.accessoryId]
                };
                vm.$api[`product/prProductRepoAccessoryDelete`](params).then(
                  () => {
                    vm.getList();
                  }
                );
              }
            }
          ]
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    delete(arr) {
      let vm = this;
      let data = vm.utils.clone(vm.tableData);
      vm.tableData = data.filter(item => {
        return !arr.find(i => vm.utils.isSame(i, item));
      });
    },
    getList() {
      let vm = this;
      let accessoryId = vm.params.accessoryId;
      this.accessoryId = accessoryId;
      vm.$api[`product/prProductRepoAccessoryGetSingle`]({ accessoryId }).then(
        ({ rows }) => {
          vm.tableData = rows;
        }
      );
    },

    submit() {
      this.params.getList();
      return true;
    }
  },
  components: {
    customTable: () => import("../../../../components/customTable/src/")
  }
};
</script>

<style lang='scss'>
.edit {
  background: #fff;
}
</style>