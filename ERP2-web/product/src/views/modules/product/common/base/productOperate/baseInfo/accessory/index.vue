<template>
  <div class="accessory">
    <customTable
      :tableData="tableData"
      :columns="columns"
      :searchConfig="searchConfig"
      @searchForm="searchForm"
      rowKey="productRepoAttachmentRelId"
      v-model="selectData"
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
      selectData: [],
      searchConfig: [
        {
          name: "添加",
          type: "add",
          fn() {
            vm._dialog({
              title: "添加",
              fullscreen: true,
              component: () => import("./add"),
              params: {
                parentProductId: vm.editObj.productRepoId,
                getList() {
                  vm.getList();
                }
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
                  productRepoAttachmentRelIds: val.map(
                    item => item.productRepoAttachmentRelId
                  )
                });
              }
            }
          ]
        },
        {
          type: "input",
          value: "sku",
          fn() {}
        }
      ],
      columns: [
        {
          label: "附件名称",
          fields: "annexList",
          close(item, row) {
            console.log(item);
            vm.delete({
              productRepoAttachmentRelIds: [row].map(
                item => item.productRepoAttachmentRelId
              ),
              annexId: item.annexId
            });
          }
        },
        {
          label: "关联SKU",
          fields: "skuList",
          close(item, row) {
            console.log(item);
            vm.delete({
              productRepoAttachmentRelIds: [row].map(
                item => item.productRepoAttachmentRelId
              ),
              variantId: item.productRepoId
            });
          }
        },
        {
          label: "操作",
          btns: [
            {
              type: "dropdown",
              name: "添加关联产品",
              fn(index, row) {
                vm.addRelated(row.productRepoAttachmentRelId);
              },
              children: [
                {
                  name: "添加关联产品",
                  fn(index, row) {
                    vm.addRelated(row.productRepoAttachmentRelId);
                  }
                },
                {
                  name: "添加附件",
                  fn(index, row) {
                    vm._dialog({
                      title: "添加",
                      fullscreen: true,
                      component: () => import("./addAccessory"),
                      params: {
                        productRepoAttachmentRelId:
                          row.productRepoAttachmentRelId,
                        getList() {
                          vm.getList();
                        }
                      }
                    });
                  }
                },
                {
                  name: "删除",
                  fn(index, row) {
                    console.log(row);
                    vm.delete({
                      productRepoAttachmentRelIds: [
                        row.productRepoAttachmentRelId
                      ]
                    });
                  }
                }
              ]
            }
          ]
        }
      ],
      tableData: [
        // {
        //   id: 1,
        //   date: "2016-05-02",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄",
        //   color: "red",
        //   disabled: true
        // },
        // {
        //   id: 2,
        //   date: "2016-05-04",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1517 弄",
        //   table: "biao"
        // },
        // {
        //   id: 5,
        //   date: "2016-05-01",
        //   name: "王小虎",
        //   btnList: [
        //     {
        //       name: "仓库SKU"
        //     },
        //     {
        //       name: "仓库SKU"
        //     },
        //     {
        //       name: "仓库SKU"
        //     }
        //   ],
        //   accessoryList: [
        //     {
        //       name: " 文件名称.jpg(12KB)"
        //     },
        //     {
        //       name: " 文件名称.jpg(12KB)"
        //     },
        //     {
        //       name: " 文件名称.jpg(12KB)"
        //     },
        //     {
        //       name: " 文件名称.jpg(12KB)"
        //     },
        //     {
        //       name: " 文件名称.jpg(12KB)"
        //     }
        //   ]
        // }
      ]
    };
  },
  created() {
    let vm = this;
    vm.bottomBtns[1].show = false;
  },
  mounted() {
    this.getList();
  },
  methods: {
    searchForm(val) {
      this.getList(val);
    },
    addRelated(productRepoAttachmentRelId = null) {
      let vm = this;
      vm._dialog({
        title: "添加",
        fullscreen: true,
        component: () => import("./addRelated"),
        params: {
          productRepoAttachmentRelId,
          getList() {
            vm.getList();
          },
          productRepoId: vm.editObj.productRepoId
        }
      });
    },
    delete(params) {
      let vm = this;
      vm.$api[`product/prProductRepoAnnexDelete`](params).then(() => {
        vm.getList();
      });
    },
    getList(search = {}) {
      let vm = this;
      vm.$api[`product/prProductRepoAnnexGet`]({
        productRepoId: vm.editObj.productRepoId,
        search: search.sku
      }).then(({ rows }) => {
        console.log(rows);
        rows.forEach(item => {
          item.annexList.forEach(i => {
            i.name = i.annexName;
          });
          item.skuList.forEach(i => {
            i.name = i.repoSku;
          });
        });
        vm.tableData = rows;
        console.log(vm.tableData);
      });
    }
  },
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
.accessory {
  background: #fff;
}
</style>