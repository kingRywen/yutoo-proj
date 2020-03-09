<template>
  <NewMainLayout
    ref="layout"
    url="main/mobileList"
    :edit-btns="edits"
    editWidth="90px"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    :searchFields="searchFields"
    :right-edit-btns="editBtns"
    :columns="columns"
  ></NewMainLayout>
</template>
<script>
export default {
  data() {
    return {
      edits: [
        {
          name: '编辑',
          fn: scope => {
            this.$dialog({
              size: 'medium',
              title: '编辑手机',
              params: { mobileId: scope.row.mobileId },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./add.vue')
            })
          }
        },
        {
          name: '充值',
          fn: scope => {
            this.$dialog({
              size: 'small',
              title: '手机充值',
              params: {
                mobile: scope.row.mobile,
                mobileId: scope.row.mobileId
              },
              okBtnText: '已充值',
              component: () => import('./recharge.vue')
            })
          }
        }
      ],
      topBatchBtn: {
        title: '项',
        options: [
          {
            label: '删除'
          }
        ],
        search: {
          field: 'search',
          placeholder: '请输入仓库SKU、ASIN、sellerSKU、平台SKU、标题',
          width: '550px'
        }
      },
      editBtns: [
        {
          name: '新增',
          perm: 'add',
          fn: () => {
            this.$dialog({
              size: 'large',
              title: '新增手机',
              params: {},
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./add.vue')
            })
          }
        },
        {
          name: '导入',
          perm: 'add',
          fn: () => {
            this.$dialog({
              size: 'small',
              title: '导入手机',
              params: {
                type: 'mobile',
                rootVm: this
              },
              component: () => import('./dialogs/importAc')
            })
          }
        }
      ],
      searchFields: {
        mobileCode: {
          label: '手机编号'
        },
        location: {
          label: '手机所在地'
        },
        mobile: {
          label: '手机号码'
        },
        status: {
          label: '状态',
          widget: 'select',
          options: this.$const['APP/status']
        }
      },
      columns: [
        {
          label: '手机编号',
          value: 'mobileCode'
        },
        {
          label: '归属国家',
          value: 'countryCode'
        },
        {
          label: '手机所在地',
          value: 'location'
        },
        {
          label: '手机成本',
          value: 'cost'
        },
        {
          label: '手机号码',
          value: 'mobile'
        },
        {
          label: '运营商',
          value: 'operator'
        },
        {
          label: '手机购买日期',
          value: 'purchaseDate'
        },
        {
          label: '套餐',
          value: 'setMeal'
        },
        {
          label: '状态',
          value: 'status',
          _enum: ['损坏', '正常', '无卡']
        },
        {
          label: '激活日期',
          value: 'activateDate'
        },
        {
          label: '有效日期',
          value: 'validDate',
          sortable: 'custom'
        },
        {
          label: '使用时长',
          value: 'useDuration'
        },
        {
          label: '充值倒计天数',
          value: 'countDown',
          render(h, scope) {
            const { countDown } = scope.row
            return (
              <span class={countDown != null && countDown <= 5 ? 'danger' : ''}>
                {countDown == null ? '-' : countDown}
              </span>
            )
          }
        },
        {
          label: '充值总额',
          value: 'payMoney'
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      val = val[0]
      if (val === '删除') {
        this.del(sel.map(el => ({ mobileId: el.mobileId })))
      }
    },
    del(ids) {
      this.showTips({ msg: '是否删除手机账号？' }, () => {
        return this.$api[`main/mobileRemove`](ids)
      })
    }
  }
}
</script>