<template>
  <div v-if="$route.name === 'evaluatorAnalysisDataDetails'">
    <CollapseWrapper :routeIgnore="['buyerIds']" :backBtn="true" :expand="true">
      <YtForm
        search
        :fields="searchFields"
        ref="search"
        :formData.sync="searchData"
        @search="handleSearch"
        label-width="80px"
      ></YtForm>
    </CollapseWrapper>
    <div v-loading="loading" class="mt10">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <div style='line-height:38px;background: #f5f7fa;text-align:center;border-top:1px solid #dcdcdc;border-bottom:1px solid #dcdcdc;'><span>评分区间评价者统计</span>
					<span>
                <el-tooltip
                  content='计算每个评分区间对应的评价者数量,如对100个评价者进行统计,当评价者5星评分占比达100%的有多少个账号'
                  effect="light"
                  placement="top"
                >
                  <i
                    style="color: #108ee9;margin-left:6px"
                    class="el-icon-question"
                  />
                </el-tooltip>
              </span>
					</div>
          <yt-table :data='scoreProductDistribution' :columns='columns' border :selection='false' ></yt-table>
          <DataTable
            @tdClick="handleTdClick"
            style='margin-top:8px;'
            :showBtn="true"
            title="第一条评价的时间"
            prop="firstReviewTimeDayMin-firstReviewTimeDayMax"
            :data="article_1EvaluationTime"
            :columns="['评价时间', '评价者数']"
            :center="true"
          ></DataTable>
          <DataTable
            @tdClick="handleTdClick"
            :showBtn="true"
            title="评价内容长度区间统计"
            prop="contentLengthMin-contentLengthMax"
            :data="evaluationContentLengthIntervalStatistics"
            :columns="['长度区间', '评价者数']"
            :center="true"
          ></DataTable>
        </ElCol>
        <ElCol :span="12">
          <DataTable
            @tdClick="handleTdClick"
            :showBtn="true"
            title="评价产品的类目分布"
            prop="categoryCntMin-categoryCntMax"
            :data="categoryDistribution"
            :columns="['类目个数', '评价者数']"
            :center="true"
          ></DataTable>
          <DataTable
            @tdClick="handleTdClick"
            :showBtn="true"
            title="评价平均间隔时间"
            prop="avgReviewDayMin-avgReviewDayMax"
            :data="evaluateTheMeanInterval"
            :columns="['间隔区间', '评价者数']"
            :center="true"
          ></DataTable>
          <DataTable
            @tdClick="handleTdClick"
            :showBtn="true"
            title="评价师类型分布"
            prop="reviewType"
            :data="evaluationTypeDistribution"
            :columns="['评价类型', '评价者数']"
            :center="true"
          ></DataTable>
        </ElCol>
      </ElRow>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
