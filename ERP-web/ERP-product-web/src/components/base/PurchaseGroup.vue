<template>
  <v-form :model="item" class="__special_form" :direction="direction">
    <template>
      <div class="__hover_box">
        <template v-for="(formItem, index) in item.values">
          <div class="openTab" v-if="index === 0">
            <v-form-item
              :label="getLabel(formItem[0].propertyName)"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :title="getLabel(formItem[0].propertyName)"
            >
              <v-row type="flex" style="padding-top: 0">
                <v-col
                  style="padding-bottom:32px"
                  :span="parseInt(24/item.values[0].length) <= 6 ? 6 : parseInt(24/item.values[0].length)"
                  v-for="(col, subIndex) in formItem"
                >
                  <v-form-item
                    style="padding-top: 0"
                    :prop="`values.0.${subIndex}.value`"
                    :rules="getRule(col)"
                    :label="subIndex === 0 ? null : col.propertyHead"
                    :label-col="subIndex === 0 ? {span:0} : labelCol1"
                    :wrapper-col="subIndex === 0 ? {span:24} :wrapperCol1"
                    :title="subIndex === 0 ? null : col.propertyHead"
                  >
                    <PurchaseInputs
                      :disabled="disabled"
                      :dateRange="col.dataRanges"
                      :list="col.propItem"
                      :bind-field="bindField"
                      :item="col"
                      v-model="col.value"
                      @input="handleInputMain(col, index, $event, subIndex)"
                      @focus="setOldVal(formItem, $event, subIndex)"
                    />
                  </v-form-item>
                </v-col>
              </v-row>

              <div class="iconBox">
                <div @click="toggle(item)" v-if="!item.variant">
                  <v-icon type="down-square" v-if="!item._show"></v-icon>
                  <v-icon type="up-square" v-else></v-icon>
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
          <div class="openTab" v-show="item._show" v-else-if="!item.variant">
            <v-form-item
              :label="formItem && formItem[0] && formItem[0].sellerSku || ' '"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :title="formItem && formItem[0] && formItem[0].sellerSku || ' '"
            >
              <v-row type="flex" style="padding-top: 0">
                <v-col
                  style="padding-bottom:32px"
                  :span="parseInt(24/item.values[0].length) <= 6 ? 6 : parseInt(24/item.values[0].length)"
                  v-for="(col, subIndex) in formItem"
                >
                  <v-form-item
                    style="padding-top: 0"
                    :prop="`values.0.${subIndex}.value`"
                    :rules="getRule(col)"
                    :label="subIndex === 0 ? null : col.propertyHead"
                    :label-col="subIndex === 0 ? {span:0} : labelCol1"
                    :wrapper-col="subIndex === 0 ? {span:24} :wrapperCol1"
                    :title="subIndex === 0 ? null : col.propertyHead"
                  >
                    <PurchaseInputs
                      :disabled="disabled"
                      :dateRange="col.dataRanges"
                      :list="col.propItem"
                      :bind-field="bindField"
                      :item="col"
                      v-model="col.value"
                    />
                  </v-form-item>
                </v-col>
              </v-row>
            </v-form-item>
          </div>
        </template>

        <div class="__hr"></div>
      </div>
    </template>
  </v-form>
</template>

<script>
import { showToast } from 'common/common'
import PurchaseInputs from './PurchaseInputs'
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
      edit: {},
      labelCol1: {
        span: 10
      },
      wrapperCol1: {
        span: 14
      },
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
    }
  },

  methods: {
    applyVal() {
      // this.item.value
      this.item.values.forEach(el => {
        el.forEach(_el => {
          if (_el.platformValue && _el.platformValue !== '') {
            _el.value =
              _el.controlType === 2 ? +_el.platformValue : _el.platformValue
          }
        })
      })
    },
    closeAll() {
      this.$set(this.item, '_show', false)
    },
    setOldVal(item, val, index) {
      // debugger
      this.$emit('closeall')
      this.$set(this.item, '_show', true)
      let _val = this.item.values[0]
      item.forEach(el => {
        this.item.values.forEach((valEl, i) => {
          if (i === 0) {
            return
          }
          if (valEl[index].value == _val[index].value) {
            this.$set(valEl[index], '_edit', false)
          } else {
            this.$set(valEl[index], '_edit', true)
          }
        })
      })
    },
    toggle(item) {
      this.$set(this.item, '_show', !this.item._show)
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
      this.item.values[index].value = null
      let val = this.item.values.map(el => el.value)
      // this.$emit('input', val)
    },

    handleInputMain(item, index, val, subIndex) {
      let arrs = this.item.values
      arrs.forEach((element, i) => {
        if (i === 0) {
          return
        }
        element.forEach((el, _i) => {
          if (_i === subIndex && !el._edit) {
            el.value = val
          }
        })
      })
    },

    getLabel(str) {
      return str
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