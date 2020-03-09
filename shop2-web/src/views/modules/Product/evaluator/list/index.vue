<template>
  <div>
    <!-- <ElButton type="text" @click="translate">翻译</ElButton> -->
    <evaHeader v-if="showHearder" v-model="activeName" @change="handleActiveCg" />
    <main-layout
      @searchTrueData="handleSearchData"
      :outerParams="outerParams"
      :searchFields="searchFields"
      :columns="columns"
      :searchDefaultData="defaultSearchData"
      edit-width="160px"
      :cusSaveName="showHearder ? null : 'inner'"
      :right-edit-btns="editBtns"
      :searchFunc="searchFn"
      :showTable="activeName === 'first'"
      :hiddenTopBtn="activeName === 'second'"
      :isShowPag="activeName === 'first'"
      :topBatchBtn="showHearder ? topBatchBtn : {}"
      @left-batch-change="handleLeftBatchChange"
      url="productAnalysis/reviewerDetail"
      ref="layout"
    ></main-layout>
    <analysis :searchData="searchData" :originSearchVal="originSearchVal" v-if="activeName === 'second'" />
  </div>
</template>
<script>
import evaHeader from '../components/eva-header'
import { downloadFile, arrayToObj } from 'Utils'
import { getSearchNumField } from 'Utils/table-render'
import analysis from '../analysis'
// import tran from 'Utils/translate'

