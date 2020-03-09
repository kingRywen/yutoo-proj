<template>
  <div>
    <main-layout
      :searchFields="searchFields"
      ref="layout"
      url="agent/taskSourceList"
      :columns="columns"
      :edit-btns="edits"
      :btnFn="btnFn"
      :edit-width="110"
      :right-edit-btns="editBtns"
      :cell-class-name="cellClassName"
      :searchFunc="searchFunc"
      :treeTable="false"
    ></main-layout>
  </div>
</template>

<script>
export default {
  name: 'dash',
  data() {
    let vm = this
    return {
      editBtns: [
        {
          name: '发布任务',
          icon: 'el-icon-plus',
          perm: 'subscribe',
          fn: () => {
            this.subscrbTsk()
          }
        }
      ],
      edits: [
        {
          name: '查看',
          fn: scope => {
            let { href } = this.$router.resolve({
              path: '/viewTask',
              query: {
                id: scope.row.taskSourceId
              }
            })
            window.open(href)
          }
        },
        {
          name: '编辑',
          fn: scope => {
            this.$router.push({
              path: '/editTask',
              query: {
                id: scope.row.taskSourceId
              }
            })
          }
        },
        {
          name: '中止任务',
          fn: scope => {
            this.showTips({ msg: '是否中止任务?' }, () => {
              return this.$api[`agent/taskSourceTermination`]({
                id: scope.row.taskSourceId
              })
            })
          }
        },
        {
          name: '反馈',
          fn: scope => {
            this.feedback(scope)
          }
        },
        {
          name: '快速发布',
          fn: scope => {
            this.$router.push({
              path: '/quickAdd',
              query: {
                id: scope.row.taskSourceId
              }
            })
          }
        },
        {
          name: '删除',
          fn: scope => {
            this.showTips({ msg: '是否删除任务?' }, () => {
              return this.$api[`agent/taskSourceRemove`]({
                id: scope.row.taskSourceId
              })
            })
          }
        },
        {
          name: '索评',
          fn: scope => {
            this.$dialog({
              title: '订单列表',
              size: 'medium',
              params: {
                taskSourceId: scope.row.taskSourceId
              },
              cancelBtnText: '关闭',
              component: () => import('./dialogs/orderList.vue')
            })
          }
        }
      ],
      searchFields: {
        taskSourceId: {
          label: '任务ID',
          labelWidth: '70px'
        },
        platformSiteId: {
          change: data => {
            if (data.platformSiteId.length) {
              vm.searchFields.storeId.hidden = false
              vm.getStoreList(data.platformSiteId.slice().pop())
            } else {
              vm.searchFields.storeId.hidden = true
            }
          },
          labelWidth: '70px',
          width: '100%',
          widget: 'cascader',
          label: '平台站点',
          clearable: true,
          // required: true,
          options: '$store.common.platSite',
          props: {
            label: 'cnName',
            value: 'platformSiteId',
            children: 'childs'
          },
          handler: {
            action: 'common/getPlatSite'
          }
        },
        terminalType: {
          labelWidth: '70px',
          widget: 'select',
          label: '终端类型',
          options: '$const.OTHER/termnalType'
        },
        storeId: {
          label: '店铺名称',
          labelWidth: '70px',
          widget: 'select',
          hidden: true,
          options: []
        },
        productId: {
          label: '产品ID',
          labelWidth: '70px'
        },
        parentProductId: {
          label: '父产品ID',
          labelWidth: '70px'
        },
        taskTypeId: {
          label: '任务类型',
          widget: 'select',
          options: '$const.OTHER/taskType',
          labelWidth: '70px'
        },
        status: {
          label: '任务状态',
          widget: 'select',
          options: '$const.OTHER/tskSosStats',
          labelWidth: '70px'
        },
        publishTime: {
          label: '发布时间',
          widget: 'daterange',
          width: '100%',
          labelWidth: '70px'
        },
        askForReview: {
          label: ' ',
          widget: 'checkbox',
          // width: 240,
          span: 1,
          labelWidth: '10px',
          options: [
            {
              label: '可索评',
              value: 1
            }
          ]
        }
        // recycleProductFlag: {
        //   label: ' ',
        //   span: 1,
        //   widget: 'checkbox',
        //   // width: 240,
        //   labelWidth: '25px',
        //   options: [
        //     {
        //       label: '商品回收',
        //       value: 1
        //     }
        //   ]
        // }
      },
      columns: [
        {
          label: '任务ID',
          value: 'taskSourceId',
          width: 70
        },
        {
          label: '主图',
          img: true,
          width: 65,
          value: 'imgUrl'
        },
        {
          label: '店铺名称',
          minWidth: 80,
          noTooltip: true,
          value: 'sellerName'
        },
        {
          type: 'array',
          width: 130,
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
          width: 80,
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
          width: 75,
          value: 'brokerage'
        },
        {
          type: 'array',
          width: 110,
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
                return realBuyMoney ? (
                  <div class="link-wrapper-1">
                    {realBuyMoney}
                    <el-button
                      type="text"
                      class="link-btn"
                      size="small"
                      onClick={() => {
                        vm.$dialog({
                          title: '实际金额',
                          cancelBtnText: '关闭',
                          params: {
                            taskSourceId: scope.row.taskSourceId
                          },
                          size: 'medium',
                          component: () => import('./dialogs/orderList.vue')
                        })
                      }}
                    >
                      {orderNumCount}
                    </el-button>
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
          width: 280,
          noTooltip: true,
          value: 'orderNum',
          render(h, scope) {
            const { orderNumCount, orderNum, taskTypeId } = scope.row
            if (taskTypeId > 3) {
              return <span>-</span>
            }
            return orderNum ? (
              <div class="link-wrapper-1">
                {orderNum}
                <el-button
                  class="link-btn"
                  type="text"
                  size="small"
                  onClick={e => {
                    e.stopPropagation()

                    vm.$dialog({
                      title: '订单列表',
                      size: 'medium',
                      params: {
                        taskSourceId: scope.row.taskSourceId
                      },
                      cancelBtnText: '关闭',
                      component: () => import('./dialogs/orderList.vue')
                    })
                  }}
                >
                  {orderNumCount}
                </el-button>
              </div>
            ) : (
              <span>-</span>
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
              headerTooltip: '已完成任务数/总任务数',
              render(h, scope) {
                const { planOne, taskNum } = scope.row
                return <span>{planOne ? planOne + '/' + taskNum : '-'}</span>
              }
            },
            {
              label: '进度2',
              value: 'planTwo',
              headerTooltip: '"-" 表示无评价',
              render(h, scope) {
                const { planTwo, taskNum } = scope.row
                return <span>{planTwo ? planTwo + '/' + taskNum : '-'}</span>
              }
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
          url: true,
          showBtn: true,
          minWidth: 140,
          btnClick: scope => {
            this.feedback(scope)
          },
          numField: 'feedbackCount',
          value: 'feedback'
        }
      ]
    }
  },
  methods: {
    getStoreList(platformSiteId) {
      this.$api[`agent/merchantStoreDropdownList`]({ platformSiteId }).then(
        data => {
          this.searchFields.storeId.options = data.rows
            .filter(el => !!el.status)
            .map(el => ({
              label: el.value,
              value: el.key
            }))
        }
      )
    },
    feedback(scope) {
      this.$dialog({
        title: '反馈',
        size: 'large',
        height: '620px',
        params: {
          taskSourceId: scope.row.taskSourceId,
          dialog: true
        },
        okBtnText: '提交反馈',
        cancelBtnText: '取消',
        component: () => import('Views/Feedback')
      })
    },
    btnFn(item) {
      const {
        status,
        removeFlag,
        updateFlag,
        terminationFlag,
        blagReviewFlag
      } = item
      let btns = []

      if (status == 0) {
        btns = [1, 2, 3, 4, 5]
      } else if (status == 1) {
        btns = [1, 2, 3, 6, 4, 5]
      } else if (status == 2 || status == 3) {
        btns = [1, 4, 5]
      } else if (status == 4) {
        if (blagReviewFlag == 1) {
          btns = [1, 2, 3, 6, 7, 5]
        } else {
          btns = [1, 2, 3, 6, 5]
        }
      } else if (status == 5) {
        btns = [1, 5, 6]
      } else if (status == 6) {
        btns = [1, 5]
      } else if (status == 7) {
        btns = [1, 4]
      }
      if (!removeFlag) {
        btns = btns.filter(el => el !== 6)
      }
      if (!updateFlag) {
        btns = btns.filter(el => el !== 2)
      }
      if (!terminationFlag) {
        btns = btns.filter(el => el !== 3)
      }

      return btns
    },
    // eslint-disable-next-line no-unused-vars
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property == 'orderNum') {
        return 'no-over'
      }
    },
    searchFunc(data) {
      const {
        platformSiteId = [],
        publishTime = [],
        recycleProductFlag = [],
        askForReview = [],
        ...info
      } = data
      const [queryStartPublishTime, queryEndPublishTime] = publishTime || []
      return {
        ...info,
        platformSiteId: platformSiteId.slice().pop(),
        blagReviewFlag: askForReview[0] || null,
        recycleProductFlag: recycleProductFlag[0] || null,
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
