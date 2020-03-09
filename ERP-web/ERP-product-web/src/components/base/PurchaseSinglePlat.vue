<template>
  <v-form :model="ruleForm" class="__special_form" :direction="direction">
    <template>
      <div class="__hover_box">
        <div class="openTab">
          <v-form-item
            style="width:100%"
            :title="getLabel(item.propertyName)"
            :label="getLabel(item.propertyName)"
            :rules="getRule(item)"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :required="!!item.mustFlag"
            :prop="`parent.${item.propertyName}`"
          >
            <PurchaseInputs
              :dateRange="item.dataRanges"
              :disabled="disabled"
              :list="item.values"
              in-type="plat"
              :bind-field="bindField"
              :item="item"
              :value="ruleForm.parent[item.propertyName]"
              @input="handleInputMain(item, $event)"
              @focus="setOldVal(item, $event)"
            />
            <div class="iconBox">
              <div @click="toggle" v-if="item.variantsDisparityFlag">
                <v-icon type="down-square" v-if="!show"></v-icon>
                <v-icon type="up-square" v-else></v-icon>
              </div>
              <div v-if="mappingFieldData.parent.reference[item.propertyName] != null">
                <v-tooltip placement="top">
                  <v-icon type="info-circle"></v-icon>
                  <template slot="content">
                    <p>{{mappingFieldData.parent.reference[item.propertyName]}}</p>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </v-form-item>
        </div>
        <!-- 变体输入 -->
        <div class="openTab" v-show="show" v-if="item.variantsDisparityFlag">
          <v-form-item
            v-for="(subVariant, key, subIndex) in ruleForm.variants"
            style="width:100%"
            :label="subVariant.skuCustom"
            :title="subVariant.skuCustom"
            :rules="getRule(item)"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :required="!!item.mustFlag"
            :prop="`variants.${key}.${item.propertyName}`"
          >
            <PurchaseInputs
              :dateRange="item.dataRanges"
              :disabled="disabled"
              :list="item.values"
              in-type="plat"
              :bind-field="bindField"
              :item="item"
              v-model="subVariant[item.propertyName]"
              @input="handleSubInput(subVariant,subIndex,$event)"
            />
            <div class="iconBox">
              <div v-if="mappingFieldData.variants[key].reference[item.propertyName] != null">
                <v-tooltip placement="top">
                  <v-icon type="info-circle"></v-icon>
                  <template slot="content">
                    <p>{{mappingFieldData.variants[key].reference[item.propertyName]}}</p>
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
import PurchaseInputs from './PurchaseInputs'
export default {
  components: {
    PurchaseInputs
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    mappingFieldData: {
      type: Object,
      default: {
        parent: { reference: {} },
        variants: { reference: {} }
      }
    },
    bindField: {
      type: Object,
      default: () => {}
    },
    ruleForm: {
      type: Object,
      default: () => {}
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
      type: [Object, Array],
      default: () => {}
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
      show: false,
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

  methods: {
    closeAll() {
      this.show = false
    },
    handleInputMain(item, val) {
      this.$set(this.ruleForm.parent, this.item.propertyName, val)
      this.$set(this.item, 'value', val)

      for (const key in this.ruleForm.variants) {
        if (this.ruleForm.variants.hasOwnProperty(key)) {
          const element = this.ruleForm.variants[key]
          if (!this.edit[key]) {
            this.$set(element, this.item.propertyName, val)
          }
        }
      }
    },
    setOldVal(item, val) {
      this.$emit('closeall')
      this.show = true
      for (const key in this.ruleForm.variants) {
        if (this.ruleForm.variants.hasOwnProperty(key)) {
          const element = this.ruleForm.variants[key]
          // debugger
          if (
            element[this.item.propertyName] ==
            this.ruleForm.parent[this.item.propertyName]
          ) {
            this.$set(this.edit, key, false)
          } else {
            this.$set(this.edit, key, true)
          }
        }
      }
    },
    handleSubInput() {},
    toggle(item) {
      this.show = !this.show
    },
    getLabel(propertyName) {
      return propertyName
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