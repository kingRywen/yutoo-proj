<template>
  <div class="twp-dialog-form">
    <ElForm
      :model="form"
      ref="form"
      :size="formConfig.globalConfig && formConfig.globalConfig.size || 'small '"
      :label-width="formConfig.globalConfig && formConfig.globalConfig.labelWidth || '60px'"
      class="twp-form"
      :rules="rules"
    >
      <form-item :items="formConfig.items || []" :value.sync="form"></form-item>
    </ElForm>
  </div>
</template>
<script>
/**
 * 使用  <twp-form ref="twpform" :formConfig="formConfig" :value.sync="form"></twp-form>
 * */

import formItem from './formItem/index'
export default {
  name: 'twp-form',
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formConfig: {
      // type input  select  mult  time  table radio active
      type: Object,
      default: () => {
        return {
          // globalConfig: {
          //   size: 'small',
          //   labelWidth: '60px'
          // },
          // items: [
          //   {
          //     type: 'input',
          //     value: 'name',
          //     label: '名字',
          //     frontLabel: '122',
          //     backLabel: '333',
          //     rules: {
          //       type: 'number',
          //       required: false
          //     }
          //   },
          //   {
          //     type: 'input',
          //     value: 'name1',
          //     label: '名字1',
          //     rules: {
          //       type: 'number',
          //       must: false,  // 是否需要红星
          //       required: false  //是否验证
          //     }
          //   },
          //   {
          //     type: 'table',
          //     config: {
          //       title: 'biaodan',
          //       thead: [
          //         {
          //           label: '名字'
          //         },
          //         {
          //           label: '名字1'
          //         },
          //         {
          //           label: '名字2'
          //         }
          //       ],
          //       tbody: [
          //         [
          //           [
          //             {
          //               type: 'input',
          //               value: 'name1',
          //               span: 12
          //             },
          //             {
          //               type: 'input',
          //               value: 'name1',
          //               span: 12
          //             }
          //           ],
          //           [
          //             {
          //               type: 'input',
          //               value: 'name3',
          //               span: 24
          //             }
          //           ],
          //           {
          //             type: 'string',
          //             value: 'aaaa'
          //           }
          //         ]
          //       ]
          //     }
          //   }
          // ]
        }
      }
    }
  },
  created() {
    let vm = this
    if (vm.formConfig.items && vm.$.dataType(vm.formConfig.items) === 'Array') {
      vm.formConfig.items.map(item => {
        // 初始化表单验证数据
        if (item.type == 'mult' || item.type == 'time') {
          this.$set(vm.form, item.value, [])
        }
        if (
          item.type == 'table' &&
          item.config &&
          item.config.tbody &&
          Array.isArray(item.config.tbody)
        ) {
          item.config.tbody.map(el => {
            if (Array.isArray(el)) {
              el.map(elm => {
                if (vm.$.dataType(elm) === 'Array') {
                  elm.map(i => {
                    if (
                      i.type != 'string' &&
                      (i.type == 'mult' || i.type == 'time')
                    ) {
                      vm.$set(vm.form, i.value, [])
                    }
                  })
                } else if (vm.$.dataType(elm) === 'Object') {
                  if (
                    elm.type != 'string' &&
                    (elm.type == 'mult' || elm.type == 'time')
                  ) {
                    vm.$set(vm.form, elm.value, [])
                  }
                }
              })
            }
            // if (el.items && Array.isArray(el.items)) {
            //   el.items.map(elm => {
            //     if (elm.type == 'mult') {
            //       vm.$set(vm.form, elm.value, [])
            //     }
            //   })
            // }
          })
        }
      })
    }
  },
  data() {
    let vm = this
    let validate = []
    if (this.formConfig.items && Array.isArray(this.formConfig.items)) {
      this.formConfig.items.map(item => {
        // 表单验证
        if (
          item.type == 'table' &&
          item.config &&
          item.config.tbody &&
          Array.isArray(item.config.tbody)
        ) {
          item.config.tbody.map(els => {
            if (Array.isArray(els)) {
              els.map(el => {
                if (vm.$.dataType(el) === 'Array') {
                  el.map(elm => {
                    if (elm.type != 'string') {
                      !elm.rules && (elm.rules = {})
                      validate.push({
                        value: elm.value,
                        label: elm.label || '',
                        maxLen: elm.rules.maxLen,
                        type: elm.rules.type,
                        required: elm.rules.required,
                        opt: elm.rules.opt,
                        must: elm.rules.must
                      })
                    }
                  })
                } else if (vm.$.dataType(el) === 'Object') {
                  if (el.type != 'string') {
                    !el.rules && (el.rules = {})
                    validate.push({
                      value: el.value,
                      label: el.label || '',
                      maxLen: el.rules.maxLen,
                      type: el.rules.type,
                      required: el.rules.required,
                      opt: el.rules.opt,
                      must: el.rules.must
                    })
                  }
                }
              })
            }
          })
        } else {
          !item.rules && (item.rules = {})
          validate.push({
            value: item.value,
            label: item.label || '',
            maxLen: item.rules.maxLen,
            type: item.rules.type,
            required: item.rules.required,
            opt: item.rules.opt,
            must: item.rules.must
          })
        }
      })
    }

    return {
      rules: vm.$formValidate(validate),
      tableData: []
    }
  },
  computed: {
    form: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  },
  methods: {
    submitForm() {
      let vm = this
      vm.$refs['form'].validate(valid => {
        if (valid) {
          console.log(111)
        } else {
          console.log('error')
        }
      })
    }
  },
  components: {
    formItem
  }
}
</script>
<style lang="scss">
.twp-dialog-form {
  background: white;
  .twp-form {
    .el-select {
      width: 100%;
    }
    .el-range-editor.el-input__inner {
      width: 100%;
    }
    .el-input-number--small {
      width: 100%;
    }
    .el-input-number.is-without-controls.numClass .el-input__inner {
      padding: 0 !important;
    }
  }
}
</style>