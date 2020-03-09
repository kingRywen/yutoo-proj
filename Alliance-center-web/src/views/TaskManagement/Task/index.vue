<template>
  <div v-if="$route.name === 'Task'">
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      ref="lay"
      editWidth="160px"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
  </div>
  <router-view v-else />
</template>

<script>
import mixin from '@/mixin'

export default {
  name: 'Task',
  mixins: [mixin],
  data() {
    let vm = this
    return {
      listApi: 'taskList',
      btns: [],
      edits: [
        {
          name: '查看结果',
          show: scope => {
            return scope.row.status === 1 || scope.row.status === 2
          },
          fn: (scope, item) => {
            vm.$router.push({
              name: 'TaskResult',
              params: { taskId: scope.row.taskId }
            })
          }
        }
      ],
      searchFields: [
        {
          label: '商户邮箱',
          name: 'merchantEmail'
        },
        {
          label: '任务名称',
          name: 'taskName'
        },
        {
          label: '终端类型',
          name: 'terminalType',
          type: 'select',
          options: [
            {
              label: '手机',
              value: '1'
            },
            {
              label: 'PC',
              value: '2'
            },
            {
              label: '虚拟机',
              value: '3'
            }
          ]
        },
        {
          label: '任务状态',
          name: 'status',
          type: 'select',
          options: [
            {
              label: '未开始',
              value: 0
            },
            {
              label: '进行中',
              value: 1
            },
            {
              label: '已完成',
              value: 2
            },
            {
              label: '已取消',
              value: 3
            },
            {
              label: '暂存中',
              value: 4
            }
          ]
        },
        {
          name: 'date',
          query: ['queryStartDate', 'queryEndDate'],
          label: '任务时间',
          type: 'dateRange',
          format: 'yyyy-MM-dd'
        }
      ],
      tableCols: [
        {
          label: '商户邮箱',
          prop: 'merchantEmail',
          width: 160
        },
        {
          label: '任务名称',
          prop: 'taskName',
          width: 140
        },
        {
          label: '终端类型',
          prop: 'terminalType',
          width: 70,
          render(h, scope) {
            const { terminalType } = scope.row
            return (
              <span>
                {terminalType == 1
                  ? '手机'
                  : terminalType == 2
                  ? 'PC'
                  : '虚拟机'}
              </span>
            )
          }
        },
        {
          label: '任务来源',
          prop: 'taskSource',
          width: 70,
          render(h, scope) {
            const { taskSource } = scope.row
            return <span>{taskSource == 0 ? '代理端' : '商户端'}</span>
          }
        },
        {
          label: '目标产品ID',
          prop: 'targetProductId'
        },
        {
          label: '产品名称',
          prop: 'productName',
          minWidth: 280
        },
        {
          label: '任务状态',
          prop: 'status',
          width: 70,
          render(h, scope) {
            let { status } = scope.row
            if (status === 0) {
              return <span class="info">未开始</span>
            }
            if (status === 1) {
              return <span class="warning">进行中</span>
            }
            if (status === 2) {
              return <span class="success">已完成</span>
            }
            if (status === 4) {
              return <span>暂存中</span>
            }
          }
        },
        {
          label: '任务进度（已完成/总数）',
          width: 160,
          prop: 'taskProgress'
        },
        {
          label: '完成情况（成功/失败）',
          width: 160,
          prop: 'performance'
        },
        {
          label: '创建时间',
          width: 140,
          prop: 'createTime'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },
  created() {
    this.$store.dispatch('getPlatformSite')
  },
  methods: {
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    edit(row) {
      if (row) {
        this.openAdd('编辑国家', row.countryCode)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑国家', data[0].countryCode)
        }
      }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除此国家？',
          'countryRemove',
          'countryCode'
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(
            data,
            '是否删除此国家？',
            'countryRemove',
            'countryCode'
          )
        }
      }
    }
  }
}
</script>

<style>
</style>
