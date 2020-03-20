<template>
  <main-layout
    :outerParams="{...storeInfo, siteId: $store.state.selling.curSiteId}"
    :searchFields="searchFields"
    :columns="columns"
    url="ss/sellingStrategyList"
    ref="layout"
    :right-edit-btns="editBtns"
    :btnFn="btnFn"
    :edit-btns="edits"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
  ></main-layout>
</template>
  <script>
export default {
  data() {
    const type = this.$const['SS/strategyType']
    return {
      editBtns: [
        {
          name: '添加策略',
          type: 'dropdown',
          btn: 'primary',
          perm: 'add',
          btns: [
            {
              name: '跟卖库存策略',
              perm: 'add',

              fn: () => {
                this.add(0)
              }
            },
            {
              name: '跟卖价格策略',
              perm: 'add',
              fn: () => {
                this.add(1)
              }
            },
            {
              name: '跟卖数量策略',
              perm: 'add',
              fn: () => {
                this.add(2)
              }
            },
            {
              name: '跟卖时间策略',
              perm: 'add',
              fn: () => {
                this.add(3)
              }
            }
            // {
            //   name: '监控频率策略',
            //   perm: 'add',
            //   fn: () => {
            //     this.add(4)
            //   }
            // }
          ]
        }
      ],
      edits: [
        {
          name: '编辑',
          perm: 'add',
          fn: scope => {
            this.add(scope.row.strategyType, scope.row.strategyId)
          }
        },
        {
          name: '删除',
          perm: 'add',
          fn: scope => {
            this.del([scope.row.strategyId])
          }
        },
        {
          name: '设为默认',
          perm: 'add',
          fn: scope => {
            this.setDef(scope.row.strategyId)
          }
        }
      ],
      topBatchBtn: {
        title: '策略',
        options: [
          {
            label: '删除'
          }
        ]
      },
      searchFields: {
        strategyType: {
          label: '策略类型',
          options: type,
          widget: 'select'
        },
        strategyName: { hidden: true, label: '策略名称' },
        defaultFlag: {
          hidden: true,
          label: '是否默认',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ],
          widget: 'select'
        }
      },
      columns: [
        {
          label: '策略名称',
          value: 'strategyName'
        },
        {
          label: '策略类型',
          value: 'strategyType',
          _enum: this.cfuns.arrayToObj(type)
        },
        {
          label: '是否默认',
          value: 'defaultFlag',
          _enum: {
            true: '是',
            false: '否'
          }
        },
        {
          label: '创建时间',
          value: 'createTime'
        },
        {
          label: '更新时间',
          value: 'updateTime'
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      if (val[0] == '删除') {
        this.del(sel.map(e => e.strategyId))
      }
    },
    btnFn(row) {
      if (!row.defaultFlag) {
        return [1, 2, 3]
      }
      return [1, 2]
    },
    setDef(strategyId) {
      this.showTips({ msg: '此操作将设置策略为默认, 是否继续?' }, () => {
        return this.$api[`ss/sellingStrategySaveDefault`]({
          strategyId,
          ...this.storeInfo
        })
      })
    },
    del(strategyIds) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`ss/sellingStrategyRemove`]({
          ...this.storeInfo,
          strategyIds
        })
      })
    },
    add(type, strategyId) {
      switch (type) {
        case 0:
          this.$_dialog({
            size: 'medium',
            title: `${strategyId ? '编辑' : '添加'}跟卖库存策略`,
            params: { strategyId },
            cancelBtnText: '取消',
            okBtnText: '确认',
            component: () => import('./dialogs/addInvoture.vue')
          })
          break
        case 1:
          this.$_dialog({
            size: 'medium',
            title: `${strategyId ? '编辑' : '添加'}跟卖价格策略`,
            params: { strategyId },
            cancelBtnText: '取消',
            okBtnText: '确认',
            component: () => import('./dialogs/addPrice.vue')
          })
          break
        case 2:
          this.$_dialog({
            size: 'medium',
            title: `${strategyId ? '编辑' : '添加'}跟卖数量策略`,
            params: { strategyId },
            cancelBtnText: '取消',
            okBtnText: '确认',
            component: () => import('./dialogs/addNum.vue')
          })
          break
        case 3:
          this.$_dialog({
            size: 'medium',
            title: `${strategyId ? '编辑' : '添加'}跟卖时间策略`,
            params: { strategyId },
            cancelBtnText: '取消',
            okBtnText: '确认',
            component: () => import('./dialogs/addTime.vue')
          })
          break
        case 4:
          this.$_dialog({
            size: 'medium',
            title: `${strategyId ? '编辑' : '添加'}跟卖监控频率策略`,
            params: { strategyId },
            cancelBtnText: '取消',
            okBtnText: '确认',
            component: () => import('./dialogs/addFrequency.vue')
          })
          break

        default:
          break
      }
    }
  }
}
</script>