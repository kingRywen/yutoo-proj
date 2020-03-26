<template>
  <div class="w1200">
    <h3 v-if="type == 'lib'">
      <span>ASIN：</span>
      {{asin}}
    </h3>
    <main-layout
      
      :outerParams="outerParams"
      :columns="type == 'lib' ? columns1 : columns"
      :url="`ss/${type == 'lib' ? 'sellingSellingLibList' : 'sellingMaybeSellingList'}`"
      :isShowPag="false"
    ></main-layout>
  </div>
</template>
<script>
export default {
  props: [
    'siteId',
    'srcSiteId',
    'asin',
    'platformId',
    'type',
    'deliverySiteId'
  ],
  computed: {
    outerParams() {
      const { siteId, srcSiteId, asin } = this
      if (this.type == 'lib') {
        // 跟卖数量
        return { siteId, platformId: this.storeInfo.platformId, asin }
      }
      return {
        platformId: this.storeInfo.platformId,
        siteId,
        srcSiteId,
        asin,
        deliverySiteId: this.deliverySiteId
      }
    }
  },
  data() {
    return {
      columns1: [
        {
          label: '店铺名称',
          value: 'sellerAlias'
        },
        {
          label: 'SKU',
          value: 'sku',
          minWidth: 240
        },
        {
          label: '库存',
          value: 'quantity'
        },
        {
          label: '销售价格',
          value: 'salePrice'
        },
        {
          label: '跟卖状态',
          value: 'saleStatus',
          _enum: ['上架', '下架']
        },
        {
          label: '跟卖更新时间',
          value: 'updateTime'
        },
        {
          label: '策略',
          headerTooltip: '仅变体才有策略',
          value: 'view',
          render(h, scope) {
            let __list = []
            Object.keys(scope.row).forEach(key => {
              let val = scope.row[key]
              if (key == 'inventoryStrategyName') {
                __list.push({
                  type: '库存策略名称',
                  name: val
                })
              }
              if (key == 'priceStrategyName') {
                __list.push({
                  type: '价格策略名称',
                  name: val
                })
              }
              if (key == 'cntStrategyName') {
                __list.push({
                  type: '跟卖数量策略名称',
                  name: val
                })
              }
              if (key == 'timeStrategyName') {
                __list.push({
                  type: '跟卖时间策略名称',
                  name: val
                })
              }
              if (key == 'frequencyStrategyName') {
                __list.push({
                  type: '监控频率策略名称',
                  name: val
                })
              }
            })
            return (
              <el-popover placement="right">
                <yt-table
                  
                  selection={false}
                  show-header={false}
                  columns={[
                    { label: '策略类型', value: 'type',width: 140 },
                    { label: '策略名称', value: 'name',minWidth: 320 }
                  ]}
                  data={__list}
                ></yt-table>
                <el-button type="text" size="mini" slot="reference">
                  查看
                </el-button>
              </el-popover>
            )
          }
        }
      ],
      columns: [
        {
          label: '卖家名称',
          value: 'sellerName'
        },
        {
          label: '价格',
          value: 'price'
        },
        {
          label: '运费',
          value: 'fare'
        },
        {
          label: '发货方式',
          value: 'fbpFlag',
          _enum: ['FBM', 'FBA']
        }
      ]
    }
  }
}
</script>