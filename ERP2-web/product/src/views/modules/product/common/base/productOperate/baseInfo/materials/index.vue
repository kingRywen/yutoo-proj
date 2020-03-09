<template>
  <div class="materials">
    <ElForm :model="form" ref="form" size="small">
      <t-form-item
        :list="variantPropertyist"
        type="select"
        :value.sync="form.variantPropertyId"
        prop="variantPropertyId"
        width="300px"
      ></t-form-item>
    </ElForm>
    <customTable
      :tableData="topList"
      :columns="topColumns"
      :searchConfig="topSearchConfig"
      rowKey="propertyId"
      v-model="topSelectData"
      :hasSearch="false"
    ></customTable>
    <flodText
      text="展开具体包装材料"
      style="margin: 30px 0"
      v-model="isHide"
      left="0px"
      @handleClick="val => isHide = !val"
    ></flodText>
    <customTable
      v-if="isHide"
      :tableData="downList"
      :columns="downColumns"
      :searchConfig="downSearchConfig"
      rowKey="materialId"
      v-model="downSelectData"
      @searchForm="searchForm"
    ></customTable>
    <btns :btns="bottomBtns"></btns>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
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
      isHide: false,
      form: {
        variantPropertyId: null
      },
      variantPropertyist: [],
      topSelectData: [],
      downSelectData: [],
      topList: [],
      downList: [],
      topColumns: [
        {
          label: "属性名称",
          value: "variantPropertyName"
        },
        {
          label: "包材名称",
          fields: "materialList",
          close(item, row) {
            vm.delete({
              id: item.id,
              materialType: 2,
              variantPropertyId: row.variantPropertyId
            });
          }
        },
        {
          label: "操作",
          btns: [
            {
              name: "编辑包装材料",
              type: "dropdown",
              async fn(index, item) {
                await await vm.edit(
                  {
                    variantPropertyId: item.variantPropertyId
                  },
                  2
                );
              },
              children: [
                {
                  name: "编辑包装材料",
                  async fn(index, item) {
                    await await vm.edit(
                      {
                        variantPropertyId: item.variantPropertyId
                      },
                      2
                    );
                  }
                },
                {
                  name: "删除",
                  fn(index, item) {
                    vm.delete({
                      variantPropertyId: item.variantPropertyId,
                      materialType: 2
                    });
                  }
                }
              ]
            }
          ]
        }
      ],
      downColumns: [
        {
          label: "仓库SKU",
          value: "repoSku"
        },
        {
          label: "包材名称",
          fields: "materialList",
          close(item, row) {
            vm.delete({
              materialType: 1,
              materialIds: [row.materialId],
              id: item.id
            });
          }
        },
        {
          label: "操作",
          btns: [
            {
              name: "编辑包装材料",
              type: "dropdown",
              async fn(index, item) {
                await vm.edit({
                  materialId: item.materialId
                });
              },
              children: [
                {
                  name: "编辑配件",
                  async fn(index, item) {
                    await vm.edit({
                      materialId: item.materialId
                    });
                  }
                },
                {
                  name: "删除",
                  fn(index, row) {
                    console.log(row);
                    vm.delete({
                      materialIds: [row.materialId],
                      materialType: 1
                    });
                  }
                }
              ]
            }
          ]
        }
      ],
      topSearchConfig: [],
      downSearchConfig: [
        {
          name: "添加",
          type: "add",
          fn() {
            vm._dialog({
              title: "添加包材",
              fullscreen: true,
              component: () => import("./addMaterials/"),
              params: {
                params: {
                  productRepoId: vm.editObj.productRepoId,
                  materialType: 1
                },
                productRepoId: vm.editObj.productRepoId,
                isShowSku: true,
                getList() {
                  vm.getList({
                    variantPropertyId: vm.form.variantPropertyId
                  });
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
                  materialIds: val.map(item => item.materialId),
                  materialType: 1
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
  async created() {
    let vm = this;
    vm.bottomBtns[1].show = false;
    await vm.getVariantList({
      type: 1,
      productType: 1,
      id: vm.editObj.categoryId
    });
  },
  watch: {
    variantList(val) {
      let vm = this;
      vm.variantPropertyist = val;
      if (vm.utils.isArrLength(val)) {
        console.log(val);
        vm.form.variantPropertyId = val[0].value;
      }
    },
    "form.variantPropertyId"(val) {
      console.log(val);
      this.getList({
        variantPropertyId: val
      });
    }
  },
  computed: {
    ...mapState("common", ["variantList"]),
    editObj: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    ...mapActions("common", ["getVariantList"]),
    getList(params = {}) {
      let vm = this;
      params = {
        ...params,
        productRepoId: vm.editObj.productRepoId
      };
      vm.$api[`product/prProductRepoPackageMaterialGet`](params).then(
        ({ rows }) => {
          let { topList, downList } = rows;
          this.topList = topList;
          this.downList = downList;
        }
      );
    },
    delete(params) {
      let vm = this;
      params = {
        ...params,
        parentProductId: vm.editObj.productRepoId
      };
      vm.$api[`product/prProductRepoPackageMaterialDelete`](params).then(() => {
        vm.getList({
          variantPropertyId: vm.form.variantPropertyId
        });
      });
    },
    edit(id, materialType = 1) {
      let vm = this;
      return vm.$api[`product/prProductRepoPackageMaterialInfo`]({
        productRepoId: vm.editObj.productRepoId,
        ...id
      }).then(({ rows }) => {
        vm.operate(
          {
            productRepoId: vm.editObj.productRepoId,
            materialType,
            ...id
          },
          rows
        );
        return Promise.resolve();
      });
    },
    operate(params, selectData = null) {
      let vm = this;
      vm._dialog({
        title: "添加包材",
        fullscreen: true,
        component: () => import("./addMaterials/"),
        params: {
          params,
          isShowSku: false,
          getList() {
            vm.getList({
              variantPropertyId: vm.form.variantPropertyId
            });
          },
          selectData
        }
      });
    },
    searchForm(search) {
      let vm = this;
      this.getList({
        ...search,
        variantPropertyId: vm.form.variantPropertyId
      });
    }
  },
  components: {
    btns: () => import("../common/btns"),
    customTable: () => import("../../../components/customTable/src/"),
    flodText: () => import("../common/flodText.vue")
  }
};
</script>

<style lang='scss'>
.materials {
  background: #fff;
}
</style>