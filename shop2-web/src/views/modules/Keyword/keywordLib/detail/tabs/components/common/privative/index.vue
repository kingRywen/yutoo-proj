<template>
  <div>
    <main-layout
      :outerParams="{...storeInfo,...curQuery, relatedId,categoryFlag}"
      :searchFields="searchFields"
      :columns="columns"
      edit-width="160px"
      :right-edit-btns="productId ? [] :editBtns"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="keyword/keywordLibNegativeList"
      ref="layout"
    ></main-layout>
  </div>
</template>
<script>
import relatedMixin from '../mixin'
export default {
  mixins: [relatedMixin],
  props: ['categoryId', 'productId', 'curQuery'],
  data() {
    const negativeType = this.$const['KEYWORD/negativeType'],
      relatedHandleType = this.$const['KEYWORD/relatedHandleType'].slice(
        this.productId ? 1 : 0
      )
    return {
      negativeType,
      topBatchBtn: {
        title: '否定词',
        options: [
          {
            label: '复制关键词'
          }
        ].concat(
          this.productId
            ? [
                {
                  label: '加入相关词'
                }
              ]
            : [
                {
                  label: '删除'
                }
              ]
        )
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
        },
        exact: {
          widget: 'textarea',
          hidden: true,
          labelWidth: '53px',
          label: '精确'
        },
        handleType: {
          label: '添加类型',
          widget: 'select',
          hidden: true,
          options: relatedHandleType
        }
      },
      columns: [
        {
          label: '否定词名称',
          value: 'negativeText'
        },
        {
          label: '添加类型',
          value: 'handleType',
          _enum: this.cfuns.arrayToObj(relatedHandleType)
        },
        {
          label: '添加时间',
          value: 'createTime'
        },
        {
          label: '否定类型',
          value: 'negativeType',
          _enum: negativeType
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
        title: '添加否定词',
        params: {
          categoryId: this.categoryId,
          productId: this.productId,
          negativeType: this.curQuery.negativeType
        },
        okBtnText: '确认',
        cancelBtnText: '取消',
        component: () => import('./dialogs/add.vue')
      })
    },
    del(negativeTexts) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`keyword/keywordLibNegativeRemove`]({
          ...this.storeInfo,
          categoryId: this.categoryId,
          negativeTexts
        })
      })
    },
    handleLeftBatchChange(val, select) {
      switch (val[0]) {
        case '删除':
          this.del(select.map(el => el.negativeText))
          break
        case '复制关键词':
          this.copy(select.map(el => el.negativeText).join('\n'))
          break
        case '加入相关词':
          this.addRelative(select)
          break

        default:
          break
      }
    },
    addRelative(sel) {
      let manuals = sel.filter(e => e.handleType === 'MANUAL')
      // console.log(manuals)
      // debugger

      if (!manuals.length) {
        this.$message.warning('只有人工筛选的词才能加入相关词')
      } else {
        this.moveKeywords(
          manuals.map(e => e.negativeText),
          'OTHER'
        )
      }
    },
    copy(text) {
      this.$copyText(text)
        .then(() => {
          this.$message.success('复制成功')
        })
        .catch(() => {
          this.$message.error('复制失败，请重试')
        })
    }
  }
}
</script>