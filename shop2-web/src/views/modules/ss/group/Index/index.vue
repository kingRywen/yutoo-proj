<template>
  <main-layout
    :columns="columns"
    :outerParams="{...storeInfo, siteId: curSiteId}"
    :searchFields="searchFields"
    url="ss/sellingGroupList"
    :edit-btns="edits"
    ref="layout"
    :right-edit-btns="editBtns"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
  ></main-layout>
</template>
<script>
export default {
  computed: {
    curSiteId() {
      return this.$store.state.selling.curSiteId
    }
  },

  data() {
    return {
      editBtns: [
        {
          name: '添加',
          perm: 'add',
          fn: () => {
            this.add()
          }
        }
      ],
      topBatchBtn: {
        title: '分组',
        options: [
          {
            label: '删除'
          }
        ]
      },
      searchFields: {
        groupName: {
          label: '分组名称'
        }
      },
      columns: [
        {
          label: '分组名称',
          value: 'groupName'
        },
        {
          label: '创建时间',
          value: 'createTime'
        }
      ],
      edits: [
        {
          name: '编辑',
          perm: 'add',
          fn: scope => {
            this.add(scope.row.groupId, scope.row.groupName)
          }
        },
        {
          name: '删除',
          perm: 'add',
          fn: scope => {
            this.del([scope.row])
          }
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      switch (val[0]) {
        case '删除':
          this.del(sel)
          break

        default:
          break
      }
    },
    add(editId, groupName) {
      this.$_dialog({
        size: 'medium',
        title: editId ? '编辑分组' : '添加分组',
        params: { editId, groupName },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/add.vue')
      })
    },
    del(sel) {
      let params = {
        platformId: this.storeInfo.platformId,
        groupIds: sel.map(e => e.groupId)
      }
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`ss/sellingGroupRemove`](params)
      })
    }
  }
}
</script>