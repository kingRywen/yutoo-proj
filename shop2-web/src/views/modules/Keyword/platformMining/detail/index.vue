<template>
  <main-layout
    @searchTrueData="val => searchData = val"
    :outerParams="outerParams"
    :searchFields="searchFields"
    :columns="columns"
    :searchFunc="searchFunc"
    :topBatchBtn="topBatchBtn"
    :right-edit-btns="editBtns"
    @left-batch-change="handleLeftBatchChange"
    edit-width="160px"
    url="keyword/taskKeywordDigDetails"
    ref="layout"
    tip="挖掘的数据只会保存7天，7天之后就会自动删除，请尽快导出"
  ></main-layout>
</template>
<script>
import { downloadFile } from 'Utils'
export default {
  data() {
    let vm = this
    return {
      topBatchBtn: {
        options: [
          {
            label: '复制'
          },
          {
            label: '导出Excel'
          },
          {
            label: '导出CSV'
          }
        ]
      },
      editBtns: [
        {
          name: '导出全部Excel',
          perm: 'add',
          showLoading: true,
          fn: () => {
            return this.expReview(undefined, 0, null, this.searchData)
          }
        },
        {
          name: '导出全部CSV',
          perm: 'add',
          showLoading: true,
          fn: () => {
            return this.expReview(undefined, 1, null, this.searchData)
          }
        }
      ],
      searchFields: {
        keywordSrc: {
          label: `${
            vm.$route.query.originId == 4 && vm.$route.query.keywordTypes == 3
              ? '商品ID'
              : '源关键词'
          }`,
          labelWidth: '80px'
        },
        length: {
          hidden: true,
          type: 'object',
          label: '关键词长度',
          properties: {
            lengthMin: {
              widget: 'number',
              width: 120,
              span: 12
            },
            lengthMax: {
              widget: 'number',
              labelWidth: '20px',
              label: '~',
              width: 30,
              span: 12
            }
          },
          labelWidth: '90px'
        },
        keywords1: {
          hidden: true,
          widget: 'textarea',
          label: '精确'
        },
        include1: {
          hidden: true,
          widget: 'textarea',
          label: '包含'
        },
        barring1: {
          hidden: true,
          widget: 'textarea',
          label: '精确排除'
        },
        exclude1: {
          hidden: true,
          widget: 'textarea',
          label: '包含排除'
        }
      },
      searchData: {},
      columns: [
        {
          label: `${
            vm.$route.query.originId == 4 && vm.$route.query.keywordTypes == 3
              ? '商品ID'
              : '源关键词'
          }`,
          value: 'keywordSrc'
        },
        {
          label: '关键词',
          render(h, scope) {
            let { keyword, keywordUrl } = scope.row
            return (
              <a href={keywordUrl} target="_blank" type="text">
                {keyword}
              </a>
            )
          }
        }
        //123/
      ]
    }
  },
  methods: {
    searchFunc(data) {
      let { length, keywords1, include1, barring1, exclude1, ...el } = data
      let lengthMin = length && length.lengthMin
      let lengthMax = length && length.lengthMax
      let keywords = keywords1 && this.moreRowText(keywords1)
      let include = include1 && this.moreRowText(include1)
      let barring = barring1 && this.moreRowText(barring1)
      let exclude = exclude1 && this.moreRowText(exclude1)
      return {
        lengthMin,
        lengthMax,
        keywords,
        include,
        barring,
        exclude,
        ...el
      }
    },
    expReview(keywords, exportType, setLoading, searchData) {
      setLoading && (this.topBatchBtn.loading = true)
      return this.$api[`keyword/taskKeywordDigExport`]({
        keywords,
        ...this.outerParams,
        taskId: this.outerParams.taskId,
        exportType,
        ...searchData
      })
        .then(data => {
          setLoading && (this.topBatchBtn.loading = false)
          let ext = exportType ? 'csv' : 'xlsx'
          downloadFile(data, `平台挖掘.${ext}`)
        })
        .catch(err => {
          setLoading && (this.topBatchBtn.loading = false)
          return Promise.reject(err)
        })
    },
    handleLeftBatchChange(val, selection) {
      let vm = this
      let keywords = selection.map(el => el.keyword)
      switch (val[0]) {
        case '复制':
          let str = ''
          str = keywords.join('\n')
          vm.$copyText(str).then(
            function(e) {
              vm.$message.success('复制成功')
            },
            function(e) {
              vm.$message.error('复制失败')
            }
          )
          break
        case '导出CSV':
          this.expReview(keywords, 1, true)
          break
        case '导出Excel':
          this.expReview(keywords, 0, true)
          break
      }
    }
  },
  computed: {
    outerParams() {
      return {
        ...this.storeInfo,
        taskId: this.$route.query.taskId || null
      }
    }
  }
}
</script>
