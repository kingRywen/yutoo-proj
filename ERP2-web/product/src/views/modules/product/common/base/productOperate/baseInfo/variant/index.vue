<template>
  <div class="variant">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <t-form-item
        :value.sync="editObj.variant.parentRepoSku"
        prop="parentRepoSku"
        label="父产品仓库SKU:"
      ></t-form-item>
      <ElRow class="variant-title">
        <ElCol :span="22" style="padding-left: 10px">变体属性</ElCol>
        <ElCol :span="2">
          <ElButton type="text" @click="handleCategory">添加类目变体属性</ElButton>
        </ElCol>
      </ElRow>
      <add-variant
        @addVariant="handleAddVariant"
        v-model="editObj.variant.addVariant"
        :categoryId="editObj.categoryId"
      ></add-variant>
      <custom-table
        v-if="editObj.variant.generateVariant.list.length"
        class="mgt"
        :searchConfig="searchConfig"
        :columns="columns"
        :tableData="editObj.variant.generateVariant.list"
        :moreColumns="moreColumns"
        rowKey="productRepoId"
      ></custom-table>
      <btns :btns="bottomBtns"></btns>
    </ElForm>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  components: {
    addVariant: () => import("./addVariant"),
    btns: () => import("../common/btns")
  },
  props: {
    params: {
      type: Object,
      default: () => {
        return {
          sourceType: 1
        };
      }
    },
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
    // eslint-disable-next-line no-unused-vars
    let vm = this;
    return {
      form: {
        parentRepoSku: ""
      },
      rules: {},
      searchConfig: [
        {
          type: "add",
          name: "添加变体",
          fn() {
            vm.editObj.variant.generateVariant.list.push({
              repoSku: "",
              productVariantList: vm.addVariantArr
            });
          }
        },
        {
          type: "batch",
          btns: [
            {
              name: "删除",
              fn(data) {
                let deleteVariantIds = [];
                data.forEach(item => {
                  if (!vm.utils.isEmpty(item.productRepoId)) {
                    deleteVariantIds.push(item.productRepoId);
                  }
                });
                vm.$set(
                  vm.editObj.variant.form,
                  "deleteVariantIds",
                  deleteVariantIds
                );
                vm.editObj.variant.generateVariant.list = vm.editObj.variant.generateVariant.list.filter(
                  item => {
                    return data.every(i => !vm.utils.isSame(item, i));
                  }
                );
              }
            }
          ]
        }
      ],
      columns: [
        {
          label: "系统SKU",
          value: "sysSku"
        },
        {
          label: "仓库SKU",
          value: "repoSku",
          type: "input"
        }
      ],
      moreColumns: [],
      addVariantArr: []
    };
  },
  watch: {
    infoSignFlag: {
      deep: true,
      handler(val) {
        this.$set(this.editObj.variant, "mustInfoFlag", val);
      }
    },
    "form.parentRepoSku"(val) {
      if (val) {
        this.$set(this.editObj.variant.form, "parentRepoSku", val);
      }
    },
    "editObj.variant.generateVariant": {
      deep: true,
      immediate: true,
      handler(val) {
        let { title, list } = val;
        let vm = this;
        if (!vm.utils.isArrLength(title) || !vm.utils.isArrLength(list)) {
          return;
        }
        vm.addVariantArr = title.map(item => {
          return {
            categoryPropertyId: item.labelId,
            propertyName: item.name,
            propertyValue: "",
            propertyValueShort: ""
          };
        });
        vm.moreColumns = title.map(item => {
          let obj = { label: item.name, value: item.value };
          if (item.name == "颜色" || item.name == "尺码") {
            obj.type = "btn";
            obj.fn = function(index, idx, row, value) {
              if (value == "color") {
                vm.handleChose("color", index, idx);
              } else {
                vm.handleChose("size", index, idx);
              }
            };
          } else {
            obj.input = true;
          }
          return obj;
        });
        vm.moreColumns.push({
          label: "操作",
          btns: [
            {
              name: "移除",
              fn(index, item) {
                if (!vm.utils.isEmpty(item.productRepoId)) {
                  vm.editObj.variant.deleteVariantIds.push(item.productRepoId);
                }
                vm.editObj.variant.generateVariant.list.splice(index, 1);
              }
            }
          ]
        });
        vm.$set(vm.editObj.variant, "productVariantList", list);
      }
    }
  },
  created() {
    this.bottomBtns[1].show = true;
  },
  computed: {
    editObj: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    infoSignFlag: {
      // 切换三角符号是否影藏
      get() {
        let vm = this;
        return (
          vm.editObj.variant.generateVariant.list.length &&
          vm.editObj.variant.generateVariant.list.every(item => {
            return (
              item.productVariantList.every(i => i.propertyValue) &&
              item.repoSku
            );
          }) &&
          !!vm.editObj.variant.parentRepoSku
        );
      }
    }
  },

  methods: {
    ...mapActions("common", ["getVariantList"]),
    formatForm(form) {
      return form;
    },
    handleCategory() {
      let vm = this;
      this._dialog({
        title: "添加变体属性",
        width: "80%",
        component: () => import("./addVariantProperty"),
        params: {
          categoryId: vm.editObj.categoryId,
          async change() {
            await vm.getVariantList({
              type: 1,
              productType: 1,
              id: vm.editObj.categoryId
            });
          }
        }
      });
    },
    handleAddVariant(propertyList) {
      let vm = this;
      vm.$api[`product/prProductRepoVariantGenerate`]({
        parentRepoSku: vm.editObj.variant.parentRepoSku,
        propertys: propertyList
      }).then(({ rows }) => {
        vm.editObj.variant.generateVariant = rows;
      });
    },
    handleChose(type, index, idx) {
      let vm = this;
      if (type == "color") {
        vm._dialog({
          fullscreen: true,
          title: "选择颜色",
          component: () => import("./choseColor"),
          params: {
            getColorForm: colors => {
              if (colors.length > 1) {
                console.log("只能选一个");
                return;
              }
              let obj =
                vm.editObj.variant.generateVariant.list[index]
                  .productVariantList[idx];
              obj.propertyValue = colors[0].labelCn;
              obj.propertyValueShort = colors[0].labelEn;
              obj.variantPropertyValueId = colors[0].value;
              vm.$set(
                vm.editObj.variant.generateVariant.list[index]
                  .productVariantList,
                idx,
                obj
              );
            }
          }
        });
      } else {
        vm._dialog({
          fullscreen: true,
          title: "选择尺寸",
          component: () => import("./choseSize"),
          params: {
            getColorForm: sizes => {
              if (sizes.length > 1) {
                console.log("只能选一个");
                return;
              }
              let obj =
                vm.editObj.variant.generateVariant.list[index]
                  .productVariantList[idx];
              obj.propertyValue = sizes[0].labelCn;
              obj.propertyValueShort = sizes[0].labelEn;
              obj.variantPropertyValueId = sizes[0].value;
              vm.$set(
                vm.editObj.variant.generateVariant.list[index]
                  .productVariantList,
                idx,
                obj
              );
            }
          }
        });
      }
    }
  }
};
</script>

<style lang='scss'>
.variant {
  background: #fff;
  .mgt {
    margin-top: 10px;
  }
  .variant-title {
    font-size: 12px;
    height: 30px;
    background: rgba(242, 242, 242, 1);
    line-height: 30px;
  }
}
</style>