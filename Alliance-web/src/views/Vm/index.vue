<template>
  <NewMainLayout
    ref="layout"
    url="main/vmList"
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
              title: '编辑虚拟机',
              params: { vmId: scope.row.vmId },
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
              title: '新增虚拟机',
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
              title: '导入虚拟机',
              params: {
                rootVm: this
              },
              component: () => import('./importVm')
            })
          }
        }
      ],
      searchFields: {
        vmCode: {
          label: '虚拟机编号'
        },
        location: {
          label: '虚拟机所在地',
          labelWidth: '100px'
        },
        ip: {
          label: 'IP'
        },
        status: {
          label: '状态',
          widget: 'select',
          options: [
            {
              label: '正常',
              value: 1
            },
            {
              label: '损坏',
              value: 0
            }
          ]
        }
      },
      columns: [
        {
          label: '虚拟机编号',
          value: 'vmCode'
        },
        {
          label: '虚拟机IP',
          value: 'ip'
        },
        {
          label: '归属国家',
          value: 'countryName'
        },
        {
          label: '虚拟机所在地',
          value: 'location'
        },
        {
          label: '状态',
          value: 'status',
          _enum: ['损坏', '正常']
        },
        {
          label: '创建时间',
          value: 'createTime'
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
        this.del(sel.map(el => ({ vmId: el.vmId })))
      }
    },
    del(ids) {
      this.showTips({ msg: '是否删除虚拟机账号？' }, () => {
        return this.$api[`main/vmRemove`](ids)
      })
    }
  }
}
</script>