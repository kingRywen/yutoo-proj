<template>
  <new-form class="w1200" ref="form" label-width="0px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['data'],
  data() {
    return {
      transports: [],
      formSchema: {
        table: {
          rowKey: 'shippingId',
          // 表格数据
          type: 'table',
          label: 'table',
          labelWidth: '0',
          width: 'auto',
          head: {
            shippingId: {
              widget: 'txt',
              label: 'shippingId',
              noLabel: true
              // required: true
            },
            transportId: {
              widget: 'select',
              options: [],
              label: '运输方式',
              noLabel: true,
              required: true
            },
            sendTime: {
              widget: 'date',
              time: true,
              label: '发货时间',
              placeholder: '请选择发货时间',
              noLabel: true,
              displayFormat: 'yyyy-MM-dd HH',
              format: 'yyyy-MM-dd HH',
              required: true,
              on: {
                'el-change'(schema, childs) {
                  let date = childs[2].value
                  childs[3].$refs.formInput.pickerOptions = {
                    disabledDate(time) {
                      return time.getTime() <= new Date(date)
                    }
                  }
                }
              }
            },
            earliestDeliveryDate: {
              widget: 'date',
              label: '最早到货时间',
              noLabel: true,
              time: true,
              required: true,
              displayFormat: 'yyyy-MM-dd HH',
              format: 'yyyy-MM-dd HH',
              placeholder: '请选择最早到货时间'
            }
          }
        }
      },
      value: {
        table: this.data.map(e => ({
          ...e,
          sendTime: '',
          earliestDeliveryDate: '',
          transportId: ''
        }))
      }
    }
  },
  created() {
    this.$store.dispatch('fba/getTransportList').then(data => {
      this.formSchema.table.head.transportId.options = data
    })
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        const params = {
          data: this.value.table
        }
        return this.$api[`fba/FbaReplenishShippingConfirmSend`](params)
      })
    }
  }
}
</script>