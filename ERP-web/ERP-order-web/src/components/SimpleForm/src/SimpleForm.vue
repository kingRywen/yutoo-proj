<template>
  <el-form
    :loading="showForm"
    :model="innerFormData"
    :rules="rules"
    :label-width="showLabel ? labelWidth : null"
    size="small"
    class="custom_simple_form"
    ref="form"
    :class="[`custom-${type}`, {'custom-search': search}]"
    :disabled="disabled"
  >
    <el-row :gutter="8">
      <!-- eslint-disable -->
      <template v-for="item in (search ? currentFields : fields)">
        <!-- eslint-disable-next-line -->
        <el-col :span="item.span || (search ? 6 : 24)" :key="item.id">
          <!-- 标题 -->
          <el-form-item :label="showLabel ? item.title : null" class="title" v-if="item.title"></el-form-item>
          <!-- 多个分组 -->
          <el-form-item
            :label="showLabel ? item.label: null"
            v-else-if="item.type === 'multi'"
            style="overflow:hidden;margin-bottom:0"
            :required="Object.values(item.opts).some(el => el.required === true)"
          >
            <el-row :gutter="12" type="flex">
              <!-- // eslint-disable-next-line -->
              <el-col v-for="(item1, index) in item.opts" :span="24/item.opts.length" :key="index">
                <el-form-item :prop="item1.name" :required="item1.required">
                  <form-inputs @clear="handleClear" v-model="innerFormData[item1.name]" :item="item1" :key="item1.name"></form-inputs>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 费用格式  (重量格式)-->
          <template v-else-if="item.type === 'price' || item.type === 'weight'">
            <el-form-item :label="showLabel ? item.label : null" :key="item.name" style="height:33px">
              <el-row :gutter="6" type="flex">
                <el-col :span="item.type === 'price' && currencyType.length ? 8 : 11">
                  <form-inputs
                    @clear="handleClear"
                    v-model="innerFormData[getStartStr(item.name)]"
                    :item="{type: item.integer ? 'number':'currency', noShow: true, label: `起始${item.label}`}"
                    :key="item.name"
                  ></form-inputs>
                </el-col>
                <el-col :span="2" style="text-align:center">~</el-col>
                <el-col :span="item.type === 'price' && currencyType.length ? 8 : 11">
                  <form-inputs
                    @clear="handleClear"
                    v-model="innerFormData[getEndStr(item.name)]"
                    :item="{type: item.integer ? 'number':'currency', noShow: true, label: `结束${item.label}`}"
                    :key="item.name"
                  ></form-inputs>
                </el-col>
                <el-col :span="6" v-if="item.type === 'price' && currencyType.length">
                  <!-- {{getCurrencyType(item.name)}} -->
                  <el-select v-model="innerFormData[getCurrencyType(item.name)]">
                    <!-- eslint-disable-next-line -->
                    <el-option
                      v-for="item in currencyType"
                      :label="showLabel ? item.label : null"
                      :value="item.value"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </template>

          <!-- 长宽高 -->
          <template v-else-if="item.type === 'group'">
            <el-form-item :label="showLabel ? item.label: null" style="height:33px">
              <el-row :gutter="12" type="flex">
                <el-col :span="8" v-for="item1 in item.opts" :key="item1.id">
                  <el-form-item
                    :label="showLabel ? item1.label : null"
                    :prop="item1.name"
                    :required="item1.required"
                    label-width="20px"
                    class="custom-group-item"
                  >
                    <el-input-number
                      :controls="false"
                      :precision="2"
                      v-model="innerFormData[getStartStr(item1.name)]"
                      placeholder
                    ></el-input-number>
                    <span class="_">~</span>
                    <el-input-number
                      :controls="false"
                      :precision="2"
                      v-model="innerFormData[getEndStr(item1.name)]"
                      placeholder
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </template>

          <!-- 普通 -->
          <el-form-item
            :label="showLabel ? item.label : null"
            :prop="item.name"
            :style="{height: item.type === 'datetimerange' ? '33px' : null}"
            :label-width="item.labelWidth"
            v-else
          >
            <form-inputs @clear="handleClear" v-model="innerFormData[item.name]" :item="item" :key="item.name"></form-inputs>
          </el-form-item>
        </el-col>
      </template>
      <template v-if="search">
        <el-col :span="6">
          <el-form-item label-width="0">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>

            <el-popover placement="bottom" width="400" trigger="click" v-model="propVisible">
              <div>
                <el-checkbox-group v-model="selectField" class="custom_checkbox_tb">
                  <el-checkbox v-for="(item, index) in fields" :key="index" :label="item.label">{{item.label}}</el-checkbox>
                  <el-checkbox class="fixed-checkbox"></el-checkbox>
                </el-checkbox-group>
                <el-button
                  style="width:50%;border-radius: 0;border-top: 0;padding: 14px 0;border-right:0"
                  slot="reference"
                  @click="clear"
                >
                  <b>重置</b>
                </el-button>
                <el-button
                  style="width:50%;border-radius: 0;border-top: 1px solid #ddd;padding: 14px 0;margin-left:0"
                  slot="reference"
                  :class="{showTopLine: fields.length % 2 !== 0}"
                  @click="apply"
                >
                  <b>确定应用</b>
                </el-button>
              </div>
              <el-button style="margin-left:10px" slot="reference" icon="el-icon-menu">自定义筛选条件</el-button>
            </el-popover>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import FormInputs from './FormInputs'
