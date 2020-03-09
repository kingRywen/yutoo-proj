<template>
  <div>
    <SimpleForm :fields="infoFields" label-width="143px" ref="info"></SimpleForm>
    <ElForm label-width="143px" v-if="$refs.info">
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="购买类目数">
            <ElPopover width="400" placement="bottom" @show="handleShow(0)">
              <ElTable :data="cateList" v-loading="$store.state.loading">
                <ElTableColumn label="类目"></ElTableColumn>
              </ElTable>
              <ElButton type="text" slot="reference" :disabled="!$refs.info.formData.payCategoryNum">
                <b>{{$refs.info.formData.payCategoryNum}}</b>
              </ElButton>
            </ElPopover>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="购买卖家数">
            <ElPopover width="400" placement="bottom" @show="handleShow(1)">
              <ElTable :data="cateList1" v-loading="$store.state.loading">
                <ElTableColumn label="卖家"></ElTableColumn>
              </ElTable>
              <ElButton type="text" slot="reference" :disabled="!$refs.info.formData.paySellerNum">
                <b>{{$refs.info.formData.paySellerNum}}</b>
              </ElButton>
            </ElPopover>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <main-layout
      :fixedH="false"
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      ref="lay"
      editWidth="160px"
      :outerParams="outerParams"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
  </div>
</template>

<script>
import mixin from '@/mixin'
// import { mapActions, mapState } from 'vuex'

export default {
  name: 'Statistic',
  mixins: [mixin],
  props: ['accountId'],
  data() {
    let vm = this
    return {
      cateList: [],
      cateList1: [],
      taskTypeList: [],
      outerParams: {
        accountId: +this.accountId
      },
      listApi: 'clientTaskListAccount',
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
          name: 'account',
          label: '账号',
          disabled: true,
          span: 8
        },
        {
          name: 'errorCase',
          label: '异常情况',
          disabled: true,
          span: 8
        },
        {
          name: 'reviewTime',
          label: '评价平均间隔时长',
          disabled: true,
          span: 8
        },
        {
          name: 'orderCase',
          label: '未评/已评/总订单数',
          disabled: true,
          span: 8
        },
        {
          name: 'reviewCase',
          label: '好/差/总评价数',
          disabled: true,
          span: 8
        },
        {
          name: 'reviewAbuseNum',
          label: '评价abuse数',
          disabled: true,
          span: 8
        },
        {
          name: 'reviewHelpfulNum',
          label: '评价Helpful数',
          disabled: true,
          span: 8
        },
        {
          name: 'qaNum',
          label: '发AQ数',
          disabled: true,
          span: 8
        },
        {
          name: 'qaNum',
          label: 'AQ Helpful数',
          disabled: true,
          span: 8
        },
        {
          name: 'loginTimes',
          label: '登录次数',
          disabled: true,
          span: 8
        },
        {
          name: 'onLineDuration',
          label: '在线时长(分钟)',
          disabled: true,
          span: 8
        },
        {
          name: 'payTotal',
          label: '购买金额',
          disabled: true,
          span: 8
        },
        {
          name: 'userUnitPrice',
          label: '客单价',
          disabled: true,
          span: 8
        }
        // {
        //   name: 'payCategoryNum',
        //   label: '购买类目数',
        //   disabled: true,
        //   span: 8
        // },
        // {
        //   name: 'paySellerNum',
        //   label: '购买卖家数',
        //   disabled: true,
        //   span: 8
        // }
      ],
      // searchFields: ,
      tableCols: [
        {
          label: '序号',
          prop: 'clientTaskId'
        },
        {
          label: '任务名称',
          prop: 'taskName',
          minWidth: 100
        },
        {
          label: '任务类型',
          prop: 'taskTypeName'
        },
        {
          label: '开始执行时间',
          prop: 'startTime'
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
          // minWidth: 200,
          prop: 'failCause',
          render(h, scope) {
            let { failCause } = scope.row
            // （0-收货人地址异常，1-信用卡异常，2-找不到产品，3-其他）
            return (
              <span>
                {failCause == '0'
                  ? '收货人地址异常'
                  : failCause == '1'
                  ? '信用卡异常'
                  : failCause == '2'
                  ? '找不到产品'
                  : failCause == '3'
                  ? '其他'
                  : ''}
              </span>
            )
          }
        },
        {
          label: '反馈信息',
          // minWidth: 200,
          prop: 'feedback'
        },
        {
          label: '失败日志',
          // minWidth: 200,
          prop: 'reason'
        }
      ]
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (from.name === 'AccountManagementStatistic') {
      next()
      return
    }
    this.getInfo()
    next()
  },
  created() {
    this.getInfo()
    this.getTaskTypeList()
  },
  computed: {
    searchFields() {
      return [
        {
          label: '任务类型',
          name: 'taskTypeId',
          type: 'select',
          options: this.taskTypeList
        },
        {
          label: '任务状态',
          name: 'taskStatus',
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
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleShow(type) {
      let api, name
      if (!type) {
        // 类目数列表
        api = 'taskStatisticsListCategorySys'
        name = 'cateList'
      } else {
        api = 'taskStatisticsListSeller'
        name = 'cateList1'
      }

      this.$api[`main/${api}`]({ accountId: +this.accountId })
        .then(data => {
          this[name] = data
        })
        .catch(err => {})
    },
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    getTaskTypeList() {
      this.$api[`main/taskTypeDropdownList`]({})
        .then(data => {
          this.taskTypeList = data.map(el => ({
            label: el.name,
            value: el.taskTypeId
          }))
        })
        .catch(err => {})
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
      this.$api[`main/taskStatisticsInfoAccount`]({
        accountId: +this.accountId
      })
        .then(data => {
          let { status, ...info } = data.rows
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
