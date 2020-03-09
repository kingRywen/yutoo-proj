<template>
  <el-date-picker
    v-if="item.controlType === 'Date'"
    class="per100"
    :value="value"
    @change="handleTimeChange"
    type="datetimerange"
    :picker-options="pickerOptions"
    range-separator="~"
    value-format="yyyy-MM-dd HH:mm:ss"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
  ></el-date-picker>
  <el-select v-else-if="item.controlType === 'Select'" :value="value" @change="$emit('input', $event)">
    <el-option v-for="el in item.fixedValue" :key="el.key" :label="el.value" :value="el.key"></el-option>
  </el-select>
  <el-input class="per100" @input="$emit('input', $event)" :value="value" v-else-if="item.controlType === 'Input' && item.dataType === 'String'"></el-input>
  <el-input-number
    @change="$emit('input', $event)"
    :precision="item.dataType ==='Double' ? 6 : 0"
    :value="value || undefined"
    class="per100"
    :controls="false"
    v-else-if="item.controlType === 'Input' && item.dataType === 'Integer'"
  ></el-input-number>
</template>

<script>
export default {
  props: ['value', 'item'],
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
      }
    }
  },
  methods: {
    handleTimeChange(val) {
      this.$emit('handleTimeChange', val)
      this.$emit('input', val)
    }
  },
}
</script>

<style>
</style>
