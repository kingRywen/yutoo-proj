<template>
  <div class="parts">
    <customTable
      :tableData="tableData"
      :columns="columns"
      :searchConfig="searchConfig"
      @searchForm="searchForm"
      rowKey="productRepoId"
      v-model="aaaa"
    ></customTable>
    <btns :btns="bottomBtns"></btns>
  </div>
</template>

<script>
export default {
  props: {
    bottomBtns: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let vm = this;
    return {
      aaaa: [],
      tableData: [
        {
          aaa: "123",
          skuList: [
            {
              name: "2343"
            },
            {
              name: "4342545"
            },
            {
              name: "4342545"
            },
            {
              name: "4342545"
            }
          ]
        }
      ],
      columns: [
        {
          label: "仓库SKU",
          value: "repoSku"
        },
        {
          label: "配件SKU",
          fields: "accessoryInfo",
          close(item, row) {
            console.log(row);
            vm.delete({
              accessoryIds: [row.accessoryId],
              ids: [item.id]
            });
          }
        },
        {
          label: "操作",
          btns: [
            {
              name: "编辑配件",
              type: "dropdown",
              fn(index, item) {
                vm.edit(item.accessoryId);
              },
              children: [
                {
                  name: "编辑配件",
                  fn(index, item) {
                    vm.edit(item.accessoryId);
                  }
                },
                {
                  name: "删除",
                  fn(index, item) {
                    vm.delete({
                      accessoryIds: [item.accessoryId]
                    });
                  }
                }
              ]
            }
          ]
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
              component: () => import("./addparts"),
              params: {
                type: 1,
                getList() {
                  vm.getList();
                },
                productRepoId: vm.editObj.productRepoId
              }
            });
          }
        },
        {
          type: "dropDowm",
          btns: [
            {
              name: "删除",
              fn(val) {
                vm.delete({
                  accessoryIds: val.map(item => item.accessoryId)
                });
              }
            }
          ]
        },
        {
          type: "input",
          value: "search"
        }
      ]
    };
  },
  methods: {
    searchForm(val) {
      this.getList(val);
    },
    getList(search = {}) {
      let vm = this;
      vm.$api[`product/prProductRepoAccessoryGet`]({
        productRepoId: vm.editObj.productRepoId,
        ...search
      }).then(({ rows = [] }) => {
        vm.tableData = rows;
      });
    },
    delete(params) {
      let vm = this;
      vm.$api[`product/prProductRepoAccessoryDelete`](params).then(() => {
        vm.getList();
      });
    },
    edit(accessoryId) {
      let vm = this;
      vm._dialog({
        title: "添加配件",
        fullscreen: true,
        component: () => import("./edit"),
        params: {
          accessoryId,
          getList() {
            vm.getList();
          }
        }
      });
    }
  },
  created() {
    let vm = this;
    vm.bottomBtns[1].show = false;
    vm.getList();
  },
  mounted() {},
  computed: {
    editObj: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  components: {
    btns: () => import("../common/btns"),
    customTable: () => import("../../../components/customTable/src/")
  }
};
</script>

<style lang='scss'>
.parts {
  background: #fff;
}
</style>