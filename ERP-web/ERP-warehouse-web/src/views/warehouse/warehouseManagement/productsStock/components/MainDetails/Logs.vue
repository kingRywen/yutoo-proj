<template>
  <!-- <div>日志</div> -->
  <div>
    <YtTableSelect ref="table" url="warehouse/wmRepertoryStockLog" :options="options"/>
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
            label: '操作时间',
            value: 'time',
            type: 'time',
            style: {
              width: '210px'
            }
          },
          {
            label: '操作类型',
            value: 'searchType',
            type: 'select',
            style: {
              width: '100px'
            },
            children: [
              {
                label: '入库',
                value: 1
              },
              {
                label: '出库',
                value: 2
              },
              {
                label: '锁定',
                value: 3
              },
              {
                label: '释放',
                value: 4
              }
            ]
          }
        ],
        // 表格项
        table: {
          selection: false,
          maxHeight: 320,
          searchDataFn(data) {
            let { time = [], ...info } = data
            let [timeStart, timeEnd] = time || []
            return { timeStart, timeEnd, ...info, ...vm.params }
          },
          columns: [
            {
              value: 'createTime',
              label: '操作时间'
            },
            {
              value: 'operatorName',
              label: '操作人员'
            },
            {
              value: 'logTypeDesc',
              label: '操作类型'
            },
            {
              value: 'amount',
              label: '数量'
            },
            {
              value: 'repertoryOriginal',
              label: '当前库存'
            },
            {
              value: 'repertoryUseful',
              label: '可用库存'
            },
            {
              value: 'wmLocationName',
              label: '位置编码'
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
