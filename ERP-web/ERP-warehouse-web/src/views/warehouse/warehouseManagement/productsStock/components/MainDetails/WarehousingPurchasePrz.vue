<template>
  <!-- <div>入库采购价</div> -->
  <div>
    <YtTableSelect ref="table" url="warehouse/wmRepertoryStockInPurchase" :options="options"/>
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    let vm = this
    return {
      options: {
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
            return { storeInTimeStart, storeInTimeEnd, ...info,...vm.params }
          },
          columns: [
            {
              value: 'createTime',
              label: '入库时间'
            },
            {
              value: 'purchasePrice',
              label: '采购价'
            },
            {
              value: 'purchaseAvg',
              label: '原采购平均价'
            },
            {
              value: 'repertoryOriginal',
              label: '原库存数量'
            },
            {
              value: 'amount',
              label: '入库数量',
              // eslint-disable-next-line
              // render(h) {
              //   return <span>{amount}</span>
              // },
            },
            {
              value: 'purchaseFreight',
              label: '采购运费'
            },
            {
              value: 'remark',
              label: '备注'
            }
          ],
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
  },
}
</script>

<style>
</style>
