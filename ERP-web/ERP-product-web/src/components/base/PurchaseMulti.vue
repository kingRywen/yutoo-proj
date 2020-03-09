<template>
  <v-form :model="item" class="__special_form" :direction="direction">
    <template v-for="(formItem, index) in valuesSort">
      <div class="__hover_box" v-if="formItem.value !=null || index === 0">
        <div class="openTab">
          <v-form-item
            style="width:100%"
            :label="getLabel(formItem.propertyName, true)"
            :prop="`values.${index}.value`"
            :rules="getRule(formItem)"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :required="!!formItem.mustFlag"
          >
            <PurchaseInputs
              :disabled="disabled"
              :dateRange="formItem.dataRanges"
              :list="item.values[index] && item.values[index].propItem"
              :bind-field="bindField"
              :item="formItem"
              v-model="formItem.value"
              @input="handleInputMain(formItem, index, $event)"
              @focus="setOldVal(formItem, $event)"
            />

            <div class="iconBox">
              <div @click="toggle(formItem)" v-if="!formItem.variant">
                <v-icon type="down-square" v-if="!formItem._show"></v-icon>
                <v-icon type="up-square" v-else></v-icon>
              </div>
              <div style="line-height: 30px;font-size: 14px;display: flex;" v-if="!disabled">
                <span style="margin-left:6px;" @click="handleAdd(formItem, index)">
                  <v-icon style="font-size:12px" type="plus-circle-o"></v-icon>
                </span>
                <span style="margin-left:6px;" v-if="index !== 0" @click="handleMinus(formItem, index)">
                  <v-icon style="font-size:12px" type="minus-circle-o"></v-icon>
                </span>
              </div>
              <div v-if="item.variantsDisparityFlag">
                <el-tooltip class="item" effect="dark" :content="'每个变体值必须不同'" placement="top">
                  <v-icon type="info-circle-o" style="color:#ff9800;margin-left:6px"></v-icon>
                </el-tooltip>
              </div>
            </div>
          </v-form-item>
        </div>
        <!-- 变体输入 -->
        <div class="openTab" v-show="formItem._show" v-if="!formItem.variant">
          <v-form-item
            v-for="(subVariant, subIndex) in formItem.propertyValue"
            style="width:100%"
            :label="getLabel(subVariant)"
            :prop="`values.${index}.propertyValue.${subIndex}.value`"
            :rules="getRule(formItem)"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :required="!!formItem.mustFlag"
          >
            <PurchaseInputs
              :disabled="disabled"
              :dateRange="subVariant.dataRanges"
              :list="item.values[index] && item.values[index].propItem"
              :bind-field="bindField"
              :item="formItem"
              v-model="subVariant.value"
              @input="handleInput(formItem, subVariant, $event)"
              @focus="setOldVal(formItem, $event)"
            />
          </v-form-item>
        </div>
        <div class="__hr"></div>
      </div>
    </template>
  </v-form>
</template>

<script>
import { showToast } from 'common/common'
import PurchaseInputs from './PurchaseInputs'
import bus from 'common/bus'
export default {
  components: {
    PurchaseInputs
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    bindField: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'plat'
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    labelCol: {
      type: Object,
      default: () => ({
        span: 4
      })
    },
    wrapperCol: {
      type: Object,
      default: () => ({
        span: 18
      })
    },
    item: {
      // formItem 对应 rows.properties.properties 里的元素
      type: Object,
      default: () => {}
    }
  },

  created() {
    let vm = this
    bus.$on('multi.close.other', item => {
      vm.$set(item, '_show', true)
    })
  },

  watch: {
    item: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
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
    return {
      rule: {
        notEmpty: [{ required: true, message: '不能为空' }]
      },
      getRule(item) {
        if (!item.mustFlag) {
          return null
        }
        if (item.dataType === 3) {
          return this.rule.notEmpty
        }
        if (this.type == 'shop') {
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
              required: item.mustFlag,
              message: '不能为空'
            }
          ]
        }
      }
    }
  },

  computed: {
    valueForm() {
      return {
        data: this.value
      }
    },
    valuesSort() {
      return this.item.values.sort((a, b) => {
        return (
          parseInt(a.propertyName.replace(/[A-Za-z_]+/, '')) -
          parseInt(b.propertyName.replace(/[A-Za-z_]+/, ''))
        )
      })
    }
  },

  methods: {
    applyVal() {
      this.item.values.forEach(element => {
        if (element.value && element.value !== '') {
          element.value =
            element.controlType === 2
              ? +element.platformValue
              : element.platformValue
          console.log(element.propertyName)
          element.propertyValue.forEach(el => {
            if (el.platformValue && el.platformValue !== '') {
              console.log(
                '填充数据',
                el.value,
                el.platformValue,
                el.propertyName
              )
              el.value =
                el.controlType === 2 ? +el.platformValue : el.platformValue
            }
          })
        }
      })
    },
    closeAll() {
      this.item.values.forEach(el => {
        this.$set(el, '_show', false)
      })
    },
    setOldVal(item, event) {
      this.$emit('closeall')

      // // 打开对应的变体输入框
      // if (!item._show) {
      //   bus.$emit('multi.close.other', item)
      // }
      this.$set(item, '_show', true)

      item.propertyValue.forEach(element => {
        let val = event && event.target && event.target.value
        if (!event) {
          if (element.value == null || element.value === '') {
            this.$set(element, '_edit', false)
            return
          }
          // 选择框
          if (element.value == item.value) {
            this.$set(element, '_edit', false)
          } else {
            this.$set(element, '_edit', true)
          }
        } else {
          if (element.value === val || (element.value == null && val === '')) {
            this.$set(element, '_edit', false)
          } else {
            this.$set(element, '_edit', true)
          }
        }
      })
    },
    toggle(item) {
      this.$set(item, '_show', !item._show)
    },
    handleAdd(item, index) {
      let _index = this.item.values.findIndex(
        (el, i) => el.value == null && i !== 0
      )
      if (_index < 0) {
        showToast('warning', `只能增加${this.item.values.length}个`)
        return
      }
      this.item.values[_index].value = ''
      this.handleInput(_index, '')
    },
    handleMinus(item, index) {
      let i = this.item.values.findIndex(
        el => item.propertyName === el.propertyName
      )
      this.item.values[i].value = null
      this.item.values[i].propertyValue.forEach(el => {
        el.value = null
      })

      let val = this.item.values.map(el => el.value)
      // this.$emit('input', val)
    },

    handleInputMain(item, index, val) {
      // debugger
      let obj = item.propertyValue
      item.propertyValue.forEach(element => {
        if (!element._edit) {
          element.value = val
        }
      })
    },

    handleInput(formItem, subVariant, $event) {
      if (formItem.value !== $event) {
        this.$set(subVariant, '_edit', true)
      }
    },
    getLabel(formItem, type) {
      if (type) {
        return formItem
          .split('_')
          .map(el => {
            if (!el) return
            if (el === 'of' || el === 'in') {
              return el
            }
            return el.slice(0, 1).toUpperCase() + el.slice(1)
          })
          .join(' ')
      }
      if (!formItem) {
        return ''
      }
      if (this.type === 'shop') {
        if (formItem.variantId) {
          return formItem.skuStore
        }
        return formItem.propertyGroupName
      }

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
    }
  }
}
</script>

<style scoped lang="scss">
.iconBox {
  position: absolute;
  right: -110px;
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