export default {
  data() {
    let vm=this;
    return {
      currentSearch: {},
      loading: false,
      // 评分产品分布
      scoreProductDistribution: [],
      // 评价产品的类目分布
      categoryDistribution: [],
      // 第一条评价的时间
      article_1EvaluationTime: [],
      // 评价内容长度区间统计
      evaluationContentLengthIntervalStatistics: [],
      // 评价平均间隔时间
      evaluateTheMeanInterval: [],
      // 评价类型分布
      evaluationTypeDistribution: [],
      searchData: {},
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
        //   multi: true,
        //   width:'400px',
        //   allowCreate: true,
        //   // type: 'textarea',
        //   // rows: 1,
        //   options: [],
        //   name: 'buyerIds'
        // },
        {
          placeholder: '请输入评价者ID',
          noLabel: true,
          type: 'textarea',
          rows: 1,
          // width: '400px',
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
        },
      ],
       columns:[
          {
            label:'区间',
            value:'state',
          },
          {
            label:'100%',
            value:'cnt1',
            sortable:true,
            minWidth:100,
            render(h,scope){
              return(
                <el-button type="text" onClick={()=>{vm.lookGradingRangeDatails(1,scope.row.state)}}>{scope.row.cnt1 + '  ('+ Math.ceil(scope.row.rate1 *10000)/100 +'%)'}</el-button>
              )
            }
          },
          {
            label:'90%',
            value:'cnt2',
            sortable:true,
            minWidth:100,
            render(h,scope){
              return(
                <el-button type="text"  onClick={()=>{vm.lookGradingRangeDatails(2,scope.row.state)}}>{scope.row.cnt2 + '  ('+ Math.ceil(scope.row.rate2 *10000)/100 +'%)'}</el-button>
              )
            }
          },
          {
            label:'80%',
            value:'cnt3',
            sortable:true,
            minWidth:100,
            render(h,scope){
              return(
                <el-button type="text"  onClick={()=>{vm.lookGradingRangeDatails(3,scope.row.state)}}>{scope.row.cnt3 +'  ('+ Math.ceil(scope.row.rate3 *10000)/100 +'%)'}</el-button>
              )
            }
          },
          {
            label:'70%',
            value:'cnt4',
            minWidth:100,
            sortable:true,
            render(h,scope){
              return(
                <el-button type="text"  onClick={()=>{vm.lookGradingRangeDatails(4,scope.row.state)}}>{scope.row.cnt4 +'  ('+ Math.ceil(scope.row.rate4 *10000)/100 +'%)'}</el-button>
              )
            }
          }
          ,{
            label:'60%',
            value:'cnt5',
            sortable:true,
            minWidth:100,
            render(h,scope){
              return(
                <el-button type="text"  onClick={()=>{vm.lookGradingRangeDatails(5,scope.row.state)}}>{scope.row.cnt5 + '  ('+ Math.ceil(scope.row.rate5 *10000)/100 +'%)'}</el-button>
              )
            }
          },
          {
            label:'50%',
            value:'cnt6',
            minWidth:100,
            sortable:true,
            render(h,scope){
              return(
                <el-button type="text"  onClick={()=>{vm.lookGradingRangeDatails(6,scope.row.state)}}>{scope.row.cnt6 +'  ('+ Math.ceil(scope.row.rate6 *10000)/100 +'%)'}</el-button>
              )
            }
          },
          {
            label:'50%以下',
            value:'cnt7',
            sortable:true,
            minWidth:100,
            render(h,scope){
              return(
                <el-button type="text"  onClick={()=>{vm.lookGradingRangeDatails(7,scope.row.state)}}>{scope.row.cnt7 + '  ('+ Math.ceil(scope.row.rate7 *10000)/100 +'%)'}</el-button>
              )
            }
          }
        ]
    }
  },
  created() {
    this.setBuyerIdOpts()
    this.getData()
    
  },
  // watch: {
  //   $route(val,oldVal) {
  //     console.log(val, oldVal);
  //   }
  // },
  methods: {
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
      this.searchData.buyerIds = buyerIds.join('\n')

      // this.searchFields[1].options = buyerIds.map(el => ({label: el, value: el}))
      // this.searchData.buyerIds = buyerIds
    },
    //评分区间评价者统计的参数处理
    processingData(data){
        let max=0;
        data.forEach(i=>{
          let small=i.range.split('-')[0]*1;
          if(small>max){
            max=small
          } 
        });
        //console.log(data);
        let datas=[]
        for (let index = 1; index <= max; index++) {
            let obj={};
            data.forEach(k=>{
               let label=k.range.split('-')[0]*1;
               let loc=k.range.split('-')[1]*1;
               //console.log(label);
               if(label===index){
                 //console.log('object');
                  obj[`range${loc}`]=k.range;
                  obj[`cnt${loc}`]=k.cnt;
                  obj[`rate${loc}`]=k.rate;
               }
            });
            obj.state=index+'星'
            datas.push(obj)
        }
        this.scoreProductDistribution=datas;
        //console.log(datas);
    },
    //评分区间评价者统计
      lookGradingRangeDatails(index,state){
          // console.log(state);
          // console.log(index);
          // console.log(this.searchData);
          let starFlag=state.slice(0,1);
          let starRateMin,starRateMax;
          let rateName
          switch(index){
              case 1:
                starRateMax=null;
                starRateMin=1;
                rateName='100%'
              break;
              case 2:
                starRateMax=1;
                starRateMin=0.9;
                rateName='90%'
              break;
              case 3:
                starRateMax=0.9;
                starRateMin=0.8;
                rateName='80%'
              break;
              case 4:
                starRateMax=0.8;
                starRateMin=0.7;
                rateName='70%'
              break;
              case 5:
                starRateMax=0.7;
                starRateMin=0.6;
                rateName='60%'
              break;
              case 6:
                starRateMax=0.6;
                starRateMin=0.5;
                rateName='50%'
              break;
              case 7:
                starRateMax=0.5;
                starRateMin=null;
                rateName='50%以下'
              break;
              default:
              break;
          }
          let search={...this.currentSearch,starRateMax,starRateMin,starFlag}
          console.log(JSON.stringify(search));
          
          this.$router.push({
            name: 'evaluatorAnalysisDataDetailsInfo',
            query: {
              name: this.$route.query.name,
              taskId: this.$route.query.taskId,
              buyerIds: this.$route.query.buyerIds,
              search: JSON.stringify(this.$.dealObjectValue(search)),
              // 前一个title
              title: this.$route.query.title,
              // 当前title
              tit: '评分区间' + '(' + rateName + ' ' + state + ')'
            }
          })

      //     this.$router.push({
      //   name: 'evaluatorAnalysisDataDetailsInfo',
      //   query: {
      //     name: this.$route.query.name,
      //     taskId: this.$route.query.taskId,
      //     buyerIds: this.$route.query.buyerIds,
      //     search: JSON.stringify(this.currentSearch),
      //     params: prop + ':' + label,
      //     // 前一个title
      //     title: this.$route.query.title,
      //     // 当前title
      //     tit: title + '(' + item.label + ')'
      //   }
      // })
      },
    handleSearch() {
      this.currentSearch = this.$.dealObjectValue(this.searchData)
      this.$router.push({name: 'evaluatorAnalysisDataDetails', query: {taskId: this.$route.query.taskId, search: {} }})
      this.getData()
    },
    handleTdClick(item, index, prop, columns, title) {
      let { label } = item
      if (prop === 'evaluateStarMin-evaluateStarMax') {
        label = parseInt(label)
      }
      if (prop === 'categoryCntMin-categoryCntMax') {
        label = label.replace(/以上/g, '-').replace(/[\u4e00-\u9fa5]/g, '')
      }
      if (prop === 'firstReviewTimeDayMin-firstReviewTimeDayMax') {
        label = label.replace(/以上/g, '-').replace(/[\u4e00-\u9fa5]/g, '')
      }
      if (prop === 'contentLengthMin-contentLengthMax') {
        label = label.replace(/以上/g, '-').replace(/[\u4e00-\u9fa5]/g, '')
      }
      if (prop === 'avgReviewDayMin-avgReviewDayMax') {
        label = label.replace(/以上/g, '-').replace(/[\u4e00-\u9fa5]/g, '')
      }
      if (prop === 'reviewType') {
        switch (label) {
          case 'VP评带图片':
            label = 0
            break
          case 'VP评带视频':
            label = 1
            break
          case 'VP评仅文字':
            label = 2
            break
          case '直评带图片':
            label = 3
            break
          case '直评带视频':
            label = 4
            break
          case '直评仅文字':
            label = 5
            break

          default:
            break
        }
      }

      this.$router.push({
        name: 'evaluatorAnalysisDataDetailsInfo',
        query: {
          name: this.$route.query.name,
          taskId: this.$route.query.taskId,
          buyerIds: this.$route.query.buyerIds,
          search: JSON.stringify(this.$.dealObjectValue(this.currentSearch)),
          params: prop + ':' + label,
          // 前一个title
          title: this.$route.query.title,
          // 当前title
          tit: title + '(' + item.label + ')'
        }
      })
    },
    getData() {
      let { buyerIds, taskId } = this.$route.query
      let _buyerIds = this.searchData.buyerIds
      // debugger
      if (_buyerIds) {
        _buyerIds = this.$.getAsins(_buyerIds)
      }
      this.loading = true
      let params = {
        taskId: +taskId,
        ...this.$.dealObjectValue(this.searchData),
        buyerIds:
          _buyerIds || (typeof buyerIds === 'string' ? [buyerIds] : buyerIds)
      }
      this.$api[`taskReviewerAnalysisStatList`](params)
        .then(data => {
          this.loading = false
          data.data.forEach(el => {
            const { dataType, list } = el
            switch (dataType) {
              case 0:
                this.processingData(list)
                break
              case 1:
                this.article_1EvaluationTime = list.map(el => {
                  let label, value
                  const { range, cnt } = el
                  const ranges = range.split('-')
                  value = cnt
                  if (ranges[1] === '') {
                    label = ranges[0] + '天以上'
                  } else {
                    label = range + '天'
                  }
                  return { label, value }
                })
                break
              case 2:
                this.evaluationContentLengthIntervalStatistics = list.map(
                  el => {
                    let label, value
                    const { range, cnt } = el
                    label = range
                    value = cnt
                    return { label, value }
                  }
                )
                break
              case 3:
                this.categoryDistribution = list.map(el => {
                  let label, value
                  const { range, cnt } = el
                  const ranges = range.split('-')
                  value = cnt
                  if (ranges[1] === '') {
                    label = ranges[0] + '个以上'
                  } else if (ranges[0] === '') {
                    label = `少于${ranges[1]}个`
                  } else {
                    label = range + '个'
                  }
                  return { label, value }
                })
                break
              case 4:
                this.evaluateTheMeanInterval = list.map(el => {
                  let label, value
                  const { range, cnt } = el
                  const ranges = range.split('-')
                  value = cnt
                  if (ranges[1] === '') {
                    label = ranges[0] + '天以上'
                  } else {
                    label = range + '天'
                  }
                  return { label, value }
                })
                break
              case 5:
                this.evaluationTypeDistribution = list.map(el => {
                  let label, value
                  const { range, cnt } = el
                  // label = range
                  // 0:VP评带图片，1:VP评带视频，2:VP评仅文字，3:直评带图片，4:直评带视频，5:直评仅文字
                  switch (+range) {
                    case 0:
                      label = 'VP评带图片'
                      break
                    case 1:
                      label = 'VP评带视频'
                      break
                    case 2:
                      label = 'VP评仅文字'
                      break
                    case 3:
                      label = '直评带图片'
                      break
                    case 4:
                      label = '直评带视频'
                      break
                    case 5:
                      label = '直评仅文字'
                      break

                    default:
                      break
                  }
                  value = cnt
                  return { label, value }
                })
                break

              default:
                break
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
</style>
