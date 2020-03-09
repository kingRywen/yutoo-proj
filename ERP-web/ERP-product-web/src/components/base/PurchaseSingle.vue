<template>
  <v-form :model="item" class="__special_form" :direction="direction">
    <template>
      <div class="__hover_box">
        <div class="openTab">
          <v-form-item
            style="width:100%"
            :label="getLabel(item.propertyName)"
            :rules="getRule(item)"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :required="!!item.mustFlag"
            :prop="`value`"
            :title="getLabel(item.propertyName)"
          >
            <PurchaseInputs
              :disabled="disabled"
              :dateRange="item.dataRanges"
              :list="item.propItem"
              :bind-field="bindField"
              :item="item"
              v-model="item.value"
              @input="handleInputMain(item, $event)"
              @focus="setOldVal(item, $event)"
            />
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

        <div class="openTab" v-show="item._show" v-if="!item.variant">
          <v-form-item
            :title="subVariant.skuStore"
            v-for="(subVariant, subIndex) in item.propertyValue"
            style="width:100%"
            :label="subVariant.skuStore"
            :rules="getRule(item)"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :required="!!item.mustFlag"
            :prop="`propertyValue.${subIndex}.value`"
          >
            <PurchaseInputs
              :disabled="disabled"
              :dateRange="subVariant.dataRanges"
              :ref="`sub${subIndex}`"
              :list="item.propItem"
              :bind-field="bindField"
              :item="item"
              v-model="subVariant.value"
            />
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
    bindField: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'shop'
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
    applyVal() {
      if (this.item.platformValue && this.item.platformValue !== '') {
        this.item.value =
          this.item.controlType === 2
            ? +this.item.platformValue
            : this.item.platformValue
      }
      this.item.propertyValue.forEach(el => {
        if (el.platformValue && el.platformValue !== '') {
          el.value = el.controlType === 2 ? +el.platformValue : el.platformValue
        }
      })
    },
    closeAll() {
      this.$set(this.item, '_show', false)
    },
    handleInputMain(item, val) {
      let vm = this
      this.item.propertyValue.forEach((element, index) => {
        if (!element._edit) {
          vm.$set(element, 'value', val)
          if (item.controlType === 7) {
            console.log(val)
            let Editor = vm.$refs[`sub${index}`][0].$children[0]
            console.log(Editor.html(val))
            Editor.editor.setContent(Editor.html(val))
          }
        }
      })
    },

    setOldVal(item, val) {
      this.$emit('closeall')
      this.$set(this.item, '_show', true)
      this.item.propertyValue.forEach(element => {
        if (element.value == this.item.value) {
          this.$set(element, '_edit', false)
        } else {
          this.$set(element, '_edit', true)
        }
      })
    },
    toggle(item) {
      this.$set(item, '_show', !item._show)
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