<template>
  <div>
    <SimpleForm :fields="infoFields" ref="info"></SimpleForm>
    <main-layout
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
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
      let el = this.searchFields[0]
      el.options = this.taskType
      this.searchFields.splice(0, 1, el)
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
          name: 'status',
          label: '任务状态',
          disabled: true,
          span: 8,
          type: 'select',
          options: [
            { label: '未开始', value: 0 },
            { label: '进行中', value: 1 },
            { label: '已完成', value: 2 }
            // { label: '已取消', value: 3 }
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
      edits: [
        {
          name: '查看账号执行结果',
          show: true,
          fn: (scope, item) => {
            vm.$router.push({
              name: 'accountResult',
              query: { taskId: scope.row.taskSubParamId }
            })
          }
        }
      ],
      searchFields: [
        {
          name: 'taskTypeId',
          label: '任务类型',
          type: 'select',
          options: [],
          bind: {
            label: 'value',
            value: 'key'
          }
        },
        {
          name: 'status',
          label: '任务状态',
          type: 'select',
          options: [
            { label: '未开始', value: '0' },
            { label: '进行中', value: '1' },
            { label: '已完成', value: '2' }
            // { label: '已取消', value: 3 }
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
          label: '任务类型',
          prop: 'taskTypeId',
          render(h, scope) {
            if (!vm.taskType.length) {
              return '-'
            }
            let typeName = vm.taskType.find(
              el => el.key === scope.row.taskTypeId
            )
            if (typeName) {
              typeName = typeName.value
            }
            return <span>{typeName}</span>
          }
        },
        {
          label: '任务数量',
          prop: 'totalNum'
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
          label: '任务进度（已完成/总数）',
          prop: 'taskProgress'
        },
        {
          label: '完成情况（成功/失败）',
          prop: 'performance'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getTaskType']),

    getData() {
      this.$api[`main/taskInfo`]({ taskId: this.$route.query.taskId })
        .then(data => {
          let { taskSubList, ...info } = data.rows
          this.$refs.info.setData(info)
        })
        .catch(err => {})
    },

    // 列表
    loadData(data) {
      return this.$api[`main/taskSubList`]({
        ...data,
        taskId: this.$route.query.taskId
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
