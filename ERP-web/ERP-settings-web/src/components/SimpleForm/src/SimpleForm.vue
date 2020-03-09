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
    <el-row>
      <template v-for="(item, index) in fields">
        <template v-if="item.add">
          <el-col :span="24">
            <el-form-item :label="item.label" :class="{'prefix-form-item':item.type === 'radio'}">
              <template v-for="(i, subIndex) in formData[item.name]">
                <el-form-item
                  :prop="`${item.name}.${subIndex}`"
                  label-width="0"
                  :rules="[{required: item.required, message: '不能为空'}]"
                >
                  <div class="flex">
                    <FormInputs
                      :item="item"
                      :disabled="item.disabled"
                      :key="item.name"
                      v-model="formData[item.name][subIndex]"
                      @input="handleInputChange(item,$event)"
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
        <el-col v-else :span="isNormal ? item.span || 24 :6">
          <el-form-item
            v-if="!item.title"
            :label="item.label"
            :prop="item.name"
            :class="{'prefix-form-item':item.type === 'radio'}"
          >
            <FormInputs
              :item="item"
              :disabled="item.disabled"
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
    this.postCode = this.$const['OTHER/postcode']
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
        post: {
          validator: strategies.isPostCode
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
      let { add, name } = item
      let el = this.formData[name]
      add = add.split('-')
      let [min, max] = add
      if (el.length >= max) {
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
        vm.formData = { ...vm.formData, ...data }
        this.refresh = true
      })
    },
    reset() {
      // this.formData = {}
      for (const key in this.formData) {
        if (this.formData.hasOwnProperty(key)) {
          const element = this.formData[key];
          if (Array.isArray(element)) {
            this.formData[key] = []
          } else {
            this.formData[key] = null
          }
        }
      }
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
          if (el.required && el.name) {
            rules[el.name] = []
            if (!el.isNotRequired) {
              rules[el.name] = [vm.valids.notEmpty(el.label)]
            }
            switch (el.required) {
              case true:
                break
              case 'email':
                rules[el.name].push(vm.valids.beEmail)
                break
              case 'number':
                rules[el.name].push(vm.valids.number)
                break
              case 'mobile':
                rules[el.name].push(vm.valids.mobile)
                break
              case 'post':
                rules[el.name].push(vm.valids.post)
                break

              default:
                break
            }
          }
        }
      })

      return rules
    }
  },
  computed: {
    isNormal() {
      return this.search === undefined || this.search === false
    }
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
.prefix-normal {
  margin-right: 10px;
}
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
