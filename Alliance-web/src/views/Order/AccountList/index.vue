<template>
  <main-layout
    :sideBar="false"
    :search-fields="searchFields"
    :loadData="loadData"
    ref="lay"
    :showSearchBtn="false"
    :tableCols="tableCols"
    :outerParams="{orderId}"
  >
    <div slot="top" class="back-wrapper">
      <el-button size="mini" type="default" @click="handleBack" icon="el-icon-back">返回订单列表</el-button>
    </div>
  </main-layout>
</template>

<script>
export default {
  props: ['orderId'],
  data() {
    return {
      searchFields: [
        {
          name: 'orderId',
          label: '订单编号',
          disabled: true
        },
        {
          name: 'ipCount',
          label: '账号配额',
          disabled: true
        }
      ],
      tableCols: [
        {
          label: '序号',
          prop: 'accountId',
          render(h, scope) {
            return <span>{scope.$index + 1}</span>
          }
        },
        {
          label: '账号',
          prop: 'account'
        },
        {
          label: '姓名',
          prop: 'name'
        }
      ],
      loadData(data) {
        return this.$api[`main/merchantOrderAccountList`](data)
          .then(data => {
            return Promise.resolve(data)
          })
          .catch(err => {})
      }
    }
  },
  methods: {
    handleBack() {
      this.$router.push({ name: 'order' })
    }
  }
}
</script>

<style>
</style>
