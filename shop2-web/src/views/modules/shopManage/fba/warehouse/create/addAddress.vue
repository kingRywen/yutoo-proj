<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
import country from './country'
export default {
  props: ['storeId'],
  data() {
    return {
      formSchema: {
        addressType: {
          label: '设置为默认地址',
          widget: 'switch',
          defaultVal: 0,
          options: [
            {
              label: '否',
              value: 0
            },
            {
              label: '是',
              value: 1
            }
          ]
        },
        addressName: {
          label: '发件人',
          required: true
        },
        addressCountryCode: {
          label: '国家',
          filterable: true,
          options: country,
          widget: 'select',
          required: true
        },
        addressPostalCode: {
          label: '邮编',
          required: true
        },
        addressState: {
          label: '州/省',
          required: true
        },
        addressCity: {
          label: '城市',
          required: true
        },
        addressLine1: {
          label: '地址1',
          required: true
        },
        addressLine2: {
          label: '地址2'
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          storeId: this.storeId,
          ...this.value,
          addressCountry: country.find(
            e => e.value === this.value.addressCountryCode
          ).label
        }
        return this.$api[`fba/fbaShipmentCreateAddressSave`](params).then(
          () => {
            this.$store.dispatch('fba/getAddress', { storeId: this.storeId })
            return Promise.resolve('close')
          }
        )
      })
    }
  }
}
</script>