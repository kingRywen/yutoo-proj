<template>
  <el-input-number
    style="width:100%"
    v-if="item.type === 'number'"
    :value="currentVal"
    @change="$emit('input', $event)"
    controls-position="right"
    :min="min"
    :max="max"
  ></el-input-number>
  <!-- 货币 -->
  <div class="currency" v-else-if="item.type === 'currency'">
    <el-input-number
      style="width:100%"
      :value="currentVal"
      :precision="2"
      @change="$emit('input', $event)"
      controls-position="right"
      :min="min"
      :max="max"
    ></el-input-number>
    <span>$</span>
  </div>
  <!-- 选择 -->
  <el-select
    :multiple="item.multi"
    style="width:100%"
    v-else-if="item.type === 'select'"
    :value="currentVal"
    :placeholder="selectPlaceholder"
    @change="$emit('input', $event)"
    clearable
  >
    <el-option v-for="i in item.options" :key="i[labeVal]" :label="i[label]" :value="i[labeVal]"></el-option>
  </el-select>
  <!-- 日期范围 -->
  <el-date-picker
    :value-format="item.format || 'yyyy-MM-dd'"
    v-else-if="item.type === 'dateRange' || item.type === 'date'"
    :type="item.type === 'dateRange' ? 'daterange': null"
    :value="currentVal"
    style="width:100%"
    @input="$emit('input', $event)"
  ></el-date-picker>
  <!-- 普通 -->
  <!-- // eslint-disable-next-line -->
  <el-input :placeholder="item.label" v-else :value="currentVal" @input="$emit('input', $event)"></el-input>
</template>

<script>
export default {
  name: 'FormInputs',
  model: {
    prop: 'value',
    event: 'input'
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
