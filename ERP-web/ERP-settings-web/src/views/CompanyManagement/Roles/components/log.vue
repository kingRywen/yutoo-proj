<template>
  <YtTable :data="list" :columns="columns"></YtTable>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['editId'],
  data() {
    return {
      list: [],
      columns: [
        {
          label: '时间',
          value: 'createTime'
        },
        {
          label: '操作人',
          value: 'operatorName'
        },
        {
          label: '操作内容',
          value: 'msg'
        }
      ]
    }
  },
  methods: {
    getList(roleId) {
      this.$api[`perms/roleLog`]({ roleId })
        .then(data => {
          this.list = data.rows
        })
        .catch(err => {})
    }
  },
  watch: {
    editId: {
      immediate: true,
      handler(val) {
        this.getList(val)
      }
    }
  }
}
</script>

<style>
</style>
