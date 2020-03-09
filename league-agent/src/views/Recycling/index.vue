<template>
  <main-layout
    :searchFields="searchFields"
    ref="layout"
    url="agent/merchantProductRecycleList"
    :columns="columns"
    :edit-btns="edits"
    :btnFn="btnFn"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    edit-width="120px"
    :searchFunc="searchFunc"
    :treeTable="false"
  ></main-layout>
</template>
<script>
export default {
  data() {
    return {
      topBatchBtn: {
        title: '项',
        options: [
          {
            label: '申请出库'
          },
          {
            label: '取消出库'
          }
        ]
      },
      searchFields: {
        platformSiteId: {
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
        storeId: {
          widget: 'select',
          options: '$store.common/activeStoreList',
          handler: {
            action: 'common/getStore'
          },
          label: '店铺名称'
        },
        productId: {
          label: '产品ID'
        },
        parentProductId: {
          label: '父产品ID'
        },
        status: {
          widget: 'select',
          options: '$const.OTHER/recklstats',
          label: '回收状态'
        }
      },
      columns: [
        {
          label: '任务ID',
          width: 60,
          value: 'taskSourceId'
        },
        {
          label: '主图',
          width: 65,
          img: true,
          value: 'imgUrl'
        },
        {
          label: '店铺名称',
          minWidth: 200,
          value: 'sellerName'
        },
        {
          type: 'array',
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
          // width: 80,
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
          label: '商品数量',
          // width: 70,
          value: 'productNum'
        },
        {
          label: '回收状态',
          value: 'status',
          render: (h, scope) => {
            const { status, noPassCause } = scope.row
            const list = this.$const['OTHER/recklstats']
            const el = list.find(el => el.value === status)
            return (
              <span class={status == 4 ? 'danger' : ''}>
                {status == 4 ? (
                  <el-tooltip
                    placement="top"
                    content={noPassCause}
                    effect="dark"
                  >
                    <el-button
                      class="el-icon-warning danger"
                      type="text"
                      style="margin-right:4px"
                    ></el-button>
                  </el-tooltip>
                ) : null}
                {el.label}
              </span>
            )
          }
        },
        {
          type: 'array',
          // width: 140,
          children: [
            {
              label: '入库时间',
              value: 'inTime'
            },
            {
              label: '出库时间',
              value: 'outTime'
            }
          ]
        },
        {
          label: '总金额$',
          value: 'totalMoney'
        },
        {
          label: '佣金$',
          value: 'brokerage',
          show: false
        },
        {
          label: '操作费$',
          value: 'handleMoney',
          show: false
        },
        {
          type: 'array',
          children: [
            {
              label: '仓储费$',
              value: 'storageMoney',
              show: false
            },
            {
              label: '已欠仓储费$',
              value: 'storageMoney',
              show: false,
              render(h, scope) {
                return <span class="danger">{scope.row.storageArrears}</span>
              },
              showLabel: false
            }
          ]
        },
        {
          label: '贴标费$',
          value: 'decalsMoney',
          show: false
        },
        {
          label: '打包费$',
          value: 'packMoney',
          show: false
        },
        {
          label: '耗材费$',
          headerTooltip: '含纸箱、胶带等',
          value: 'consumableMoney',
          show: false
        },
        {
          label: '纸箱贴标费$',
          value: 'cartonDecalsMoney',
          show: false
        },
        {
          label: '运费$',
          value: 'freight',
          show: false
        }
      ],
      edits: [
        {
          name: '申请出库',
          fn: scope => {
            this.out([scope.row.productRecycleId], scope.row.status)
          }
        },
        {
          name: '取消出库',
          fn: scope => {
            this.cancelOut([scope.row.productRecycleId])
          }
        }
      ]
    }
  },
  methods: {
    btnFn(item) {
      if (item.status == 2) {
        return [1]
      } else if (item.status == 3) {
        return [2]
      } else if (item.status == 4) {
        return [1, 2]
      } else {
        return []
      }
    },
    handleLeftBatchChange(val, selection) {
      val = val[0]
      const ids = selection.map(el => el.productRecycleId)
      switch (val) {
        case '申请出库':
          this.out(ids)
          break
        case '取消出库':
          this.cancelOut(ids)
          break

        default:
          break
      }
    },
    out(productRecycleIds, status) {
      this.$dialog({
        size: 'medium',
        title: '申请出库',
        params: {
          productRecycleId: productRecycleIds.join(','),
          status
        },
        cancelBtnText: '取消',
        okBtnText: '出库',
        component: () => import('./dialogs/cancelOut.vue')
      })
    },
    cancelOut(ids) {
      this.showTips({ msg: '是否取消出库？' }, () => {
        return this.$api[`agent/merchantProductRecycleCancelOutWarehouse`]({
          idArray: ids
        })
      })
    },
    searchFunc(data) {
      const { platformSiteId = [], ...info } = data
      return { platformSiteId: platformSiteId.slice().pop(), ...info }
    }
  }
}
</script>