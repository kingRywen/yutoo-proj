<template>
  <div>
    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
    <el-divider content-position="center">
      <b>如下附加服务，可根据需要选择</b>
    </el-divider>
    <new-form ref="form1" label-width="120px" :form-schema="formSchema1" :value="value"></new-form>
  </div>
</template>
<script>
import Oss from 'Utils/oss'
export default {
  props: ['productRecycleId', 'status'],
  data() {
    return {
      formSchema1: {
        cartonDecalsFlag: {
          label: '纸箱贴标',
          widget: 'switch',
          innerTips: ' '
        },
        pdf1: {
          label: '上传附件',
          widget: 'upload',
          limitSize: 2,
          hidden(data) {
            return data.cartonDecalsFlag == 0
          },
          httpRequest: this.handleRequest.bind(null, 'pdf1'),
          onSuccess: this.handleSuccess.bind(null, 'pdf1'),
          action: 'https://jsonplaceholder.typicode.com/posts/',
          multiple: false,
          required: true,
          limit: 1,
          fileLimit: ['pdf']
        },

        productDecalsFlag: {
          label: '产品贴标',
          widget: 'switch',
          innerTips: ' '
        },
        pdf2: {
          label: '上传附件',
          widget: 'upload',
          limitSize: 2,
          hidden(data) {
            return data.productDecalsFlag == 0
          },
          action: 'https://jsonplaceholder.typicode.com/posts/',
          multiple: false,
          httpRequest: this.handleRequest.bind(null, 'pdf2'),
          onSuccess: this.handleSuccess.bind(null, 'pdf2'),
          required: true,
          limit: 1,
          fileLimit: ['pdf']
        },
        packFlag: {
          label: '打包',
          widget: 'switch',
          innerTips: ' '
        }
      },
      formSchema: {
        consignee: {
          maxlength: 255,
          label: '收货人',
          required: true
        },
        mobile: {
          maxlength: 20,
          label: '联系电话',

          required: true
        },
        delivery: {
          label: '运输地址',
          maxlength: 255,
          required: true
        },
        freightType: {
          label: '运费支付方',
          widget: 'radio',
          required: true,

          options: [
            {
              label: '自付',
              value: 0
            },
            {
              label: '垫付',
              value: 1
            }
          ]
        },
        prepayLabel: {
          hidden(data) {
            return data.freightType !== 0
          },
          label: '预付标签',
          required: true
        }
      },
      value: {}
    }
  },
  created() {
    this.getMoney()
    if (
      this.status == 4 &&
      this.productRecycleId &&
      this.productRecycleId.length == 1
    ) {
      this.getInfo()
    }
  },
  methods: {
    getInfo() {
      this.$api[`agent/merchantProductRecycleInfo`]({}).then(data => {
        this.value = data.rows
      })
    },
    getMoney() {
      this.$api[`agent/applyOutWarehouse`]({}).then(data => {
        const { cartonDecalsFlag, productDecalsFlag, packFlag } = data.rows
        this.formSchema1.cartonDecalsFlag.innerTips = cartonDecalsFlag
        this.formSchema1.productDecalsFlag.innerTips = productDecalsFlag
        this.formSchema1.packFlag.innerTips = packFlag
      })
    },
    handleSuccess(item, res) {
      if (typeof item === 'object') {
        this.$set(item, 'imageUrl', res)
      } else {
        this.$set(this.value, item, res.map(el => ({ name: '', url: el })))
      }
    },
    async handleRequest(item, file) {
      const path = await this.$api[`agent/constantRealPathGet`]({
        uploadType: 'review-img-url'
      }).then(data => data.filePath)
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
    },
    _submit() {
      let promises = [this.$refs.form.validate(), this.$refs.form1.validate()]
      return Promise.all(promises).then(() => {
        const { pdf1 = [], pdf2 = [], ...info } = this.value
        let params = {
          productRecycleIdArray: this.productRecycleId
            .split(',')
            .map(el => +el),
          ...info,
          cartonDecalsAffix: pdf1[0] && pdf1[0].response[0],
          decalsAffix: pdf2[0] && pdf2[0].response[0]
        }
        return this.$api[`agent/merchantProductRecycleApplyOutWarehouse`](
          params
        )
      })
    }
  }
}
</script>