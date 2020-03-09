<template>
  <new-form :disabled="disabled" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: {
    taskSourceId: [String, Number],
    batch: {
      default: false
    },
    type: {
      type: String,
      // taskSource 任务审核  audit 出库审核 null 充值审核
      default: 'taskSource'
    },
    disabled: Boolean,
    currency: String
  },
  data() {
    return {
      formSchema: {
        auditResult: {
          label: '审核结果',
          widget: 'radio',
          required: true,
          options: [
            {
              label: '通过',
              value: 1
            },
            {
              label: '不通过',
              value: 0
            }
          ]
        },
        noPassCause: {
          label: '不通过原因',
          widget: 'select',
          hidden: data => data.auditResult == null || data.auditResult == 1,
          required: true,
          change: data => {
            let selected = this.opts.find(el => el.value === data.noPassCause)
            if (selected) {
              this.formSchema.auditExplain.required = selected.label === '其它'
            }
          },
          options: () =>
            this.$api[
              `main/${
                this.type === 'taskSource'
                  ? 'taskSourceCauseList'
                  : this.type === 'audit'
                  ? 'recycleCauseList'
                  : 'merchantPayCauseList'
              }`
            ]({}).then(
              data =>
                (this.opts = data.rows.map(el => ({
                  label: el.name,
                  value: el.value
                })))
            )
        },
        realPay: {
          label: '实付金额',
          widget: 'currency',
          min: 0.01,
          required: true,
          hidden: data =>
            this.type === 'taskSource' ||
            !(data.noPassCause && data.noPassCause == 'realPayMismatching') ||
            data.auditResult == 1,
          signal: this.currency == 'CNY' ? '￥' : '$'
        },
        auditExplain: {
          label: '审核结果说明',
          widget: 'textarea',
          required: false,
          rows: 5
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          ...this.value,
          [this.type === 'taskSource' ? 'taskSourceId' : 'merchantPayId']: this
            .taskSourceId
        }
        if (params.noPassCause !== 'realPayMismatching') {
          delete params.realPay
        } else {
          params.realPay = '' + params.realPay
        }
        if (params.auditResult == 1) {
          delete params.noPassCause
          delete params.realPay
        }
        return this.$api[
          `main/${
            this.type === 'taskSource'
              ? this.batch
                ? 'taskSourceBatchAudit'
                : 'taskSourceAudit'
              : this.type === 'audit'
              ? 'recycleAuditOutStorage'
              : 'merchantPayAudit'
          }`
        ](params)
      })
    }
  }
}
</script>