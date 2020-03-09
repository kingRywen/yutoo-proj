<template>
  <div class="w1100">
    <main-layout
      :outerParams="{...storeInfo,classifyId,categoryId}"
      :searchFields="searchFields"
      :columns="columns"
      :edit-btns="!isView ? edits : []"
      edit-width="160px"
      :right-edit-btns="!isView ? editBtns : []"
      :topBatchBtn="!isView ? topBatchBtn : null"
      @left-batch-change="handleLeftBatchChange"
      url="keyword/keywordLibClassifyKeywordList"
      ref="layout"
    ></main-layout>
  </div>
</template>
<script>
import relatedMixin from '../../common/mixin'
export default {
  mixins: [relatedMixin],
  props: [
    'classifyId',
    'categoryId',
    'productId',
    'classifyName',
    'type',
    'closeM'
  ],
  data() {
    return {
      isView: this.type == 'view',
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
        title: '关键词',
        options: [
          {
            label: '删除'
          }
        ]
      },
      searchFields: {
        searchText: {
          placeholder: '关键词名称'
        }
      },
      columns: [
        {
          label: '关键词',
          value: 'keywordText'
          // editFn: row => {
          //   // console.log(row)
          //   return new Promise(resolve => {
          //     setTimeout(() => {
          //       resolve()
          //     }, 1000)
          //   })
          // }
        }
      ],
      edits: [
        {
          name: '删除',
          perm: 'addTask',
          fn: scope => {
            this.del([scope.row.classifyTextId])
          }
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      if (this.isView) {
        return
      }

      switch (val[0]) {
        case '删除':
          this.del(sel.map(el => el.classifyTextId))
          break

        default:
          break
      }
    },
    add() {
      this.$options._edit = true
      this._openDialog({
        // fullscreen: false,
        size: 'large',
        title: '添加关键词',
        params: {
          type: 'keyword',
          classifyName: this.classifyName,
          categoryId: this.categoryId,
          classifyId: this.classifyId
        },
        okBtnText: '确认',
        cancelBtnText: '取消',
        component: () => import('./add.vue')
      })
    },
    del(classifyTextIds) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`keyword/keywordLibClassifyRemoveKeywordText`]({
          categoryId: this.categoryId,
          classifyTextIds,
          classifyId: this.classifyId,
          ...this.storeInfo
        })
      })
    }
  }
}
</script>