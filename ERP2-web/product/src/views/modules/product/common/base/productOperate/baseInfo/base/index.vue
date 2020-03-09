<template>
  <div class="base">
    <new-form
      ref="form"
      :is-dirty.sync="isDirty"
      v-model="editObj.base.form"
      label-width="170px"
      :form-schema="dataFormSchema"
      :validSuccess.sync="editObj.base.mustInfoFlag"
      :key="indexKey"
    ></new-form>
    <el-button type="text" style="margin-left: 170px;" @click="handleClick(isHide)">
      添加更多信息填写
      <i :class="!isHide ? 'el-icon-arrow-down': 'el-icon-arrow-up'"></i>
    </el-button>
    <btns :btns="bottomBtns"></btns>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  components: {
    btns: () => import("../common/btns")
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    bottomBtns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    let vm = this;
    return {
      isHide: true,
      isDirty: false,
      loadFlag: false,
      indexKey: null,
      // form: {
      //   nameCn: null,
      //   nameEn: null,
      //   variantTitleFlag: null,
      //   warehouseId: null,
      //   purchaseUserId: null,
      //   developUserId: null,
      //   productType: null,
      //   riskType: null,
      //   logisticType: null,
      //   plugFlag: null,
      //   brandId: null,
      //   platformIds: null,
      //   grossWeight: null,
      //   netWeight: null,
      //   weightUnit: null,
      //   singleLength: null,
      //   singleWidth: null,
      //   singleHeight: null,
      //   singleLengthUnit: null,
      //   packageLength: null,
      //   packageWidth: null,
      //   packageHeight: null,
      //   packageLengthUnit: null,
      //   lowestPrice: null,
      //   lowestPriceCurrency: null,
      //   presaleFlag: null,
      //   time: null,
      //   feature: null,
      //   list: null,
      //   overseaFlag: null,
      //   seoTitle: null,
      //   seoKeyword: null,
      //   seoDesc: null,
      //   presaleDate: null
      // },
      dataFormSchema: {
        nameCn: {
          label: "产品中文名称",
          required: true,
          hidden: true
        },
        nameEn: {
          label: "产品英文名称",
          required: true
        },
        variantTitleFlag: {
          label: "变体属性是否加入名称",
          widget: "switch",
          tip: {
            // 帮助信息
            content: "把变体属性加入到变体产品中，如袜子-红色-大码", // 内容
            icon: "el-icon-question" // 图标
          },
          required: true
        },
        warehouseId: {
          label: "发货仓库",
          widget: "select",
          options: [
            {
              label: "1",
              value: 1
            }
          ],
          rightBtn: {
            type: "text",
            name: "添加",
            fn() {
              vm._dialog({
                title: "添加仓库",
                fullscreen: true,
                component: () => import("./addWarehose/index")
              });
            }
          },
          required: true
        },
        purchaseUserId: {
          label: "采购人员",
          widget: "select",
          options: [
            {
              label: "1",
              value: 1
            }
          ],
          rightBtn: {
            type: "text",
            name: "添加",
            fn() {}
          },
          required: true
        },
        developUserId: {
          label: "开发人员",
          widget: "select",
          options: [],
          rightBtn: {
            type: "text",
            name: "添加",
            fn() {}
          },
          required: true
        },
        productType: {
          label: "产品类型",
          widget: "select",
          options: [],
          required: true
        },
        riskType: {
          label: "产品侵权风险",
          widget: "select",
          options: [],
          required: true
        },
        logisticType: {
          label: "产品物流属性",
          widget: "select",
          options: [
            {
              label: "1",
              value: 1
            }
          ],
          required: true
        },
        plugFlag: {
          label: "强电插头",
          widget: "switch"
        },
        plugType: {
          label: "选择插头规格",
          widget: "checkbox",
          options: [],
          required: true,
          hidden: data => {
            if (data.plugFlag == 0) {
              return true;
            } else {
              return false;
            }
          }
        },
        plugAddNameFlag: {
          label: "是否加入中文名称",
          widget: "switch",
          hidden: data => {
            if (data.plugFlag == 0) {
              return true;
            } else {
              return false;
            }
          }
        },
        brandId: {
          label: "选择品牌",
          widget: "select",
          options: [
            {
              label: "1",
              value: 1
            }
          ],
          rightBtn: {
            type: "text",
            name: "添加",
            fn() {
              vm._dialog({
                title: "添加品牌",
                fullscreen: true,
                component: () => import("./addBrand/index")
              });
            }
          }
        },
        platformIds: {
          label: "仅上架平台",
          widget: "select",
          multi: true,
          tip: {
            // 帮助信息
            content: "配置后只能上架到选择的这些平台", // 内容
            icon: "el-icon-question" // 图标
          },
          options: [
            {
              label: "1",
              value: 1
            },
            {
              label: "2",
              value: 2
            }
          ]
        },
        grossWeight: {
          label: "单个产品重量",
          span: 12,
          // label前置或者后置
          pend: {
            type: "prepend", // [prepend | append],
            text: "毛重"
          },
          required: true
        },
        netWeight: {
          span: 9,
          // label前置或者后置
          pend: {
            type: "prepend", // [prepend | append]
            text: "净重"
          },
          required: true
        },
        weightUnit: {
          widget: "select",
          span: 3,
          options: [
            {
              label: "1",

              value: 1
            }
          ],
          required: true
        },
        singleLength: {
          label: "单个产品尺寸",
          span: 9,
          pend: {
            type: "prepend",
            text: "长"
          }
        },
        singleWidth: {
          span: 6,
          pend: {
            type: "prepend",
            text: "宽"
          }
        },
        singleHeight: {
          span: 6,
          pend: {
            type: "prepend",
            text: "高"
          }
        },
        singleLengthUnit: {
          span: 3,
          widget: "select",
          options: [
            {
              label: "1",
              value: 1
            }
          ]
        },
        packageLength: {
          label: "单个包装尺寸",
          span: 9,
          pend: {
            type: "prepend",
            text: "长"
          }
        },
        packageWidth: {
          span: 6,
          pend: {
            type: "prepend",
            text: "宽"
          }
        },
        packageHeight: {
          span: 6,
          pend: {
            type: "prepend",
            text: "高"
          }
        },
        packageLengthUnit: {
          span: 3,
          widget: "select",
          options: [
            {
              label: "1",
              value: 1
            }
          ]
        },
        lowestPrice: {
          label: "产品最低销售价",
          span: 21,
          required: true
        },
        lowestPriceCurrency: {
          span: 3,
          widget: "select",
          options: [
            {
              label: "1",
              value: 1
            }
          ]
        },
        presaleFlag: {
          label: "是否预售",
          widget: "switch",
          span: 3
        },

        presaleDate: {
          label: "预售到货日期",
          widget: "datetime",
          time: true,
          hidden: data => {
            if (data.presaleFlag == 0) {
              return true;
            } else {
              return false;
            }
          },
          span: 21
        },
        time: {
          label: "出售时间",
          widget: "daterange",
          time: true // 是否显示时间
        },
        feature: {
          label: "产品特征亮点",
          widget: "textarea",
          required: true
        },
        list: {
          label: "包装清单",
          widget: "textarea",
          required: true
        },
        overseaFlag: {
          label: "是否支持海外仓直采",
          widget: "switch"
        },
        photoFlag: {
          label: "是否拍照",
          widget: "switch",
          span: 3,
          required: true
        }
      }
    };
  },
  async created() {
    let vm = this;
    vm.bottomBtns[1].show = false;
    await vm.$api[`product/cateSystemCategoryPropertyMPropertyList`]({
      type: 1,
      productType: 1,
      id: vm.editObj.categoryId
    }).then(({ rows = [] }) => {
      let dataFormSchema = vm.utils.clone(vm.dataFormSchema);
      let len = rows.length;
      for (let i = 0; i < len; i += 1) {
        let item = rows[i];
        if (item.show == 1) {
          if (vm.utils.isObject(dataFormSchema[item.field])) {
            dataFormSchema[item.field].hidden = false;
            if (item.field == "plugType" || item.field == "plugAddNameFlag") {
              dataFormSchema[item.field].hidden = data => {
                if (data.plugFlag == 0) {
                  return true;
                } else {
                  return false;
                }
              };
            }
            if (item.field == "presaleDate") {
              dataFormSchema[item.field].hidden = data => {
                if (data.presaleFlag == 0) {
                  return true;
                } else {
                  return false;
                }
              };
            }
            if (
              item.field != "netWeight" &&
              item.field != "weightUnit" &&
              item.field != "singleWidth" &&
              item.field != "singleHeight" &&
              item.field != "packageWidth" &&
              item.field != "packageHeight" &&
              item.field != "packageLengthUnit" &&
              item.field != "grossWeight" &&
              item.field != "packageLength" &&
              item.field != "singleLength" &&
              item.field != "lowestPriceCurrency" &&
              item.field != "singleLengthUnit"
            ) {
              dataFormSchema[item.field].label = item.fieldName;
            }
            dataFormSchema[item.field].required = !!item.required;
          } else {
            if (
              item.field == "seoTitle" ||
              item.field == "seoKeyword" ||
              item.field == "seoDesc"
            ) {
              continue;
            }
            dataFormSchema[item.field] = {
              label: item.fieldName,
              required: !!item.required,
              ...vm.makeControlType(item.controlType)
            };
          }
        } else {
          dataFormSchema[item.field].hidden = true;
        }
      }

      vm.dataFormSchema = {
        ...dataFormSchema,
        seoTitle: {
          label: "SEO标题",
          widget: "textarea",
          hidden: () => this.isHide
        },
        seoKeyword: {
          label: "SEO关键词",
          widget: "textarea",
          hidden: () => this.isHide
        },
        seoDesc: {
          label: "SEO描述",
          widget: "textarea",
          hidden: () => this.isHide
        }
      };
    });
    await this.getGlWarehouseGetComboBox();
    await this.getGlBrandGetComboBox();
    await this.getGlEnumList("Repo-Product-Type");
    await this.getGlEnumList("Repo-Risk-Type");
    await this.getGlEnumList("Repo-Logistic-Type");
    await this.getGlEnumList("Repo-Plug-Type");
    await this.getGlEnumList("Repo-Weight-Unit");
    await this.getGlEnumList("Repo-Length-Unit");
    await this.getGlEnumList("Repo-Currency-Unit");
    await this.getPlatList();
    await vm.$api[`product/SMpermissionUserList`]({
      types: ["Purchase", "Develop"]
    }).then(({ rows }) => {
      rows.forEach(item => {
        if (item.type == "Purchase") {
          vm.dataFormSchema.purchaseUserId.options = item.users.map(i => {
            return {
              label: i.userName,
              value: i.userId
            };
          });
          vm.dataFormSchema = {
            ...vm.dataFormSchema
          };
        } else if (item.type == "Develop") {
          vm.dataFormSchema.developUserId.options = item.users.map(i => {
            return {
              label: i.userName,
              value: i.userId
            };
          });
          vm.dataFormSchema = {
            ...vm.dataFormSchema
          };
        }
      });
    });
  },
  computed: {
    ...mapState("common", [
      "glWarehouseGetComboBox",
      "glBrandGetComboBox",
      "productTypeList", // 产品类型
      "riskTypeList", // 侵权风险
      "logisticTypeList", // 物流属性
      "plugTypeList", // 插头规格
      "platList", // 平台
      "weightUnitList", // 重量
      "currencyUnitList", // 货币
      "lengthUnitList" // 长度
    ]),
    editObj: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {
    glWarehouseGetComboBox(val) {
      let vm = this;
      let data = vm.utils.clone(this.dataFormSchema);
      data.warehouseId.options = val;
      vm.dataFormSchema = {
        ...data
      };
    },
    productTypeList(val) {
      let vm = this;
      let data = vm.utils.clone(this.dataFormSchema);
      data.productType.options = val;
      vm.dataFormSchema = {
        ...data
      };
    },
    riskTypeList(val) {
      let vm = this;
      let data = vm.utils.clone(this.dataFormSchema);
      data.riskType.options = val;
      vm.dataFormSchema = {
        ...data
      };
    },
    logisticTypeList(val) {
      let vm = this;
      let data = vm.utils.clone(this.dataFormSchema);
      data.logisticType.options = val;
      vm.dataFormSchema = {
        ...data
      };
    },
    plugTypeList(val) {
      let vm = this;
      let data = vm.utils.clone(this.dataFormSchema);
      data.plugType.options = val;
      vm.dataFormSchema = {
        ...data
      };
    },
    platList(val) {
      let vm = this;
      let data = vm.utils.clone(this.dataFormSchema);
      data.platformIds.options = val;
      vm.dataFormSchema = {
        ...data
      };
    },
    weightUnitList(val) {
      let vm = this;
      let data = vm.utils.clone(this.dataFormSchema);
      data.weightUnit.options = val;
      vm.dataFormSchema = {
        ...data
      };
    },
    lengthUnitList(val) {
      let vm = this;
      let data = vm.utils.clone(this.dataFormSchema);
      data.packageLengthUnit.options = val;
      data.singleLengthUnit.options = val;
      vm.dataFormSchema = {
        ...data
      };
    },
    currencyUnitList(val) {
      let vm = this;
      let data = vm.utils.clone(this.dataFormSchema);
      data.lowestPriceCurrency.options = val;
      vm.dataFormSchema = {
        ...data
      };
    },
    glBrandGetComboBox(val) {
      let vm = this;
      let data = vm.utils.clone(this.dataFormSchema);
      data.brandId.options = val;
      vm.dataFormSchema = {
        ...data
      };
    },
    form(val) {
      this.editObj.base.form = val;
    }
  },
  methods: {
    ...mapActions("common", [
      "getGlWarehouseGetComboBox",
      "getGlBrandGetComboBox",
      "getGlEnumList",
      "getPlatList"
    ]),
    makeControlType(controlType) {
      switch (controlType) {
        case 1:
          return {
            widget: "input"
          };
        case 2:
          return {
            widget: "select"
          };
        case 3:
          return {
            widget: "select",
            multi: true
          };
        case 4:
          return {
            widget: "textarea"
          };
        case 5:
          return {
            widget: "switch"
          };
        case 6:
          return {
            widget: "daterange"
          };
        case 7:
          return {
            widget: "editor"
          };
        case 8:
          return {
            widget: "select",
            allowCreate: true
          };
        case 9:
          return {
            widget: "switch"
          };
        case 11:
          return {
            widget: "checkbox"
          };
        case 12:
          return {
            widget: "select",
            allowCreate: true,
            multi: true
          };
      }
    },
    edit(params) {
      console.log(params);
    },
    submit() {},
    handleClick(val) {
      this.isHide = !this.isHide;
      this.dataFormSchema["seoTitle"].hidden = () => !val;
      this.dataFormSchema["seoKeyword"].hidden = () => !val;
      this.dataFormSchema["seoDesc"].hidden = () => !val;
    }
  }
};
</script>

<style lang='scss'>
.base {
  background: #fff;
}
</style>