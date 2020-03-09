<template>
  <div>
    <new-main-layout
      :searchFields="searchFields"
      ref="layout"
      url="main/taskSourceList"
      :columns="columns"
      :edit-btns="edits"
      :btnFn="btnFn"
      :edit-width="110"
      :cell-class-name="cellClassName"
      @left-batch-change="handleLeftBatchChange"
      :searchFunc="searchFunc"
      :treeTable="false"
    >
      <!-- <el-button type="text" slot="topleft" @click="view">佣金配置</el-button> -->
    </new-main-layout>
    <yt-dialog :options="options" :events="events">
      <AssignTask ref="AssignTask" :task-source="true" />
    </yt-dialog>
  </div>
</template>

<script>
import AssignTask from './AssignTask'

export default {
  name: 'taskSource',
  components: {
    AssignTask
  },
  data() {
    let vm = this
    return {
      // editBtns: [
      //   {
      //     name: '分配任务',
      //     show: true,
      //     fn: () => {
      //       vm.options.visible = true
      //     }
      //   }
      // ],
      events: {
        handleOkClick() {
          return vm.submitAssignTask()
        },
        close() {
          // vm.$refs.
        }
      },
      options: {
        title: '分配任务',
        width: '800px',
        visible: false,
        okBtnText: '分配',
        cancelBtnText: '取消'
      },
      // topBatchBtn: {
      //   title: '项',
      //   options: [
      //     {
      //       label: '审核'
      //     }
      //   ]
      // },

      edits: [
        {
          name: '查看',
          perm: 'add',
          fn: scope => {
            let { href } = this.$router.resolve({
              path: `/TaskManagement/Task/view/${scope.row.taskSourceId}`
              // params: {
              //   id: scope.row.taskSourceId
              // }
            })
            window.open(href)
          }
        }
        // {
        //   name: '编辑',
        //   fn: scope => {
        //     const { href } = this.$router.resolve({
        //       path: '/task/source/edit',
        //       query: {
        //         id: scope.row.taskSourceId
        //       }
        //     })
        //     window.open(href)
        //   }
        // },
        // {
        //   name: '审核',
        //   fn: scope => {
        //     this.$dialog({
        //       size: 'small',
        //       title: '任务审核',
        //       params: { taskSourceId: scope.row.taskSourceId },
        //       cancelBtnText: '取消',
        //       okBtnText: '确认',
        //       component: () => import('./dialogs/audit.vue')
        //     })
        //   }
        // },
        // {
        //   name: '反馈',
        //   fn: scope => {
        //     this.feedback(scope)
        //   }
        // },
        // {
        //   name: '中止任务',
        //   fn: scope => {
        //     this.$dialog({
        //       size: 'small',
        //       title: '中止任务',
        //       params: { taskSourceId: scope.row.taskSourceId },
        //       cancelBtnText: '取消',
        //       okBtnText: '确认',
        //       component: () => import('./dialogs/suspend.vue')
        //     })
        //   }
        // },
        // {
        //   name: '重新筛选账号',
        //   fn: scope => {
        //     this.showTips({ msg: '是否确认重新筛选账号？' }, () => {
        //       return this.$api[`main/taskSourceReFilterAccount`]({
        //         taskSourceId: scope.row.taskSourceId
        //       })
        //     })
        //   }
        // }
      ],
      searchFields: {
        platformSiteId: {
          label: '平台站点',
          widget: 'cascader',
          clearable: true,
          width: '100%',
          options: this.$store.state.platformSite
        },
        merchantEmail: {
          width: '100%',
          label: '商户邮箱'
        },
        terminalType: {
          widget: 'select',
          label: '终端类型',
          options: '$const.OTHER/termnalType'
        },
        sellerName: {
          label: '店铺名称'
        },
        productId: {
          label: '产品ID'
        },
        parentProductId: {
          label: '父产品ID'
        },
        taskTypeId: {
          label: '任务类型',
          widget: 'select',
          options: this.$const['OTHER/taskType'].concat({
            label: '带评购买',
            value: 8
          })
        },
        status: {
          label: '任务状态',
          widget: 'select',
          options: '$const.OTHER/tskSosStats'
        },
        publishTime: {
          label: '发布时间',
          widget: 'daterange',
          width: '100%'
        },
        // waitProvide: {
        //   label: '待提供内容',
        //   widget: 'select',
        //   options: [
        //     {
        //       label: '无需',
        //       value: 0
        //     },
        //     {
        //       label: '评价',
        //       value: 1
        //     }
        //   ]
        // },
        taskSourceId: {
          label: '任务ID'
        },
        askForReview: {
          label: ' ',
          widget: 'checkbox',
          // width: 240,
          span: 1,
          labelWidth: '20px',
          options: [
            {
              label: '可索评',
              value: 1
            }
          ]
        },
        // recycleProductFlag: {
        //   label: ' ',
        //   span: 1,
        //   widget: 'checkbox',
        //   // width: 240,
        //   labelWidth: '50px',
        //   options: [
        //     {
        //       label: '商品回收',
        //       value: 1
        //     }
        //   ]
        // },
        exceptionFlag: {
          label: ' ',
          span: 1,
          widget: 'checkbox',
          // width: 240,
          labelWidth: '90px',
          options: [
            {
              label: '是否有异常',
              value: 1
            }
          ]
        }
      },
      columns: [
        {
          label: '任务ID',
          value: 'taskSourceId',
          width: 80
        },
        {
          label: '主图',
          img: true,
          width: 65,
          value: 'imgUrl'
        },
        {
          type: 'array',

          minWidth: 140,
          children: [
            {
              label: '商户邮箱',

              value: 'merchantEmail'
            },
            {
              label: '店铺名称',
              showTooltip: true,
              value: 'sellerName'
            }
          ]
        },
        {
          type: 'array',
          width: 110,
          children: [
            {
              label: '产品ID',
              value: 'productId'
            },
            {
              label: '父产品ID',
              value: 'parentProductId'
            }
          ]
        },
        {
          type: 'array',
          width: 95,
          children: [
            {
              label: '平台',
              value: 'platform'
            },
            {
              label: '站点',
              value: 'site'
            }
          ]
        },

        {
          type: 'array',
          width: 70,
          children: [
            {
              label: '终端类型',

              value: 'terminalType',
              _enum: {
                1: '手机',
                2: 'PC'
              }
            }
            // {
            //   label: '商品回收',
            //   value: 'recycleProductFlag',
            //   _enum: {
            //     1: '是',
            //     0: '否'
            //   }
            // }
          ]
        },
        {
          type: 'array',
          width: 100,
          children: [
            {
              label: '任务类型',
              value: 'taskTypeId',
              _enum: {
                1: '免评购买',
                2: '文字评价',
                3: '图片评价',
                4: '加购物车',
                5: '加Wishlist',
                6: '发布QA',
                7: '评价点Helpful',
                8: '带评购买'
              }
            },
            {
              label: '数量',
              value: 'taskNum'
            }
          ]
        },
        {
          label: '佣金',
          // width: 100,
          value: 'brokerage'
        },
        {
          type: 'array',
          width: 100,
          children: [
            {
              label: '产品金额',
              value: 'productMoney'
            },
            {
              label: '实际购买金额',
              value: 'realBuyMoney',

              render(h, scope) {
                const { orderNumCount, realBuyMoney } = scope.row
                return orderNumCount ? (
                  <div class="link-wrapper-1">
                    {realBuyMoney}({orderNumCount})
                  </div>
                ) : (
                  <span>-</span>
                )
              }
            }
          ]
        },
        {
          label: '订单号',
          width: 230,
          noTooltip: true,
          value: 'orderNum',
          render(h, scope) {
            const { orderNumCount, orderNum, taskTypeId } = scope.row
            if (taskTypeId > 3 || !orderNumCount) {
              return <span>-</span>
            }
            return (
              <div class="link-wrapper-1">
                {orderNum}({orderNumCount})
              </div>
            )
          }
        },
        {
          label: '任务状态',
          width: 110,
          value: 'status',
          render: (h, scope) => {
            const list = this.$const['OTHER/tskSosStats']
            const el = list.find(el => el.value === scope.row.status)
            return (
              <span
                class={
                  scope.row.status == 1 || scope.row.status == 7 ? 'danger' : ''
                }
              >
                {scope.row.status == 1 || scope.row.status == 7 ? (
                  scope.row.noPassCause ? (
                    <el-tooltip
                      placement="top"
                      content={scope.row.noPassCause}
                      effect="dark"
                    >
                      <div>
                        <el-button
                          class="el-icon-warning danger"
                          type="text"
                          style="margin-right:4px"
                        ></el-button>
                        {el.label}
                      </div>
                    </el-tooltip>
                  ) : (
                    <div>
                      <el-button
                        class="el-icon-warning danger"
                        type="text"
                        style="margin-right:4px"
                      ></el-button>
                      {el.label}
                    </div>
                  )
                ) : (
                  el.label
                )}
              </span>
            )
          }
        },
        {
          type: 'array',
          width: 75,
          children: [
            {
              label: '进度1',
              value: 'planOne',
              headerTooltip: '已完成任务数/总任务数'
            },
            {
              label: '进度2',
              value: 'planTwo',
              headerTooltip: '"-" 表示无评价'
            }
          ]
        },
        {
          type: 'array',
          width: 140,
          children: [
            {
              label: '发布时间',
              value: 'publishTime'
            },
            {
              label: '完成时间',
              value: 'completeTime'
            }
          ]
        },
        {
          label: '反馈',
          // url: true,
          // showBtn: true,
          minWidth: 140,
          // btnClick: scope => {
          //   this.feedback(scope)
          // },
          numField: 'feedbackCount',
          value: 'feedback'
        },
        {
          label: '异常',
          width: 50,
          // url: true,
          noVal: true,
          btnBg: 'danger',
          // showBtn: true,
          // btnClick: scope => {
          //   this.$dialog({
          //     size: 'medium',
          //     title: '异常账号列表',
          //     params: { taskSourceId: scope.row.taskSourceId },
          //     cancelBtnText: '关闭',
          //     component: () => import('./dialogs/errAct.vue')
          //   })
          // },
          numField: 'exceptionNum',
          // numField: 'feedbackCount',
          value: 'exception'
        }

        // {
        //   type: 'array',
        //   width: 90,
        //   children: [
        //     {
        //       label: '待提供内容',
        //       value: 'waitProvide',
        //       _enum: ['-', '评价']
        //     },
        //     {
        //       label: '提供条数',
        //       value: 'contentCount'
        //     }
        //   ]
        // }
      ]
    }
  },
  created() {
    this.$store.dispatch('getPlatformSite')
  },
  watch: {
    '$store.state.platformSite'(val) {
      this.searchFields.platformSiteId.options = val
    }
  },
  methods: {
    btnFn() {
      return [0]
    },
    // feedback(scope) {
    //   this.$dialog({
    //     title: '反馈',
    //     size: 'large',
    //     height: '620px',
    //     params: {
    //       taskSourceId: scope.row.taskSourceId,
    //       dialog: true
    //     },
    //     okBtnText: '提交反馈',
    //     cancelBtnText: '取消',
    //     component: () => import('./Feedback')
    //   })
    // },
    view() {
      this.$dialog({
        size: 'medium',
        title: '佣金配置',
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/moneySetting.vue')
      })
    },
    submitAssignTask() {
      let table = this.$refs.AssignTask.$refs.lay
      if (!table.selection.length) {
        this.$message.warning('请选择要分配的任务')
        return Promise.reject()
      }
      let obj = {
        userIdArray: this.$refs.AssignTask.$refs.form.formData.userIdArray,
        taskIdArray: table.selection.map(el => el.taskId || el.taskSourceId)
      }
      return this.$api[`main/taskSourceAllot`](obj)
        .then(data => {
          this.$message.success(data.rows)
          table.getList()
          return Promise.reject()
        })
        .catch(err => {})
    },
    handleLeftBatchChange(val, sel) {
      val = val[0]
      if (val === '审核') {
        this.$dialog({
          size: 'small',
          title: '任务审核',
          params: {
            taskSourceId: sel.map(el => el.taskSourceId).join(','),
            batch: true
          },
          cancelBtnText: '取消',
          okBtnText: '确认',
          component: () => import('./dialogs/audit.vue')
        })
      }
    },
    // eslint-disable-next-line no-unused-vars
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property == 'orderNum') {
        return 'no-over'
      }
    },
    searchFunc(data) {
      let {
        platformSiteId = [],
        publishTime = [],
        askForReview = [],
        recycleProductFlag = [],
        exceptionFlag = [],
        ...info
      } = data
      const [queryStartPublishTime, queryEndPublishTime] = publishTime || []
      return {
        ...info,
        platformSiteId: (platformSiteId || []).slice().pop(),
        blagReviewFlag: askForReview[0],
        recycleProductFlag: recycleProductFlag[0],
        exceptionFlag: exceptionFlag[0],
        queryStartPublishTime,
        queryEndPublishTime
      }
    },

    subscrbTsk() {
      this.$router.push({
        path: '/addTask'
      })
    }
  }
}
</script>

<style lang="scss">
.no-over {
  .cell {
    overflow: initial !important;
  }
}
</style>
