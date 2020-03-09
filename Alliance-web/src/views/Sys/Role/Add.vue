<template>
  <SimpleForm labelWidth="80px" :fields="addFields" ref="add"></SimpleForm>
</template>

<script>
export default {
  props: ['edit'],
  data() {
    return {
      roleList: [],
      addFields: [
        {
          label: '角色名',
          required: true,
          name: 'roleName',
          span: 24
        },
        {
          label: '角色标识',
          required: true,
          name: 'roleSign',
          span: 24
        },
        {
          label: '备注',
          name: 'remark',
          type: 'textarea',
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
      if (this.edit) {
        this.getEditData()
      }
    },
    getEditData() {
      this.$api[`main/sysRoleInfo`](this.edit)
        .then(data => {
          this.$refs.add.setData(data.rows)
        })
        .catch(err => {})
    },
    
  }
}
</script>

<style>
</style>
