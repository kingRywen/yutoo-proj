<template>
  <new-form ref="form" class="w600" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['data', 'type'],
  data() {
    let table = {
      rowKey: 'sellerSku',
      type: 'table',
      width: 'auto',
      head: {
        sellerSku: {
          widget: 'text',
          label: 'SKU',
          noLabel: true
        }
      }
    }
    if (this.type == 1) {
      table.head.price = {
        widget: 'currency',
        label: '价格（$）',
        required: true,
        noLabel: true
      }
    }
    if (this.type == 2) {
      table.head.warningDays = {
        widget: 'number',
        label: '滞销预警天数',
        prevText: '可售天数≥',
        nextText: '天',
        required: true,
        noLabel: true
      }
    }

    return {
      formSchema: {
        table
      },
      value: {
        table: this.data.map(e => ({
          ...e,
          warningDays: e.unsalableWarningDays
        }))
      }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          data: this.value.table
        }
        return this.$api[
          `fba/${
            this.type == 1
              ? 'FbaReplenishProductPriceSet'
              : 'FbaReplenishProductWarningDaysSet'
          }`
        ](params)
      })
    }
  }
}
</script>