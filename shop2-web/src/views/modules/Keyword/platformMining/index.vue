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
    reserveSelection="taskId"
    @left-batch-change="leftBatchChange"
    url="keyword/taskKeywordDigList"
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
              import('./dialogs/add.vue')
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
        originId: {
          hidden: true,
          label: '来源',
          labelWidth: '70px',
          widget: 'select',
          options: []
        },
        keywordType: {
          hidden: true,
          widget: 'select',
          options: [
            {
              label: '相关词',
              value: 0
            },
            {
              label: '下拉词',
              value: 1
            },
            {
              label: '联想词',
              value: 2
            },
            {
              label: 'TAG词',
              value: 3
            },
            {
              label: '广告词',
              value: 4
            }
          ],
          label: '类型',
          labelWidth: '70px'
        }
      },
      edits: [
        {
          name: '查看',
          perm: 'addTask',
          fn: scope => {
            vm.$router.push({
              path: '/keyword/platformMining/detail',
              query: {
                taskId: scope.row.taskId,
                originId: scope.row.originId,
                keywordTypes:
                  scope.row.originId == 4 ? scope.row.keywordTypes[0] : null
              }
            })
          }
        },
        {
          name: '重新抓取',
          fn: scope => {
            let params = { taskIds: [scope.row.taskId], ...vm.outerParams }
            this.showConfirmGlobal(
              'keyword/taskKeywordDigReCrawl',
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
              'keyword/taskKeywordDigRemove',
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
          value: 'defaultSource',
          url: true,
          showTooltip: true,
          numField: 'resourceCnt',
          showBtn: true,
          btnClick: scope => {
            vm.showDialog(scope.row.taskId)
          }
        },
        // 123/
        {
          label: '来源',
          value: 'originId',
          render(h, scope) {
            return (
              <span>
                {
                  vm.searchFields.originId.options.find(
                    e => e.value === scope.row.originId
                  ).label
                }
              </span>
            )
          }
        },
        // 123/
        {
          label: '类型',
          render(h, scope) {
            let { keywordTypes } = scope.row
            if (keywordTypes && keywordTypes.length > 0) {
              return (
                <div>
                  {keywordTypes.includes(0) ? <span>相关词　</span> : null}
                  {keywordTypes.includes(1) ? <span>下拉词　</span> : null}
                  {keywordTypes.includes(2) ? <span>联想词　</span> : null}
                  {keywordTypes.includes(3) ? <span>TAG词　</span> : null}
                  {keywordTypes.includes(4) ? <span>广告词　</span> : null}
                </div>
              )
            } else {
              return <span>-</span>
            }
          }
        },
        //123/
        {
          label: '创建时间',
          value: 'createTime',
          sortable: 'custom'
        },
        {
          label: '数据更新时间',
          value: 'resultTime',
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
        { id: id, url: 'keyword/taskKeywordDigInfo' },
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
            'keyword/taskKeywordDigReCrawl',
            params,
            '重新抓取'
          )
          break
        case '删除':
          this.showConfirmGlobal('keyword/taskKeywordDigRemove', params, '删除')
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
  },
  created() {
    let params = { num: 1 }
    this.$api['common/keywordTypeList'](params).then(res => {
      this.searchFields.originId.options = res.data.map(e => {
        return {
          label: e.platformName,
          value: e.platformId
        }
      })
    })
  }
}
</script>
