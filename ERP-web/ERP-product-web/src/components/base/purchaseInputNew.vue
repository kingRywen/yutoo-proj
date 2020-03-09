<template>
  <v-form :direction="$attrs.direction" :model="ruleForm" :rules="$attrs.rules" class="__special_form" ref="ruleForm">
    <!-- 控件类型 1.输入框，2单选框，3多选框，4多行文本输入框-->
    <!-- 平台编辑list | data = Basic -->
    <template v-if="data.length == null && mappingFieldData && variantDataList.length">
      <template v-for="(item,key,index) in data">
        <template v-if="Object.prototype.toString.call(item) === '[object Array]'">
          <PurchaseGroupMulti
            :bind-field="bindField"
            :item="item"
            ref="PurchaseMulti"
            :direction="$attrs.direction"
            :ruleForm="ruleForm"
            @closeall="handleCloseAll"
            :mappingFieldData="mappingFieldData"
            :disabled="disabled"
          ></PurchaseGroupMulti>
        </template>
        <template v-else-if="!~~item.propertyGroupName && item.num">
          <!-- 多个 -->
          <PurchaseMultiPlat
            :bind-field="bindField"
            :disabled="disabled"
            :mappingFieldData="mappingFieldData"
            :item="item"
            ref="PurchaseMulti"
            :direction="$attrs.direction"
            :ruleForm="ruleForm"
            @closeall="handleCloseAll"
          ></PurchaseMultiPlat>
        </template>
        <!-- 单个 -->
        <PurchaseSinglePlat
          :disabled="disabled"
          :mappingFieldData="mappingFieldData"
          v-else
          :bind-field="bindField"
          :item="item"
          ref="PurchaseMulti"
          :direction="$attrs.direction"
          :ruleForm="ruleForm"
          @closeall="handleCloseAll"
        />
      </template>
    </template>

    <!-- 店铺编辑list -->
    <template v-else>
      <!-- {{data}} -->
      <template v-for="(item, index) in data">
        <template v-if="item.templatePropertyShow === 2">
          <!-- 表格 -->
          <PurchaseTable
            :disabled="disabled"
            :values="item.values"
            ref="PurchaseTable"
            @set="val => item.tableData = val"
          ></PurchaseTable>
        </template>
        <template v-else-if="item.templatePropertyShow === 3">
          <!-- 分组 -->
          <PurchaseGroup
            :disabled="disabled"
            :bind-field="bindField"
            :item="item"
            type="shop"
            ref="PurchaseMulti"
            :direction="$attrs.direction"
            @closeall="handleCloseAll"
          ></PurchaseGroup>
        </template>
        <template v-else-if="item.templatePropertyShow === 4">
          <!-- 多个 -->
          <PurchaseMulti
            :disabled="disabled"
            :bind-field="bindField"
            :item="item"
            type="shop"
            ref="PurchaseMulti"
            :direction="$attrs.direction"
            @closeall="handleCloseAll"
          ></PurchaseMulti>
        </template>
        <template v-else-if="item.templatePropertyShow === 1">
          <!-- 单个 -->
          <PurchaseSingle
            :disabled="disabled"
            :bind-field="bindField"
            :item="item"
            type="shop"
            ref="PurchaseMulti"
            :direction="$attrs.direction"
            @closeall="handleCloseAll"
          />
        </template>
      </template>
    </template>
  </v-form>
</template>

<script>
import PurchaseSelect from './purchaseSelect'
import PurchaseSinglePlat from './PurchaseSinglePlat'
import PurchaseSingle from './PurchaseSingle'
import PurchaseGroupMulti from './PurchaseGroupMulti'
import PurchaseTable from './purchaseTable'
import PurchaseGroup from './PurchaseGroup'
import PurchaseMultiPlat from './PurchaseMultiPlat'
import PurchaseMulti from './PurchaseMulti'
import { formatTime } from 'common/util'
import { showToast } from 'common/common'
import Vue from 'vue'
import Editor from 'components/base/editor.vue'
import { DatePicker, Tooltip } from 'element-ui'

Vue.use(DatePicker)
Vue.use(Tooltip)

