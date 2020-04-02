<template>
  <new-form class="w30p" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['transportInfo'],
  data() {
    return {
      formSchema: {
        transportName: {
          label: '名称',
          required: true
        },
        transportType: {
          label: '运输类型',
          required: true,
          widget: 'select',
          change: data => {
            this.getList({ partneredType: data.partneredType })
          },
          options: this.$const['FBA/tranType']
        },
        carrierLable: {
          label: '承运商',
          required: true,
          hidden: data => {
            return data.transportType == null
          },
          widget: 'select',
          options: []
        },

        shippingDays: {
          label: '运输天数',
          required: true,
          widget: 'number'
        },
        partneredType: {
          label: '是否合作承运商',
          required: true,
          // defaultVal: 0,
          widget: 'switch',
          change: data => {
            this.getList({ partneredType: data.partneredType })
          },
          options: [
            {
              label: '',
              value: 0
            },
            {
              label: '',
              value: 1
            }
          ]
        }
      },
      value: {
        partneredType: 0,
        ...this.transportInfo
        // transportType: this.$const['FBA/tranType'].find(
        //   e => e.value == this.transportInfo.transportType
        // ).value
      } || {
        partneredType: 0
      }
    }
  },
  created() {
    if (this.value.transportType) {
      this.getL()
    }
  },
  methods: {
    getL() {
      this.getList({}, false)
    },
    getList(params, reset = true) {
      reset &&
        (this.value = {
          ...this.value,
          carrierLable: ''
        })
      this.$api[`fba/fbaReplenishTransportGetCarrierType`]({
        partneredType: this.value.partneredType,
        transportType: this.value.transportType,
        ...params
      }).then(data => {
        data = data.rows.map(e => ({ label: e, value: e }))
        this.formSchema.carrierLable.options = data
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[
          `fba/${
            this.transportInfo
              ? 'FbaReplenishTransportEdit'
              : 'FbaReplenishTransportAnd'
          }`
        ](this.value)
      })
    }
  }
}
</script>