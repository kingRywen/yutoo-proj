<template>
  <main-layout
    :outerParams="outerParams"
    :searchFields="searchFields"
    :columns="columns"
    :edit-btns="edits"
    edit-width="160px"
    :right-edit-btns="editBtns"
    :topBatchBtn="topBatchBtn"
    :btnFn="btnFn"
    @left-batch-change="leftBatchChange"
    url="keyword/taskKeywordInteDigList"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  data() {
    let vm = this
    return {
      topBatchBtn: {
        options: [
          {
            label: '重新抓取'
          },
          {
            label: '删除'
          }
        ]
      },
      editBtns: [
        {
          name: '添加任务',
          // icon: 'el-icon-plus',
          perm: 'add',
          fn: () => {
            this.showDialogGlobal(`添加任务`, '100%', {}, () =>
              import('./dialogs/newAdd.vue')
            )
          }
        }
      ],
      searchFields: {
        taskName: {
          placeholder: '任务ID',
          labelWidth: '70px'
        },
        createTime: {
          hidden: true,
          labelWidth: '80px',
          widget: 'daterange',
          label: '创建时间',
          fields: ['createTimeMin', 'createTimeMax']
        },
        resultTime: {
          hidden: true,
          labelWidth: '80px',
          widget: 'daterange',
          label: '更新时间',
          fields: ['resultTimeMin', 'resultTimeMax']
        },
        status: {
          hidden: true,
          widget: 'select',
          options: vm.$const['KEYWORD/status'],
          label: '抓取状态',
          labelWidth: '80px'
        }
      },
      edits: [
        {
          name: '查看',
          perm: 'addTask',
          fn: scope => {
            vm.$router.push({
              path: '/keyword/intelligentMining/detail',
              query: { taskId: scope.row.taskId }
            })
          }
        },
        {
          name: '重新抓取',
          fn: scope => {
            let params = { taskIds: [scope.row.taskId], ...vm.outerParams }
            this.showConfirmGlobal(
              'keyword/taskKeywordInteDigReCrawl',
              params,
              '重新抓取'
            )
          }
        },
        {
          name: '删除',
          fn: scope => {
            let params = { taskIds: [scope.row.taskId], ...vm.outerParams }
            this.showConfirmGlobal(
              'keyword/taskKeywordInteDigRemove',
              params,
              '删除'
            )
          }
        }
      ],
      columns: [
        {
          label: '任务ID',
          value: 'taskName'
        },
        {
          label: '关键词',
          render(h, scope) {
            let { keyword } = scope.row
            return <span>{keyword}</span>
          }
        },
        //123/
        {
          label: '创建时间',
          value: 'createTime',
          sortable: 'custom'
        },
        {
          label: '抓取状态',
          value: 'status',
          _enum: {
            0: '待处理',
            1: '处理中',
            2: '处理成功',
            3: '处理失败'
          }
        },
        {
          label: '数据更新时间',
          value: 'resultTime',
          sortable: 'custom'
        }
      ]
    }
  },
  methods: {
    btnFn({ status }) {
      if (status == 1) {
        return [3]
      }
      if (status == 2) {
        return [1, 2, 3]
      }
      if (status == 3 || status > 3) {
        return [2, 3]
      }
    },
    showDialog(id) {
      this.showDialogGlobal(
        `关键词列表`,
        '100%',
        { id: id, url: 'keyword/taskKeywordInteDigInfo' },
        () => import('Views/modules/Keyword/common/dialog/keywordList.vue'),
        '',
        '关闭'
      )
    },
    leftBatchChange(type, data) {
      let params = {
        ...this.outerParams,
        taskIds: data.map(e => e.taskId)
      }
      switch (type[0]) {
        case '重新抓取':
          this.showConfirmGlobal(
            'keyword/taskKeywordInteDigReCrawl',
            params,
            '重新抓取'
          )
          break
        case '删除':
          this.showConfirmGlobal(
            'keyword/taskKeywordInteDigRemove',
            params,
            '删除'
          )
          break
      }
    }
  },
  computed: {
    outerParams() {
      return {
        platformId: this.storeInfo.platformId,
        siteId: this.storeInfo.siteId
      }
    }
  }
}
</script>
