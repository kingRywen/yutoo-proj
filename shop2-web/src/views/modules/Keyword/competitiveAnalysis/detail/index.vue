<template>
  <main-layout
    @searchTrueData="val => searchData = val"
    :outerParams="outerParams"
    :searchFields="searchFields"
    :columns="columns"
    :searchFunc="searchFunc"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    :right-edit-btns="editBtns"
    edit-width="160px"
    :btnTip="true"
    url="keyword/taskKeywordCompeteDetails"
    ref="layout"
  >
    <span slot="btnTip">
      需要导入搜索量才可查看竞争度数据，导入日志可以在常用工具-
      <span @click="method123" style="color:#ff9966;margin-right:0;cursor:pointer;">导入日志</span>中查看
    </span>
  </main-layout>
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
        },
        {
          name: '导入搜索量',
          perm: 'add',
          fn: () => {
            let params = {
              fn: this.$refs.layout.closeDialog,
              success: this.$refs.layout.getList,
              taskId: this.outerParams.taskId
            }
            return this.showDialogGlobal(
              '导入搜索量',
              '100%',
              params,
              () => import('../dialogs/import'),
              '',
              '关闭'
            )
          }
        }
      ],
      searchData: {},
      searchFields: {
        length: {
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
        },
        compRate: {
          hidden: true,
          type: 'object',
          label: '竞争度',
          properties: {
            compRateMin: {
              widget: 'number',
              width: 120,
              span: 12
            },
            compRateMax: {
              widget: 'number',
              labelWidth: '20px',
              label: '~',
              width: 30,
              span: 12
            }
          },
          labelWidth: '90px'
        },
        searchCnt: {
          hidden: true,
          type: 'object',
          label: '搜索量',
          properties: {
            searchCntMin: {
              widget: 'number',
              width: 120,
              span: 12
            },
            searchCntMax: {
              widget: 'number',
              labelWidth: '20px',
              label: '~',
              width: 30,
              span: 12
            }
          },
          labelWidth: '90px'
        },
        compProductCnt: {
          hidden: true,
          type: 'object',
          label: '产品数',
          properties: {
            compProductCntMin: {
              widget: 'number',
              width: 120,
              span: 12
            },
            compProductCntMax: {
              widget: 'number',
              labelWidth: '20px',
              label: '~',
              width: 30,
              span: 12
            }
          },
          labelWidth: '90px'
        }
      },
      columns: [
        {
          label: '关键词',
          render(h, scope) {
            let { keyword } = scope.row
            return (
              <a
                href={vm.storeUrls.keywordUrl + keyword}
                target="_blank"
                type="text"
              >
                {keyword}
              </a>
            )
          }
        },
        //123/
        {
          label: '产品数',
          value: 'compProductCnt',
          sortable: 'custom',
          render(h, scope) {
            let { compProductCnt } = scope.row
            return compProductCnt !== undefined ? (
              parseInt(compProductCnt / 1000) == compProductCnt / 1000 ? (
                <span>{compProductCnt}+</span>
              ) : (
                <span>{compProductCnt}</span>
              )
            ) : (
              <span>-</span>
            )
          }
        },
        {
          label: '搜索量',
          value: 'searchCnt',
          sortable: 'custom'
        },
        {
          label: '竞争度',
          value: 'compRate',
          sortable: 'custom'
        }
      ]
    }
  },
  methods: {
    method123() {
      this.$router.push({
        path: '/common/importLogs',
        query: { importType: 0 }
      })
    },
    searchFunc(data) {
      let {
        length,
        compRate,
        searchCnt,
        compProductCnt,
        keywords1,
        include1,
        barring1,
        exclude1,
        ...el
      } = data
      let lengthMin = length && length.lengthMin
      let lengthMax = length && length.lengthMax
      let compRateMin = compRate && compRate.compRateMin
      let compRateMax = compRate && compRate.compRateMax
      let searchCntMin = searchCnt && searchCnt.searchCntMin
      let searchCntMax = searchCnt && searchCnt.searchCntMax
      let compProductCntMin = compProductCnt && compProductCnt.compProductCntMin
      let compProductCntMax = compProductCnt && compProductCnt.compProductCntMax
      let keywords = keywords1 && this.moreRowText(keywords1)
      let include = include1 && this.moreRowText(include1)
      let barring = barring1 && this.moreRowText(barring1)
      let exclude = exclude1 && this.moreRowText(exclude1)
      return {
        lengthMin,
        lengthMax,
        compRateMin,
        compRateMax,
        searchCntMin,
        searchCntMax,
        compProductCntMin,
        compProductCntMax,
        keywords,
        include,
        barring,
        exclude,
        ...el
      }
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
    },
    expReview(keywords, exportType, setLoading, searchData) {
      setLoading && (this.topBatchBtn.loading = true)
      return this.$api[`keyword/taskKeywordCompeteExport`]({
        keywords,
        ...this.outerParams,
        taskId: this.outerParams.taskId,
        exportType,
        ...searchData
      })
        .then(data => {
          setLoading && (this.topBatchBtn.loading = false)
          let ext = exportType ? 'csv' : 'xlsx'
          downloadFile(data, `竞争度分析.${ext}`)
        })
        .catch(err => {
          setLoading && (this.topBatchBtn.loading = false)
          return Promise.reject(err)
        })
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