export default {
  inheritAttrs: false,
  props: [
    'value',
    'data',
    'bindField',
    'mappingFieldData',
    'variantDataList',
    'name',
    'disabled',
    'auditDataList'
  ],
  components: {
    PurchaseSelect,
    PurchaseGroupMulti,
    PurchaseGroup,
    PurchaseSingle,
    PurchaseSinglePlat,
    PurchaseMulti,
    PurchaseMultiPlat,
    PurchaseTable,
    Editor
  },
  created() {
    if (this.data.length) {
      // 店铺编辑
      this.data.forEach(element => {
        this.ruleForm.parent['main_' + element.propertyName] = element.value
        if (element.propertyValue) {
          element.propertyValue.forEach((el, i) => {
            this.ruleForm.variants[i + '_' + element.propertyName] = el.value
          })
        }
      })
    }
  },
  data() {
    const checkRule = item => {
      return (rule, value, callback) => {
        let reg
        if (item.ruleExp) {
          reg = new RegExp(item.ruleExp, 'gi')
        } else {
          reg = new RegExp(item.dataRanges, 'gi')
        }
        // let errorMsg = "不能为空";
        if (value === '') {
          callback(new Error('不能为空'))
        }
        // if (item.dataRanges.trim() !== '' && !reg.test(value)) {
        //   callback(new Error('数值不符合规范'))
        // }
        callback()
      }
    }
    let vm = this

    return {
      hasHistory(propertyName) {
        if (vm.auditDataList) {
          let _el = vm.auditDataList.find(el => el.key === propertyName)
          console.log(vm.auditDataList, propertyName, _el)
          return _el && _el.value
        } else {
          return null
        }
      },
      getRule(item, type) {
        if (!item.mustFlag) {
          return null
        }
        if (item.dataType === 3) {
          return this.rule.notEmpty
        }
        if (type == 1) {
          if (item.dataRanges === '') {
            return this.rule.notEmpty
          } else {
            return [{ validator: checkRule(item) }]
          }
        } else {
          if (item.rules) {
            return this.rule[item.rules]
          }

          return [
            { validator: checkRule(item) },
            {
              required: item[this.required] === 1 ? true : false,
              message: '不能为空'
            }
          ]
        }
      },

      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350,
        scaleEnabled: false,
        maximumWords: 2000
      },

      test: [],

      numIndex: 1,

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 24 * 3600 * 1000 < Date.now()
        }
      },
      selectOptions: [],
      checkboxOptions: [],
      rule: {
        notEmpty: [{ required: true, message: '不能为空' }]
      },
      options: [],
      ruleForm: {
        parent: {},
        variants: {}
      }
    }
  },
  methods: {
    handleCloseAll() {
      this.$refs.PurchaseMulti.forEach(el => {
        el.closeAll()
      })
    },
    handleIndexAdd(item, i) {
      let arr = this.ruleForm.parent[item[this.label]]
      if (arr.length < item.num) {
        arr.push(null)
      } else {
        showToast('warning', `最多只能增加${item.num}个`)
      }
    },
    handleIndexMinus(item, i) {
      let arr = this.ruleForm.parent[item[this.label]]
      arr.pop()
    },
    getLabel(str, index, item) {
      if (!str) return str
      if (index == null) {
        index = ''
      }
      return (
        str
          .split('_')
          .map(el => {
            if (!el) return
            if (el === 'of' || el === 'in') {
              return el
            }
            return el.slice(0, 1).toUpperCase() + el.slice(1)
          })
          .join(' ')
          .replace(/1(?=\b)/g, '') + (item && item.num ? index + 1 : '')
      )
    },
    // 日期组件输入时需要手动验证一下表单域
    validDate(prop) {
      this.$refs.ruleForm.validateField(prop)
    },
    applyVal() {
      this.data.forEach &&
        this.data.forEach(el => {
          if (el.propertyValue && el.propertyValue.length) {
            el.propertyValue.forEach(i => {
              if (i.platformValue != null) {
                i.value = i.platformValue
              }
            })
          }
        })
    },
    toggle(i, index, itemIndex) {
      if (itemIndex == null) {
        if (i._hidden) {
          this.$set(i, '_hidden', false)
        } else {
          this.$set(i, '_hidden', true)
        }
        return
      }
      if (i['_hidden' + itemIndex]) {
        this.$set(i, '_hidden' + itemIndex, false)
      } else {
        this.$set(i, '_hidden' + itemIndex, true)
      }
    },
    showItem(item) {
      this.data.forEach &&
        this.data.forEach(element => {
          this.$set(element, '_hidden', false)
        })
      this.$set(item, '_hidden', true)
    },
    hiddenItem(item) {
      this.$set(item, '_hidden', false)
    },
    handlerMainBlur(item) {
      this.$set(item, '_hidden', false)
    },
    handlerBlur(item, key, val) {
      if (val === this.ruleForm.parent[key]) {
        item['edit-' + key] = false
      } else {
        item['edit-' + key] = true
      }
    },
    handlerInput(item, key, val, variant, field, isIndex) {
      let _val = val
      if (item.num) {
        // 如果是累加，该值为数组
        _val = JSON.parse(JSON.stringify(this.ruleForm.parent[key]))
        _val.splice(isIndex, 1, val)
      }

      if (field) {
        this.$refs.ruleForm.validateField(field)
      }
      // debugger;
      if (variant) {
        if (item[this.type] === 3) {
          this.$refs.ruleForm.validate()
        }
      } else {
        if (item[this.type] === 3) {
          this.$refs.ruleForm.validate()
        }
      }

      if (variant) {
        this.$set(item, key, _val)
        return
      }

      if (!item.num) {
        // 如果是累加输入，不需要设置值，否则重复触发值的更新会死循环
        this.$set(item, this.val, _val)
      }

      this.$set(this.ruleForm.parent, key, _val)

      if (
        item.variantsDisparityFlag != null &&
        item.variantsDisparityFlag === 1
      ) {
        for (const k in this.ruleForm.variants) {
          if (this.ruleForm.variants.hasOwnProperty(k)) {
            const element = this.ruleForm.variants[k]
            if (element['edit-' + key]) {
              continue
            }
            if (item.num) {
              this.$set(item, this.val, _val)
            } else {
              this.$set(item, this.val, val)
            }
          }
        }
      }
    },
    handlerInput1(item, index, val, field) {
      if (field) {
        this.$refs.ruleForm.validateField(field)
      }
      // item.propertyValue[index].value = val;
      this.$set(item.propertyValue[index], 'value', val)

      this.$set(this.ruleForm.variants, index + '_' + item[this.bindval], val)
      if (item.propertyValue) {
        item.propertyValue.forEach(element => {
          if (element.value === val) {
            item.propertyValue[index].edit = false
          } else {
            item.propertyValue[index].edit = true
          }
        })
      }
    },
    handlerInputMain(item, index, val, field) {
      if (field) {
        this.$refs.ruleForm.validateField(field)
      }
      this.$set(this.ruleForm.parent, 'main_' + item[this.bindval], val)
      this.$set(item, this.val, val)
      if (item.variantsDisparityFlag) {
        return
      }
      if (item.propertyValue) {
        item.propertyValue.forEach(element => {
          if (!element.edit) {
            this.$set(element, this.val, val)
          }
        })
      }
    }
  },
  computed: {
    label() {
      return this.bindField.label
    },
    bindval() {
      return this.bindField.bindval
    },
    val() {
      return this.bindField.value
    },
    type() {
      return this.bindField.type
    },
    required() {
      return this.bindField.required
    },
    inputType() {
      return this.bindField.inputType
    }
  },
  watch: {
    variantDataList: {
      immediate: true,
      handler(val) {
        if (!val) {
          return
        }
        let mappingFieldData = this.mappingFieldData
        mappingFieldData = JSON.parse(JSON.stringify(mappingFieldData))
        let vm = this
        let ret = {
          parent: {},
          variants: {}
        }
        for (const key in mappingFieldData) {
          if (mappingFieldData.hasOwnProperty(key)) {
            const element = mappingFieldData[key]
            if (key === 'parent') {
              ret[key] = JSON.parse(JSON.stringify(element))
              let _el = ret[key]

              // debugger

              for (const k in vm.data) {
                if (vm.data.hasOwnProperty(k)) {
                  const el = vm.data[k]
                  if (Object.prototype.toString.call(el) === '[object Array]') {
                    // 分组数据
                    el.forEach(group => {
                      _el[group.propertyName] = group.value
                    })
                  } else {
                    _el[k] = el.value
                  }

                  // 如果是累加输入，先赋一个长度为1的空数组
                  if (!el.value && el.num) {
                    _el[k] = new Array(1)
                  }
                  if (el.variantsDisparityFlag === 1) {
                    _el['edit-' + k] = false
                  }
                }
              }
            } else {
              for (const key in element) {
                if (element.hasOwnProperty(key)) {
                  const el = element[key]
                  ret.variants[key] = JSON.parse(JSON.stringify(el))
                  let _el = ret.variants[key]
                  let _values = {}
                  console.log(vm.variantDataList)
                  val.forEach(__el => {
                    if (key === __el.pltSku) {
                      _values = { ..._values, ...__el.data[vm.name] }
                    }
                  })

                  ret.variants[key] = { ..._el, ..._values }
                  for (const k in vm.data) {
                    if (vm.data.hasOwnProperty(k)) {
                      const el = vm.data[k]
                      // ret.variants[key][k] = el.value;
                      if (el.variantsDisparityFlag === 1) {
                        ret.variants[key]['edit-' + k] = false
                      }
                    }
                  }
                }
              }
            }
          }
        }
        vm.ruleForm = ret
      }
    }
  }
}
</script>

<style scoped lang="scss">
.iconBox {
  position: absolute;
  right: -100px;
  cursor: pointer;
  top: 0;
  display: flex;
  width: 100px;
}

.__hover_box {
  padding-top: 24px;
  &.plat {
    padding-bottom: 1px;
  }

  &:hover {
    background: #eff1f6;
  }
}

.platform_tab {
  .iconBox {
    height: 33px;
    line-height: 33px;
    .anticon {
      line-height: 33px;
    }
  }
}
.__span {
  position: absolute;
  line-height: 1.9;
  right: 0;
  opacity: 0.8;
}
</style>
