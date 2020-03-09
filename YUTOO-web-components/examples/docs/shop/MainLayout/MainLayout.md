## 表格布局

用于上部有搜索栏，中部有按钮，下部有表格的布局。搜索栏可以折叠，默认关闭。

## 基础表格布局

基础表格布局展示用法。

:::demo 组件基本参数 data columns 必须传入， rowKey 对应 element-ui 中的rowKey, columns中每项中的value为数据中的对应key值，另外提供了一种渲染jsx函数的方式展示数据(如果提供了value和render属性，优先展示render结果)，此方法接收两个参数(h, scope), 第一个参数为渲染函数，不用处理，第二个参数为当前行的数据，对应el-table中的scope, 参见[jsx语法](https://github.com/vuejs/jsx#installation)

```html
<template>
  <main-layout
    :outer-params="outerParams"
    :edits="edits"
    :search-fields="searchFields"
    :search-func="searchFunc"
    :edit-btns="editBtns"
    :columns="columns"
    ref="layout"
    url="productAnalysisList"
  >
  </main-layout>
</template>

<script>
  export default {
    name: 'PartFour',
    computed: {
      outerParams() {
        const { platformId, sellerId, siteId } = this.sellerData
        return { platformId, sellerId, siteId }
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
            fn: (scope, item) => {
              this.$router.push({
                name: 'partFourDetail',
                query: {
                  name: scope.row.asin,
                  taskId: scope.row.taskId,
                  asin: scope.row.asin,
                  startTime: scope.row.createTime.split(' ')[0]
                }
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
                label: '关闭监控',
                value: 0
              },
              {
                label: '开启监控',
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
            disabled: selection => {
              return selection.length <= 0
            },
            fn: () => {
              this.$.showWarning('是否删除选中的任务？', () => {
                let taskIds = this.getSelectionId()
                this.$api[`productAnalysisRemove`]({ taskIds })
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
              let time = [],
                sel = this.$refs.layout.selection
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
            disabled: selection => {
              return selection.length <= 0
            },
            fn: () => {
              this.$.showWarning('是否关闭选中的监控任务？', () => {
                let taskIds = this.getSelectionId()
                this.$api[`productAnalysisRemoveMonitor`]({ taskIds })
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
            label: 'ASIN'
            // toggle: ['asin', 'status']
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
            url: 'productUrl'
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
    }
  }
</script>

<style></style>
```

:::
