<template>
  <!-- <div>入库记录</div> -->
  <div>
    <YtTableSelect ref="table" url="warehouse/wmRepertoryStockIn" :options="options"/>
  </div>
</template>

<script>
export default {
  props: ['params'],
  computed: {
    options() {
      let vm = this
      let columns = [
        {
          value: 'createTime',
          label: '入库时间',
          width: 140
        },
        {
          value: 'baseProductVariantSkuCus',
          label: '自定义SKU',
          width: 95
        },
        {
          value: 'purchaseNumber',
          label: '采购单',
          width: 110
        },
        {
          value: 'purchaseDestroy',
          label: '历史销单',
          width: 120
        },
        {
          value: 'purchaseCode',
          label: '采购唯一编码',
          width: 120
        },
        {
          value: 'wmLocationCode',
          label: '库位编码'
        },
        {
          value: 'amount',
          label: '入库数量'
        },
        {
          value: 'purchasePrice',
          label: '入库采购金额',
          width: 95
        },
        {
          value: 'operatorName',
          label: '操作人'
        },
        {
          value: 'remark',
          label: '备注'
        }
      ]
      if (this.params.productType != 1) {
        columns.splice(1, 1)
      }
      return {
        search: [
          {
            label: '入库时间',
            value: 'time',
            type: 'time',
            style: {
              width: '210px'
            }
          },
          {
            label: '查询类型',
            value: 'searchType',
            type: 'select',
            style: {
              width: '100px'
            },
            children: [
              {
                label: '订单号',
                value: 1
              },
              {
                label: '采购唯一编码',
                value: 2
              },
              {
                label: '备注',
                value: 3
              },
              {
                label: '操作人id',
                value: 4
              }
            ]
          },
          {
            label: '',
            value: 'searchValue',
            type: 'input'
          }
        ],
        // 表格项
        table: {
          selection: false,

          searchDataFn(data) {
            let { time = [], ...info } = data
            let [storeInTimeStart, storeInTimeEnd] = time || []
            return { storeInTimeStart, storeInTimeEnd, ...info, ...vm.params }
          },
          columns,
          maxHeight: 320,
          border: true,
          reserveSelection: null
        }
      }
    }
  },
  mounted() {
    // this.$nextTick(() => this.$refs.table.getData())
  },
  methods: {
    initData() {
      this.$nextTick(() => this.$refs.table.getData())
    }
  }
}
</script>

<style>
</style>
