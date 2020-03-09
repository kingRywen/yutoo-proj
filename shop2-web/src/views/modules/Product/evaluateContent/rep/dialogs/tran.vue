<template>
  <new-form v-loading="loading" ref="form" label-width="60px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
import tran from 'Utils/translate'
export default {
  props: ['row', 'type'],
  data() {
    let contentStr =
      this.type == 'qa'
        ? 'questionContent'
        : this.type === 'question'
        ? 'answerContent'
        : 'content'
    return {
      loading: false,
      isQa: this.type == 'qa',
      contentCnStr: this.type == 'qa' ? 'questionContentCn' : 'contentCn',
      contentStr,
      formSchema: {
        origin: {
          widget: 'txt',
          label: '原文'
        },
        contentCn: {
          label: '翻译',
          widget: this.type === 'question' ? 'txt' : 'textarea',
          maxlength: 2000,
          autosize: { minRows: 8 },
          required: true
        }
      },
      value: {
        origin: this.row[contentStr],
        contentCn: ''
      }
    }
  },
  async created() {
    if (this.type !== 'question' && this.row[this.contentCnStr]) {
      this.value.contentCn = this.row[this.contentCnStr]
      return
    }
    this.loading = true
    this.$parent.$parent.$parent.$emit('setBtnDisabled', true)
    let res = await tran(this.row[this.contentStr])
    this.$parent.$parent.$parent.$emit('setBtnDisabled')
    this.loading = false
    this.value.contentCn = res.data[0]
      ? res.data[0].map(el => el[0]).join('')
      : ''
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        const strId = this.isQa ? 'questionId' : 'reviewId'
        const contentStr = this.isQa ? 'questionContentCn' : 'contentCn'
        const params = {
          [contentStr]: this.value.contentCn,
          ...this.storeInfo,
          taskId: +this.$route.query.taskId,
          [strId]: this.row[strId]
        }
        return this.$api[
          `productAnalysis/${this.isQa ? 'rcTranslateQa' : 'rcTranslateReview'}`
        ](params).then(() => {
          this.$set(this.row, contentStr, this.value.contentCn)
          return Promise.resolve('close')
        })
      })
    }
  }
}
</script>