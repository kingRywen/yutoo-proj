<template>
  <div>
    <new-main-layout
      :columns="columns"
      :isShowPag="false"
      :outerParams="{taskSourceId}"
      :simple="true"
      url="main/taskSourceExceptionList"
    ></new-main-layout>
  </div>
</template>
<script>
export default {
  props: ['taskSourceId'],
  data() {
    return {
      columns: [
        {
          label: '账号',
          value: 'account'
        },
        {
          label: '操作员',
          value: 'operator'
        },
        {
          label: '执行时间',
          value: 'executeTime'
        },
        {
          label: '异常',
          value: 'exception'
        }
      ]
    }
  }
}
</script>