<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['editId', 'groupName'],
  data() {
    return {
      formSchema: {
        groupName: {
          label: '分组名称',
          required: true
        }
      },
      value: {
        groupName: this.groupName
      }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          ...this.storeInfo,
          ...this.value,
          groupId: this.editId
        }
        return this.$api[
          `ss/${this.editId ? 'sellingGroupUpdate' : 'sellingGroupSave'}`
        ](params)
      })
    }
  }
}
</script>