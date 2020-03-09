<template>
  <el-form
    :model="innerFormData"
    :rules="rules"
    :label-width="labelWidth"
    size="small"
    class="custom_simple_form"
    ref="form"
    :class="`custom-${type}`"
    :disabled="disabled"
  >
    <el-row>
      <template v-for="item in fields">
        <el-col :span="item.span || 24" :key="item.id">
          <el-form-item :label="item.title" class="title" v-if="item.title"></el-form-item>
          <el-form-item
            :label="item.label"
            v-else-if="item.type === 'multi'"
            style="overflow:hidden;margin-bottom:0"
            :required="Object.values(item.opts).some(el => el.required === true)"
          >
            <el-row :gutter="12" type="flex">
              <el-col v-for="item1 in item.opts" :span="24/item.opts.length" :key="item1.id">
                <el-form-item :prop="item1.name" :required="item1.required">
                  <form-inputs v-model="innerFormData[item1.name]" :item="item1"></form-inputs>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="item.label" :prop="item.name" v-else>
            <form-inputs v-model="innerFormData[item.name]" :item="item"></form-inputs>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import FormInputs from './FormInputs'
export default {
  name: 'SimpleForm',
  components: {
    FormInputs
  },
  props: {
    type: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fields: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    },
    labelWidth: {
      type: String,
      default: '100px'
    }
  },
  created() {
    this.exps = Object.values(this.$const['OTHER/phoneExp'])
    this.postCode = this.$const['OTHER/postcode']
    // let unwatchs = []
    this.fields.forEach((el, index) => {
      if (el.type === 'select') {
        this.$watch(`fields.${index}.options`, () => {
          // console.log('变化了', newVal, oldVal, el.label)
          this.$nextTick(() => {
            this.$refs.form.clearValidate()
          })
        })
      }
    })
  },
  data() {
    let vm = this
    let strategies = {
      isMobile(rule, value, cb) {
        let flag = vm.exps.some(regExp => regExp.test(value) == true)
        if (!flag) {
          cb(new Error('联系电话输入错误'))
        }
        cb()
      },
      isPostCode(rule, value, cb) {
        if (vm.postCode.test(value)) {
          cb()
        } else {
          cb(new Error('邮编输入错误'))
        }
      }
    }
    return {
      // innerFormData: JSON.parse(JSON.stringify(this.formData)),
      is_edit: false,
      valids: {
        notEmpty(str) {
          return {
            required: true,
            message: `${str}不能为空`
          }
        },
        beEmail: {
          type: 'email',
          message: '请输入正确的邮箱地址'
        },
        number: {
          type: 'number',
          message: '必须是数字'
        },
        mobile: {
          validator: strategies.isMobile
        },
        post: {
          validator: strategies.isPostCode
        }
      }
      // formData: {},
      // fields: [
      //   {
      //     label: 'First Name',
      //     name: 'cneeFirstName',
      //     type: 'currency',
      //     required: true,
      //     span: 12
      //   },
      //   {
      //     label: 'Last Name',
      //     name: 'cneeLastName',
      //     type: 'number',
      //     required: true,
      //     span: 12
      //   },
      //   {
      //     type: 'select',
      //     label: '电子邮件',
      //     name: 'cneeEmail',
      //     span: 12,
      //     options: [
      //       {
      //         label: 1,
      //         value1: 1
      //       },
      //       {
      //         label: 2,
      //         value1: 2
      //       }
      //     ],
      //     bind: {
      //       label: 'label',
      //       value: 'value1'
      //     }
      //   },
      //   {
      //     label: '电子邮件',
      //     span: 12,
      //     name: 'cneeEmail1',
      //     required: 'email'
      //   }
      // ]
    }
  },
  computed: {
    rules() {
      return this.getRules(this.fields)
    },
    innerFormData: {
      get() {
        this.fields.forEach(el => {
          if (
            el.type === 'select' &&
            el.multi &&
            this.formData[el.name] == null
          ) {
            this.$set(this.formData, el.name, [])
          }
        })
        return this.formData
      },
      set(val) {
        this.$emit('update:formData', JSON.parse(JSON.stringify(val)))
      }
    }
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    // 输入编辑数据
    addFormData(data) {
      this.is_edit = true
      this.innerFormData = JSON.parse(JSON.stringify(data))
    },
    // 清空表单数据
    clearFormData() {
      if (this.is_edit) {
        return
      }
      this.innerFormData = {}
      this.$refs.form.clearValidate()
      this.is_edit = false
    },
    getRules(fields, rules) {
      if (!rules) {
        rules = {}
      }
      fields.forEach(el => {
        if (el.type === 'multi') {
          this.getRules(el.opts, rules)
        } else {
          if (el.required && el.name) {
            rules[el.name] = []
            if (!el.isNotRequired) {
              rules[el.name] = [this.valids.notEmpty(el.label)]
            }
            switch (el.required) {
              case true:
                break
              case 'email':
                rules[el.name].push(this.valids.beEmail)
                break
              case 'number':
                rules[el.name].push(this.valids.number)
                break
              case 'mobile':
                rules[el.name].push(this.valids.mobile)
                break
              case 'post':
                rules[el.name].push(this.valids.post)
                break

              default:
                break
            }
          }
        }
      })

      return rules
    }
  }
  // watch: {
  //   innerFormData(val) {
  //     this.$emit('update:formData', val)
  //   }
  // }
}
</script>

<style lang="scss">
.custom_simple_form {
  margin: 12px;
  .title {
    font-size: 14px;
    margin: 3px 0 16px;
    font-weight: bold;
    color: #333;
    background: #ebeef5;
  }
  .el-input-number {
    .el-input__inner {
      text-align: left;
    }
  }
  .currency {
    position: relative;
    & > span {
      position: absolute;
      left: 6px;
      top: 0;
      opacity: 0.8;
    }
  }
}
.custom-border.custom_simple_form {
  margin: 0;
  padding: 10px;
  border: 1px solid #ddd;
  padding-top: 20px;
  margin-bottom: 20px;
}
</style>
