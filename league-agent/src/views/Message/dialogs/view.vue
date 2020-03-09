<template>
  <new-form ref="form" :disabled="true" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['id'],
  data() {
    return {
      formSchema: {
        type: {
          label: '通知类型',
          widget: 'select',
          options: '$const.OTHER/sysInform'
        },
        noticeStartDate: {
          label: '通知日期'
        },
        title: {
          label: '标题'
        },
        content: {
          label: '内容',
          widget: 'textarea',
          rows: 5
        }
      },
      value: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$api[`agent/merchantMessageInfo`]({ id: this.id }).then(data => {
        this.value = data.rows
      })
    }
  }
}
</script>