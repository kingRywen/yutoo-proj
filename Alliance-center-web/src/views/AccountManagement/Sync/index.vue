<template>
  <div>
    <main-layout
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
      taskTypeList: [],
      outerParams: {
        // accountId: +this.accountId
      },
      listApi: 'platformOrderList',
      btns: [],
      edits: [
        {
          name: '同步订单',
          show: scope => {
            return scope.row.sync
          },
          fn: scope => {
            return this.$api[`main/platformOrderSyncOrder`]({
              platformOrderId: scope.row.platformOrderId
            })
              .then(data => {
                this.$refs.lay.getList()
              })
              .catch(err => {})
          }
        }
      ],
      // searchFields: ,
      tableCols: [
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '订单ID',
          prop: 'platformOrderId'
        },
        {
          label: '操作类型',
          prop: 'optionType',
          render(h, scope) {
            let { optionType } = scope.row
            return (
              <span>
                {optionType == 0 ? '手动' : optionType == 1 ? '自动' : ''}
              </span>
            )
          }
        },
        {
          label: '商户邮箱',
          prop: 'merchantEmail'
        },
        {
          label: '任务名称',
          prop: 'taskName'
        },
        {
          label: '订单日期',
          prop: 'createTime'
        },
        {
          label: '订单状态',
          prop: 'status',
          render(h, scope) {
            let { status } = scope.row
            if (status == 1) {
              return <span class="info">已支付</span>
            }
            if (status == 2) {
              return <span class="warning">已派送</span>
            }
            if (status == 3) {
              return <span class="success">已完成</span>
            }
          }
        },
        {
          label: '产品ID',
          prop: 'targetProductId'
        },
        {
          label: '物流编号',
          minWidth: 200,
          prop: 'platformOrdersShipmentId'
        }
      ]
    }
  },
  // created() {
  //   this.getInfo()
  // },
  computed: {
    searchFields() {
      return [
        {
          label: '任务名称',
          name: 'taskName'
        },
        {
          label: '订单日期',
          name: 'taskTypeId',
          type: 'date'
        },
        {
          label: '订单状态',
          name: 'status',
          type: 'select',
          options: [
            {
              label: '已支付',
              value: '1'
            },
            {
              label: '已派送',
              value: '2'
            },
            {
              label: '已完成',
              value: '3'
            }
          ]
        }
      ]
    }
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
    },
    getInfo() {
      this.$api[`main/platformOrderList`]({ accountId: +this.accountId })
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