import storage from 'Utils/saver'
export default {
  name: 'SimpleForm',
  components: {
    FormInputs
  },
  props: {
    storageName: String,
    search: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    currencyType: {
      type: Array,
      default: () => []
    },
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
      default: '120px'
    }
  },
  created() {
    this.exps = Object.values(this.$const['OTHER/phoneExp'])
    this.postCode = this.$const['OTHER/postcode']
    this.watchOpts(this.fields)

    this.initField()
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
      showForm: false,
      // innerFormData: JSON.parse(JSON.stringify(this.formData)),
      propVisible: false,
      current: [],
      selectField: [],
      is_edit: false,
      unit: null,
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
    currentFields() {
      return this.fields.filter(el => {
        return this.current.indexOf(el.label) > -1
      })
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
          if (el.type === 'checkbox' && this.formData[el.name] == null) {
            this.$set(this.formData, el.name, [])
          }
          if (el.type === 'group') {
            el.opts.forEach(i => {
              if (this.formData['start' + this.$.firstCase(i.name)] == null) {
                this.$set(
                  this.formData,
                  'start' + this.$.firstCase(i.name),
                  undefined
                )
              }
              if (this.formData['end' + this.$.firstCase(i.name)] == null) {
                this.$set(
                  this.formData,
                  'end' + this.$.firstCase(i.name),
                  undefined
                )
              }
            })
          }

          if (el.type === 'price' && this.currencyType.length) {
            this.$set(
              this.formData,
              el.name + 'CurrencyType',
              +this.formData[el.name + 'CurrencyType'] || 1
            )
          }

          // // 费用格式需要设置三个属性 start end 单位
          // if (el.type === 'price') {
          //   // eslint-disable-next-line
          //   this.startStr = 'start' + this.$.firstCase(el.name)
          //   // eslint-disable-next-line
          //   this.endStr = 'end' + this.$.firstCase(el.name)
          //   // eslint-disable-next-line
          //   this.currencyType = el.name + 'CurrencyType'
          // }
        })
        return this.formData
      },
      set(val) {
        this.$emit('update:formData', JSON.parse(JSON.stringify(val)))
      }
    }
  },
  methods: {
    /**
     *  监听传进来的表单中有异步获取值的选项
     *
     *  @param {Array} fields 表单域数组
     *  @param {String} type  控件类型
     */
    watchOpts(fields, type) {
      let indexs = this.watchOpts.index
      if (!indexs) {
        this.watchOpts.index = [0]
      } else {
        this.watchOpts.index.push(0)
      }
      let vm = this
      if (vm.search) {
        return
      }
      let watchs = {}
      fields.forEach((el, index) => {
        let indexs = this.watchOpts.index
        indexs[indexs.length - 1] = index
        // 监听单选框的选项值，因为是异步获取
        if (el.type === 'select') {
          let key
          if (!type) {
            key = `fields.${indexs.join('.')}.options`
          }
          if (type === 'multi') {
            key = `fields.${indexs[0]}.opts.${indexs[1]}.options`
          }
          watchs[key] = vm.$watch(key, () => {
            // 值变化后取消监听
            // vm.watchOpts[key]()
            // vm.watchOpts[key] = null
            // delete vm.watchOpts[key]
            vm.$nextTick(() => {
              setTimeout(() => {
                vm.$refs.form && vm.$refs.form.clearValidate()
              })
            })
          })
        }
        // 监听一行多个输入，异步获取
        if (el.type === 'multi') {
          // debugger
          vm.watchOpts(el.opts, 'multi')
        }
      })
    },
    initField() {
      if (this.search) {
        let arr = storage.get('local', this.storageName)
        if (arr) {
          this.current = arr
          this.selectField = [...this.current]
          return
        }
        this.current = this.fields.filter(el => el.default).map(el => el.label)
        this.selectField = [...this.current]
      }
    },
    handleSearch() {
      this.$emit('search')
    },
    apply() {
      this.current = this.selectField
      if (this.storageName) {
        storage.set('local', this.storageName, this.current)
      }
      this.propVisible = false
      this.$nextTick(() => {
        this.$emit('apply')
      })
    },
    handleClear() {
      this.handleSearch()
    },
    clear() {
      if (this.storageName) {
        storage.remove('local', this.storageName)
      }
      this.initField()
      this.innerFormData = {}
      this.propVisible = false
      this.$emit('search')
      // this.$nextTick(() => {
      //   this.$emit('apply')
      // })
    },
    getStartStr(name) {
      if (this.search) {
        return name + 'Start'
      }
      return 'start' + this.$.firstCase(name)
    },
    getEndStr(name) {
      if (this.search) {
        return name + 'End'
      }
      return 'end' + this.$.firstCase(name)
    },
    getCurrencyType(name) {
      console.log(name + 'CurrencyType')
      return name + 'CurrencyType'
    },
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
  .custom-group-item {
    margin-bottom: 0 !important;
    .el-form-item__content {
      display: flex;
    }
    ._ {
      margin: 0 4px;
    }
  }
}
.custom-border.custom_simple_form {
  margin: 0;
  padding: 10px;
  border-radius: 5px 5px 0 0;
  border: 1px solid #ddd;
  padding-top: 20px;
  margin-bottom: 20px;
}
.showTopLine {
  border-top-width: 0 !important;
}
.custom-search {
  .el-form-item {
    margin-bottom: 10px;
  }
}
.fixed-checkbox {
  .el-checkbox__input {
    display: none;
  }
}
</style>
