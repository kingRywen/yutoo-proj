<template>
  <div>
    <main-layout
      :outerParams="{...storeInfo,...curQuery, categoryId}"
      :searchFields="searchFields"
      :columns="columns"
      edit-width="160px"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="keyword/keywordLibUnScreenedList"
      ref="layout"
    ></main-layout>
  </div>
</template>
<script>
import mixin from '../common/mixin'
export default {
  mixins: [mixin],
  props: ['categoryId', 'curQuery'],
  data() {
    const negativeType = this.$const['KEYWORD/negativeType']
    return {
      negativeType,
      topBatchBtn: {
        title: '关键词',
        options: [
          {
            label: '设为有效'
          },
          {
            label: '设为无效'
          },
          {
            label: '复制关键词'
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
        }
      },
      columns: [
        {
          label: '关键词',
          value: 'keywordText'
        }
      ]
    }
  },

  methods: {
    handleLeftBatchChange(val, select) {
      switch (val[0]) {
        case '删除':
          this.delKeywords(select.map(el => el.keywordId))
          break
        case '复制关键词':
          this.copy(select.map(el => el.keywordText).join('\n'))
          break
        case '设为有效':
          // 改为其它词
          this.moveKeywords(
            select.map(el => el.keywordText),
            'OTHER'
          )
          break
        case '设为无效':
          // 改为精确否定
          this.moveKeywords(
            select.map(el => el.keywordText),
            'INVALID_EXACT',
            true
          )
          break

        default:
          break
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