<template>
  <v-form :model="ruleForm" class="__special_form" :direction="direction">
    <!-- {{ruleForm.variants}} -->
    <template v-for="(val, index) in valuesSort">
      <div class="__hover_box" v-if="val !== null || index === 0">
        <div class="openTab">
          <v-form-item
            style="width:100%"
            :label="getLabel(item.propertyName) + (index + 1)"
            :rules="getRule(item)"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :required="!!item.mustFlag && index === 0"
            :prop="`parent.${item.propertyName}.${index}`"
          >
            <PurchaseInputs
              @clearVal="handleInputMain(item, index, null)"
              :dateRange="item.dataRanges"
              :disabled="disabled"
              in-type="plat"
              :list="index === 0 ? item.values : item.groupValues && item.groupValues[index-1]"
              :bind-field="bindField"
              :item="item"
              :value="ruleForm.parent[item.propertyName][index]"
              @input="handleInputMain(item, index, $event)"
              @focus="setOldVal(item, $event, index)"
              :key="index"
            />
            <div class="iconBox">
              <div @click="toggle(index)" v-if="item.variantsDisparityFlag">
                <v-icon type="down-square" v-if="!show[index]"></v-icon>
                <v-icon type="up-square" v-else></v-icon>
              </div>
              <div style="line-height: 30px;font-size: 14px;display: flex;" v-if="!disabled">
                <span style="margin-left:6px;" @click="handleAdd(val, index)">
                  <v-icon style="font-size:12px" type="plus-circle-o"></v-icon>
                </span>
                <span style="margin-left:6px;" v-if="index !== 0" @click="handleMinus(val, index)">
                  <v-icon style="font-size:12px" type="minus-circle-o"></v-icon>
                </span>
              </div>

              <div
                style="margin-left:6px;"
                v-if="mappingFieldData.parent.reference[item.propertyGroupName+(index+1)] != null"
              >
                <v-tooltip placement="top">
                  <v-icon type="info-circle"></v-icon>
                  <template slot="content">
                    <p>{{mappingFieldData.parent.reference[item.propertyGroupName+(index+1)]}}</p>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </v-form-item>
        </div>
        <!-- 变体输入 -->
        <div class="openTab" v-show="show[index]" v-if="item.variantsDisparityFlag">
          <v-form-item
            v-for="(subVariant, key, subIndex) in ruleForm.variants"
            style="width:100%"
            :label="key"
            :rules="getRule(item)"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :required="!!item.mustFlag && index === 0"
            :prop="`variants.${key}.${item.propertyName}.${index}`"
          >
            <PurchaseInputs
              @clearVal="handleSubInput(item, index, null)"
              :dateRange="item.dataRanges"
              :disabled="disabled"
              in-type="plat"
              :list="index === 0 ? item.values : item.groupValues && item.groupValues[index-1]"
              :bind-field="bindField"
              :item="item"
              v-model="subVariant[item.propertyName][index]"
              @input="handleSubInput(subVariant,subIndex,$event)"
            />
            <div class="iconBox">
              <div v-if="mappingFieldData.variants[key].reference[item.propertyGroupName+(index+1)] != null">
                <v-tooltip placement="top">
                  <v-icon type="info-circle"></v-icon>
                  <template slot="content">
                    <p>{{mappingFieldData.variants[key].reference[item.propertyGroupName+(index+1)]}}</p>
                  </template>
                </v-tooltip>
              </div>
            </div>
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
    mappingFieldData: {
      type: Object,
      default: {
        parent: { reference: {} },
        variants: { reference: {} }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    ruleForm: {
      type: Object,
      default: () => {}
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
      //
      type: Object,
      default: () => {}
    }
  },

  created() {
    for (const key in this.ruleForm.variants) {
      if (this.ruleForm.variants.hasOwnProperty(key)) {
        const element = this.ruleForm.variants[key]
        this.$set(element, 'edit-' + this.item.propertyName, [])
        if (!(this.item.propertyName in element)) {
          this.$set(element, this.item.propertyName, [])
        }
      }
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
        if (!reg.test(value)) {
          callback(new Error('数值不符合规范'))
        }
        callback()
      }
    }
    return {
      show: [],
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
      if (!this.item.value) {
        return []
      }
      return this.item.value.map(el => {
        return el == null ? '' : el
      })
    }
  },

  methods: {
    clear(val, index, type) {
      // if (!type) {
      //   this.handleMinus(val, index)
      // }
    },
    handleSubInput() {},
    closeAll() {
      this.show.splice(0)
    },
    setOldVal(item, event, index) {
      this.$emit('closeall')
      this.$set(this.show, index, true)
      for (const key in this.ruleForm.variants) {
        if (this.ruleForm.variants.hasOwnProperty(key)) {
          const element = this.ruleForm.variants[key]
          if (
            element[this.item.propertyName][index] ==
              this.ruleForm.parent[this.item.propertyName][index] ||
            (element[this.item.propertyName][index] == null &&
              this.ruleForm.parent[this.item.propertyName][index] === '')
          ) {
            this.$set(element['edit-' + this.item.propertyName], index, false)
          } else {
            this.$set(element['edit-' + this.item.propertyName], index, true)
          }
        }
      }
    },
    toggle(index) {
      this.$set(this.show, index, !this.show[index])
    },
    handleAdd(item, index) {
      if (this.item.value.length > this.item.num - 1) {
        showToast('warning', `只能增加${this.item.num}个`)
        return
      }
      if (index === 0 && this.item.value.length === 1) {
        this.item.value[0] = ''
      }
      this.item.value.push('')
    },
    handleMinus(item, index) {
      let len = this.item.value.length
      this.item.value.splice(index, 1)
      for (let i = index; i < this.item.value.length; i++) {
        this.item.value[i] = null
      }
    },

    handleInputMain(item, index, val) {
      this.$set(this.ruleForm.parent[this.item.propertyName], index, val)
      for (const key in this.ruleForm.variants) {
        if (this.ruleForm.variants.hasOwnProperty(key)) {
          const element = this.ruleForm.variants[key]
          if (!element['edit-' + this.item.propertyName][index]) {
            this.$set(element[this.item.propertyName], index, val)
          }
        }
      }
    },

    handleInput(subVariant, $event) {
      if (this.item.value !== $event) {
        this.$set(subVariant, '_edit', true)
      }
    },
    getLabel(propertyGroupName) {
      return propertyGroupName
        .split('_')
        .map(el => {
          if (!el) return
          if (el === 'of' || el === 'in') {
            return el
          }
          return el.slice(0, 1).toUpperCase() + el.slice(1)
        })
        .join(' ')
        .replace(/1(?=\b)/g, '')
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