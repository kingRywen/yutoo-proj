<template>
  <el-input-number
    @clear="$emit('clear')"
    style="width:100%"
    v-if="item.type === 'number'"
    :value="currentVal"
    @change="$emit('input', $event)"
    controls-position="right"
    :controls="item.controls"
    :min="min"
    :disabled="disabled"
    :max="max"
    :placeholder="item.placeholder"
  ></el-input-number>
  <!-- 货币 -->
  <div class="currency" v-else-if="item.type === 'currency'">
    <el-input-number
      :disabled="disabled"
      @clear="$emit('clear')"
      style="width:100%"
      :value="currentVal"
      :precision="2"
      @change="$emit('input', $event)"
      controls-position="right"
      :min="min"
      :max="max"
      :placeholder="item.label"
    ></el-input-number>
    <span v-if="!item.noShow">$</span>
  </div>
  <!-- 多行文本 -->
  <el-input
    :disabled="disabled"
    v-else-if="item.type === 'textarea'"
    @input="$emit('input', $event)"
    :value="currentVal"
    @clear="$emit('clear')"
    type="textarea"
    :rows="item.rows || 2"
    :placeholder="item.label"
  ></el-input>
  <!-- 多选框 -->
  <el-checkbox-group class="formInputs" v-model="checkBoxVal" v-else-if="item.type === 'checkbox'" :disabled="disabled">
    <el-checkbox
      v-for="i in item.optionsFun ? item.optionsFun(formData) : options"
      :disabled="i.disabled"
      :key="i.value"
      :label="i.value"
      :value="i.value"
    >{{i.label}}</el-checkbox>
  </el-checkbox-group>
  <!-- 单选列表 -->
  <el-radio-group
    :value="currentVal"
    @input="$emit('input', $event)"
    v-else-if="item.type === 'radio'"
    :disabled="disabled"
  >
    <el-radio v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-radio>
  </el-radio-group>
  <!-- 选择 -->
  <el-select
    collapse-tags
    :multiple="item.multi"
    :disabled="disabled"
    style="width:100%"
    v-else-if="item.type === 'select'"
    :value="currentVal"
    :placeholder="selectPlaceholder"
    @change="$emit('input', $event)"
    @clear="$emit('clear')"
    clearable
  >
    <el-option v-for="i in options" :key="i[labeVal]" :label="i[label]" :value="i[labeVal]"></el-option>
  </el-select>

  <!-- 树型展示 -->
  <el-cascader
    v-else-if="item.type === 'cascader' && typeof item.options !== 'function'"
    :options="item.options"
    :disabled="disabled"
    :props="item.bind"
    @clear="$emit('clear')"
    @change="$emit('input', $event)"
    :value="currentVal"
  ></el-cascader>
  <!-- 树型展示异步 -->
  <SyncCascader
    v-else-if="item.type === 'cascader' && typeof item.options === 'function'"
    :props="item.bind"
    :disabled="disabled"
    @clear="$emit('clear')"
    @change="$emit('input', $event)"
    @changeEl="$emit('changeEl', $event)"
    :value="currentVal"
    :itemDisabled="item.itemDisabled && item.itemDisabled(formData)"
    :get-el="item.getEl"
    :load="item.options"
  ></SyncCascader>
  <!-- 日期范围 -->
  <el-date-picker
    :disabled="disabled"
    :value-format="item.format || (item.type === 'datetimerange' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd')"
    v-else-if="item.type === 'dateRange' || item.type === 'date' || item.type === 'datetimerange'"
    :type="item.type === 'dateRange' ? 'daterange': item.type === 'datetimerange' ? 'datetimerange' : undefined"
    :value="currentVal"
    :start-placeholder="item.start || '开始时间'"
    :end-placeholder="item.end || '结束时间'"
    :picker-options="item.pickerOptions"
    :placeholder="item.placeholder || '选择日期'"
    style="width:100%"
    @clear="$emit('clear')"
    @input="$emit('input', $event)"
  ></el-date-picker>

  <!-- 普通 -->
  <el-input
    :placeholder="`请输入${item.label}`"
    v-else
    :disabled="disabled"
    :value="currentVal"
    @input="$emit('input', $event)"
    @clear="$emit('clear')"
  ></el-input>
</template>

<script>
import SyncCascader from './SyncCascader'
export default {
  name: 'FormInputs',
  components: {
    SyncCascader
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      options: [],
      // checkBoxVal: [],
      val: null
    }
  },

  props: {
    formData: {
      type: Object,
      default: {}
    },
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  created() {
    // console.log(this.item.label, this.item)
    let { type, options } = this.item
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
    // if (type === 'checkbox') {
    //   this.$watch('checkBoxVal', val => {
    //     this.$emit('input', val)
    //   })
    // }
  },
  watch: {
    'item.options': {
      immediate: true,
      handler(val) {
        let { type, options } = this.item
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
    checkBoxVal: {
      get() {
        return this.currentVal || []
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    selectPlaceholder() {
      return `请选择${this.item.label != null ? this.item.label : ''}`
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

<style>
.formInputs.el-checkbox-group {
  line-height: 28px;
  height: 28px;
}
</style>
