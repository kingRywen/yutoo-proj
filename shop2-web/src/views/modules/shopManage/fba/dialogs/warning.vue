<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  data() {
    return {
      formSchema: {
        table: {
          rowKey: 'sellerSku',
          type: 'table',
          width: 'auto',
          head: {
            storeName: {
              widget: 'text',
              label: '店铺名称',
              noLabel: true
            },
            warningDays: {
              widget: 'number',
              min: 0,
              required: true,
              label: '滞销预警天数',
              noLabel: true
            }
          }
        }
      },
      value: {
        table: []
      },
      topBatchBtn: {
        title: '店铺',
        options: [
          {
            label: '编辑'
          }
        ]
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      let params = { a: 1 }
      this.$api[`fba/fbaReplenishProductWarningDaysView`](params).then(data => {
        this.value.table = data.rows
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          data: this.value.table
        }
        return this.$api[`fba/FbaReplenishProductWarningDaysSet`](params)
      })
    }
  }
}
</script>