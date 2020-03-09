<template>
  <yt-form ref="form" label-width="86px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  props: ['params'],
  data() {
    let vm = this
    return {
      formData: {},
      activeFields: [
        {
          label: '否定词类型',
          name: 'matchType',
          span: 24,
          type: 'select',
          options: [
            {
              label: '精确否定',
              value: 'negativeExact'
            },
            {
              label: '词组否定',
              value: 'negativePhrase'
            }
          ],
          required: true
        },
        {
          label: '关键词',
          name: 'keywordTexts',
          placeholder:'请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号',
          span: 24,
          type: 'textarea',
          required: true,
          rows: 5
        }
      ]
    }
  },
  methods: {
    _initData() {
      
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          ...this.storeIds,
          campaignIds: this.params.row.map(el => el.objectId),
          matchType: this.formData.matchType,
          keywordTexts: this.formData.keywordTexts.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '')
        }
        return this.$api[`adCampaignNegativeKeywordAddKeyword`](params).then(() => {
          // this.params.parent.getTaskClassifyList()
          // this.params.parent.$refs.layout.getList()
          return Promise.resolve('close')
        })
      })
    }
  }
}
</script>

<style>
</style>
