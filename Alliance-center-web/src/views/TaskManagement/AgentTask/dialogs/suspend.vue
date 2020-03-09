<template>
  <div>
    <div class="txc" style="font-size: 12px">
      <span style="opacity: 0.8">当任务不想或无法执行下去时，可以中止任务，系统将返回剩余费用：</span>
      <b style="color:green">${{returnMoney}}</b>。
    </div>
    <new-form class="mt20" ref="form" label-width="120px" :form-schema="formSchema" v-model="value"></new-form>
  </div>
</template>
<script>
export default {
  props: ['taskSourceId'],
  data() {
    return {
      returnMoney: '-',
      formSchema: {
        stopCause: {
          label: '中止原因',
          widget: 'select',
          options: () =>
            this.$api[`main/taskSourceStopCause`]({}).then(data =>
              data.rows.map(el => ({ label: el.name, value: el.value }))
            ),
          required: true
        },
        auditExplain: {
          label: '审核结果说明',
          widget: 'textarea',
          rows: 5
        }
      },
      value: {}
    }
  },
  created() {
    this.getMoney()
  },
  methods: {
    getMoney(stopCause) {
      this.$api[`main/taskSourceStopReturnMoney`]({
        taskSourceId: this.taskSourceId,
        stopCause
      }).then(data => {
        this.returnMoney = data.rows.returnMoney
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() =>
        this.$api[`main/taskSourceStop`]({
          taskSourceId: this.taskSourceId,
          ...this.value
        })
      )
    }
  },
  watch: {
    'value.stopCause'(val) {
      if (val === 'productCategoryMismatch') {
        this.getMoney(val)
      }
    }
  }
}
</script>