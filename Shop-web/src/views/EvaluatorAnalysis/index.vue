<template>
  <div v-if="$route.name === 'evaluatorAnalysis'">
    <MainLayout
      :edits="edits"
      :outerParams="outerParams"
      :searchFields="searchFields"
      :searchData="searchData"
      :searchFunc="searchFunc"
      :editBtns="editBtns"
      :columns="columns"
      ref="layout"
      url="taskReviewerAnalysisList"
    ></MainLayout>
  </div>
  <router-view v-else></router-view>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      show: true,
      edits: [
        // {
        //   name: '重新抓取',
        //   icon: 'el-icon-refresh',
        //   show: scope => {
        //     return scope.row.status >= 2
        //   },
        //   fn: scope => {
        //     this.$api[`taskReviewerAnalysisReCrawl`]({
        //       taskIds: [scope.row.taskId]
        //     })
        //       .then(data => {						
        //         this.getLayoutList()
        //       })
        //       .catch(() => {})
        //   }
        // },
        {
          name: '查看',
          icon: 'el-icon-search',
          show: scope => {
            return scope.row.status === 2
          },
          fn: scope => {
            let { taskName, taskId } = scope.row
            this.$router.push({
              name: 'evaluatorAnalysisDatails',
              query: { name: taskName, taskId }
            })
          }
        }
      ],
      searchFields: [
        {
          noLabel: true,
          placeholder: '请输入任务名称',
          labelWidth: '80px',
          name: 'taskName'
        },
        {
          placeholder: '抓取状态',
          noLabel: true,
          name: 'status',
          type: 'select',
          options: [
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
          noLabel: true,
          name: 'createTime',
          type: 'dateRange',
		  rangeSeparator:"至",
		  width:'337px'
        }
      ],
      searchData: {},
      editBtns: [
        {
          name: '添加任务',
          fn: () => {
            this.$refs.layout.$dialog({
              title: '添加任务',
              size: 'small',
              component: () => import('./dialogs/AddTask.vue'),
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          type: 'danger',
          disabled: selection => {
            return selection.length < 1
          },
          showLoading:true,
          fn: () => {
            return this.$.showWarning('是否删除选中的任务?', () => {
              let taskIds = this.getSelectionByKey('taskId')
              return this.$api[`taskReviewerAnalysisRemove`]({ taskIds })
                .then(data => {
                  this.getLayoutList()
                })
                .catch(() => {})
            })
          }
        }
      ],
      columns: [
        {
          label: '任务名称',
          value: 'taskName'
          // expand: true
        },
        {
          label: '抓取源类型',
          value: 'dataType',
          enum: {
            0: '产品链接',
            1: '店铺链接',
            2: '类目',
            3: 'Top10000链接',
            4: '关键词'
          }
        },
        {
          label: '抓取源',
          value: 'dataSources',
          render(h, scope) {
            console.log(scope.row);
            let { categoryUrl, dataType, dataSources, searchPages } = scope.row
            return dataSources && dataSources.length ? (
              <el-button
                onClick={() => {
                  vm.$refs.layout.$dialog({
                    title: '数据源',
                    size: 'small',
                    component: () => import('./dialogs/DataSource.vue'),
                    // okBtnText: '确认',
                    params: { categoryUrl, dataType, dataSources, searchPages }
                    // cancelBtnText: '取消'
                  })
                }}
                type="text"
              >
                <b>{dataSources.length}</b>
              </el-button>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          label: '创建时间',
          value: 'createTime',
          width: 150
        },
        {
          label: '抓取状态',
          value: 'status',
          enum: {
            0: '待处理',
            1: '处理中',
            2: '处理成功',
            '>=3': '处理失败'
          }
        },

        {
          label: '结果生成时间',
          value: 'resultTime'
        }
      ]
    }
  },
  computed: {
    outerParams() {
      const { platformId, sellerId, siteId } = this.sellerData
      
      return { platformId, sellerId, siteId }
    }
  },
  methods: {
    sortChange({ column, prop, order }) {
      console.log({ column, prop, order })
    },
    searchFunc(data) {
      let { createTime, ...info } = data
      let [startTime, endTime] = createTime || []
      return { startTime, endTime, ...info }
    }
  }
}
</script>

<style>
</style>
