<template>
  <new-form label-width="115px" ref="form" :form-schema="formSchema" v-model="value"></new-form>
</template>
<script>
export default {
  props: ['vmId'],
  data() {
    return {
      formSchema: {
        vmCode: {
          label: '虚拟机编号',
          span: 12,
          required: true
        },
        ip: {
          label: 'IP',
          span: 12,
          required: {
            value: /(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/,
            errMsg: '请输入正确的IP地址'
          }
        },
        location: {
          label: '虚拟机所在地',
          // widget: 'currency',
          span: 12,
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
        status: {
          label: '状态',
          span: 12,
          options: this.$const['APP/status'].slice(0, 2),
          widget: 'select',
          required: true
        }
      },
      value: {}
    }
  },
  created() {
    if (this.vmId) {
      this.getData()
    }
  },
  methods: {
    getData() {
      this.$api[`main/vmInfo`]({ vmId: this.vmId }).then(data => {
        this.value = data.rows
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[`main/${this.vmId ? 'vmUpdate' : 'vmSave'}`](
          this.value
        )
      })
    }
  }
}
</script>