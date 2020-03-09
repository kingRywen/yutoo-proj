<template>
  <!-- <div>出库记录</div> -->
  <div>
    <YtTableSelect ref="table" url="warehouse/wmRepertoryStockOut" :options="options"/>
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
            label: '出库时间',
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
          maxHeight: 320,
          searchDataFn(data) {
            let { time = [], ...info } = data
            let [storeOutTimeStart, storeOutTimeEnd] = time || []
            return { storeOutTimeStart, storeOutTimeEnd, ...info, ...vm.params }
          },
          columns: [
            {
              value: 'createTime',
              label: '出库时间',
              width: 150
            },
            {
              value: 'amount',
              label: '出库数量'
            },
            {
              value: 'purchasePrice',
              label: '出库采购金额'
            },
            {
              value: 'purchaseNumber',
              label: '采购单'
            },
            {
              value: 'purchaseCode',
              label: '采购唯一码'
            },
            {
              value: 'wmLocationCode',
              label: '库位编码'
            },
            {
              value: 'operatorName',
              label: '操作人'
            },
            {
              value: 'remark',
              label: '备注'
            }
          ],
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
