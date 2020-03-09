<template>
  <div class="variationInfor">
    <new-form
      ref="form"
      :is-dirty.sync="isDirty"
      v-model="form"
      label-width="170px"
      :form-schema="dataFormSchema"
      :validSuccess.sync="mustInfoFlag"
    ></new-form>
    <btns :btns="bottomBtns"></btns>
  </div>
</template>

<script>
import { Promise } from 'q';
export default {
  components: {
    btns: () => import("../common/btns")
  },
  props: {
    categoryId: {
      type: Number,
      default: null
    },
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
    return {
      mustInfoFlag:false,
      validSuccess: false,
      isDirty: false,
      form: {
        variantDifference: [
          // {
          //   repoSku: ""
          // },
          // {
          //   repoSku: ""
          // },
        ]
      },
      dataFormSchema: {
        variantDifference: {
          // 表格数据
          type: "table",
          label: "table",
          head: {
            color: {
              widget: "input",
              label: "颜色",
              noLabel: true,
              required: true
            },
            size: {
              widget: "input",
              options: [],
              label: "尺寸",
              noLabel: true,
              required: true
            }
          },
          rows: {
            label: "自定义SKU",
            value: "repoSku"
          }
        }
      }
    };
  },
  mounted() {

  },
  methods:{
     saveBtn(){
            let arr = [] 
            arr.push( this.$refs.ruleForm.validate())
            return Promise.all(arr).then(()=>{
                    return Promise.resolve({customsInforForm:this.ruleForm,customsInforTable:this.tableData})
            })

        }
  },
  async mounted() {
    let vm = this;
    // 获取表头
    await vm.$api[`product/cateSystemCategoryPropertyMPropertyList`]({
      type: 2,
      productType: 1,
      id: vm.categoryId
    }).then(({ rows = [] }) => {
      this.formatForm(rows);
      return Promise.resolve()
    });
    // 获取表数据;
    await vm.$api[`product/prProductRepoVariantGetComboBox`]({
      productRepoId: 90
    }).then(({ rows }) => {
      vm.form.variantDifference = rows;
      return Promise.resolve()
    });
    
  },
  watch: {
    validSuccess(val) {
      this.mustInfoFlag = val;
    },
    mustInfoFlag(v){
           this.$emit('update:isComplete2', !v);
        },
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
  },
  methods: {
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
      arr.forEach(item => {
        if (vm.utils.isArrLength(item.optionDataArray)) {
          item.optionDataArray = item.optionDataArray.map(i => {
            return {
              label: i.value,
              value: i.key
            };
          });
        }

        obj.variantDifference.head[item.field] = {
          ...{
            label: item.fieldName,
            noLabel: true,
            required: true,
            options: item.optionDataArray || []
          },
          ...vm.makeControlType(item.controlType)
        };
      });
      vm.dataFormSchema = obj;
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
        // case 7:
        //   return {
        //     widget: "editor"
        //   };
        case 8:
          return {
            widget: "select",
            allowCreate: true
          };
        case 9:
          return {
            widget: "radio"
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
    saveBtn() {
      return  this.$refs.form.validate().then(()=>{
                  return Promise.resolve({variantDifference:this.form.variantDifference})
              }).catch(()=>{
                  return Promise.reject(false)
              })
    }
  }
};
</script>

<style lang='scss'>
.variationInfor {
  background: #fff;
}
</style>