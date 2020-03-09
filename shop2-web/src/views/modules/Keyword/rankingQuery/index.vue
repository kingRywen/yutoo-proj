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
    url="keyword/taskKeywordRankList"
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
            label: '修改监控周期'
          },
          {
            label: '关闭监控'
          },
          {
            label: '开启监控'
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
        monitorFlag: {
          hidden: true,
          widget: 'select',
          options: [
            {
              label: '开启',
              value: 1
            },
            {
              label: '关闭',
              value: 0
            }
          ],
          label: '监控状态',
          labelWidth: '80px'
        },
        monitorFrom: {
          hidden: true,
          labelWidth: '100px',
          widget: 'daterange',
          label: '监控开始时间',
          fields: ['monitorFromMin', 'monitorFromMax']
        },
        monitorTo: {
          hidden: true,
          labelWidth: '100px',
          widget: 'daterange',
          label: '监控结束时间',
          fields: ['monitorToMin', 'monitorToMax']
        },
        adFlag: {
          hidden: true,
          widget: 'select',
          options: [
            {
              label: '广告',
              value: 1
            },
            {
              label: '自然',
              value: 0
            }
          ],
          label: '查询类型',
          labelWidth: '80px'
        }
      },
      edits: [
        {
          name: '查看',
          perm: 'addTask',
          fn: scope => {
            vm.$router.push({
              path: '/keyword/rankingQuery/detail',
              query: {
                taskId: scope.row.taskId,
                asin: scope.row.asin,
                compareAsin1: scope.row.compareAsin1,
                compareAsin2: scope.row.compareAsin2
              }
            })
          }
        },
        {
          name: '删除',
          fn: scope => {
            let params = { taskIds: [scope.row.taskId], ...vm.outerParams }
            this.showConfirmGlobal(
              'keyword/taskKeywordRankRemove',
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
          label: '主图',
          width: 67,
          value: 'imageUrl',
          img: true
        },
        {
          label: 'ASIN',
          value: 'asin',
          width: 130,
          url: true,
          btnClick: scope => {
            return this.cfuns.openASINLink(scope.row.asin)
          }
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
        //123/
        {
          label: '查询类型',
          value: 'adFlag',
          width: 90,
          _enum: {
            0: '自然',
            1: '广告'
          }
        },

        {
          label: '监控状态',
          width: 90,
          value: 'monitorFlag',
          _enum: {
            0: '关闭',
            1: '开启'
          }
        },
        {
          label: '监控开启时间',
          value: 'monitorFrom',
          sortable: 'custom'
        },
        {
          label: '监控结束时间',
          value: 'monitorTo',
          sortable: 'custom'
        },
        {
          label: '监控频率',
          value: 'frequency',
          render(h, scope) {
            let { frequency } = scope.row
            return frequency ? (
              <span style="background: rgb(0,153,153);color: #fff;padding: 4px 10px;border-radius: 4px;">
                {frequency}分
              </span>
            ) : (
              <span>-</span>
            )
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
        }
      ]
    }
  },
  methods: {
    btnFn({ status }) {
      if (status == 1) {
        return [2]
      }
      if (status == 2) {
        return [1, 2]
      }
      if (status == 3 || status > 3) {
        return [2]
      }
    },
    showDialog(id) {
      this.showDialogGlobal(
        `关键词列表`,
        '100%',
        { id: id, url: 'keyword/taskKeywordRankInfo' },
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
        case '修改监控周期':
          params.edit = true
          params.rows = data.map(e => e)
          this.showDialogGlobal(`修改监控周期`, '100%', params, () =>
            import('./dialogs/edit.vue')
          )
          break
        case '关闭监控':
          this.showConfirmGlobal(
            'keyword/taskKeywordRankCloseMonitor',
            params,
            '关闭监控'
          )
          break
        case '开启监控':
          params.rows = data.map(e => e)
          this.showDialogGlobal(`开启监控`, '100%', params, () =>
            import('./dialogs/edit.vue')
          )
          break
        case '删除':
          this.showConfirmGlobal(
            'keyword/taskKeywordRankRemove',
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