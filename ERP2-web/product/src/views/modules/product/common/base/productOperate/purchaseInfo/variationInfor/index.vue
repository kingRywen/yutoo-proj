<template>
  <div class="variant-differ">
    <new-form
      ref="form"
      :is-dirty.sync="isDirty"
      v-model="editObj.variantDiffer.form"
      label-width="170px"
      :form-schema="dataFormSchema"
      :validSuccess.sync="editObj.variantDiffer.mustInfoFlag"
    ></new-form>
  </div>
</template>

<script>
export default {
  components: {
    btns: () => import("../../baseInfo/common/btns")
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      validSuccess: false,
      isDirty: false,
      form: {
        variantDifference: []
      },
      dataFormSchema: {
        variantDifference: {
          // 表格数据
          type: "table",
          label: "table",
          head: {
            // color: {
            //   widget: "input",
            //   label: "颜色",
            //   noLabel: true,
            //   required: true
            // },
            // size: {
            //   widget: "input",
            //   options(item) {
            //     console.log(item);
            //     return Promise.resolve();
            //   },
            //   label: "尺寸",
            //   noLabel: true,
            //   required: true
            // }
          },
          rows: {
            label: "自定义SKU",
            value: "repoSku"
          }
        }
      }
    };
  },
  mounted() {},
  async created() {
    let vm = this;
    // 获取表头
    await vm.$api[`product/cateSystemCategoryPropertyMPropertyList`]({
      type: 2,
      productType: 1,
      id: vm.editObj.categoryId
    }).then(({ rows = [] }) => {
      this.formatForm(rows);
    });
    // 获取表数据;
    if (vm.editObj.variantDiffer.form.variantDifference.length) {
      return;
    }
    await vm.$api[`product/prProductRepoVariantGetComboBox`]({
      productRepoId: vm.editObj.productRepoId // 动态的，需要改
    }).then(({ rows }) => {
      vm.editObj.variantDiffer.form.variantDifference = rows;
    });
  },
  watch: {
    validSuccess(val) {
      this.editObj.variantDiffer.mustInfoFlag = val;
    },
    form: {
      deep: true,
      handler(val) {
        this.editObj.variantDiffer.form = val;
      }
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
  methods: {
    saveBtn() {
      return  this.$refs.form.validate().then(()=>{
                  return Promise.resolve({variantDifference:this.form.variantDifference})
              }).catch(()=>{
                  return Promise.reject(false)
              })
    },
    submit() {},
    formatForm(arr = []) {
      let vm = this;
      let obj = {
        variantDifference: {
          type: "table",
          label: "table",
          head: {},
          rows: {
            label: "自定义SKU",
            value: "repoSku"
          }
        }
      };
      arr.forEach(async (item, index) => {
        if (item.enumName) {
          obj.variantDifference.head[item.field] = {
            ...{
              label: item.fieldName,
              noLabel: true,
              required: true,
              options: await vm.dealHeadOptions(item.enumName)
            },
            ...vm.makeControlType(item.controlType)
          };
        } else {
          obj.variantDifference.head[item.field] = {
            ...{
              label: item.fieldName,
              noLabel: true,
              required: true,
              options: await vm.dealHeadOptions(item.field)
            },
            ...vm.makeControlType(item.controlType)
          };
        }
        if (index == arr.length - 1) {
          vm.dataFormSchema = {
            ...obj
          };
        }
      });
    },
    async dealHeadOptions(name) {
      let vm = this;
      let isEnumName = /^Repo/g.test(name);
      if (isEnumName) {
        let result = await vm.$api[`product/glEnumList`]({
          enumName: name
        });
        return result.rows.map(item => {
          return {
            label: item.labelCn,
            value: item.value
          };
        });
      } else {
        let activeFlagArr = [
          {
            label: "是",
            value: 1
          },
          {
            label: "否",
            value: 0
          }
        ];
        switch (name) {
          case "variantTitleFlag":
            return activeFlagArr;
          case "plugFlag":
            return activeFlagArr;
          case "presaleFlag":
            return activeFlagArr;
          case "overseaFlag":
            return activeFlagArr;
          case "developUserId":
            return vm.permissionUserList("developUserId");
          case "purchaseUserId":
            return vm.permissionUserList("purchaseUserId");
          case "brandId":
            return await vm.$api[`product/constantBrandType`]({})
              .then(({ rows }) => {
                return Promise.resolve(
                  rows.map(item => {
                    return {
                      label: item.name,
                      value: item.id
                    };
                  })
                );
              })
              .catch(() => {
                return Promise.resolve([]);
              });
          case "platformIds":
            return await vm.$api[`product/glPlatList`]({})
              .then(({ rows }) => {
                return Promise.resolve(
                  rows.map(item => {
                    return {
                      label: item.platName,
                      value: item.platId
                    };
                  })
                );
              })
              .catch(() => {
                return Promise.resolve([]);
              });
          case "warehouseId":
            return await vm.$api[`product/glWarehouseGetComboBox`]({})
              .then(({ rows }) => {
                return Promise.resolve(
                  rows.map(item => {
                    return {
                      label: item.name,
                      value: item.id
                    };
                  })
                );
              })
              .catch(() => {
                return Promise.resolve([]);
              });

          default:
            return [];
        }
      }
    },
    async permissionUserList(field) {
      let vm = this;
      let result = [];
      let types = [];
      if (field == "developUserId") {
        types = ["Develop"];
      } else {
        types = ["Purchase"];
      }
      await vm.$api[`product/permissionUserList`]({
        types
      })
        .then(({ rows }) => {
          if (field == "developUserId") {
            result = rows
              .find(item => item.type == "Develop")
              .users.map(i => {
                return {
                  label: i.userName,
                  value: i.userId
                };
              });
          } else if (field == "purchaseUserId") {
            result = rows
              .find(item => item.type == "Purchase")
              .users.map(i => {
                return {
                  label: i.userName,
                  value: i.userId
                };
              });
          }
          return Promise.resolve();
        })
        .catch(() => {
          return Promise.resolve([]);
        });
      return result;
    },
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
    click() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log("success");
        }
      });
    }
  }
};
</script>

<style lang='scss'>
.variant-differ {
  background: #fff;
}
</style>