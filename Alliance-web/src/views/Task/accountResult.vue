<template>
  <div>
    <SimpleForm :fields="infoFields" ref="info"></SimpleForm>
    <main-layout
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :loadNode="_loadNode"
      ref="lay"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  created() {
    this.getTaskType().then(() => {
      // let el = this.searchFields[0]
      // el.options = this.taskType
      // this.searchFields.splice(0, 1, el)
      let el = this.infoFields[2]
      el.options = this.taskType
      this.infoFields.splice(2, 1, el)
    })

    this.getData()
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.info.setData(this.$route.query)
    })
  },
  computed: {
    ...mapState(['taskType'])
  },
  data() {
    let vm = this
    return {
      infoFields: [
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
          name: 'taskTypeId',
          label: '任务类型',
          type: 'select',
          disabled: true,
          options: [],
          bind: {
            label: 'value',
            value: 'key'
          },
          span: 8
        },
        {
          name: 'status',
          label: '任务状态',
          disabled: true,
          span: 8,
          type: 'select',
          options: [
            { label: '未开始', value: 0 },
            { label: '进行中', value: 1 },
            { label: '已完成', value: 2 },
            { label: '已取消', value: 3 }
          ]
        },
        {
          name: 'createTime',
          label: '创建时间',
          disabled: true,
          span: 8
        },
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
          name: 'status',
          label: '任务状态',
          type: 'select',
          options: [
            { label: '未开始', value: '0' },
            { label: '进行中', value: '1' },
            { label: '已完成', value: '2' }
          ]
        },
        {
          name: 'result',
          label: '执行结果',
          type: 'select',
          options: [
            {
              label: '成功',
              value: '0'
            },
            {
              label: '失败',
              value: '1'
            }
          ]
        }
      ],
      tableCols: [
        {
          label: '序号',
          render(h, scope) {
            return <span>{scope.$index + 1}</span>
          }
        },
        {
          label: '账号',
          prop: 'account'
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
            // ：0-未开始；1-进行中；2-已完成；3-已取消；
            if (status === 0) {
              return <span>未开始</span>
            }
            if (status === 1) {
              return <span class="warning">进行中</span>
            }
            if (status === 2) {
              return <span class="success">已完成</span>
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
            return scope.row.result == null ? (
              <span>-</span>
            ) : (
              <span class={scope.row.result === 0 ? 'success' : 'danger'}>
                {scope.row.result === 0 ? '成功' : '失败'}
              </span>
            )
          }
        },
        {
          label: '失败原因',
          prop: 'failCause',
          render(h,scope) {
            let {failCause} = scope.row, name
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
          },
        },
        {
          label: '反馈信息',
          prop: 'feedback',
          width: 200,
          wrap: true
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getTaskType']),

    getData() {
      this.$api[`main/taskSubParamInfo`]({
        taskSubParamId: this.$route.query.taskId
      })
        .then(data => {
          let { taskSubList, ...info } = data.rows
          this.$refs.info.setData(info)
        })
        .catch(err => {})
    },

    // 列表
    loadData(data) {
      return this.$api[`main/taskSubParamList`]({
        ...data,
        taskSubParamId: this.$route.query.taskId + ''
      })
        .then(data => {
          return Promise.resolve(data)
        })
        .catch(err => {})
    },
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    }
  }
}
</script>

<style>
</style>
