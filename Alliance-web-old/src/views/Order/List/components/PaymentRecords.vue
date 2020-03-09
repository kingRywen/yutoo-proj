<template>
  <main-layout :dataList="true" :loadData="loadData" ref="lay" :tableCols="tableCols" :outerParams="{orderId}"></main-layout>
</template>

<script>
export default {
  props: ['orderId'],
  data() {
    return {
      tableCols: [
        {
          label: '账号',
          prop: 'accountId'
        },
        {
          label: '账号类型',
          prop: 'accountType',
          render(h, scope) {
            return <span>{scope.row.accountType ? '自动' : '手动'}</span>
          }
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '性别',
          prop: 'sex',
          render(h, scope) {
            return <span>{scope.row.sex ? '女' : '男'}</span>
          }
        },
        {
          label: '类目数',
          prop: 'categoryCount',
          render(h, scope) {
            return (
              // TODO: 换成类目展示
              <el-popover placement="right" width="400" trigger="hover">
                <span>123123</span>
                <el-button type="text" slot="reference">
                  <b>{scope.row.categoryCount}</b>
                </el-button>
              </el-popover>
            )
          }
        },
        
        {
          label: '注册时间',
          prop: 'registerDate'
        },
        {
          label: '状态',
          prop: 'status',
          render(h, scope) {
            let { status } = scope.row
            let statusStr
            if (status === 0) {
              statusStr = '未激活'
            }
            if (status === 1) {
              statusStr = '正常'
            }
            if (status === 2) {
              statusStr = '暂停'
            }
            if (status === 3) {
              statusStr = '终止'
            }
            return <span>{statusStr}</span>
          }
        },
        {
          label: '异常信息',
          prop: 'remark'
        }
      ],
      loadData(data) {
        return this.$api[`main/merchantOrderPayList`](data)
          .then(data => {
            return Promise.resolve(data)
          })
          .catch(err => {})
      }
    }
  }
}
</script>

<style>
</style>
