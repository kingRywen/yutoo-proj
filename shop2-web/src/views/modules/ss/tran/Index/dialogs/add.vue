<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['row', 'getStoreList'],
  data() {
    return {
      formSchema: {
        siteName: {
          label: '站点',

          disabled: true
        },
        sellerId: {
          label: '适用店铺',
          required: true,
          widget: 'select',
          options: () => this.getStoreList()
        },
        templateName: {
          label: '模板名称',
          required: true
        },
        defaultFlag: {
          required: true,
          tip: {
            content:
              '一个店铺、一个站点，最多只有一个默认模版，跟卖上架时会自动选中默认模版，如果没有就会报错。'
          },
          widget: 'switch',
          defaultVal: true,
          options: [
            {
              label: '',
              value: false
            },
            {
              label: '',
              value: true
            }
          ],
          label: '设为默认模版'
        }
      },
      value: {
        siteName: this.$store.state.selling.curSite.siteName,
        ...this.row
      }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          ...this.storeInfo,
          ...this.row,
          ...this.value
        }
        return this.$api[
          `ss/${this.row ? 'sellingFareUpdate' : 'sellingFareSave'}`
        ](params)
      })
    }
  }
}
</script>