<template>
  <div>
    <new-form ref="form" :disabled="true" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
    <div class="txc">
      <b>如下附加服务，可根据需要选择</b>
    </div>
    <new-form ref="form1" :disabled="true" label-width="120px" :form-schema="formSchema1" :value="value"></new-form>
  </div>
</template>
<script>
export default {
  props: ['productRecycleId'],
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
          view: true,
          widget: 'upload',
          hidden(data) {
            return data.cartonDecalsFlag == 0
          },
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
          drag: false,
          view: true,
          hidden(data) {
            return data.productDecalsFlag == 0
          },
          action: 'https://jsonplaceholder.typicode.com/posts/',
          multiple: false,
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
          label: '收货人',
          required: true
        },
        mobile: {
          label: '联系电话',

          required: true
        },
        delivery: {
          label: '运输地址',
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
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.$api[`main/recycleOutStorageInfo`]({
        productRecycleId: this.productRecycleId
      }).then(data => {
        let {
          cartonDecalsAffix: pdf1,
          decalsAffix: pdf2,
          cartonDecalsMoney,
          productDecalsMoney,
          packMoney,
          ...info
        } = data.rows
        this.formSchema1.cartonDecalsFlag.innerTips = cartonDecalsMoney
        this.formSchema1.productDecalsFlag.innerTips = productDecalsMoney
        this.formSchema1.packFlag.innerTips = packMoney
        if (pdf1) {
          pdf1 = [{ name: '纸箱贴标附件', download: true, url: pdf1 }]
        }
        if (pdf2) {
          pdf2 = [{ name: '产品贴标附件', download: true, url: pdf2 }]
        }
        this.value = { ...info, pdf1, pdf2 }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.txc {
  background: #e4e7ed;
  padding: 20px 0;
  margin: 20px 0;
}
</style>