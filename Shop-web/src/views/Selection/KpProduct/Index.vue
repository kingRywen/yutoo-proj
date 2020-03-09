<template>
  <!-- <div>产品深度分析</div> -->
  <MainLayout
    :outerParams="outerParams"
    :edits="edits"
    :searchFields="searchFields"
    :searchFunc="searchFunc"
    :editBtns="editBtns"
    :columns="columns"
    ref="layout"
    url="kpProductList"
  >
    <!-- <div slot="left">123</div> -->
  </MainLayout>
</template>

<script>
export default {
  name: 'PartFour',
  computed: {
    outerParams() {
      return {
        platformId: this.platformId,
        siteId: this.siteId,
        sellerId: this.sellerId
      }
    }
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
          fn: scope => {
            let { taskId, asin } = scope.row
            let params = { ...this.outerParams, taskId, asin }
            this.$refs.layout.$dialog({
              title: '数据源',
              width: '1400px',
              showMaxBtn: true,
              component: () => import('./dialogs/chart.vue'),
              params,
            })
          }
        },
        {
          name: '重新抓取',
          icon: 'el-icon-refresh',
          show: scope => {
            return scope.row.status !== 1
          },
          fn: scope => {
            this.$api[`kpProductReCrawl`]({ taskIds: [scope.row.taskId], ...this.outerParams })
              .then(() => {
                this.getList()
              })
              .catch(() => {})
          }
        }
      ],
      searchFields: [
        {
          noLabel: true,
          name: 'searchText',
          placeholder: '请输入ASIN/备注'
        },
        {
          noLabel: true,
          placeholder: '抓取状态',
          labelWidth: '80px',
          name: 'status',
          type: 'select',
          options: [
            {
              label: '待处理',
              value: 0
            },
            {
              label: '处理中',
              value: 1
            },
            {
              label: '处理成功',
              value: 2
            },
            {
              label: '处理失败',
              value: 3
            }
          ]
        },
        {
          label: '添加时间',
          name: 'createTime',
          type: 'dateRange'
          // width: 240,
          // pickerOptions: {
          //   disabledDate(time) {
          //     return time.getTime() > Date.now()
          //   }
          // }
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
              return this.$api[`kpProductRemove`]({
                taskIds,
                ...this.outerParams
              })
                .then(() => {
                  this.$refs.layout.getList()
                })
                .catch(() => {})
            })
          }
        },
        {
          name: '重新抓取',
          showLoading: true,
          disabled: selection => {
            return selection.length <= 0
          },
          fn: () => {
            let taskIds = this.getSelectionId()
            return this.$api[`kpProductReCrawl`]({
              taskIds,
              ...this.outerParams
            }).then(() => {
              this.getList()
            })
          }
        }
      ],
      columns: [
        {
          value: 'asin',
          label: 'ASIN',
          url: 'productUrl'
        },
        {
          value: 'remark',
          label: '备注',
          url: 'productUrl'
        },
        {
          value: 'imageUrl', //table需要渲染的值
          label: '主图', //表头
          width: '60', //当前行宽度
          img: true //如图片传
        },
        {
          label: '添加时间',
          value: 'createTime',
          sortable: 'custom'
        },
        {
          label: '状态',
          value: 'status',
          enum: {
            1: '处理中',
            2: '处理成功',
            '>=3': '处理失败'
          }
        },
        {
          label: '数据更新时间',
          value: 'updateTime',
          sortable: 'custom'
        }
      ]
    }
  },
  methods: {
    searchFunc(data) {
      let { createTime, ...info } = data
      let [startTime, endTime] = createTime || []
      return { startTime, endTime, ...info }
    },

    getSelectionId() {
      return this.getSelection().map(el => el.taskId)
    },
    getList() {
      return this.$refs.layout.getList()
    }
  },
  mounted() {}
}
</script>

<style>
</style>
