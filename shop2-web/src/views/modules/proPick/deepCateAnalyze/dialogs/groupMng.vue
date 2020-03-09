<template>
  <main-layout
    class="w30p"
    :columns="columns"
    :outerParams="{...storeInfo,merchantTaskId}"
    :dataMethod="dataMethod"
    url="proPick/categoryDepthTaskMerchantGroupList"
    :isShowPag="false"
    ref="table"
    :showSelection="false"
  ></main-layout>
</template>
<script>
export default {
  props: ['merchantTaskId'],
  data() {
    return {
      columns: [
        {
          label: '分组名称',
          value: 'name',
          render: (h, scope) => {
            return (
              <el-input
                size="mini"
                value={scope.row.name}
                on-input={e => {
                  this.$set(scope.row, 'name', e)
                }}
              ></el-input>
            )
          }
        }
      ]
    }
  },
  methods: {
    dataMethod(data) {
      return Object.keys(data)
        .filter(key => key.indexOf('groupName') > -1)
        .map(key => ({
          name: data[key],
          id: +key.replace('groupName', '')
        }))
    },
    _submit() {
      let list = this.$refs.table.tableList,
        ret = {}
      if (list.find(el => el.name === '')) {
        return Promise.reject('分组名不能为空')
      }
      list.forEach(e => {
        ret[`groupName${e.id}`] = e.name
      })
      let params = {
        ...this.storeInfo,
        merchantTaskId: this.merchantTaskId,
        ...ret
      }
      return this.$api[`proPick/categoryDepthTaskMerchantUpdateGroupName`](
        params
      )
    }
  }
}
</script>