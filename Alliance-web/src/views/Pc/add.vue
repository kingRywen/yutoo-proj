<template>
  <new-form label-width="105px" ref="form" :form-schema="formSchema" v-model="value"></new-form>
</template>
<script>
export default {
  props: ['pcId'],
  data() {
    return {
      formSchema: {
        pcCode: {
          label: 'PC编号',
          span: 12,
          required: true
        },
        location: {
          label: 'PC所在地',
          span: 12,
          required: true
        },
        cost: {
          label: 'PC成本',
          widget: 'currency',
          span: 12,
          required: true
        },
        // ip: {
        //   label: 'IP',
        //   span: 12,
        //   required: {
        //     value: /(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/,
        //     errMsg: '请输入正确的IP地址'
        //   }
        // },
        purchaseDate: {
          label: 'PC购买日期',
          span: 12,
          widget: 'date',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > new Date().getTime()
            }
          },
          required: true
        },
        status: {
          label: '状态',
          span: 12,
          options: this.$const['APP/status'].slice(0, 2),
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
        }
      },
      value: {}
    }
  },
  created() {
    if (this.pcId) {
      this.getData()
    }
  },
  methods: {
    getData() {
      this.$api[`main/pcInfo`]({ pcId: this.pcId }).then(data => {
        this.value = data.rows
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[`main/${this.pcId ? 'pcUpdate' : 'pcSave'}`](
          this.value
        )
      })
    }
  }
}
</script>