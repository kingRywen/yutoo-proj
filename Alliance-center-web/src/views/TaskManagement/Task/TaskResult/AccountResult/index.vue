<template>
  <div class="flex-col">
    <SimpleForm :fields="infoFields" ref="info"></SimpleForm>
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      :outerParams="outerParams"
      ref="lay"
      editWidth="160px"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
  </div>
</template>

<script>
import mixin from '@/mixin'
// import { mapActions, mapState } from 'vuex'

export default {
  name: 'AccountResult',
  mixins: [mixin],
  props: ['taskId', 'taskSubParamId'],
  data() {
    let vm = this
    return {
      listApi: 'taskSubParamList',
      outerParams: {
        taskId: this.taskId,
        taskSubParamId: this.taskSubParamId
      },
      btns: [],
      edits: [],
      infoFields: [
        {
          name: 'merchantEmail',
          label: '商户邮箱',
          disabled: true,
          span: 8
        },
        {
          name: 'taskName',
          label: '任务名称',
          disabled: true,
          span: 8
        },
        {
          name: 'targetProductId',
          label: '目标产品ID',
          disabled: true,
          span: 8
        },
        {
          name: 'productName',
          label: '产品名称',
          disabled: true,
          span: 8
        },
        {
          name: 'status',
          label: '任务状态',
          disabled: true,
          span: 8
        },
        {
          name: 'createTime',
          label: '创建时间',
          disabled: true,
          span: 8
        },
        // {
        //   name: 'taskName',
        //   label: '任务类型',
        //   disabled: true,
        //   span: 8
        // },
        {
          name: 'taskProgress',
          label: '任务进度',
          disabled: true,
          span: 8
        },
        {
          name: 'performance',
          label: '完成情况',
          disabled: true,
          span: 8
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
          label: '序号',
          prop: 'taskSubParamId'
        },
        {
          label: '账号',
          prop: 'account'
        },
        {
          label: '虚拟机名称',
          prop: 'vmName',
          minWidth: 100
        },
        {
          label: '计划执行时间',
          prop: 'planStartTime'
        },
        {
          label: '实际执行时间',
          prop: 'realStartTime'
        },
        {
          label: '任务状态',
          prop: 'status',
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
          label: '上一个执行步骤',
          prop: 'currentOperation'
        },
        {
          label: '执行结果',
          prop: 'result',
          render(h, scope) {
            let { result } = scope.row
            if (result === 0) {
              return <span class="success">成功</span>
            }
            if (result === 1) {
              return <span class="danger">失败</span>
            }
          }
        },

        {
          label: '失败原因',
          prop: 'failCause',
          render(h, scope) {
            let { failCause } = scope.row,
              name
            // 0-收货人地址异常，1-信用卡异常，2-找不到产品，3-其他
            if (failCause == 0) {
              name = '收货人地址异常'
            }
            if (failCause == 1) {
              name = '信用卡异常'
            }
            if (failCause == 2) {
              name = '找不到产品'
            }
            if (failCause == 3) {
              name = '其他'
            }
            return <span>{name}</span>
          }
        },
        {
          label: '反馈信息',
          prop: 'feedback',
          width: 200,
          wrap: true
        },
        {
          label: '失败日志',
          minWidth: 200,
          prop: 'reason'
        }
      ]
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (from.name === 'AccountResult') {
      next()
      return
    }
    this.getInfo()
    next()
  },
  created() {
    this.getInfo()
  },
  // computed: {
  //   ...mapState(['taskTypeList'])
  // },
  methods: {
    // ...mapActions(['getTaskTypeList']),
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
    },
    getInfo() {
      this.$api[`main/taskSubParamInfo`]({
        taskId: this.taskId,
        taskSubParamId: this.taskSubParamId
      })
        .then(data => {
          let { status, ...info } = data.rows
          if (status === 0) {
            status = '未开始'
          }
          if (status === 1) {
            status = '进行中'
          }
          if (status === 2) {
            status = '已完成'
          }
          // if (status === 3) {
          //   status = '未完成'
          // }
          this.$refs.info.setData({ ...info, status })
        })
        .catch(err => {})
    }
  }
}
</script>

<style>
</style>
