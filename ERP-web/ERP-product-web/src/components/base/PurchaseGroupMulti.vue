<template>
  <v-form class="__special_form" :direction="direction">
    <div class="__hover_box">
      <div class="openTab">
        <v-form-item
          :label="getLabel(item[0].propertyName)"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :title="getLabel(item[0].propertyName)"
        >
          <v-row type="flex" style="padding-top: 0">
            <v-col
              style="padding-bottom:32px"
              :span="parseInt(24/item.length) <= 6 ? 6 : parseInt(24/item.length)"
              v-for="(col, subIndex) in item"
            >
              <v-form-item
                style="padding-top: 0"
                :label="subIndex === 0 ? null : getLabel(col.propertyName)"
                :rules="getRule(col)"
                :label-col="subIndex === 0 ? {span:0} : labelCol1"
                :wrapper-col="subIndex === 0 ? {span:24} :wrapperCol1"
                :title="subIndex === 0 ? null : getLabel(col.propertyName)"
              >
                <PurchaseInputs
                  :disabled="disabled"
                  :dateRange="col.dataRanges"
                  :list="col.values"
                  :bind-field="bindField"
                  :item="col"
                  v-model="ruleForm.parent[col.propertyName]"
                  @input="handleInputMain(col, $event, subIndex)"
                  @focus="setOldVal(col)"
                />
                <div
                  class="iconBox"
                  style="right:-103px"
                  v-if="mappingFieldData.parent.reference[col.propertyName] != null"
                >
                  <div>
                    <v-tooltip placement="top">
                      <v-icon type="info-circle"></v-icon>
                      <template slot="content">
                        <p>{{mappingFieldData.parent.reference[col.propertyName]}}</p>
                      </template>
                    </v-tooltip>
                  </div>
                </div>
              </v-form-item>
            </v-col>
          </v-row>
          <div class="iconBox">
            <div @click="toggle(item)" v-if="item.variantsDisparityFlag">
              <v-icon type="down-square" v-if="!show"></v-icon>
              <v-icon type="up-square" v-else></v-icon>
            </div>
          </div>
        </v-form-item>
      </div>

      <template>
        <div
          class="openTab"
          v-for="(subVariant, key, index) in ruleForm.variants"
          v-show="show"
          v-if="item.variantsDisparityFlag"
        >
          <v-form-item
            :label="subVariant.skuCustom"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :title="subVariant.skuCustom"
          >
            <v-row type="flex" style="padding-top: 0">
              <v-col
                style="padding-bottom:32px"
                :span="parseInt(24/item.length) < 6 ? 6 : parseInt(24/item.values[0].length)"
                v-for="(col, subIndex) in item"
              >
                <v-form-item
                  style="padding-top: 0"
                  :label="subIndex === 0 ? null : getLabel(col.propertyName)"
                  :rules="getRule(col)"
                  :label-col="subIndex === 0 ? {span:0} : labelCol1"
                  :wrapper-col="subIndex === 0 ? {span:24} :wrapperCol1"
                  :title="subIndex === 0 ? null : getLabel(col.propertyName)"
                >
                  <PurchaseInputs
                    :disabled="disabled"
                    :dateRange="col.dataRanges"
                    :list="col.values"
                    :bind-field="bindField"
                    :item="col"
                    v-model="ruleForm.variants[key][col.propertyName]"
                  />
                  <div
                    class="iconBox"
                    style="right:-103px"
                    v-if="mappingFieldData.variants[key].reference[col.propertyName] != null"
                  >
                    <div>
                      <v-tooltip placement="top">
                        <v-icon type="info-circle"></v-icon>
                        <template slot="content">
                          <p>{{mappingFieldData.variants[key].reference[col.propertyName]}}</p>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                </v-form-item>
              </v-col>
            </v-row>
          </v-form-item>
        </div>
      </template>

      <div class="__hr"></div>
    </div>
  </v-form>
</template>

<script>
import { showToast } from 'common/common'
import PurchaseInputs from './PurchaseInputs'
export default {
  components: {
    PurchaseInputs
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
      labelCol1: {
        span: 10
      },
      wrapperCol1: {
        span: 14
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
      type: [Object, Array],
      default: () => {}
    }
  },
  methods: {
    closeAll() {
      this.show = false
    },
    handleInputMain(col, val, subIndex) {
      this.$set(col, 'value', val)
      let variants = this.ruleForm.variants
      for (const key in variants) {
        if (variants.hasOwnProperty(key)) {
          const element = variants[key]
          if (!this.edit['edit-' + col.propertyName]) {
            this.$set(element, col.propertyName, val)
          }
        }
      }
    },
    setOldVal(col) {
      this.$emit('closeall')
      this.show = true
      let variants = this.ruleForm.variants
      for (const key in variants) {
        if (variants.hasOwnProperty(key)) {
          const element = variants[key]
          if (
            this.ruleForm.parent[col.propertyName] == element[col.propertyName]
          ) {
            this.$set(this.edit, 'edit-' + col.propertyName, false)
          } else {
            this.$set(this.edit, 'edit-' + col.propertyName, true)
          }
        }
      }
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
    },
    toggle(item) {
      this.show = !this.show
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