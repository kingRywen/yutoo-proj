<template>
  <div class="dispute-manage">
    <twp-page
      url="email/ebayDisputeList"
      reserveSelection="disputeId"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="val => selectData=val"
      ref="page"
      :leftCustom="true"
      @clickBtn="clickBtn"
    >
      <template slot="table">
        <el-table-column label="操作" align="center" width="90px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="处理" v-if="scope.row.disputeState != 3" placement="top" :open-delay="500">
              <i @click="handleDeal(scope.$index, scope.row)" class="iconfont1">&#xe638;</i>
            </el-tooltip>
            <el-tooltip effect="dark" content="备注" placement="top" :open-delay="500">
              <i @click="handleRemark(scope.$index, scope.row)" class="iconfont1">&#xe63b;</i>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </twp-page>
  </div>
</template>

<script>
import mixins from '../mixins.js'
import { mapActions, mapGetters } from 'vuex'
export default {
  mixins: [mixins],
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      logParams: {
        url: '',
        info: {},
        visible: true
      },
      selectData: [],

      btnConfig: [
        {
          name: '手动同步数据',
          fn: () => {
            // vm.synchronous('ebayDisputeSync')
            vm.$refs.page.$dialog({
              title: '手动同步数据',
              width: '580px',
              visible: true,
              component: () => import('../common/syncTime')
            })
          }
        },
        {
          name: '批量操作',
          fn: () => {},
          value: '点击的是批量修改',
          children: [
            {
              name: '批量修改等待我方回复',
              value: '批量修改等待我方回复'
            },
            {
              name: '批量修改等待对方回复',
              value: '批量修改等待对方回复'
            },
            {
              name: '批量处理未付款个案',
              value: '批量处理未付款个案'
            }
          ]
        },
        {
          name: '导出',
          fn: () => {
            vm.exportData('ebayDisputeExport', 'disputeId')
          }
        }
      ],
      searchConfig: [
        {
          value: 'storeIds',
          type: 'multiple',
          placeholder: '订单来源店铺(多选)',
          children: []
        },
        // {
        //   value: 'warehouseIds',
        //   type: 'select',
        //   placeholder: '发货仓库',
        //   children: []
        // },
        // {
        //   value: 'transportIds',
        //   type: 'select',
        //   placeholder: '运输方式',
        //   children: []
        // },
        {
          value: 'searchOrigin',
          type: 'select',
          placeholder: '搜索源',
          children: [
            {
              label: '客户ID',
              value: 'memberId'
            },
            {
              label: '物品ID',
              value: 'itemId'
            },
            {
              label: '产品SKU',
              value: 'productSku'
            },
            {
              label: '平台订单号',
              value: 'orderNumber'
            }
          ]
        },
        {
          value: 'originValue',
          type: 'input'
        },
        {
          value: 'timeLabel',
          type: 'select',
          placeholder: '同步时间',
          children: [
            {
              label: '同步时间',
              value: 1
            },
            {
              label: '开启时间',
              value: 2
            }
          ]
        },
        {
          value: 'time',
          type: 'time'
        },
        {
          value: 'replyState',
          type: 'select',
          placeholder: '回复状态',
          children: [
            {
              label: '等待我方回复',
              value: 1
            },
            {
              label: '等待对方回复',
              value: 2
            }
          ]
        },
        {
          value: 'disputeType',
          type: 'select',
          placeholder: '个案类型',
          children: [
            {
              label: '未收到货',
              value: 1
            },
            {
              label: '描述不符',
              value: 2
            },
            {
              label: '未付款',
              value: 3
            },
            {
              label: '取消交易',
              value: 4
            }
          ]
        },
        {
          value: 'disputeState',
          type: 'select',
          placeholder: '个案状态',
          children: [
            {
              label: '开启',
              value: 1
            },
            {
              label: '已完成',
              value: 2
            }
          ]
        }
      ],
      tableConfig: [
        {
          label: '个案ID',
          value: 'disputeNumber',
          width: '130px'
        },
        {
          label: '产品图片',
          value: 'productImg',
          width: '130',
          img: true,
          style: {
            width: 48,
            height: 48
          }
        },
        {
          label: '产品ID',
          value: 'itemId',
          width: '130px'
        },
        {
          label: '产品SKU',
          value: 'productSku',
          width: '150px',
          href: 'https://www.ebay.com/',
          render: vm.pageJump()
        },
        {
          label: '来源店铺',
          value: 'storeName',
          width: '130px',
          href: 'https://www.ebay.com/',
          render: vm.pageJump()
        },
        {
          label: '平台订单号',
          value: 'orderNumber',
          width: '130px',
          render: vm.orderJump()
        },
        {
          label: '开启时间',
          value: 'disputeTime',
          width: '130px'
        },
        {
          label: '个案类型',
          value: 'disputeTypeName'
        },
        {
          label: '回复状态',
          value: 'replyStateName',
          width: '130px'
        },
        {
          label: '客服人员',
          value: 'serviceName'
        },
        {
          label: '个案状态',
          value: 'disputeStateName'
        },
        {
          label: '同步时间',
          value: 'createTime',
          width: '130px'
        },
        {
          label: '买家名称',
          value: 'memberName',
          width: '130px'
        },
        {
          label: '差评原因备注',
          value: 'remark',
          width: '130px'
        }
      ]
    }
  },
  created() {
    this.getWarehouseList()
    this.getTransportTypeList({
      type: 0
    })
  },
  watch: {
    ebayTransportTypeList(val) {
      if (val) {
        this.searchConfig[2].children = val
      }
    }
  },
  computed: {
    ...mapGetters(['ebayWarehouseList', 'ebayTransportTypeList'])
  },
  methods: {
    ...mapActions(['getWarehouseList', 'getTransportTypeList']),

    clickBtn(val) {
      let vm = this
      let params = {}
      if (val == '批量处理未付款个案') {
        this.$refs.page.$dialog({
          title: '批量处理未付款个案',
          visible: true,
          width: '400px',
          component: () => import('./unpaidCase.vue')
        })
      } else {
        if (this.$editMsg(this.selectData, false)) {
          return
        }
        params.disputeIds = this.selectData.map(item => item.disputeId)
        if (val == '批量修改等待我方回复') {
          params.replyState = 1
        } else if (val == '批量修改等待对方回复') {
          params.replyState = 2
        }
        this.$api[`email/ebayDisputeSetReplyState`](params).then(() => {
          vm.$refs.page.closeForm()
        })
      }
    },
    handleDeal(index, row) {
      console.log(row)
      this.$refs.page.$dialog({
        title: '处理',
        visible: true,
        width: '1200px',
        component: () => import('./deal.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              disputeId: row.disputeId
            }
          }
        ]
      })
    },
    handleRemark(index, row) {
      this.$refs.page.$dialog({
        title: '添加备注',
        visible: true,
        width: '400px',
        component: () => import('./remark.vue'),
        childFn: [
          {
            name: 'getDisputeId',
            params: {
              disputeId: row.disputeId
            }
          }
        ]
      })
    },
    async submitForm(data, title) {
      let vm = this
      switch (title) {
        case '处理':
          vm.$api[`email/ebayDisputeHandleDispute`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        case '添加备注':
          vm.$api[`email/ebayDisputeSaveRemark`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        case '批量处理未付款个案':
          vm.$api[`email/ebayDisputeHandleUnpaidDispute`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        case '手动同步数据':
          vm.$api[`email/ebayDisputeSync`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang='scss'>
.dispute-manage {
  background: #fff;
}
</style>