export default {
  components: {
    evaHeader,
    analysis
  },
  props: {
    defaultSearchData: {
      default: () => ({})
    },
    showHearder: {
      default: true,
      type: Boolean
    },
    queries: {
      default: () => ({})
    },
    mustQueries: {
      default: () => ({})
    }
  },
  computed: {
    outerParams() {
      return {
        starRateMax: null,
        starRateMin: null,
        ...this.defaultSearchData,
        ...this.storeInfo,
        ...this.queries
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      searchData: {},
      originSearchVal: {},
      taskId: +this.$route.query.taskId,
      searchFields: {
        buyerName: {
          placeholder: '评价者名称'
        },
        buyerId: {
          label: ' ',
          labelWidth: '12px',
          placeholder: '评价者ID'
        },
        // parentAsin: {
        //   placeholder: '评价者名称、评价者ID',
        //   suffixIcon: 'el-icon-search'
        // },
        appraisers: {
          hidden: true,
          label: '评价师类型',
          labelWidth: '95px',
          widget: 'select',
          multi: true,
          options: this.$const['PRODUCTANALYSIS/everType']
        },
        reviewerRanking: this.getSearchNumField(
          'Reviewer ranking',
          'reviewerRanking'
        ),
        helpfulVotes: this.getSearchNumField(
          '有用的投票数',
          'helpfulVotes',
          '110px'
        ),
        reviews: this.getSearchNumField('评论条数', 'reviews', '80px'),
        hearts: this.getSearchNumField('心形', 'hearts', '50px'),
        ideaLists: this.getSearchNumField('创意列表', 'ideaLists', '80px'),
        followingCnt: this.getSearchNumField(
          'Following数量',
          'followingCnt',
          '110px'
        ),
        categoryCnt: this.getSearchNumField(
          '评价产品类目数',
          'categoryCnt',
          '120px'
        ),
        reviewAllAsinFlag: {
          hidden: true,
          label: '相同评价者',
          labelWidth: '95px',
          widget: 'select',
          options: this.$const['OTHER/yesno']
        }
      },
      columns: [
        {
          label: '序号',
          width: 50,
          index: true,
          render: (h, { $index }) => {
            let { pageNo, pageSize } = this.$refs.layout
            return <span>{$index + 1 + (pageNo - 1) * pageSize}</span>
          }
        },
        {
          label: '头像',
          width: 70,
          value: 'avatar',
          img: true
        },
        {
          label: '名称',
          value: 'buyerName',
          url: 'buyerUrl',
          noTooltip: true,
          copy: false
        },
        {
          label: '评价者ID',
          value: 'buyerId',

          noTooltip: true
        },
        {
          label: 'Reviewer ranking',
          width: 150,
          value: 'reviewerRanking',
          sortable: 'custom'
        },
        {
          label: '评价师类型',
          value: 'appraisers',
          _enum: arrayToObj(this.$const['PRODUCTANALYSIS/everType'])
        },
        {
          label: '有用的投票数',
          sortable: 'custom',
          value: 'helpfulVotes'
        },
        {
          label: '评论数',
          sortable: 'custom',
          value: 'reviews'
        },
        {
          label: '心形',
          sortable: 'custom',
          value: 'hearts'
        },
        {
          label: '创意列表',
          sortable: 'custom',
          value: 'ideaLists'
        },
        {
          label: 'Following数量',
          sortable: 'custom',
          value: 'followingCnt'
        },
        {
          label: '评价产品类目数',
          width: 150,
          sortable: 'custom',
          value: 'categoryCnt'
        }
      ],
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
      topBatchBtn: {
        loading: false,
        title: '评价者',
        options: [
          {
            label: '导出CSV'
          },
          {
            label: '导出Excel'
          }
        ]
      }
    }
  },
  methods: {
    // async translate() {
    //   let text = await tran('我是谁？')
    //   console.log(text)
    // },
    handleSearchData(val, originVal) {
      this.searchData = val
      this.originSearchVal = originVal
    },
    handleActiveCg(name) {
      if (name === 'first') {
        this.$nextTick(() => {
          this.$refs.layout.getList()
        })
      }
    },
    getSearchNumField,
    handleLeftBatchChange(val, selection) {
      let buyerIds = selection.map(el => el.buyerId)
      switch (val[0]) {
        case '导出CSV':
          this.expReview(buyerIds, 1, true)
          break
        case '导出Excel':
          this.expReview(buyerIds, 0, true)
          break

        default:
          break
      }
    },
    expReview(buyerIds, exportType, setLoading, searchData) {
      setLoading && (this.topBatchBtn.loading = true)
      return this.$api[`productAnalysis/reviewerExportDetail`]({
        buyerIds,
        ...this.storeInfo,
        taskId: this.taskId,
        flag: this.flag,
        exportType,
        ...searchData
      })
        .then(data => {
          setLoading && (this.topBatchBtn.loading = false)
          let ext = exportType ? 'csv' : 'xlsx'
          downloadFile(data, `评价者.${ext}`)
        })
        .catch(err => {
          setLoading && (this.topBatchBtn.loading = false)
          return Promise.reject(err)
        })
    },
    searchFn(data) {
      // console.log(data)

      let {
        categoryCnt = {},
        followingCnt = {},
        hearts = {},
        helpfulVotes = {},
        ideaLists = {},
        reviewerRanking = {},
        reviews = {},
        ...info
      } = data
      // debugger
      let categoryCntMin = categoryCnt.min,
        categoryCntMax = categoryCnt.max,
        followingCntMin = followingCnt.min,
        followingCntMax = followingCnt.max,
        heartsMin = hearts.min,
        heartsMax = hearts.max,
        helpfulVotesMin = helpfulVotes.min,
        helpfulVotesMax = helpfulVotes.max,
        ideaListsMin = ideaLists.min,
        ideaListsMax = ideaLists.max,
        reviewerRankingMin = reviewerRanking.min,
        reviewerRankingMax = reviewerRanking.max,
        reviewsMin = reviews.min,
        reviewsMax = reviews.max
      return {
        categoryCntMin,
        categoryCntMax,
        followingCntMin,
        followingCntMax,
        heartsMin,
        heartsMax,
        helpfulVotesMin,
        helpfulVotesMax,
        ideaListsMin,
        ideaListsMax,
        reviewerRankingMin,
        reviewerRankingMax,
        reviewsMin,
        reviewsMax,
        ...info,
        taskId: this.taskId,
        ...this.mustQueries
      }
    }
  }
}
</script>