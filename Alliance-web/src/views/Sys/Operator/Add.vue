<template>
  <SimpleForm labelWidth="90px" :fields="addFields" ref="add"></SimpleForm>
</template>

<script>
export default {
  props: ['edit'],
  data() {
    return {
      roleList: [],
      addFields: [
        {
          label: '用户名',
          required: true,
          name: 'username',
          span: 12
        },
        {
          label: '密码',
          required: true,
          name: 'password',
          password: true,
          disabled: data => {
            return data.userId != null
          },
          span: 12
        },
        {
          label: '手机号码',
          required: 'mobile-cn',
          name: 'mobile',
          span: 12
        },
        {
          label: '邮箱',
          required: 'email',
          name: 'email',
          span: 12
        },
        {
          label: '角色',
          name: 'roleIdList',
          type: 'checkbox',
          required: true,
          options: [],
          span: 24
        },
        {
          label: '备注',
          name: 'remark',
          type: 'textarea',
          rows: 5,
          span: 24
        },
        {
          label: '是否启用',
          name: 'status',
          type: 'switch',
          // active: '是',
          // inActive: '否',
          // acClass: 'el-icon-check',
          // inacClass: 'el-icon-close',
          rows: 5,
          span: 24
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$api[`main/sysRoleSelect`]({})
        .then(data => {
          this.addFields[4].options = data.rows.map(el => ({
            label: el.roleName,
            value: el.roleId
          }))
        })
        .catch(err => {})
      if (this.edit) {
        this.getEditData()
      }
    },
    getEditData() {
      this.$api[`main/sysUserInfoUser`](this.edit)
        .then(data => {
          this.$refs.add.setData(data.rows)
        })
        .catch(err => {})
    }
  }
}
</script>

<style>
</style>
