<template>
  <el-form
    v-if="refresh"
    :model="formData"
    :label-width="labelWidth"
    size="mini"
    ref="form"
    :class="`prefix-${isNormal ? 'normal': 'search'}`"
    :rules="rules"
  >
    <el-row :gutter="12">
      <template v-for="(item, index) in fields">
        <template v-if="item.add">
          <el-col :span="24" :key="index">
            <el-form-item label-width="0" :class="{'prefix-form-item':item.type === 'radio' || /date/.test(item.type)}">
              <template v-for="(i, subIndex) in formData[item.name]">
                <el-form-item
                  :prop="item.requiredFun && item.requiredFun(formData) ? `${item.name}.${subIndex}` : !!item.required ? `${item.name}.${subIndex}` : null"
                  :key="item.name + subIndex + (item.requiredFun && item.requiredFun(formData) || item.required)"
                  :label="item.label + (subIndex + 1)"
                  :required="item.requiredFun ? item.requiredFun(formData) : !!item.required"
                  :rules="addRules(subIndex)"
                >
                  <div class="flex">
                    <FormInputs
                      :item="item"
                      :formData="formData"
                      :disabled="typeof item.disabled === 'function' ? item.disabled(formData) : item.disabled"
                      :key="item.name"
                      v-model="formData[item.name][subIndex]"
                      @input="handleInputChange(item,$event)"
                    />
                    <div class="btn">
                      <el-button
                        type="text"
                        icon="el-icon-plus"
                        @click="handleItemAdd(item, subIndex)"
                        v-if="item.add != 1"
                      ></el-button>
                      <el-button
                        type="text"
                        icon="el-icon-minus"
                        @click="handleItemMinus(item, subIndex)"
                        v-if="subIndex !== 0"
                      ></el-button>
                    </div>
                  </div>
                </el-form-item>
              </template>
            </el-form-item>
          </el-col>
        </template>
        <el-col
          :key="index"
          v-else-if="!item.hidden || item.hidden(formData)"
          :span="isNormal ? item.span || 24 :(item.span ||6)"
        >
          <el-form-item
            v-if="!item.title"
            :label="item.label"
            :key="item.name + (item.requiredFun && item.requiredFun(formData) || item.required)"
            :prop="item.requiredFun && item.requiredFun(formData) ? item.name : !!item.required ? item.name : null"
            :required="item.requiredFun ? item.requiredFun(formData) : !!item.required"
            :rules="rules[item.name] ? null : (item.requiredFun ? item.requiredFun(formData) : !!item.required) ? [{required: true, message:`${item.label}不能为空`}] : null"
            :class="{'prefix-form-item':item.type === 'radio' || /date/.test(item.type)}"
          >
            <span slot="label">
              {{item.label}}
              <el-tooltip v-if="item.tip" :content="item.tip" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </span>
            <FormInputs
              :item="item"
              :formData="formData"
              :disabled="typeof item.disabled === 'function' ? item.disabled(formData) : item.disabled"
              :key="item.name"
              v-model="formData[item.name]"
              @changeEl="val => formData[item.name+ '1'] = val"
              @input="handleInputChange(item, $event)"
            />
          </el-form-item>
          <div class="title" v-else>{{item.title}}</div>
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
    defaultData: {
      type: Object,
      default: () => {}
    },
    fields: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: [Number, String],
      default: '100px'
    },
    search: {
      default: undefined
    }
  },
  created() {
    this.rules = this.getRules(this.fields)
    this.exps = Object.values(this.$const['OTHER/phoneExp'])
    // console.log(this.exps);
    this.postCode = this.$const['OTHER/postcode']
  },
  data() {
    let vm = this
    let checkAddRule = index => (rule, value, cb) => {
      if (value == null || value === '' || !value.length) {
        cb(new Error('请选择类目'))
      }
      let isCommon = false
      this.formData.id.forEach((el, i) => {
        if (i === index) {
          return
        }
        if (el != null && value != null && el.join() === value.join()) {
          isCommon = true
        }
      })
      if (isCommon) {
        cb(new Error('请选择不同类目'))
      }

      cb()
    }
    let strategies = {
      isMobile(rule, value, cb) {
        let flag = vm.exps.some(regExp => regExp.test(value))
        if (!flag) {
          cb(new Error('联系电话输入错误'))
          return
        }
        cb()
      },
      // 中国手机
      isMobileCn(rule, value, cb) {
        let expCn = vm.$const['OTHER/phoneExp']['zh-CN']
        let flag = expCn.test(value)
        if (!flag) {
          cb(new Error('联系电话输入错误'))
          return
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
      addRules(index) {
        return [
          {
            validator: checkAddRule(index)
          }
        ]
      },
      refresh: true,
      hiddenFields: [],
      rules: {},
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
        mobileCn: {
          validator: strategies.isMobileCn
        },
        post: {
          validator: strategies.isPostCode
        },
        validLen(len) {
          return {
            validator(rule, value, cb) {
              if (value.length < len) {
                cb(new Error(`长度须不少于${len}位`))
              }
              cb()
            }
          }
        }
      },
      formData: {}
    }
  },
  methods: {
    handleInputChange(item, val) {
      if (item.onChange && item.onChange instanceof Function) {
        item.onChange(item, val)
      }
    },
    getSearchData() {
      let val = JSON.parse(JSON.stringify(this.formData))
      this.hiddenFields.forEach(str => {
        delete val[str]
      })

      return val
    },
    handleItemAdd(item, index) {
      if (item.fixedScroll) {
        this.$nextTick(() => {
          this.$refs.form.$el.parentNode.parentNode.scrollTop = 9999
        })
      }
      let { add, name } = item
      let el = this.formData[name]
      add = add.split('-')
      let [min, max] = add
      if (el.length >= max) {
        this.$message.warning('最多只能添加3个类目')
        return
      }
      this.formData[name].splice(index + 1, 0, null)
    },
    handleItemMinus(item, index) {
      this.formData[item.name].splice(index, 1)
    },
    setData(data, init = true) {
      let vm = this
      if (init) {
        vm.initData()
      }

      this.refresh = false
      this.$nextTick(() => {
        vm.formData = { ...JSON.parse(JSON.stringify(vm.formData)), ...data }
        this.refresh = true
      })
    },
    reset() {
      this.formData = {}
      this.$refs.form.clearValidate()
    },
    initData() {
      this.fields.forEach(el => {
        if (el.add) {
          this.formData[el.name] = [null]
          return
        }
      })
    },
    getRules(fields, rules) {
      let vm = this
      if (!rules) {
        rules = {}
      }
      fields.forEach(el => {
        // if (!this.isAbled(el)) {
        //   return
        // }
        if (el.type === 'multi') {
          vm.getRules(el.opts, rules)
        } else if (el.query) {
          // Field不传出
          vm.hiddenFields.push(el.name)
          vm.$watch(`formData.${el.name}`, function(val) {
            if (!val || !val.length) {
              vm.formData[el.query[0]] = null
              vm.formData[el.query[1]] = null
              return
            }
            vm.formData[el.query[0]] = val[0]
            vm.formData[el.query[1]] = val[1]
          })
        } else {
          rules[el.name] = this.getValidateLabel(el)
        }
      })

      return rules
    },
    getValidateLabel(el) {
      let vm = this
      let rule = []
      if (el.requiredFun) {
        rule = [vm.valids.notEmpty(el.label)]
      }
      if (el.required && el.name) {
        rule = []
        if (!el.isNotRequired) {
          rule = [vm.valids.notEmpty(el.label)]
        }

        switch (el.required) {
          case true:
            break
          case 'email':
            rule.push(vm.valids.beEmail)
            break
          case 'number':
            rule.push(vm.valids.number)
            break
          case 'mobile':
            rule.push(vm.valids.mobile)
            break
          case 'mobile-cn':
            rule.push(vm.valids.mobileCn)
            break
          case 'length':
            rule.push(vm.valids.validLen(el.reqLen))
            break
          case 'post':
            // rule.push(vm.valids.post)
            break

          default:
            break
        }
      }
      return rule
    },
    validate(cb) {
      if (cb) {
        return this.$refs.form && this.$refs.form.validate(cb)
      } else {
        return this.$refs.form && this.$refs.form.validate()
      }
    },
    isAbled(el) {
      return !el.hidden || (el.hidden && !el.hidden())
    }
  },
  computed: {
    isNormal() {
      return this.search === undefined || this.search === false
    }
    // filterFields() {
    //   return this.fields.filter(el => this.isAbled(el))
    // }
  },
  watch: {
    formData: {
      deep: true,
      handler(val) {
        this.$emit('datachange', val)
      }
    },
    defaultData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.setData(val)
      }
    }
  }
}
</script>

<style lang='scss'>
// .el-form-item--mini .el-form-item__content {
//   height: 28px;
// }
.prefix-search {
  margin-bottom: -10px;
  margin-top: -10px;
  .el-form-item {
    margin-bottom: 10px;
    margin-top: 10px;
  }
}
.prefix-form-item {
  height: 29px;
}
.title {
  position: relative;
  text-indent: 12px;
  margin-bottom: 20px;
  margin-top: 20px;
  &:after {
    content: '';
    display: block;
    width: 3px;
    height: 100%;
    left: 0;
    top: 0;
    background: #30cc7b;
    position: absolute;
  }
}
.prefix-normal {
  .flex {
    display: flex;
    margin-bottom: 10px;
    .btn {
      margin-left: 20px;
      flex: 0 0 60px;
    }
  }
}
</style>
