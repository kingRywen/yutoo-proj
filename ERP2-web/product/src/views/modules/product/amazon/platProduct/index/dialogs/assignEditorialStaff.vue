<template>
  <new-form :form-schema="formSchema" label-width="90px" ref="search" v-model="data"></new-form>
</template>
<script>
export default {
  data() {
    return {
      formSchema: {
        p1: {
          label: '信息编辑人员',
          widget: 'select',
          options: () => {
            return this.$api[`product/permissionUserList`]({
              types: ['Edit']
            }).then(data => {
              return data.rows[0].users.map(el => ({
                label: el.userName,
                value: el.userId
              }))
            })
          }
        },
        p2: {
          label: '图片编辑人员',
          widget: 'select',
          options: () => {
            return this.$api[`product/permissionUserList`]({
              types: ['Image']
            }).then(data => {
              return data.rows[0].users.map(el => ({
                label: el.userName,
                value: el.userId
              }))
            })
          }
        }
      },
      data: {}
    }
  },
  methods: {
    _submit() {
      const params = {
        ...this.$attrs,
        basicUserId: this.data.p1,
        imgUserId: this.data.p2
      }
      return this.$api[`product/prProductPlatAmzAllot`](params)
    }
  }
}
</script>