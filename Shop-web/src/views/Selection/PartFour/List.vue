<template>
  <!-- <div>竞品分析</div> -->
  <MainLayout
    :outerParams="outerParams"
    :edits="edits"
    :searchFields="searchFields"
    :searchFunc="searchFunc"
    :editBtns="editBtns"
    :columns="columns"
    ref="layout"
    url="productAnalysisList"
  >
    <!-- <div slot="left">123</div> -->
  </MainLayout>
</template>

<script>
export default {
  name: 'PartFour',
  computed: {
    outerParams(){
    	return {
    		platformId: this.platformId,
    		siteId: this.siteId,
    		sellerId: this.sellerId
    	}
    },
  },
  data() {
    return {
      edits: [
        {
          name: '查看详情',
          icon: 'el-icon-search',
          show: scope => {
            return scope.row.status === 2
          },
          fn: (scope, item) => {
            this.$router.push({
              name: 'partFourDetail',
              query: { name: scope.row.asin, taskId: scope.row.taskId, asin: scope.row.asin, startTime: scope.row.createTime.split(' ')[0] }
            })
          }
        },
        {
          name: '重新抓取',
          icon: 'el-icon-refresh',
          show: scope => {
            return scope.row.status >= 3
          },
          fn: (scope, item) => {
            this.$api[`productAnalysisReCrawl`]({ taskId: scope.row.taskId })
              .then(data => {
                this.getList()
              })
              .catch(() => {})
          }
        }
      ],
      searchFields: [
        {
          noLabel: true,
          name: 'asin',
          placeholder: '请输入ASIN'
        },
        {
          noLabel: true,
          placeholder: '抓取状态',
          labelWidth: '80px',
          name: 'status',
          type: 'select',
          options: [
            {
              label: '抓取中',
              value: 1
            },
            {
              label: '抓取成功',
              value: 2
            },
            {
              label: '抓取失败',
              value: 3
            }
          ]
        },
        {
          noLabel: true,
          placeholder: '监控状态',
          labelWidth: '80px',
          name: 'monitorFlag',
          type: 'select',
          options: [
            {
              label: '未开启',
              value: 0
            },
            {
              label: '监控中',
              value: 1
            }
          ]
        },
        {
          label: '创建时间',
          name: 'createTime',
          type: 'dateRange',
          // width: 240,
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now()
            }
          }
        }
      ],

      editBtns: [
        {
          name: '添加任务',
          fn: () => {
            let params = this.outerParams
            this.$refs.layout.$dialog({
              title: '添加任务',
              width: '500px',
              component: () => import('./dialogs/AddTask.vue'),
              params,
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '删除',
          showLoading: true,
          disabled: selection => {
            return selection.length <= 0
          },
          fn: () => {
            return this.$.showWarning('是否删除选中的任务？', () => {
              let taskIds = this.getSelectionId()
              return this.$api[`productAnalysisRemove`]({ taskIds })
                .then(data => {
                   this.$refs.layout.getList()
                })
                .catch(err => {})
            })
          }
        },
        {
          name: '添加监控',
          disabled: selection => {
            return selection.length <= 0
          },
          fn: () => {
            this.$refs.layout.$dialog({
              title: '添加监控',
              width: '500px',
              component: () => import('./dialogs/AddMonitor.vue'),
              params: { taskIds: this.getSelectionId() },
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '修改监控周期',
          disabled: selection => {
            return selection.length <= 0
          },
          fn: () => {
            let time = [], sel = this.$refs.layout.selection
            if (sel.length === 1) {
              time = [sel[0].monitorFrom, sel[0].monitorTo]
            }
            this.$refs.layout.$dialog({
              title: '修改监控周期',
              width: '500px',
              component: () => import('./dialogs/AddMonitor.vue'),
              params: { taskIds: this.getSelectionId(), edit: true, time },
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '关闭监控',
          showLoading: true,
          disabled: selection => {
            return selection.length <= 0
          },
          fn: () => {
              return this.$.showWarning('是否关闭选中的监控任务？', () => {
              let taskIds = this.getSelectionId()
              return this.$api[`productAnalysisRemoveMonitor`]({ taskIds })
                .then(data => {
                  this.$refs.layout.getList()
                })
                .catch(err => {})
            })
          }
        }
      ],
      columns: [
        {
          value: 'asin',
          label: 'ASIN',
          // toggle: ['asin', 'status']
		  url:'productUrl'
        },
        {
          value: 'imageUrl', //table需要渲染的值
          label: '主图', //表头
          width: '60', //当前行宽度
          img: true //如图片传
        },
        {
          label: '标题',
          value: 'title',
		      showTooltip:true,
          // url: 'productUrl'
        },
        {
          label: '监控状态',
          value: 'monitorFlag',
          enum: {
            0: '未开启',
            1: '监控中'
          }
        },
        {
          label: '监控周期',
          value: 'monitorFlag',
          render(h, scope) {
            let { monitorFrom, monitorTo } = scope.row
            return monitorFrom ? (
              <span>
                {monitorFrom} ~ {monitorTo}
              </span>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          label: '抓取状态',
          value: 'status',
          enum: {
            0: '待抓取',
            1: '抓取中',
            2: '抓取成功',
            '>=3': '抓取失败'
          }
        },
        {
          label: '创建时间',
          value: 'createTime'
        }
      ]
    }
  },
  methods: {
    searchFunc(data) {
      let {createTime, ...info} = data
      let [startTime, endTime] = createTime || []
      return {startTime,endTime, ...info}
    },
    
    getSelectionId() {
      return this.getSelection().map(el => el.taskId)
    },
    getList() {
      return this.$refs.layout.getList()
    }
  },
  mounted(){
	
  },
}
</script>

<style>
</style>
