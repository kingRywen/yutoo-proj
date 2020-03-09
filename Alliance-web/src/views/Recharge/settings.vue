<template>
  <NewMainLayout
    ref="layout"
    :edit-btns="edits"
    url="main/paySetList"
    editWidth="90px"
    :searchFields="searchFields"
    :columns="columns"
    :right-edit-btns="editBtns"
    :btnFn="btnFn"
  ></NewMainLayout>
</template>
<script>
export default {
  data() {
    return {
      editBtns: [
        {
          name: '新增',
          show: true,
          fn: () => {
            this.$dialog({
              size: 'medium',
              title: '新增充值设置',
              params: {
                list: this.searchFields.payType.options
              },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./dialogs/add.vue')
            })
            // this.options.visible = true
          }
        }
      ],
      edits: [
        {
          name: '编辑',
          fn: scope => {
            this.edit(scope.row.paySetId)
          }
        },
        {
          name: '激活',
          fn: scope => {
            this.active(scope.row.paySetId)
          }
        },
        {
          name: '删除',
          fn: scope => {
            this.del([scope.row.paySetId])
          }
        }
      ],
      columns: [
        {
          label: '充值方式',
          value: 'payType',
          _enum: []
        },
        {
          label: '收款账号',
          value: 'recipientAccount'
        },

        {
          // 0-发布任务 1-产品差价 2-商品仓储费 3-商品出库费 4-回收操作费
          label: '是否激活',
          value: 'activateFlag',
          _enum: ['否', '是']
        },
        {
          label: '收款备注',
          noTooltip: true,
          minWidth: 500,
          value: 'remark'
        }
      ],
      searchFields: {
        payType: {
          label: '充值方式',
          widget: 'select',
          options: []
        },
        activateFlag: {
          label: '是否激活',
          widget: 'select',
          options: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    edit(id) {
      this.$dialog({
        size: 'medium',
        title: '编辑充值设置',
        params: { id, list: this.searchFields.payType.options },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/add.vue')
      })
    },
    active(id) {
      this.showTips({ msg: '是否激活此充值方式？' }, () => {
        return this.$api[`main/paySetActivating`]({ id })
      })
    },
    del(idArray) {
      this.showTips({ msg: '是否删除此充值方式？' }, () => {
        return this.$api[`main/paySetRemove`]({ idArray })
      })
    },
    btnFn(row) {
      let btn = [0]
      if (!row.activateFlag) {
        btn.push(1)
      }
      btn.push(2)
      return btn
    },
    getList() {
      this.$api[`main/paySetPayType`]().then(data => {
        let arr = Object.keys(data.rows).map(key => ({
          label: data.rows[key],
          value: +key
        }))
        this.columns[0]._enum = data.rows
        this.searchFields.payType.options = arr
      })
    }
  }
}
</script>