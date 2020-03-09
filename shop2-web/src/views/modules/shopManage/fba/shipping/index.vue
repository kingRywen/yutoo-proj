<template>
  <main-layout
    :outerParams="storeInfo"
    :searchFields="searchFields"
    :columns="columns"
    edit-width="160px"
    tbRightFixed="right"
    :right-edit-btns="editBtns"
    :edit-btns="edits"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    url="fba/FbaReplenishTransportPage"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  data() {
    const tranType = this.$const['FBA/tranType']
    return {
      searchFields: {
        transportName: {
          placeholder: '运输方式名称'
        },
        transportType: {
          placeholder: '运输类型',
          widget: 'select',
          options: tranType
        }
      },
      topBatchBtn: {
        title: '运输方式',
        options: [
          {
            label: '删除'
          }
        ]
      },
      editBtns: [
        {
          name: '添加',
          perm: 'addTask',
          fn: () => {
            this.add()
          }
        }
      ],
      edits: [
        {
          name: '编辑',
          perm: 'addTask',
          fn: scope => {
            this.add(scope.row)
          }
        },
        {
          name: '删除',
          perm: 'addTask',
          fn: scope => {
            this.del([scope.row.transportId])
          }
        }
      ],
      columns: [
        {
          label: '名称',
          value: 'transportName'
        },
        {
          label: '运输类型',
          value: 'transportType',
          _enum: this.cfuns.arrayToObj(tranType)
        },
        {
          label: '运输天数',
          value: 'shippingDays'
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      if (val[0] == '删除') {
        //
        this.del(sel.map(e => e.transportId))
      }
    },
    del(transportIds) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`fba/FbaReplenishTransportDelete`](transportIds)
      })
    },
    add(edit) {
      this.$_dialog({
        size: 'medium',
        title: `${edit ? '编辑' : '添加'}运输方式`,
        params: { transportInfo: edit },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./add.vue')
      })
    }
  }
}
</script>