<template>
  <new-form ref="form" label-width="120px" :form-schema="formSchema" v-model="value"></new-form>
</template>
<script>
import Oss from 'Utils/oss'
export default {
  props: ['list', 'id'],
  data() {
    return {
      formSchema: {
        activateFlag: {
          widget: 'checkbox',
          label: '是否激活',
          required: true,
          options: [
            {
              label: '是',
              value: 1
            }
          ],
          defaultVal: [1],
          tip: {
            content: '同一个充值方式，最多只有一个激活的账号'
          }
        },
        payType: {
          required: true,
          label: '充值方式',
          widget: 'select',
          options: this.list
        },
        recipientAccount: {
          required: true,
          label: '收款账号'
        },
        remark: {
          label: '收款备注',
          widget: 'textarea',
          rows: 4
        },
        qrCode: {
          required: true,
          label: '收款二维码',
          widget: 'upload',
          fileLimit: 'image',
          limitSize: 1,
          limit: 1,
          listType: 'picture-card',
          drag: false,
          autoUpload: true,
          action: 'https://jsonplaceholder.typicode.com/posts/',
          httpRequest: this.handleRequest.bind(null, 'p6')
        }
      },
      value: {}
    }
  },
  created() {
    if (this.id) {
      this.getInfo()
    }
  },
  methods: {
    getInfo() {
      this.$api[`main/paySetInfo`]({ id: this.id }).then(data => {
        let { qrCode, activateFlag, ...info } = data.rows
        this.value = {
          ...info,
          qrCode: [{ name: '', url: qrCode }],
          activateFlag: [activateFlag]
        }
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let { activateFlag, qrCode, ...info } = this.value
        activateFlag = activateFlag[0]
        qrCode = qrCode[0].response ? qrCode[0].response[0] : qrCode[0].url
        return this.$api[
          `main/${this.id == null ? 'paySetSave' : 'paySetUpdate'}`
        ]({ activateFlag, qrCode, ...info })
      })
    },
    async handleRequest(item, file) {
      const path = await this.$api[`main/constantRealPathGet`]({
        uploadType: 'qr-code'
      }).then(data => data.filePath)
      console.log(path)

      let res = await Oss.batchUpload(
        [file.file],
        path,
        '/constant/get/oss/signature',
        e => {
          if (e.lengthComputable) {
            let percent = Math.round(((e.loaded / e.total) * 100) | 0)
            if (typeof item === 'object') {
              let f = item.imageUrl.find(el => el.raw === file.file)
              f.percentage = percent
            }

            // console.log(percent)
          }
        },
        this.$storage.get('local', 'token')
      )
      if (typeof item === 'object') {
        this.$set(item, 'imgs', res)
      }
      return res
    }
  }
}
</script>