<template>
  <main-layout
    :columns="columns"
    :outerParams="{...storeInfo, siteId: curSiteId}"
    :searchFields="searchFields"
    url="ss/sellingRateList"
    :edit-btns="edits"
    :isShowPag="false"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  computed: {
    curSiteId() {
      return this.$store.state.selling.curSiteId
    }
  },
  data() {
    return {
      edits: [
        {
          name: '编辑',
          perm: 'add',
          fn: ({ row }) => {
            this.$_dialog({
              size: 'medium',
              title: '编辑汇率',
              params: { row },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./edit.vue')
            })
          }
        }
      ],
      searchFields: {
        searchChineseName: {
          label: '币种名称'
        },
        searchCurrency: {
          label: '币种代码'
        }
      },
      columns: [
        {
          label: '币种名称',
          value: 'chineseName'
        },
        {
          label: '币种代码',
          value: 'currency'
        },
        {
          label: '币种符号',
          value: 'symbol'
        },
        {
          label: '美元汇率',
          value: 'exchangeRate'
        },
        {
          label: '更新时间',
          value: 'updateTime'
        }
      ]
    }
  }
}
</script>