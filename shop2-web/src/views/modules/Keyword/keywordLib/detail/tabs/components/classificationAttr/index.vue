<template>
  <div>
    <main-layout
      :outerParams="{...storeInfo, categoryId, productId}"
      :searchFields="searchFields"
      :columns="columns"
      :edit-btns="edits"
      edit-width="160px"
      :right-edit-btns="editBtns"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="keyword/keywordLibClassifyList"
      ref="layout"
    ></main-layout>
  </div>
</template>
<script>
export default {
  props: ['categoryId', 'productId'],
  data() {
    let edits = []
    let editBtns = [
      {
        name: '添加',
        perm: 'add',
        fn: () => {
          this.add()
        }
      },
      {
        name: '导入',
        perm: 'add',
        fn: () => {
          this.openImport()
        }
      }
    ]
    if (this.productId) {
      editBtns.pop()
    }

    if (this.productId) {
      edits.unshift({
        name: '查看关键词',
        perm: 'addTask',
        fn: scope => {
          this.keywordsMng(
            +scope.row.classifyId,
            scope.row.classifyName,
            'view'
          )
        }
      })
    } else {
      edits.unshift(
        {
          name: '关键词管理',
          perm: 'addTask',
          fn: scope => {
            this.keywordsMng(+scope.row.classifyId, scope.row.classifyName)
          }
        },
        {
          name: '编辑名称',
          perm: 'addTask',
          fn: scope => {
            this.$_dialog({
              size: 'medium',
              title: '编辑分类属性名称',
              params: {
                classifyId: scope.row.classifyId,
                categoryId: this.categoryId,
                classifyName: scope.row.classifyName
              },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./dialogs/editName.vue')
            })
          }
        },
        {
          name: '删除',
          perm: 'addTask',
          fn: scope => {
            this.del([scope.row.classifyId])
          }
        }
      )
    }

    return {
      topBatchBtn: {
        title: '',
        options: [
          {
            label: '删除'
          }
        ]
      },
      searchFields: {
        searchText: {
          placeholder: '分类属性名称'
          // suffix: 'el-icon-search'
        },
        time: {
          widget: 'daterange',
          hidden: true,
          label: '添加时间',
          fields: ['startTime', 'endTime'],
          timeDisabled: 'after'
        }
      },
      columns: [
        {
          label: '分类属性名称',
          value: 'classifyName'
        },
        {
          label: '关联关键词数量',
          value: 'keywordTextCnt'
        }
      ],
      editBtns,
      edits
    }
  },
  methods: {
    keywordsMng(classifyId, classifyName, type) {
      this._openDialog(
        {
          size: 'medium',
          title: '关键词管理',
          params: {
            categoryId: this.categoryId,
            classifyName: classifyName,
            classifyId,
            type
          },
          cancelBtnText: '关闭',
          component: () => import('./dialogs/keywordsMng.vue')
        },
        {},
        {
          close: () => {
            this.getLayoutList()
          }
        }
      )
    },
    add() {
      this._openDialog({
        size: 'medium',
        title: '添加分类属性',
        params: {
          query: {
            categoryId: this.categoryId
          },
          productId: this.productId
        },
        okBtnText: '确认',
        cancelBtnText: '取消',
        component: () =>
          import(`./dialogs/${this.productId ? 'selAdd' : 'add'}.vue`)
      })
    },
    del(classifyIds) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`keyword/keywordLibClassifyRemove`]({
          ...this.storeInfo,
          categoryId: this.categoryId,
          productId: this.productId,
          classifyIds
        })
      })
    },
    openImport() {
      let vm = this
      this._openDialog({
        size: 'medium',
        fullscreen: false,
        title: '导入分类属性',
        params: {
          query: {
            categoryId: this.categoryId,
            importType: 5
          },
          params: {
            fn: () => {
              vm.getLayoutList()
            }
          }
        },
        cancelBtnText: '关闭',
        component: () => import('./dialogs/impt.vue')
      })
    },
    handleLeftBatchChange(val, select) {
      switch (val[0]) {
        case '删除':
          this.del(select.map(el => el.classifyId))
          break

        default:
          break
      }
    }
  }
}
</script>