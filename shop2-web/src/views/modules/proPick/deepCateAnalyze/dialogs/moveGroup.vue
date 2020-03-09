<template>
  <new-form ref="form" class="w600" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['merchantTaskId', 'groups'],
  data() {
    return {
      formSchema: {
        groupIds: {
          label: '选择分组',
          // required: true,
          widget: 'select',
          multi: true,
          options: () =>
            this.$api[`proPick/categoryDepthTaskMerchantGroupList`]({
              ...this.storeInfo,
              merchantTaskId: this.merchantTaskId
            }).then(data => {
              let d = Object.keys(data.data)
                .filter(key => key.indexOf('groupName') > -1)
                .map(key => ({
                  label: data.data[key],
                  value: key
                }))
              if (this.groups) {
                let groupIds = this.groups.map(e => {
                  return d.find(el => el.label == e).value
                })
                this.value.groupIds = groupIds
              }
              return d
            })
        }
      },
      value: { groupIds: [] }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          ...this.storeInfo,
          ...this.$attrs,
          groupIds: this.value.groupIds.map(e => +e.replace('groupName', '')),
          merchantTaskId: this.merchantTaskId
        }
        return this.$api[`proPick/categoryDepthTaskMerchantSetGroup`](params)
      })
    }
  }
}
</script>