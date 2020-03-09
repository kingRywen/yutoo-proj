<template>
  <div v-if="$route.name === 'evaluatorAnalysisDatails' || $route.name === 'evaluatorAnalysisDataDetailsInfo'">
    <MainLayout
      :edits="edits"
      :outerParams="outerParams"
      :searchFields="searchFields"
      :outSearchData.sync="searchData"
      :searchFunc="searchFunc"
      @searchTrueData='searchTrueData'
      :editBtns="editBtns"
      @search="handleSearch"
      :columns="columns"
      ref="layout"
      url="taskReviewerAnalysisDetails"
    ></MainLayout>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import storage from 'Utils/saver';
import {downloadFile} from 'Utils/tools';
export default {
  data() {
    let vm = this
    return {
      currentSearch: {},
      show: true,
      query: {},
      edits: [],
      searchFields: [
        {
          noLabel: true,
          placeholder: '评价师类型（多选）',
          name: 'appraisers',
          type: 'select',
          multi: true,
          options: [
            // 0:非评价师,1:Top 10000 Reviewer,,2:VINE VOICE,3:HALL OF FAME REVIEWER,4:TOP CONTRIBUTOR,5:2008 HOLIDAY TEAM,6:COMMUNITY FORUM 04,多个用逗号分隔',
            {
              label: '非评价师',
              value: 0
            },
            {
              label: 'Top 10000 Reviewer',
              value: 1
            },
            {
              label: 'VINE VOICE',
              value: 2
            },
            {
              label: 'HALL OF FAME REVIEWER',
              value: 3
            },
            {
              label: 'TOP CONTRIBUTOR',
              value: 4
            },
            {
              label: '2008 HOLIDAY TEAM',
              value: 5
            },
            {
              label: 'COMMUNITY FORUM 04',
              value: 6
            }
          ],
          span: 8
        },
        // {
        //   placeholder: '请输入评价者ID',
        //   noLabel: true,
        //   type: 'select',
        //   allowCreate: true,
        //   multi: true,
        //   width:'400px',
        //   options: [],
        //   name: 'buyerIds'
        // },
        {
          placeholder: '请输入评价者ID, 多个评价者ID换行输入',
          noLabel: true,
          type: 'textarea',
          rows: 1,
          // width:'400px',
          name: 'buyerIds',
          span: 8
        },
        {
          placeholder: '请输入评价名字',
          noLabel: true,
          name: 'buyerName',
          span: 8
        },
        {
          label: 'Reviewer ranking',
          labelWidth: '125px',
          name: 'reviewerRanking',
          type: 'price',
          integer: 'number',
          span: 8
        },
        {
          label: '有用的投票数',
          labelWidth: '125px',
          name: 'helpfulVotes',
          type: 'price',
          integer: 'number',
          span: 8
        },
        {
          label: '评论条数',
          labelWidth: '125px',
          name: 'reviews',
          type: 'price',
          integer: 'number',
          span: 8
        },
        {
          label: '心形',
          labelWidth: '125px',
          name: 'hearts',
          type: 'price',
          integer: 'number',
          span: 8
        },
        {
          label: '创意列表',
          labelWidth: '125px',
          name: 'ideaLists',
          type: 'price',
          integer: 'number',
          span: 8
        },
        {
          label: 'Following数量',
          labelWidth: '125px',
          name: 'followingCnt',
          type: 'price',
          integer: 'number',
          span: 8
        },
        {
          label: '评价产品类目数',
          labelWidth: '125px',
          name: 'categoryCnt',
          type: 'price',
          integer: 'number',
          span: 8
        }
      ],
      searchData: {
        // buyerIds: []
      },
      editBtns: [
        {
          name: '查看数据分析',
          // disabled: selection => {
          //   return selection.length < 1
          // },
          fn: () => {
            const len = this.getSelectionByKey('buyerId').length
            this.$router.push({
              name: 'evaluatorAnalysisDataDetails',
              query: {
                name: this.$route.query.name,
                taskId: this.$route.query.taskId,
                title: '(' + (len ? this.getSelectionByKey('buyerName')[0] + ` ${len > 1 ? '等多位' : ''}评价者` : '全部') + ')',
                search: JSON.stringify(this.currentSearch),
                buyerIds: this.getSelectionByKey('buyerId')
              }
            })
          }
        },
        {
          name: '导出',
          showLoading:true,
          // disabled: () => {
          //     return this.$refs.layout && this.$refs.layout.selection.length === 0
          // },
          fn: ()=>{
              return this.exportBtn();
          }
        },
      ],
      columns: [
        {
          label: '序号',
          value: 'taskName',
          render(h, scope) {
            const { $index } = scope
            const pageNumber = vm.$refs.layout.pageNo
            const pageSize = vm.$refs.layout.pageSize
            return <span>{(pageNumber - 1) * pageSize + $index + 1}</span>
          }
        },
        {
          value: 'avatar', //table需要渲染的值
          label: '头像', //表头
          // width: "60", //当前行宽度
          img: true, //如图片传
          style: {
            //图片宽高
            width: 40,
            height: 40
          },
          bulkyHeight: 120 //鼠标hover图片高，宽度自动
        },
        {
          label: '姓名',
          width: 150,
          value: 'buyerName',
          url: 'buyerUrl'
        },
        {
          label: 'ID',
          value: 'buyerId',
          width: 150,
        },
        {
          label: 'Reviewer ranking',
          width: 150,
          sortable: 'custom',
          value: 'reviewerRanking'
        },

        {
          label: '评价师类型',
          width: 120,
          value: 'appraisers',
          render(h, scope) {
            const arr = vm.searchFields[0].options
            const { appraisers } = scope.row
            let names = []
            appraisers.forEach(el => {
              let _find = arr.find(_el => _el.value === el)
              if (_find) {
                names.push(_find.label)
              }
            })
            return <span>{names.join(' & ')}</span>
          }
        },
        {
          label: '有用的投票数',
          width: 140,
          sortable: 'custom',
          value: 'helpfulVotes'
        },
        {
          label: '评论条数',
          width: 120,
          sortable: 'custom',
          value: 'reviews'
        },
        {
          label: '心形',
          width: 120,
          sortable: 'custom',
          value: 'hearts'
        },
        {
          label: '创意列表',
          width: 120,
          sortable: 'custom',
          value: 'ideaLists'
        },
        {
          label: 'Following数量',
          sortable: 'custom',
          width: 130,
          value: 'followingCnt'
        },
        {
          label: '评价产品类目数',
          sortable: 'custom',
          width: 130,
          value: 'categoryCnt'
        },
        // {
        //   label: '第一条评价时间',
        //   width: 120,
        //   value: 'firstReviewTime'
        // },
        // {
        //   label: '评价平均间隔时间',
        //   width: 130,
        //   value: 'avgReviewDay'
        // },
        // {
        //   label: '创建时间',
        //   width: 120,
        //   value: 'createTime'
        // }
      ],

      searchTrueDatas:null,
    }
  },
  // beforeDestroy() {
  //   this.saveRouteParams()
  // },

  // beforeRouteUpdate(to, from, next) {
  //   this.setRouteParams()
  //   next()
  // },
  watch: {
    $route (to, from) {
      
      if (from.name === 'evaluatorAnalysisDataDetails') {
        this.saveRouteParams()
        this.setRouteParams()
        this.setBuyerIdOpts()
      }
    }
  },
  created() {
    this.setRouteParams()
    this.setBuyerIdOpts()
  },
  computed: {
    outerParams() {
      
      const { platformId, sellerId, siteId } = this.sellerData
      let { taskId, buyerIds, search } = this.$route.query
      if (search) {
        search = JSON.parse(search)
      } else {
        search = {}
      }
      console.log(search);
      buyerIds = typeof buyerIds === 'string' ? [buyerIds] : buyerIds
      return { platformId, sellerId, siteId, taskId, buyerIds, ...this.query, ...search }
      
    }
  },
  methods: {
    saveRouteParams() {
      storage.set('session', 'dataDetails_routerParams', this.$route.query)
    },
    searchTrueData(v){
      this.searchTrueDatas=v;
      console.log(v);
    },
    exportBtn(){
        if(this.$refs.layout.selection.length){
            let buyerIds=[];
            this.$refs.layout.selection.forEach(i=>{
               // console.log(i);
                buyerIds.push(i.buyerId)
            });
            this.searchTrueDatas.buyerIds=buyerIds;
        }else{
          this.searchTrueDatas.buyerIds=null;
        }
        //return
        return this.$api[`taskReviewerAnalysisExportDetails`](this.searchTrueDatas)
        .then(data => {
            downloadFile(data, '评价者分析-评价者详情' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
        })
        .catch(() => {})
    },
    handleSearch() {
      this.currentSearch = this.$.dealObjectValue(this.searchData)
    },
    setBuyerIdOpts() {
      let { buyerIds, search } = this.$route.query
      buyerIds = typeof buyerIds === 'string' ? [buyerIds] : buyerIds
      if (search) {
        this.currentSearch = JSON.parse(search)
        this.searchData = JSON.parse(search)
      } else {
        this.currentSearch = {}
        this.searchData = {}
      }
      if (!buyerIds) {
        return
      }
      // this.searchFields[1].options = buyerIds.map(el => ({label: el, value: el}))
      // this.searchData.buyerIds = buyerIds
    },
    setRouteParams() {
      // 
      this.query = {}
      let { params } = this.$route.query
      if (!params) {
        return
      }
      // 
      let [key, value] = params.split(':')
      if (key.indexOf('-') > -1) {
        let [min, max] = key.split('-')
        if (value.indexOf('-') > -1) {
          let [v1, v2] = value.split('-')
          this.$set(this.query, min, v1 != null && v1 !== '' ? +v1 : null)
          this.$set(this.query, max, v2 != null && v2 !== '' ? +v2 : null)
          // this.query[min] = v1 != null && v1 !== '' ? +v1 : null
          // this.query[max] = v2 != null && v2 !== '' ? +v2 : null
        } else {
          this.$set(this.query, min, +value)
          this.$set(this.query, max, +value)
          // this.query[min] = this.query[max] = +value
        }
      } else {
        this.$set(this.query, key, +value)
        // this.query[key] = +value
      }
    },
    sortChange({ column, prop, order }) {
      
    },
    searchFunc(data) {
      let { createTime, buyerIds,...info } = data
      if (buyerIds) {
        buyerIds = this.$.getAsins(buyerIds)
      }
      let [startTime, endTime] = createTime || []
      return { startTime, endTime, buyerIds, ...info }
    }
  }
}
</script>

<style>
</style>
