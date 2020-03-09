<template>
  <new-form ref="form" label-width="80px" :form-schema="formSchema" v-model="value"></new-form>
</template>
<script>
export default {
  props: ['id'],
  data() {
    return {
      formSchema: {
        name: {
          label: '支出项',
          required: true
        },
        type: {
          label: '支出类型',
          widget: 'select',
          options: this.$const['OTHER/outType'],
          required: true
        },
        cycle: {
          hidden: data => !(data.type && data.type == 1),
          label: '支出周期',
          widget: 'select',
          options: [
            {
              label: '按年',
              value: 1
            },
            {
              label: '按月',
              value: 2
            },
            {
              label: '按日',
              value: 3
            }
          ],
          change: this.cycleChange,
          required: true
        },
        expendDay: {
          hidden: data => !(data.type && data.type == 1),
          label: '支出日',
          type: 'object',
          required: true,
          properties: {},

          span: 4
        },
        m: {
          label: '每年',
          widget: 'number',
          controls: false,
          labelWidth: '40px',
          width: '100%',
          hidden: data => data.cycle > 1 || !(data.type && data.type == 1),
          span: 6,
          min: 1,
          max: 12,
          change: data => {
            let day31 = [1, 3, 5, 7, 8, 10, 12]
            if (~day31.indexOf(data.m)) {
              this.formSchema.d.max = 31
            } else if (data.m == 2) {
              this.formSchema.d.max = 28
            } else {
              this.formSchema.d.max = 30
            }
          },
          noxin: true,
          required: true
        },
        d: {
          label: '月',
          labelWidth: '25px',
          controls: false,
          hidden: data => data.cycle > 2 || !(data.type && data.type == 1),
          widget: 'number',
          width: '100%',
          span: 6,
          noxin: true,
          min: 1,
          max: 31,
          required: true
        },
        h: {
          hidden: data => !(data.type && data.type == 1),
          label: '日',
          defaultVal: 0,
          disabled: true,
          labelWidth: '25px',
          controls: false,
          widget: 'number',
          noxin: true,
          width: '100%',
          span: 6,
          min: 0,
          max: 24,
          required: true
        },
        expendDay1: {
          hidden: data => !(data.type && data.type == 1),

          label: '时',
          labelWidth: '25px',
          type: 'object',
          properties: {},
          span: 2
        },
        money: {
          hidden: data => !(data.type && data.type == 1),
          label: '支出金额',
          min: 0.01,
          widget: 'currency',
          required: true,
          span: 16
        },
        currency: {
          hidden: data => !(data.type && data.type == 1),
          required: true,
          span: 8,
          widget: 'select',
          width: '100%',
          options: [
            {
              label: '美金',
              value: 'USD'
            },
            {
              label: '人民币',
              value: 'CNY'
            }
          ]
        },
        remark: {
          label: '备注',
          widget: 'textarea',
          rows: 5
        }
      },
      value: {}
    }
  },
  mounted() {
    if (this.id) {
      this.getData()
    }
  },
  methods: {
    cycleChange(data) {
      if (data.cycle == 3) {
        this.formSchema.h.label = '每日'
        this.formSchema.h.labelWidth = '40px'
      }
      if (data.cycle == 2) {
        this.formSchema.h.label = '日'
        this.formSchema.h.labelWidth = '25px'
        this.formSchema.d.label = '每月'
        this.formSchema.d.labelWidth = '40px'
      }
      if (data.cycle == 1) {
        this.formSchema.d.label = '月'
        this.formSchema.h.label = '日'
        this.formSchema.h.labelWidth = '25px'
        this.formSchema.d.labelWidth = '25px'
      }
    },
    getData() {
      this.$api[`main/expendOptionInfo`]({ id: this.id }).then(data => {
        let { expendDay, ...info } = data.rows,
          y,
          m,
          d,
          h = 0
        if (expendDay) {
          let a = expendDay.split('-')
          y = a[0]
          m = a[1]
          d = a[2]
          h = a[3]
          if (m.charAt() !== '/') {
            m = +m.replace('M', '')
          } else {
            m = undefined
          }
          if (d.charAt() !== '/') {
            d = +d.replace('D', '')
          } else {
            d = undefined
          }
          if (h.charAt() !== '/') {
            h = 0
          } else {
            h = 0
          }
        }
        this.cycleChange(data.rows)
        this.value = { m, d, h, ...info }
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let { m, d, h, ...info } = this.value

        if (this.value.cycle >= 2) {
          m = '/'
        }
        if (this.value.cycle > 2) {
          d = '/'
        }
        let expendDay = `/Y-${m}M-${d}D-${h}H`
        return this.$api[
          this.id ? `main/expendOptionUpdate` : `main/expendOptionSave`
        ]({ ...info, expendDay })
      })
    }
  }
}
</script>