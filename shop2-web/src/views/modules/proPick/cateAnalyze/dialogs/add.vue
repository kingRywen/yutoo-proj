<template>
  <div style="height: calc(100vh - 170px);display:flex;align-items:center">
    <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
  </div>
</template>
<script>
export default {
  props: ['type'],
  data() {
    return {
      formSchema: {
        pcid: {
          width: '100%',
          label: '选择类目',
          widget: 'cascader',
          required: true,
          props: {
            lazy: true,
            label: 'name',
            value: 'pcid',
            checkStrictly: true,
            lazyLoad: (node, resolve) => {
              this.$api[`productAnalysis/categoryGetCategory`]({
                ...this.storeInfo,
                parentPcid: node.data ? node.data.pcid : 0,
                cateType: this.type !== 'depth' ? 1 : undefined
              }).then(data =>
                resolve(data.data.map(e => ({ ...e, leaf: !e.haveChildren })))
              )
            }
          }
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          ...this.storeInfo,
          pcid: this.value.pcid.slice().pop()
        }
        return this.$api[
          `proPick/${
            this.type == 'depth'
              ? 'categoryDepthTaskMerchantSave'
              : 'categoryTaskMerchantSave'
          }`
        ](params)
      })
    }
  }
}
</script>