/*
 * @Author: rywen 
 * @Date: 2020-03-02 16:07:29 
 * @Last Modified by: rywen
 * @Last Modified time: 2020-03-02 16:33:57
 */
<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['getGroups', 'parentAsins'],
  data() {
    return {
      formSchema: {
        groupId: {
          label: '选择分组',
          required: true,
          widget: 'select',
          options: () => this.getGroups()
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
          groupId: this.value.groupId,
          parentAsins: this.parentAsins
        }
        return this.$api[`ss/sellingUpdateProductGroup`](params)
      })
    }
  }
}
</script>