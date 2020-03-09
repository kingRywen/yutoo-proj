<template>
  <NewMainLayout
    ref="layout"
    url="main/pcList"
    :edit-btns="edits"
    editWidth="90px"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    :searchFields="searchFields"
    :right-edit-btns="editBtns"
    :btnFn="btnFn"
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
              title: '编辑PC',
              params: { pcId: scope.row.pcId },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./add.vue')
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
              title: '新增PC',
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
              title: '导入PC',
              params: {
                rootVm: this
              },
              component: () => import('../App/dialogs/importAc')
            })
          }
        }
      ],
      searchFields: {
        pcCode: {
          label: 'PC编号'
        },
        location: {
          label: 'PC所在地'
        },
        // mobile: {
        //   label: 'PC号码'
        // },
        status: {
          label: '状态',
          widget: 'select',
          options: this.$const['APP/status'].slice(0, 2)
        }
      },
      columns: [
        {
          label: 'PC编号',
          value: 'pcCode'
        },
        {
          label: '归属国家',
          value: 'countryName'
        },
        {
          label: 'PC所在地',
          value: 'location'
        },
        {
          label: 'PC成本',
          value: 'cost'
        },
        // {
        //   label: 'IP',
        //   value: 'ip'
        // },
        {
          label: '状态',
          value: 'status',
          _enum: ['损坏', '正常']
        },
        {
          label: '购买日期',
          value: 'purchaseDate'
        },
        {
          label: '使用时长',
          value: 'useDuration'
        }
      ]
    }
  },
  methods: {
    btnFn() {
      return [0]
    },
    handleLeftBatchChange(val, sel) {
      val = val[0]
      if (val === '删除') {
        this.del(sel.map(el => ({ pcId: el.pcId })))
      }
    },
    del(ids) {
      this.showTips({ msg: '是否删除PC账号？' }, () => {
        return this.$api[`main/pcRemove`](ids)
      })
    }
  }
}
</script>