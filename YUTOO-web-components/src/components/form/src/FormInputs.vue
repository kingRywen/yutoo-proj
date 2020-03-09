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
    :placeholder="item.label"
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
      :placeholder="item.label"
    ></el-input-number>
    <span v-if="!item.noShow">$</span>
  </div>
  <!-- 多行文本 -->
  <el-input
    v-else-if="item.type === 'textarea'"
    @input="$emit('input', $event)"
    :value="currentVal"
    @clear="$emit('clear')"
    type="textarea"
    :rows="2"
    :placeholder="item.label"
  ></el-input>
  <!-- 多选框 -->
  <el-checkbox-group v-model="checkBoxVal" v-else-if="item.type === 'checkbox'">
    <el-checkbox v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
  </el-checkbox-group>
  <!-- switch -->
  <!-- <el-switch v-else-if="item.type === 'switch'" @change="$emit('input', $event)" :value="currentVal"></el-switch> -->
  <!-- 选择 -->
  <el-select
    collapse-tags
    :multiple="item.multi"
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
    v-else-if="item.type === 'cascader'"
    :options="options"
    :props="item.bind"
    @clear="$emit('clear')"
    @change="$emit('input', $event)"
    :value="currentVal"
  ></el-cascader>
  <!-- 日期范围 -->
  <el-date-picker
    :value-format="item.format || item.type === 'datetimerange' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'"
    v-else-if="item.type === 'dateRange' || item.type === 'date' || item.type === 'datetimerange'"
    :type="item.type === 'dateRange' ? 'daterange': item.type === 'datetimerange' ? 'datetimerange' : null"
    :value="currentVal"
    :picker-options="item.pickerOptions"
    :start-placeholder="item.start || '开始时间'"
    :end-placeholder="item.end || '结束时间'"
    style="width:100%"
    @clear="$emit('clear')"
    @input="$emit('input', $event)"
  ></el-date-picker>

  <!-- 普通 -->
  <el-input
    :placeholder="item.label"
    v-else
    :value="currentVal"
    @input="$emit('input', $event)"
    @clear="$emit('clear')"
  ></el-input>
</template>

<script>
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
</style>
