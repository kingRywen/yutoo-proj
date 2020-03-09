<template>
  <div>
    <!-- <evaHeader activeName="second" />
    <main-layout
      @searchTrueData="val => searchData = val"
      :outerParams="storeInfo"
      :searchFields="searchFields"
      :columns="columns"
      edit-width="160px"
      cusSaveName="productEvaluatorList:undefined"
      :showTable="false"
      :isShowPag="false"
      :searchFunc="searchFn"
      @requestSuccess="requestSuccess"
      ref="layout"
      url="productAnalysis/reviewerStat"
    ></main-layout>-->
    <!-- 评分区间评价者统计 -->
    <Stats :data="data[0]" :searchData="searchData" :originSearchVal="searchVal" />
    <div class="mt20">
      <el-row :gutter="12">
        <el-col :span="6">
          <!-- 第一条评价的时间 -->
          <firstRvTime :data="data[1]" :searchData="searchData" :originSearchVal="searchVal" />
        </el-col>
        <el-col :span="6">
          <!-- 评价产品的类目分布 -->
          <cate :data="data[2]" :searchData="searchData" :originSearchVal="searchVal" />
        </el-col>
        <el-col :span="6">
          <!-- 评价平均间隔时间 -->
          <avgTime :data="data[3]" :searchData="searchData" :originSearchVal="searchVal" />
        </el-col>
        <el-col :span="6">
          <!-- 评价类型分布 -->
          <type :data="data[4]" :searchData="searchData" :originSearchVal="searchVal" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import evaHeader from '../components/eva-header'
import { getSearchNumField } from 'Utils/table-render'
import Stats from './stats'
import cate from './cate'
import avgTime from './avgTime'
import type from './type'
import firstRvTime from './firstRvTime'
import { removeSearchEmpty } from 'Utils'
export default {
  props: ['searchData', 'originSearchVal'],
  components: {
    evaHeader,
    avgTime,
    type,
    Stats,
    cate,
    firstRvTime
  },
  computed: {
    searchVal() {
      return removeSearchEmpty(this.originSearchVal)
    }
  },
  data() {
    return {
      data: {},
      taskId: +this.$route.query.taskId,
      searchFields: {
        parentAsin: {
          placeholder: '评价者名称、评价者ID',
          suffixIcon: 'el-icon-search'
        },
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
          noTooltip: true
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
          value: 'appraisers'
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
      ]
    }
  },
  // created() {
  //   this.getData()
  // },
  watch: {
    searchData: {
      deep: true,
      immediate: true,
      handler(val, oldVal) {
        if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
          this.getData()
        }
      }
    }
  },
  methods: {
    getSearchNumField,
    getData() {
      this.$api[`productAnalysis/reviewerStat`](this.searchData).then(data => {
        this.handleData(data)
      })
    },
    handleData(data) {
      if (data) {
        let ret = {}
        data &&
          data.data &&
          data.data.forEach(el => {
            ret[el.dataType] = el.data
          })
        this.data = ret
      }
    },
    searchFn(data) {
      let {
        categoryCnt,
        followingCnt,
        hearts,
        helpfulVotes,
        ideaLists,
        reviewerRanking,
        reviews,
        ...info
      } = data
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
        taskId: this.taskId
      }
    }
  }
}
</script>