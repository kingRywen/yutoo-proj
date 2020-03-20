<template>
  <div>
    <main-layout
      :key="key"
      :outerParams="{...storeInfo, siteId: $store.state.selling.curSiteId}"
      :searchFields="searchFields"
      :columns="columns"
      url="ss/sellingTaskList"
      ref="layout"
      editWidth="140px"
      :btnFn="btnFn"
      :right-edit-btns="editBtns"
      :edit-btns="edits"
      tbRightFixed="right"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
    ></main-layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      key: '111',
      editBtns: [
        {
          name: '添加任务',
          perm: 'add',
          fn: () => {
            this.$_dialog({
              size: 'medium',
              title: '添加跟卖源任务',
              params: { siteId: this.$store.state.selling.curSiteId },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./dialogs/addTask.vue')
            })
          }
        }
      ],
      topBatchBtn: {
        title: '项',
        options: [
          {
            label: '重新抓取'
          },
          {
            label: '删除'
          }
        ]
      },
      edits: [
        {
          name: '重新抓取',
          perm: 'add',
          fn: scope => {
            this.recrwal([scope.row.taskId])
          }
        },
        {
          name: '删除',
          perm: 'add',
          fn: scope => {
            this.del([scope.row.taskId])
          }
        }
      ],
      columns: [
        {
          label: '序号',
          width: 50,
          type: 'index'
        },
        {
          label: '站点',
          width: 80,
          value: 'siteName'
        },
        {
          label: '抓取方式',
          width: 80,
          value: 'dataType',
          _enum: this.cfuns.arrayToObj(this.$const['SS/scDataType'])
        },
        {
          label: '抓取对象',
          value: 'defaultSource',
          minWidth: 160,
          noTooltip: true,
          render: (h, scope) => {
            const {
              dataType,
              defaultSource,
              categoryUrl,
              resourceCnt
            } = scope.row
            if (dataType == 0) {
              return (
                <span>
                  <a target="_blank" href={categoryUrl}>
                    {defaultSource}
                  </a>
                </span>
              )
            }
            if (dataType >= 1) {
              return (
                <span>
                  {defaultSource}
                  {resourceCnt > 1 ? (
                    <span>
                      （
                      <a
                        onClick={() => {
                          this.$_dialog({
                            size: 'medium',
                            title: '详情',
                            params: { row: scope.row },
                            cancelBtnText: '取消',
                            okBtnText: '确认',
                            component: () => import('./dialogs/view.vue')
                          })
                        }}
                        href="javascript:void(0)"
                      >
                        {resourceCnt}
                      </a>
                      ）
                    </span>
                  ) : null}
                </span>
              )
            }
          }
        },
        {
          label: '抓取状态',
          width: 80,
          value: 'status',
          _enum: this.cfuns.arrayToObj(this.$const['PRODUCTANALYSIS/status'])
        },
        {
          label: '创建时间',
          width: 150,
          value: 'createTime'
        },
        {
          label: '更新时间',
          width: 150,
          value: 'dataTime'
        }
      ],
      searchFields: {
        dataType: {
          widget: 'select',
          options: this.$const['SS/scDataType'],
          label: '抓取方式'
        },
        status: {
          widget: 'select',
          labelWidth: '50px',
          options: this.$const['PRODUCTANALYSIS/status'],
          label: '状态'
        }
      }
    }
  },
  watch: {
    '$store.state.selling.curSiteId'(val) {
      this.key = val
    }
  },
  methods: {
    del(taskIds) {
      const params = {
        ...this.storeInfo,
        taskIds
      }
      this.showTips({ msg: '此操作将删除任务, 是否继续?' }, () => {
        return this.$api[`ss/sellingSrcRemoveTask`](params)
      })
    },
    btnFn(row) {
      if (row.status == 1) {
        return []
      }
      return [1,2]
    },
    handleLeftBatchChange(val, sel) {
      const taskIds = sel.map(e => e.taskId)
      switch (val[0]) {
        case '重新抓取':
          this.recrwal(taskIds)
          break
        case '删除':
          this.del(taskIds)
          break

        default:
          break
      }
    },
    recrwal(taskIds) {
      this.showTips({ msg: '此操作将重新抓取任务, 是否继续?' }, () => {
        return this.$api[`ss/sellingReCrawlTask`]({
          ...this.storeInfo,
          siteId: this.$store.state.selling.curSiteId,
          taskIds
        })
      })
    }
  }
}
</script>