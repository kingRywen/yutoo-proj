<template>
  <main-layout
    class="w800"
    :url="`proPick/${depth ? 'categoryDepthTaskMerchantListToBsrByProduct' : 'listToBsrByProduct'}`"
    :simple="true"
    :isShowPag="false"
    :showSelection="false"
    :outerParams="{...storeInfo,merchantTaskId,category,asin, parentAsin : noParentAsin ? undefined: (asin || parentAsin) }"
    :columns="columns"
  ></main-layout>
</template>
<script>
export default {
  props: [
    'merchantTaskId',
    'category',
    'asin',
    'parentAsin',
    'depth',
    'noParentAsin'
  ],
  data() {
    return {
      columns: [
        {
          label: '分类',
          value: 'bsrCategory',
          noTooltip: true,
          url: 'bsrUrl'
        },
        {
          label: '排名',
          width: 100,
          sortable: true,
          value: 'bsr'
        }
      ]
    }
  }
}
</script>