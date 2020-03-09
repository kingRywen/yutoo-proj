<template>
  <div>
    <yt-table :columns="columns" :data="data" :selection='false' border></yt-table>
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      columns: [
        {
          label: '属性名称',
          value: 'attrKey'
        },
        {
          label: '属性值',
          value: 'attrValue',
          line: 1,
          render(h, scope) {
            let value = scope.row.attrValue || []
            return <span>{value.join(', ') || '-'}</span>
          }
          
        },
        
      ],
      data: []
    }
  },
  methods: {
    _initData() {
      let params ={
        parentAsin: this.params.parentAsin,
        siteId: this.siteId,
        sellerId: this.sellerId,
        platformId: this.platformId,
      }
      this.$api[`selAttrProductListProductAttr`](params)
      .then(data => {
        this.data = data.data
      }).catch(() => {})
    }
  }
}
</script>

<style>
</style>
