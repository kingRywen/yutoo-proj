<template>
  <main-layout
    :columns="columns"
    :outerParams="{...storeInfo, siteId: curSiteId}"
    :searchFields="searchFields"
    url="ss/sellingFareList"
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
      edits: [
        {
          name: '编辑',
          perm: 'add',
          fn: scope => {
            this.add(scope.row)
          }
        },
        {
          name: '删除',
          perm: 'add',
          fn: scope => {
            this.del([scope.row])
          }
        },
        {
          name: '设为默认',
          perm: 'add',
          fn: scope => {
            this.setDef(scope.row.templateId)
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
      columns: [
        {
          label: '模板名称',
          value: 'templateName'
        },
        {
          label: '店铺名称',
          value: 'sellerAlias'
        },
        {
          label: '站点',
          value: 'siteName'
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
        }
      ],
      searchFields: {
        searchName: {
          label: '模版名称'
        },
        sellerId: {
          hidden: true,
          label: '适用店铺',
          labelWidth: 96,
          widget: 'select',
          multi: true,
          options: () => this.getStoreList(true)
        },
        defaultFlag: {
          hidden: true,
          label: '是否默认',
          widget: 'select',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        }
      }
    }
  },
  methods: {
    getStoreList(sellingFlag) {
      let params = { ...this.storeInfo, sellingFlag }
      return this.$api[`ss/sellingMySellerList`](params).then(data =>
        data.data.map(e => ({ label: e.sellerAlias, value: e.sellerId }))
      )
    },
    handleLeftBatchChange(val, sel) {
      switch (val[0]) {
        case '删除':
          this.del(sel)
          break

        default:
          break
      }
    },
    add(row) {
      this.$_dialog({
        size: 'medium',
        title: row ? '编辑运费模板' : '添加运费模板',
        params: { row: { ...row }, getStoreList: this.getStoreList.bind(this) },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/add.vue')
      })
    },
    del(sel) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`ss/sellingFareRemove`]({
          platformId: this.storeInfo.platformId,
          templateIds: sel.map(el => el.templateId)
        })
      })
    },
    setDef(templateId) {
      this.showTips({ msg: '此操作将模板设为默认, 是否继续?' }, () => {
        return this.$api[`ss/sellingFareSaveDefault`]({
          platformId: this.storeInfo.platformId,
          templateId
        })
      })
    }
  }
}
</script>