<template>
  <new-form v-if="!showPercent" ref="form" class="w600" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
  <div v-else>
    <el-progress :text-inside="true" :stroke-width="10" status="warning" :percentage="percentage"></el-progress>
    <div class="mt20 txc">正在修改价格中...</div>
  </div>
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
      hasSetted: false,
      percentage: 0,
      showPercent: false,
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
      if (this.type == 1) {
        this.showPercent = true
        this._interval = setInterval(() => {
          if (this.percentage >= 97 && !this.hasSetted) {
            return
          }
          this.percentage = (this.percentage * 10000 + 4000) / 10000
        }, 1000)
        // return
      }
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
          .then(data => {
            clearInterval(this._interval)
            this.hasSetted = true
            this.percentage = 100

            return Promise.resolve(data)
          })
          .catch(data => {
            if (data.code == -1 && this.type == 1) {
              this.$alert(data.errors.join('<br>'), data.msg, {
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true
              })
            }
            clearInterval(this._interval)
            this.showPercent = false
            this.percentage = 0
            this.hasSetted = false
            return Promise.reject(data)
          })
      })
    }
  },
  beforeDestroy() {
    clearInterval(this._interval)
  }
}
</script>