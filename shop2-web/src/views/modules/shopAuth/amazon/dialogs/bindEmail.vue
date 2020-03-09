<template>
  <div class="w600">
    <div style="text-align:right">
      <el-button icon="el-icon-info" style="padding: 10px 0;z-index:2" type="text" @click="openHelp">查看帮助</el-button>
    </div>
    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
  </div>
</template>
<script>
export default {
  props: ['platformId', 'sellerAuthId', 'emailAccount'],
  data() {
    return {
      value: {
        emailAccount: this.emailAccount
      },
      formSchema: {
        emailAccount: {
          label: '店铺邮箱账号',
          required: 'email',
          tip: {
            content: '用于监控店铺预警消息和客户消息'
          },
          change: this.handleEmailAccountCg
        },
        emailProtocol: {
          required: true,
          label: '接收邮件协议',
          widget: 'radio',
          defaultVal: 'imap',
          options: [{ label: 'IMAP', value: 'imap' }]
        },
        emailAuthCode: {
          required: true,
          label: '邮箱授权码'
        },
        sencondUrl: {
          hidden: true,
          label: '二次授权链接',
          defaultVal: '222',
          widget: 'txt',
          url: true
        }
      }
    }
  },
  methods: {
    handleEmailAccountCg(data) {
      let value = data.emailAccount.trim()

      if (!value || value.indexOf('@') == -1) {
        return
      }
      value = value.split('@')[1]
      if (value == '163.com') {
        this.formSchema.sencondUrl.hidden = () => false
        this.value.sencondUrl =
          'http://config.mail.163.com/settings/imap/login.jsp?uid=' +
          this.value.emailAccount
      } else if (value == '126.com') {
        this.formSchema.sencondUrl.hidden = () => false
        this.value.sencondUrl =
          'http://config.mail.126.com/settings/imap/login.jsp?uid=' +
          this.value.emailAccount
      } else {
        this.formSchema.sencondUrl.hidden = () => true
      }
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let { ...info } = this.value
        let params = {
          ...info,
          platformId: this.platformId,
          sellerAuthId: this.sellerAuthId
        }
        return this.$api[`shopAuth/sellerAuthEmailAuth`](params)
      })
    },
    openHelp() {
      const { href } = this.$router.resolve({
        path: '/helps/email-auth'
      })
      window.open(href)
    }
  }
}
</script>