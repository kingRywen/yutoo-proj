<template>
  <el-form
    v-if="refresh"
    :model="formData"
    :label-width="labelWidth"
    :size="size"
    ref="form"
    :class="`prefix-${isNormal ? 'normal': 'search'}`"
    :rules="rules"
  >
    <el-row :gutter="10">
      <template v-for="(item, index) in fields">
        <template v-if="item.add">
          <el-col :span="24" :key="index">
            <el-form-item label-width="0" :class="{'prefix-form-item':item.type === 'radio'}">
              <template v-for="(i, subIndex) in formData[item.name]">
                <el-form-item
                  :prop="item.requiredFun && item.requiredFun(formData) ? `${item.name}.${subIndex}` : !!item.required ? `${item.name}.${subIndex}` : null"
                  :key="item.name + subIndex + (item.requiredFun && item.requiredFun(formData) || item.required)"
                  :label="item.label + (subIndex + 1)"
                  :required="item.requiredFun ? item.requiredFun(formData) : !!item.required"
                  :rules="addRules(subIndex, item)"
                >
                  <div class="flex">
                    <FormInputs
                      :item="item"
                      :formData="formData"
                      :disabled="typeof item.disabled === 'function' ? item.disabled(formData) : item.disabled"
                      :key="item.name"
                      @clear="$emit('clear')"
                      v-model="formData[item.name][subIndex]"
                      @input="handleInputChange(item,$event)"
                      @change="handleInputChange(item,$event)"
                    />
                    <div class="btn">
                      <el-button type="text" icon="el-icon-plus" @click="handleItemAdd(item, subIndex)"></el-button>
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
          v-else-if="!item.hidden || item.hidden(formData)"
          :span="isNormal ? item.span || 24 :(item.span ||6)"
          :key="index"
        >
          <el-form-item
            :label-width="item.labelWidth"
            v-if="!item.title"
            :label="item.label"
            :key="item.name + (item.requiredFun && item.requiredFun(formData) || item.required)"
            :prop="item.requiredFun && item.requiredFun(formData) ? item.name : !!item.required ? item.name : null"
            :required="item.requiredFun ? item.requiredFun(formData) : !!item.required"
            :rules="rules[item.name] ? null : !!item.required ? [{required: true, message:`${item.label}${item.requiredText || '不能为空'}`}] : null"
            :class="{'prefix-form-item':item.type === 'radio'}"
          >
            <FormInputs
              @clear="$emit('clear')"
              :item="item"
              :formData="formData"
              :disabled="typeof item.disabled === 'function' ? item.disabled(formData) : item.disabled"
              :key="item.name"
              v-model="formData[item.name]"
              @changeEl="val => formData[item.name+ '1'] = val"
              @input="handleInputChange(item, $event)"
              @change="handleInputChange(item,$event)"
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
    size: {
      type: String,
      default: 'mini'
    },
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
    },
    outerFormData: {
      default: () => ({})
    }
  },
  created() {
    this.rules = this.getRules(this.fields)
    this.exps = Object.values(this.$const['OTHER/phoneExp'])
    this.ipExp = this.$const['OTHER/ipExp']
    this.postCode = this.$const['OTHER/postcode']
  },
  mounted() {
    this.unwatch = this.$watch(
      'defaultData',
      val => {
        this.setData(val)
      },
      {
        deep: true
        // immediate: true,
      }
    )
  },
  data() {
    let vm = this
    let checkAddRule = (index, item) => (rule, value, cb) => {
      // console.log(rule, value)
      if (value == null || value === '') {
        cb(new Error('请选择'))
      }
      let isCommon = false

      this.formData[item.name].forEach((el, i) => {
        if (i === index) {
          return
        }
        if (this.$.dataType(el) === 'Array') {
          if (el != null && value != null && el.join() === value.join()) {
            isCommon = true
          }
        } else {
          if (el != null && value != null && el === value) {
            isCommon = true
          }
        }
      })
      if (isCommon) {
        cb(new Error('请选择不同项'))
      }

      cb()
    }
    let strategies = {
      isCN(rule, value, cb) {
        let reg = /[a-zA-Z]/
        if (reg.test(value)) {
          cb(new Error('必须是中文'))
        }
        cb()
      },
      isEmail(rule, value, cb) {
        let reg = /^([a-z0-9A-Z]+[-|_|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/
        if (!reg.test(value)) {
          cb(new Error('邮箱格式错误'))
        }
        cb()
      },
      isEN(rule, value, cb) {
        let reg = /[\u4e00-\u9fa5]/
        if (reg.test(value)) {
          cb(new Error('必须是英文'))
        }
        cb()
      },
      isMobile(rule, value, cb) {
        console.log(vm.exps)

        let flag = vm.exps.some(regExp => regExp.test(value) == true)
        if (!flag) {
          cb(new Error('手机号码输入错误'))
        }
        cb()
      },
      isPostCode(rule, value, cb) {
        if (vm.postCode.test(value)) {
          cb()
        } else {
          cb(new Error('邮编输入错误'))
        }
      },
      isIp(rule, value, cb) {
        if (vm.ipExp.test(value)) {
          cb()
        } else {
          cb(new Error('ip格式为 *.*.*.* ( * 为0-255之间的数字)'))
        }
      },
      isUrl(rule, value, cb) {
        let url =
          '^((https|http|ftp|rtsp|mms)?://)' +
          "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + //ftp的user@
          '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
          '|' + // 允许IP和DOMAIN（域名）
          "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
          '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
          '[a-z]{2,6})' + // first level domain- .com or .museum
          '(:[0-9]{1,4})?' + // 端口- :80
          '((/?)|' + // a slash isn't required if there is no file name
          "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"
        url = new RegExp(url)
        if (url.test(value)) {
          cb()
        } else {
          cb(new Error('url地址不正确'))
        }
      }
    }
    return {
      addRules(index, item) {
        return [
          {
            validator: checkAddRule(index, item)
          }
        ]
      },
      refresh: true,
      hiddenFields: [],
      rules: {},
      valids: {
        notEmpty(str, el) {
          return {
            required: true,
            message: `${str}${el.requiredText || '不能为空'}`
          }
        },
        beEmail: {
          validator: strategies.isEmail
        },

        number: {
          type: 'number',
          message: '必须是数字'
        },
        url: {
          validator: strategies.isUrl
        },
        mobile: {
          validator: strategies.isMobile
        },
        post: {
          validator: strategies.isPostCode
        },
        ip: {
          validator: strategies.isIp
        },
        cn: {
          validator: strategies.isCN
        },
        en: {
          validator: strategies.isEN
        }
      },
      formData: this.outerFormData
    }
  },
  methods: {
    handleInputChange(item, val) {
      if (item.onChange && item.onChange instanceof Function) {
        item.onChange(item, val, this.formData)
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
      if (max && el.length >= max) {
        this.$message.warning(`最多只能添加${max}个`)
        return
      }
      this.formData[name].splice(index + 1, 0, null)
    },
    handleItemMinus(item, index) {
      this.formData[item.name].splice(index, 1)
    },
    setData(data, init = true, refresh = true, cb) {
      // debugger
      let vm = this
      if (init) {
        vm.initData()
      }
      if (refresh) {
        this.refresh = false
        this.$nextTick(() => {
          vm.formData = JSON.parse(JSON.stringify({ ...vm.formData, ...data }))
          this.refresh = true
          this.$nextTick(() => {
            this.unwatch()
            cb && cb()
          })
        })
      } else {
        vm.formData = JSON.parse(JSON.stringify({ ...vm.formData, ...data }))
        this.unwatch()
      }
    },
    reset() {
      this.formData = {}
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
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
        rule = [vm.valids.notEmpty(el.label, el)]
      }
      if (el.required && el.name) {
        rule = []
        if (!el.isNotRequired) {
          rule = [vm.valids.notEmpty(el.label, el)]
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
          case 'url':
            rule.push(vm.valids.url)
            break
          case 'mobile':
            rule.push(vm.valids.mobile)
            break
          case 'post':
            // rule.push(vm.valids.post)
            break
          case 'ip':
            rule.push(vm.valids.ip)
            break
          case 'cn':
            rule.push(vm.valids.cn)
            break
          case 'en':
            rule.push(vm.valids.en)
            break

          default:
            break
        }
      }
      return rule
    },
    validate() {
      return this.$refs.form.validate()
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
        // this.$emit('update:outerFormData', val)
      }
    }
    // defaultData: {
    //   deep: true,
    //   immediate: true,
    //   handler(val) {
    //     this.setData(val)
    //   }
    // }
  }
}
</script>

<style lang='scss'>
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
