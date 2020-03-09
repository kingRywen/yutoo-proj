<template>
  <new-form ref="form" label-width="80px" :form-schema="formSchema" v-model="value"></new-form>
</template>
<script>
export default {
  props: ['productRecycleId'],
  data() {
    return {
      formSchema: {
        transport: { label: '运输方式', disabled: true },
        transportNo: { label: '运单号', disabled: true },
        freight: { label: '运费$', widget: 'currency', required: true }
      },
      value: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$api[`main/recycleDeliverInfo`]({
        productRecycleId: this.productRecycleId
      }).then(data => {
        this.value = data.rows
      })
    },
    _submit() {
      return this.$refs.form
        .validate()
        .then(() =>
          this.$api[`main/recycleDeliver`]({
            productRecycleId: this.productRecycleId,
            freight: this.value.freight
          })
        )
    }
  }
}
</script>