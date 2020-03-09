<template>
  <el-input-number
    @clear="$emit('clear')"
    style="width:100%"
    v-if="item.type === 'number'"
    :value="currentVal"
    @change="$emit('input', $event)"
    controls-position="right"
    :min="min"
    :max="max"
    :disabled="disabled"
    :placeholder="item.placeholder"
  ></el-input-number>
  <!-- 货币 -->
  <div class="currency" v-else-if="item.type === 'currency'">
    <el-input-number
      @clear="$emit('clear')"
      style="width:100%"
      :value="currentVal"
      :precision="2"
      @change="$emit('input', $event)"
      controls-position="right"
      :min="min"
      :max="max"
      :disabled="disabled"
      :placeholder="item.placeholder"
    ></el-input-number>
    <span v-if="!item.noShow">$</span>
  </div>
  <!-- 多行文本 -->
  <el-input
    v-else-if="item.type === 'textarea'"
    @input="$emit('input', $event)"
    :value="currentVal"
    @clear="$emit('clear')"
    :style="{width:item.width|| '100%',minWidth:'150px'}"
    type="textarea"
    :disabled="disabled"
    :rows="item.rows || 2"
    :placeholder="item.placeholder"
  ></el-input>
  <!-- 多选框 -->
  <el-checkbox-group v-model="checkBoxVal" :disabled="disabled" v-else-if="item.type === 'checkbox'">
    <el-checkbox v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
  </el-checkbox-group>
  <!-- switch -->
  <el-switch
    v-else-if="item.type === 'switch'"
    :active-value="item.activeValue || 1"
    :inactive-value="item.inactiveValue || 0"
    @change="$emit('input', $event)"
    :value="currentVal"
  ></el-switch>
  <!-- 选择 -->
  <el-select
    collapse-tags
    :disabled="disabled"
    :multiple="item.multi"
    :style="{width:item.width|| '100%',minWidth: item.width ? 0 : '150px'}"
    @visible-change="handleSelectVisibleChange"
    v-else-if="item.type === 'select'"
    :value="currentVal"
    :allow-create="item.allowCreate"
    :filterable="item.allowCreate || item.filterable"
    :placeholder="selectPlaceholder"
    @change="$emit('input', $event)"
    @clear="$emit('clear')"
    :clearable="item.clearable===false?false:true"
  >
    <el-option v-for="i in options" :key="i[labeVal]" :label="i[label]" :value="i[labeVal]">
      <span :class="{'custom_hover': item.optionsHoverFunc ? item.optionsHoverFunc(i) : false}">{{ i[label] }}</span>
    </el-option>
  </el-select>

  <!-- 树型展示异步 -->
  <SyncCascader
    v-else-if="item.type === 'cascader' && typeof item.options === 'function'"
    :props="item.bind"
    :disabled="disabled"
    :last="item.last"
    :placeholder="item.placeholder"
    @clear="$emit('clear')"
    @change="$emit('input', $event)"
    @changeEl="$emit('changeEl', $event)"
    :value="currentVal"
    :style="{width: item.width ? parseInt(item.width) + 'px' : '200px'}"
    :itemDisabled="item.itemDisabled && item.itemDisabled(formData)"
    :get-el="item.getEl"
    :load="item.options"
  ></SyncCascader>
  <!-- 树型展示 -->
  <el-cascader
    :disabled="disabled"
    :change-on-select="item.every"
    v-else-if="item.type === 'cascader' && typeof item.options !== 'function'"
    :options="options"
    :props="item.bind"
    :placeholder="item.placeholder"
    @clear="$emit('clear')"
    :style="{width: item.width ? parseInt(item.width) + 'px' : '200px'}"
    @change="$emit('input', $event)"
    @active-item-change="handleChangeItem"
    :value="currentVal"
  ></el-cascader>
  <!-- 日期范围 -->
  <el-date-picker
    :disabled="disabled"
    :value-format="item.format || item.type === 'datetimerange' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'"
    v-else-if="item.type === 'dateRange' || item.type === 'date' || item.type === 'datetimerange'"
    :type="item.type === 'dateRange' ? 'daterange': item.type === 'datetimerange' ? 'datetimerange' : 'date'"
    :value="currentVal"
    :picker-options="getPickerOptions"
    :start-placeholder="item.startPlaceholder || '开始时间'"
    :end-placeholder="item.endPlaceholder || '结束时间'"
    :style="{width: item.width ? parseInt(item.width) + 'px' : '200px'}"
    @clear="$emit('clear')"
    @change="$emit('input', $event)"
    @input="$emit('input', $event)"
    :clearable="item.clearable===false?false:true"
  ></el-date-picker>

  <!-- 普通 -->
  <el-input
    :disabled="disabled"
    :placeholder="item.placeholder"
    :maxlength="item.maxlength"
    v-else
    :style="{width:item.width|| '100%',minWidth:item.width ? 0 : '100px'}"
    :value="currentVal"
    @input="$emit('input', $event)"
    @clear="$emit('clear')"
  ></el-input>
</template>

<script>
import cfun from 'Plugins/functions'
export default {
  name: 'FormInputs',
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      options: [],
      checkBoxVal: []
    }
  },

  props: {
    formData: {
      type: Object,
      default: {}
    },
    disabled: Boolean,
    placeholder: {
      type: String
    },
    item: {
      type: Object,
      default: () => {}
    },
    value: {
      default: null,
      required: true
    }
  },
  created() {
    // console.log(this.item.label, this.item)
    let { type } = this.item
    // if (!options) {
    //   return
    // }
    // if (options && typeof options === 'function') {
    //   options().then(res => {
    //     this.options = res
    //   })
    // } else {
    //   this.options = options
    // }

    // checkbox时，监听checkbox的绑定值，并把值反馈回父组件
    if (type === 'checkbox') {
      this.$watch('checkBoxVal', val => {
        this.$emit('input', val)
      })
    }
  },
  methods: {
    handleChangeItem(arr) {
      if (this.item.changeItem) {
        this.item.changeItem(arr)
      }
    },
    handleSelectVisibleChange(show) {
      if (this.item.visibleChange) {
        this.item.visibleChange(show)
      }
    }
  },
  watch: {
    'item.options': {
      immediate: true,
      handler(val) {
        let { options } = this.item
        if (val) {
          if (typeof val === 'function') {
            options().then(res => {
              this.options = res
            })
          } else {
            this.options = options
          }
        }
      }
    }
  },
  computed: {
    getPickerOptions() {
      if (this.item.pickerOptions) {
        return this.item.pickerOptions
      }
      if (this.item.timeDisabled) {
        switch (this.item.timeDisabled) {
          case 'before':
            return cfun._pickerFuture
            break
          case 'after':
            return cfun._pickerBefore
            break

          default:
            break
        }
      }
    },
    selectPlaceholder() {
      return (
        this.item.placeholder ||
        `请选择${this.item.label != null ? this.item.label : ''}`
      )
    },
    min() {
      return this.item.min || 0
    },
    max() {
      return this.item.max || Infinity
    },
    currentVal() {
      return this.value == null ? undefined : this.value
    },
    label() {
      return (this.item.bind && this.item.bind.label) || 'label'
    },
    labeVal() {
      return (this.item.bind && this.item.bind.value) || 'value'
    }
  }
}
</script>

<style lang='scss' scoped>
.custom_hover {
  background: #e4e7ed;
  display: block;
  margin: 0 -20px;
  padding: 0 20px;
  &:hover {
    background: #dcdfe6;
  }
}
</style>
