<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['data', 'lifeCircle'],
  data() {
    return {
      formSchema: {
        lifeCycle: {
          label: '选择周期',
          required: true,
          widget: 'select',
          options: this.$const['FBA/lifecircles']
        }
      },
      value: { lifeCycle: this.lifeCircle }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          data: this.data.map(el => ({
            ...el,
            lifeCycle: this.value.lifeCycle
          }))
        }
        return this.$api[`fba/FbaReplenishProductSetLifeCycle`](params)
      })
    }
  }
}
</script>