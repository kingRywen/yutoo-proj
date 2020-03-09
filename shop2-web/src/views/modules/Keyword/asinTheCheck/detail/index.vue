<template>
  <main-layout
    class="asinTheCheckClass"
    @searchTrueData="val => searchData = val"
    :outerParams="outerParams"
    :searchFields="searchFields"
    :columns="columns"
    :searchFunc="searchFunc"
    :topBatchBtn="topBatchBtn"
    :right-edit-btns="editBtns"
    @left-batch-change="handleLeftBatchChange"
    :showAsinDes="true"
    @requestSuccess="requestSuccess"
    edit-width="160px"
    url="keyword/taskKeywordAsinReverseMerDetails"
    ref="layout"
    tip="数据只会保存7天，7天之后就会自动删除，请尽快导出"
  >
    <span
      slot="textDes"
    >关键词总数:{{asinObj.keywordCnt}} 自然关键词:{{asinObj.organicKeywordCnt}} 广告关键词:{{asinObj.adKeywordCnt}} 亚马逊推荐:{{asinObj.amzRecommendedCnt}}</span>
  </main-layout>
</template>
<script>
import { downloadFile } from 'Utils'
export default {
  data() {
    let vm = this
    return {
      asinObj: {},
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
        adProductCnt: {
          hidden: true,
          type: 'object',
          label: '广告产品数',
          properties: {
            adProductCntMin: {
              widget: 'number',
              width: 120,
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
      searchFields1: {
        matchType: {
          hidden: true,
          widget: 'select',
          options: [
            { label: 'Organic', value: 0 },
            { label: 'Sponsored', value: 1 },
            { label: 'Amazon', value: 2 }
          ],
          label: '匹配类型',
          labelWidth: '80px'
        },
        amzRecommendedRank: {
          hidden: true,
          type: 'object',
          label: '亚马逊推荐排名',
          properties: {
            amzRecommendedRankMin: {
              widget: 'number',
              width: 120,
              span: 12
            },
            amzRecommendedRankMax: {
              widget: 'number',
              labelWidth: '20px',
              label: '~',
              width: 30,
              span: 12
            }
          },
          labelWidth: '120px'
        },
        adRank: {
          hidden: true,
          type: 'object',
          label: '广告排名',
          properties: {
            adRankMin: {
              widget: 'number',
              width: 120,
              span: 12
            },
            adRankMax: {
              widget: 'number',
              labelWidth: '20px',
              label: '~',
              width: 30,
              span: 12
            }
          },
          labelWidth: '80px'
        }
      },
      searchFields2: {
        organicRank: {
          hidden: true,
          type: 'object',
          label: '自然排名',
          properties: {
            organicRankMin: {
              widget: 'number',
              width: 120,
              span: 12
            },
            organicRankMax: {
              widget: 'number',
              labelWidth: '20px',
              label: '~',
              width: 30,
              span: 12
            }
          },
          labelWidth: '120px'
        },
        compareOrganicRank: {
          hidden: true,
          type: 'object',
          label: '对比ASIN自然排名',
          properties: {
            compareOrganicRankMin: {
              widget: 'number',
              width: 120,
              span: 12
            },
            compareOrganicRankMax: {
              widget: 'number',
              labelWidth: '20px',
              label: '~',
              width: 30,
              span: 12
            }
          },
          labelWidth: '120px'
        },
        compareRankType: {
          hidden: true,
          widget: 'select',
          options: [
            { label: '高于竞争产品', value: 0 },
            { label: '低于竞争产品', value: 1 },
            { label: '等于竞争产品', value: 2 }
          ],
          label: '自然排名趋势',
          labelWidth: '110px'
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
          label: '竞争度',
          value: 'compRate',
          sortable: 'custom'
        },
        {
          label: '搜索量',
          value: 'searchCnt',
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

        //compareType为0 /
        {
          label: '匹配类型',
          // sortable: 'custom',
          isShow: vm.$route.query.compareType == 1 ? true : false,
          render(h, scope) {
            let { matchType } = scope.row
            let arr = []
            if (matchType) arr = matchType.split(',')
            if (arr.length > 0) {
              return (
                <div>
                  {arr.includes('2') ? (
                    <el-tooltip
                      effect="dark"
                      content="Amazon recommended"
                      placement="bottom-start"
                    >
                      <span class="spcText">A</span>
                    </el-tooltip>
                  ) : null}
                  {arr.includes('1') ? (
                    <el-tooltip
                      effect="dark"
                      content="Sponsored"
                      placement="bottom-start"
                    >
                      <span class="spcText">S</span>
                    </el-tooltip>
                  ) : null}
                  {arr.includes('0') ? (
                    <el-tooltip
                      effect="dark"
                      content="Organic"
                      placement="bottom-start"
                    >
                      <span class="spcText">O</span>
                    </el-tooltip>
                  ) : null}
                </div>
              )
            } else {
              return <span>-</span>
            }
          }
        },
        {
          label: '亚马逊推荐排名',
          value: 'amzRecommendedRank',
          isShow: vm.$route.query.compareType == 1 ? true : false,
          sortable: 'custom'
        },
        {
          label: '广告排名',
          value: 'adRank',
          isShow: vm.$route.query.compareType == 1 ? true : false,
          sortable: 'custom'
        },
        {
          label: '自然排名',
          value: 'organicRank',
          isShow: vm.$route.query.compareType == 1 ? true : false,
          sortable: 'custom'
        },

        //compareType为1
        {
          label: `自然排名(${vm.$route.query.asin})`,
          value: 'organicRank',
          isShow: vm.$route.query.compareType == 1 ? false : true,
          sortable: 'custom',
          render(h, scope) {
            let { organicRank, compareOrganicRank } = scope.row
            if (organicRank !== undefined) {
              if (compareOrganicRank !== undefined) {
                if (organicRank > compareOrganicRank) {
                  return (
                    <span style="background: #E4E4E4;color: #999;padding: 3px 15px;">
                      {organicRank}
                    </span>
                  )
                } else if (organicRank == compareOrganicRank) {
                  return <span>{organicRank}</span>
                } else if (organicRank < compareOrganicRank) {
                  return (
                    <span style="background: #000;color: #fff;padding: 3px 15px;">
                      {organicRank}
                    </span>
                  )
                }
              } else {
                return (
                  <span style="background: #000;color: #fff;padding: 3px 15px;">
                    {organicRank}
                  </span>
                )
              }
            } else {
              return <span>-</span>
            }
          }
        },
        //123/
        {
          label: `自然排名(${vm.$route.query.compareAsin})`,
          value: 'compareOrganicRank',
          isShow: vm.$route.query.compareType == 1 ? false : true,
          sortable: 'custom'
        }
      ]
    }
  },
  methods: {
    requestSuccess(data1, data2, data3) {
      this.asinObj = {
        keywordCnt: data3.data.keywordCnt,
        organicKeywordCnt: data3.data.organicKeywordCnt,
        adKeywordCnt: data3.data.adKeywordCnt,
        amzRecommendedCnt: data3.data.amzRecommendedCnt
      }
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
        amzRecommendedRank,
        adRank,
        organicRank,
        compareOrganicRank,
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
      let amzRecommendedRankMin =
        amzRecommendedRank && amzRecommendedRank.amzRecommendedRankMin
      let amzRecommendedRankMax =
        amzRecommendedRank && amzRecommendedRank.amzRecommendedRankMax
      let adRankMin = adRank && adRank.adRankMin
      let adRankMax = adRank && adRank.adRankMax
      let organicRankMin = organicRank && organicRank.organicRankMin
      let organicRankMax = organicRank && organicRank.organicRankMax
      let compareOrganicRankMin =
        compareOrganicRank && compareOrganicRank.compareOrganicRankMin
      let compareOrganicRankMax =
        compareOrganicRank && compareOrganicRank.compareOrganicRankMax
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
        amzRecommendedRankMin,
        amzRecommendedRankMax,
        adRankMin,
        adRankMax,
        organicRankMin,
        organicRankMax,
        compareOrganicRankMin,
        compareOrganicRankMax,
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
      return this.$api[`keyword/taskKeywordAsinReverseMerExport`]({
        keywords,
        ...this.outerParams,
        taskId: this.outerParams.taskId,
        exportType,
        ...searchData
      })
        .then(data => {
          setLoading && (this.topBatchBtn.loading = false)
          let ext = exportType ? 'csv' : 'xlsx'
          downloadFile(data, `ASIN反查.${ext}`)
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
        merchantTaskId: this.$route.query.merchantTaskId || null
      }
    }
  },
  mounted() {
    if (this.$route.query.compareType == 0) {
      let { ...el } = this.searchFields
      this.searchFields = { ...el, ...this.searchFields1 }
    } else if (this.$route.query.compareType == 1) {
      let { ...el } = this.searchFields
      this.searchFields = { ...el, ...this.searchFields2 }
    }
  }
}
</script>
<style lang="scss">
.asinTheCheckClass {
  .spcText {
    width: 23px;
    height: 23px;
    background: rgb(52, 73, 94);
    color: #fff;
    display: inline-block;
    border-radius: 50%;
    text-align: center;
    line-height: 23px;
    margin-right: 8px;
  }
}
</style>