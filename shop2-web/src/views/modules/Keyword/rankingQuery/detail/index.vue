<template>
  <main-layout
    @searchTrueData="val => searchData = val"
    :outerParams="outerParams"
    :searchFields="searchFields"
    :columns="columns"
    :searchFunc="searchFunc"
    :topBatchBtn="topBatchBtn"
    :right-edit-btns="editBtns"
    @requestSuccess="handlerequestSuccess"
    @left-batch-change="handleLeftBatchChange"
    edit-width="160px"
    url="keyword/taskKeywordRankDetails"
    ref="layout"
    :btnTip="true"
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
    const addedList = [
      {
        label: '竞争度',
        value: 'compRate',
        sortable: 'custom'
      },
      {
        label: '广告产品数',
        value: 'adProductCnt',
        sortable: 'custom'
      },
      {
        label: '竞争产品数',
        value: 'compProductCnt',
        sortable: 'custom'
      },
      {
        label: '搜索量',
        value: 'searchCnt',
        sortable: 'custom'
      }
    ]
    return {
      addedList,
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
          name: '导入搜索量和产品数',
          perm: 'add',
          fn: () => {
            let params = {
              fn: this.$refs.layout.closeDialog,
              success: this.$refs.layout.getList,
              taskId: this.outerParams.taskId
            }
            return this.showDialogGlobal(
              '导入搜索量和产品数',
              '100%',
              params,
              () => import('../dialogs/import'),
              '',
              '关闭'
            )
          }
        }
      ],
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
              width: 120,
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
              width: 30,
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
              width: 30,
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
        adProductCnt: {
          hidden: true,
          type: 'object',
          label: '广告产品数',
          properties: {
            adProductCntMin: {
              widget: 'number',
              width: 30,
              span: 12
            },
            adProductCntMax: {
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
          label: '竞争产品数',
          properties: {
            compProductCntMin: {
              widget: 'number',
              width: 30,
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
      searchData: {},
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
          label: `${vm.$route.query.asin}`,
          align: 'center',
          merge: [
            {
              label: '页码',
              value: 'asin1RankPages',
              sortable: 'custom'
            },
            {
              label: '排名',
              sortable: 'custom',
              value: 'asin1PagesRank',
              render(h, scope) {
                let { taskId, keyword, asin1, asin1PagesRank } = scope.row
                return asin1PagesRank !== undefined ? (
                  <el-button
                    type="text"
                    onClick={() => {
                      vm.showDialog(taskId, keyword, asin1)
                    }}
                  >
                    {scope.row.asin1PagesRank}
                  </el-button>
                ) : (
                  <el-button
                    type="text"
                    onClick={() => {
                      vm.showDialog(taskId, keyword, asin1)
                    }}
                  >
                    -
                  </el-button>
                )
              }
            }
          ]
        },
        //123/
        {
          label: `${vm.$route.query.compareAsin1}`,
          isShow: vm.$route.query.compareAsin1 ? false : true,
          align: 'center',
          merge: [
            {
              label: '页码',
              value: 'asin2RankPages',
              sortable: 'custom'
            },
            {
              label: '排名',
              sortable: 'custom',
              value: 'asin2PagesRank',
              render(h, scope) {
                let { taskId, keyword, asin2, asin2PagesRank } = scope.row
                return asin2PagesRank !== undefined ? (
                  <el-button
                    type="text"
                    onClick={() => {
                      vm.showDialog(taskId, keyword, asin2)
                    }}
                  >
                    {scope.row.asin2PagesRank}
                  </el-button>
                ) : (
                  <el-button
                    type="text"
                    onClick={() => {
                      vm.showDialog(taskId, keyword, asin2)
                    }}
                  >
                    -
                  </el-button>
                )
              }
            }
          ]
        },
        //123/
        {
          label: `${vm.$route.query.compareAsin2}`,
          isShow: vm.$route.query.compareAsin2 ? false : true,
          align: 'center',
          merge: [
            {
              label: '页码',
              value: 'asin3RankPages',
              sortable: 'custom'
            },
            {
              label: '排名',
              sortable: 'custom',
              value: 'asin3PagesRank',
              render(h, scope) {
                let { taskId, keyword, asin3, asin3PagesRank } = scope.row
                return asin3PagesRank !== undefined ? (
                  <el-button
                    type="text"
                    onClick={() => {
                      vm.showDialog(taskId, keyword, asin3)
                    }}
                  >
                    {scope.row.asin3PagesRank}
                  </el-button>
                ) : (
                  <el-button
                    type="text"
                    onClick={() => {
                      vm.showDialog(taskId, keyword, asin3)
                    }}
                  >
                    -
                  </el-button>
                )
              }
            }
          ]
        }
        //123/
      ]
    }
  },
  methods: {
    method123() {
      this.$router.push({
        path: '/common/importLogs',
        query: { importType: 1 }
      })
    },
    showDialog(taskId, keyword, asin) {
      let params = { taskId, keyword, asin }
      this.showDialogGlobal(
        asin + '-排名曲线',
        '100%',
        params,
        () => import('../dialogs/echarts.vue'),
        '',
        '关闭'
      )
    },
    searchFunc(data) {
      let {
        length,
        compRate,
        searchCnt,
        adProductCnt,
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
      let adProductCntMin = adProductCnt && adProductCnt.adProductCntMin
      let adProductCntMax = adProductCnt && adProductCnt.adProductCntMax
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
        adProductCntMin,
        adProductCntMax,
        compProductCntMin,
        compProductCntMax,
        keywords,
        include,
        barring,
        exclude,
        ...el
      }
    },
    handlerequestSuccess(suc, list) {
      let ret = []
      list.forEach(el => {
        if (el.compRate) {
          ret[0] = this.addedList[0]
        }
        if (el.adProductCnt) {
          ret[1] = this.addedList[1]
        }
        if (el.compProductCnt) {
          ret[2] = this.addedList[2]
        }
        if (el.searchCnt) {
          ret[3] = this.addedList[3]
        }
      })
      ret = ret.filter(el => el != null)
      this.columns.splice(1, 0, ...ret)
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
      return this.$api[`keyword/taskKeywordRankExport`]({
        keywords,
        ...this.outerParams,
        taskId: this.outerParams.taskId,
        exportType,
        ...searchData
      })
        .then(data => {
          setLoading && (this.topBatchBtn.loading = false)
          let ext = exportType ? 'csv' : 'xlsx'
          downloadFile(data, `排名查询.${ext}`)
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
