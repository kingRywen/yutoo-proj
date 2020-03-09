<template>
  <div>
    <ElForm ref="form" :model="data">
      <ElFormItem label="选择日期" prop="time" :rules="[{required: true, message: '请选择日期'}]">
        <el-date-picker
          size="small"
          v-model="data.time"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd hh:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        time: []
      }
    }
  },
  methods: {
    _initData() {
      this.$refs.form.resetFields()
    },
    submit() {
      return this.$refs.form.validate().then(() => {
        return this.exportRecord()
      })
    },
    exportRecord() {
      let [startTime, endTime] = this.data.time
      return this.$api[`warehouse/wmInventoryExportStorage`]({startTime, endTime}).then(() => {
        this.$.notify()
      })
    }
  }
}
</script>

<style>
</style>
