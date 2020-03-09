<template>
  <div>
    <main-layout
      :outerParams="{...storeInfo,...curQuery, categoryId,categoryFlag}"
      :searchFields="searchFields"
      :columns="columns"
      edit-width="160px"
      :right-edit-btns="editBtns"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="keyword/keywordLibRootList"
      ref="layout"
    ></main-layout>
  </div>
</template>
<script>
import relatedMixin from '../../common/mixin'
export default {
  mixins: [relatedMixin],
  props: ['categoryId', 'productId', 'curQuery'],
  data() {
    return {
      topBatchBtn: {
        title: '有效词根',
        options: [
          {
            label: '加入无效词根'
          },
          {
            label: '删除'
          }
        ]
      },
      searchFields: {
        include: {
          widget: 'textarea',
          placeholder: '请输入关键词'
        },
        time: {
          widget: 'daterange',
          hidden: true,
          label: '添加时间',
          fields: ['startTime', 'endTime'],
          timeDisabled: 'after'
        },
        wordCnt: {
          widget: 'select',
          label: '单词数量',
          hidden: true,
          options: this.$const['KEYWORD/wordCnt']
        },
        exclude: {
          widget: 'textarea',
          hidden: true,
          labelWidth: '65px',
          label: '不包含'
        },
        barring: {
          widget: 'textarea',
          hidden: true,
          labelWidth: '53px',
          label: '排除'
        }
        // exact: {
        //   widget: 'textarea',
        //   hidden: true,
        //   labelWidth: '53px',
        //   label: '精确'
        // }
      },
      columns: [
        {
          label: '词根名称',
          value: 'rootText'
        },
        // {
        //   label: '添加类型',
        //   value: 'negativeType',
        //   _enum: negativeType
        // },
        {
          label: '添加时间',
          value: 'createTime'
        }
      ],
      editBtns: [
        {
          name: '添加',
          perm: 'add',
          fn: () => {
            this.add()
          }
        }
      ]
    }
  },

  methods: {
    add() {
      this._openDialog({
        size: 'medium',
        title: '添加有效词根',
        params: {
          categoryId: this.categoryId,
          rootType: this.curQuery.rootType
        },
        okBtnText: '确认',
        cancelBtnText: '取消',
        component: () => import('./dialogs/add.vue')
      })
    },
    del(rootIds) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`keyword/keywordLibRootRemove`]({
          ...this.storeInfo,
          categoryId: this.categoryId,
          rootIds
        })
      })
    },
    handleLeftBatchChange(val, select) {
      switch (val[0]) {
        case '删除':
          this.del(select.map(el => el.rootId))
          break
        case '加入无效词根':
          this.addToInvalid(select.map(el => el.rootId))
          break

        default:
          break
      }
    },
    addToInvalid(rootIds) {
      this.$_dialog({
        size: 'medium',
        title: '加入无效词根',
        params: {
          categoryId: this.categoryId,
          rootIds
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/addToInvalid.vue')
      })
    }
  }
}
</script>