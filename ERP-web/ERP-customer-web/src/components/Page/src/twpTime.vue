<template>
  <div class="twp-time">
    <el-date-picker
      value-format="yyyy-MM-dd HH:mm:ss"
      :size="size || 'small'"
      v-model="values"
      type="datetimerange"
      align="right"
      unlink-panels
      range-separator="至"
      @clear="() => values = []"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :style="styles || null"
      :picker-options="pickerOptions"
    ></el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'twp-time',
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    size: {
      type: String,
      default: 'small'
    },
    styles: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    values: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  }
}
</script>

<style lang='scss'>
.twp-time {
  background: #fff;
}
</style>