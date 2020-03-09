<template>
  <new-form label-width="110px" ref="form" :form-schema="formSchema" v-model="value"></new-form>
</template>
<script>
export default {
  props: ['mobileId'],
  data() {
    return {
      formSchema: {
        mobileCode: {
          label: '手机编号',
          span: 12,
          required: true
        },
        location: {
          label: '手机所在地',
          span: 12,
          required: true
        },
        cost: {
          label: '手机成本',
          widget: 'currency',
          span: 12,
          required: true
        },

        purchaseDate: {
          label: '手机购买日期',
          widget: 'date',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > new Date().getTime()
            }
          },
          span: 12,
          required: true
        },
        status: {
          label: '状态',
          span: 12,
          options: this.$const['APP/status'],
          widget: 'select',
          required: true
        },
        countryCode: {
          label: '归属国家',
          widget: 'select',
          options: '$store.countryList',
          handler: {
            action: 'getCountryList'
          },
          span: 12,
          required: true
        },
        mobile: {
          label: '手机号码',
          span: 12,
          required: true,
          hidden: data => data.status == 2
        },
        operator: {
          label: '运营商',
          span: 12,
          required: true,
          hidden: data => data.status == 2
        },
        setMeal: {
          label: '手机套餐',
          span: 12,
          required: true,
          hidden: data => data.status == 2
        },
        payMoney: {
          label: '充值金额',
          widget: 'currency',
          span: 12,
          required: true,
          hidden: data => data.status == 2
        },
        activateDate: {
          label: '激活日期',
          span: 12,
          widget: 'date',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > new Date().getTime()
            }
          },
          required: true,
          hidden: data => data.status == 2
        },
        validDate: {
          label: '有效日期',
          widget: 'date',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < new Date().getTime()
            }
          },
          span: 12,
          required: true,
          hidden: data => data.status == 2
        }
      },
      value: {}
    }
  },
  created() {
    if (this.mobileId) {
      this.getData()
    }
  },
  methods: {
    getData() {
      this.$api[`main/mobileInfo`]({ mobileId: this.mobileId }).then(data => {
        if (data.rows.setMeal) {
          data.rows.no = [1]
        }
        this.value = data.rows
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {}
        for (const key in this.value) {
          if (this.value.hasOwnProperty(key)) {
            const element = this.value[key]
            params[key] = element
          }
        }
        if (this.value.status == 2) {
          delete params.setMeal
          delete params.payMoney
          delete params.activateDate
          delete params.operator
          delete params.mobile
          delete params.validDate
        }
        delete params.no
        return this.$api[
          `main/${this.mobileId ? 'mobileUpdate' : 'mobileSave'}`
        ](params)
      })
    }
  }
}
</script>