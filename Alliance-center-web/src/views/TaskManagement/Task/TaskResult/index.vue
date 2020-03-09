<template>
  <keep-alive>
    <div v-if="$route.name === 'TaskResult'">
      <SimpleForm :fields="infoFields" ref="info"></SimpleForm>
      <main-layout
        :btns="btns"
        :sideBar="false"
        :search-fields="searchFields"
        :loadData="loadData"
        :edits="edits"
        ref="lay"
        editWidth="160px"
        :tableCols="tableCols"
        :outerParams="outerParams"
        @treeCurrentChange="handleTreeCurrentChange"
      ></main-layout>
    </div>
    <router-view v-else></router-view>
  </keep-alive>
</template>

<script>
import mixin from '@/mixin'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TaskResult',
  mixins: [mixin],
  props: ['taskId'],
  data() {
    let vm = this
    return {
      outerParams: {},
      listApi: 'taskSubList',
      btns: [],
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
      edits: [
        {
          name: '查看账号执行结果',
          show: scope => {
            return scope.row.status === 1 || scope.row.status === 2
          },
          fn: (scope, item) => {
            vm.$router.push({
              name: 'AccountResult',
              params: {
                taskId: scope.row.taskId,
                taskSubParamId: scope.row.taskSubParamId
              }
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
          prop: 'taskSubId'
        },
        {
          label: '任务类型',
          prop: 'taskTypeId',
          render(h, scope) {
            let { taskTypeId } = scope.row,
              str
            let el = vm.taskTypeList.find(el => el.value === taskTypeId)
            if (el) {
              str = el.label
            }
            return <span>{str || '-'}</span>
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
              return <span class="success">暂存中</span>
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
  beforeRouteUpdate(to, from, next) {
    if (from.name === 'TaskResult') {
      next()
      return
    }
    this.getInfo()
    next()
  },
  created() {
    this.outerParams.taskId = this.$route.params.taskId
    if (!this.taskTypeList.length) {
      this.getTaskTypeList()
    }
    this.getInfo()
  },
  computed: {
    ...mapState(['taskTypeList'])
  },
  methods: {
    ...mapActions(['getTaskTypeList']),
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
      this.$api[`main/taskInfo`]({ taskId: this.taskId })
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
