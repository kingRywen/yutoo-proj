<template>
  <new-form class="w30p" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['data', 'fn'],
  data() {
    return {
      formSchema: {
        num: {
          placeholder: '请填写数量',
          widget: 'number',
          required: true,
          min: 1
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        const data = {
          ...this.data,
          data: this.data.data.map(el => ({ ...el, count: this.value.num }))
        }
        return this.$api[`fba/FbaReplenishInfoViewUpdate`](data).then(() => {
          this.fn(this.value.num)
          return Promise.resolve()
        })
      })
    }
  }
}
</script>