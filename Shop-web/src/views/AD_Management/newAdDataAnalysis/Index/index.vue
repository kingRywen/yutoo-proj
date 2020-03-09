<template>
  <div>
    <MainLayout
      :outerParams="outerParams"
      :edits="edits"
      :leftSpan="4"
      :searchFields="searchFields"
      :outSearchData="searchData"
      :editBtns="editBtns"
      :columns="columns"
      :searchFunc="searchFunc"
      :treeTable="treeTable"
      :initialParmas="initialParmas"
      :treeTableOtions="treeTableOtions"
	  @searchTrueData='searchTrueData'
	  :getSummaries = 'getSummaries'
      ref="layout"
      :editWidth="110"
      url="newAdDataList"
      :backBtn="!(this.$route.name === 'otherNewAd' || this.$route.name === 'newAdDataAnalysis')"
    >
	  <div slot="showWarning">
	    <el-button
	      type="primary"
	      plain
	      size="small"
	      @click="editMonitorMethod"
	      style="position:absolute;right:200px;top:13px;"
	    >
	      修改全局监控频率
	    </el-button>
	  </div>
      <div slot="showRefresh">
        <el-button
          type="primary"
          plain
          size="small"
          @click="setManualUpdate"
          :loading="loadingBtn1"
          :disabled="BTNdisabled"
          style="position:absolute;right:80px;top:13px;"
        >
          {{refreshhtml}}
          <i class="el-icon-refresh el-icon--right"></i>
        </el-button>
      </div>
      <CommonTree
        @add="showDialog('AddGroup', '添加分组', $event)"
        @addNext="showDialog('AddGroup', '添加下级分组', $event)"
        @edit="showDialog('AddGroup', '编辑分组', $event)"
        @del="deleteTreeNode"
        @nodeClick="handleNodeClick"
        :currentNode.sync="currentNode"
        :classifyType="4"
        ref="treeTaskCustomCategory"
        slot="left"
      />
    </MainLayout>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { downloadFile,totalMethod } from 'Utils/tools'
export default {
  data() {
    let vm = this
    return {
      currentNode: {},
      // objectId: 'ad_group_id',
      filterTaskText: '',
      tree1Key: 1,
      tree1Loading: false,
      taskClassify1List: [],
      defaultProps: {
        label: 'classifyName',
        value: 'classifyId',
        children: 'childList'
      },
      show: true,
      treeTable: true,
      treeTableOtions: {
        childs: 'children',
        expandFunc: row => {
          return row.count > 0
        }
      },
      data: {},

      edits: [
        {
          name: '查看',
          icon: 'el-icon-search',
          fn: (scope, item) => {
            this.lookAdEcharts(scope)
          }
        }
      ],
      searchFields: [
        {
          name: 'objectName',
          labelWidth: '75px',
          label: '广告系列',
			placeholder: '请输入广告系列',
        },
		{
          label: '太平洋时间',
          name: 'rptDate',
          type: 'dateRange',
          placeholder: '请选择',
          //required:true,
          clearable:false,
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now() - 15 * 3600 * 1000
            }
          }
        },  
        {
          label: '监控状态',
          labelWidth: '80px',
          name: 'monitorFlag',
          type: 'select',
          options: [
			{
			  label: '开启',
			  value: 1
			},
            {
              label: '关闭',
              value: 0
            },            
          ]
        },
        {
          label: '系列状态',
          labelWidth: '80px',
          name: 'state',
          type: 'select',
          options: [
            {
              label: '启用',
              value:'enabled'
            },
            {
              label: '暂停',
              value:'paused'
            },
			{
				label:'存档',
				value:'archived'
			},
          ]
        },
      ],
      searchData: {
        rptDate: [ dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD') , dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD') ],
        state: "enabled"
      },
      initialParmas: {
        rptDate: [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'),dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')],
        state: "enabled"
      },
      editBtns: [
        {
          name: '移入分组',
          show: () => {
            return this.keyName === '预算'
          },
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
            let data = this.$refs.layout.selection
            if (!data.length) {
              this.$message.warning('请选择数据进行移动')
              return
            }
            this.showDialog('MoveGroup', '移入分组', data)
          }
        },
        {
        	name:'导出',
        	showLoading:true,
        	fn: ()=>{
        		let data = vm.getSelection().map(el=>el.objectId)
        		return vm.exportMethod(data)
        	}
        },
        {
        	name:'取消监控',
        	disabled: selection => {
        	  return selection.length == 0
        	},
        	fn: ()=>{
        		let data = vm.getSelection().map(el=>el.objectId)
        		vm.monMethod(0,data)
        	}
        },
        {
        	name:'开启监控',
        	disabled: selection => {
        	  return selection.length == 0
        	},
        	fn: ()=>{
        		let data = vm.getSelection().map(el=>el.objectId)
        		vm.monMethod(1,data)
        	}
        },
      ],
      columns: [
        {
          label: '广告系列',
          value: 'objectName',
          width: '160px',
          render: (h, scope) => {
            let { objectName, objectId } = scope.row
            return (
              <a
                type="text"
                style="word-wrap:normal;"
                onClick={() => {
                  this.$router.push({
                    name: 'DataAnalysisManualGroup',
                    query: {
                      adType: 1,
                      objectId,
                      name: objectName,
                      classifyId: this.currentNode.classifyId,
					  timeRange:this.timeRange
                    }
                  })
                }}
              >
                {objectName}
              </a>
            )
          }
        },
		{
		  label: '匹配方式',
		  value: 'matchType',
		  enum: {
		    exact: '精确匹配',
		    phrase: '词组匹配',
			broad:'广泛匹配',
		  },
		  isShow:false,
		},
        {
          label: '状态',
          value: 'state',
          enum: {
            enabled: '启用',
            paused: '暂停',
			archived:'存档',
          }
        },
		{
		  label:'当前排名ASIN',
		  value: "asin",
		  minWidth:170,
		  url:'productUrl',
		  isShow:false,
		},
		{
		  label:'SKU',
		  value: "sku",
		  minWidth:170,
		  showTooltip:true,
		  isShow:false,
		},
		{
			label:'主图',
			value:'imageUrl',
			img:true,
			isShow:false,
		},
		{
			label:'排名',
			value:'rank',
			sortable: 'custom',
			isShow:false,
		},
		{
		  label: '投放类型',
		  value: 'targetingType',
		  isShow: false,
		  enum: {
			manual: '手动',
			auto: '自动'
		  }
		},
        {
          label: '广告预算',
          value: 'oldBid',
          width: 90,
          headerTooltip: '最新的广告预算',
          isShow: false,
		  money:'us'
        },
		{
		  label: '花费',
		  value: 'cost',
		  sortable: 'custom',
		  isShow: false,
		  money:'us'
		},
		{
		  label: '订单量',
		  value: 'adOrderCnt',
		  minWidth: '90px',
		  sortable: 'custom'
		},
		{
		  label: '转化率',
		  value: 'adConversionRates',
		  minWidth: '90px',
		  sortable: 'custom',
		  render(h, scope) {
		    let { adConversionRates } = scope.row
		    return (
		      <span>
		        {adConversionRates == null
		          ? '-'
		          : Math.round(adConversionRates * 1000000) / 10000 + '%'}
		      </span>
		    )
		  }
		},
		{
		  label: 'CPC',
		  value: 'cpc',
		  sortable: 'custom'
		},
		{
		  label: 'ACOS',
		  value: 'acos',
		  sortable: 'custom',
		  minWidth: '90px',
		  isShow: false,
		  isPercent:true,
		  keepFew:2
		},
		{
		  label: '广告销售总额',
		  minWidth: 110,
		  value: 'adSales',
		  minWidth: '140px',
		  sortable: 'custom',
		  isShow: false,
		  money:'us'
		},
        {
          label: '曝光量',
          value: 'impressions',
          minWidth: '90px',
          sortable: 'custom'
        },
        {
          label: '点击量',
          value: 'clicks',
          minWidth: '90px',
          sortable: 'custom'
        },
        {
          label: '点击率',
          value: 'clickRates',
          minWidth: '90px',
          sortable: 'custom',
          render(h, scope) {
            let { clickRates } = scope.row
            return (
              <span>
                {clickRates == null
                  ? '-'
                  : Math.round(clickRates * 1000000) / 10000 + '%'}
              </span>
            )
          }
        },
        
        
        
        
        
        
		{
		  label: '监控状态',
		  value: 'monitorFlag',
		  enum: {
			1: '开启',
			0: '关闭'
		  }
		},
        {
          label: '分组',
          value: 'classifyName',
		  width:120,
          isShow: true,
          render(h, scope) {
            let { classifyName } = scope.row
            return classifyName ? classifyName : '未分组'
          }
        }
      ],

      loadingBtn1: false,
      refreshhtml: '手动刷新',
      BTNdisabled: false,
	  
	  
	  time:null
    }
  },
  computed: {
    keyName() {
      return this.$route.name === 'newAdDataAnalysisKeyword'
        ? 'CPC'
        : this.$route.name === 'newAdDataAnalysisGroup'
        ? '默认CPC'
        : '预算'
    },
    adType() {
      if (this.$route.name === 'newAdDataAnalysisGroup') {
        return 1
      } else if (this.$route.name === 'newAdDataAnalysisKeyword') {
        return 2
      } else {
        return 0
      }
    },
    objectId() {
      return this.adType == 0
        ? 'campaign_id'
        : this.adType == 1
        ? 'ad_group_id'
        : 'keyword_id'
    },
    baseParams() {
      return {
        ...this.storeIds,
        adType: this.adType
      }
    },
    outerParams() {
      let { classifyId, objectId, groupObjectId } = this.$route.query
      classifyId = this.currentNode.classifyId || classifyId
      return {
        ...this.storeIds,
        classifyId,
        objectId:
          this.$route.name === 'newAdDataAnalysisGroup'
            ? +groupObjectId
            : +objectId,
        adType: this.adType
      }
    },
	timeRange(){
	  return  this.time
	},
  },
  created() {
    this.updateColumn()
  },
  watch: {
    $route(to) {
      let rptDate= [ dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD') , dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD') ];
        if( this.$route.query && this.$route.query.timeRange){
            rptDate= [ 
              this.$route.query.timeRange[0] || dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'),
              this.$route.query.timeRange[1]  || dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')
            ];
        }
        
      this.searchData = { rptDate , state: "enabled"};
      this.initialParmas = { rptDate , state: "enabled"};
      if (
        to.name === 'newAdDataAnalysis' ||
        to.name === 'newAdDataAnalysisGroup' ||
        to.name === 'newAdDataAnalysisKeyword' ||
        to.name === 'otherNewAd'
      ) {
        this.$refs.layout.resetSort()
		this.$refs.layout.sortData = {}
		this.$refs.layout.clearSelection()
        this.$nextTick(() => {
          this.updateColumn()
          this.$refs.layout && this.$refs.layout.getList(undefined, true)
        })
      }
    },
    sellerData() {
      if (this.siteId && this.sellerId) {
        this.getManualUpdate()
      }
    }
  },
  methods: {
	searchTrueData(v){
	  let { startTime , endTime} = v;
	  this.time = [startTime,endTime]
	},
	monMethod(type,data){
		this.$confirm(`此操作将${type==1?'开启监控':'取消监控'},是否继续`,'提示',{type:'warning'}).then(()=>{
			let params = {
				platformId:this.platformId,
				siteId:this.siteId,
				sellerId:this.sellerId,
				adType:this.adType,
				objectIds:data,
				monitorFlag:type				
			}
			this.$api['newAdDataUpdateMonitoring'](params).then(()=>{
				this.$refs.layout.getList()
			})
		}).catch(()=>{})
	},
	exportMethod(data){
		let params = {
			platformId:this.platformId,
			siteId:this.siteId,
			sellerId:this.sellerId,
			adType:this.adType,
			classifyId: this.currentNode.classifyId,
			objectName:this.$refs.layout.searchTrueData.objectName,
			monitorFlag:this.$refs.layout.searchTrueData.monitorFlag,
			state:this.$refs.layout.searchTrueData.state,
			asin:this.$refs.layout.searchTrueData.asin,
			startTime:this.$refs.layout.searchTrueData.startTime,
			endTime:this.$refs.layout.searchTrueData.endTime,
			sortField:this.$refs.layout.sortData.sortField,
			sortOrder:this.$refs.layout.sortData.sort == 1 ? 'asc' : this.$refs.layout.sortData.sort == 0 ? 'desc' : null,
		}
		if(this.adType){
			if(this.adType==1){
				params.objectId = this.$route.query.groupObjectId
			}
			if(this.adType==2){
				params.objectId = this.$route.query.objectId
			}
		}else{
			params.objectId = null
		}
		
		if(data.length) params.objectIds = data
		return this.$api['newAdDataExportData'](params).then((data)=>{
			downloadFile(data, '广告数据分析')
		})
	},
	editMonitorMethod(){
		this.$refs.layout.$dialog({
			title:'添加优化',
			width:'400px',
			component:()=>import('./dialogs/editMonitor.vue'),
			okBtnText: "确认",
		})
	},
    lookAdEcharts(scope) {
	  let compon = null
	  if(this.adType == 2){
		  compon = () => import('./dialogs/keywordEcharsDialog.vue')
	  }else{
		  compon = () => import('./dialogs/echartsDialog.vue')
	  }
      this.$refs.layout.$dialog({
        title: '数据展示',
        width: '1200px',
        showMaxBtn: true,
        params: { strategyType: this.adType, objectId: scope.row.objectId,url:this.adType==2?'newAdDataAdKeywordHistoryStat':'newAdDataAdHistoryStat'},
        component: compon
      })
    },
    searchFunc(data) {
      let { rptDate, ...info } = data
      let [startTime,endTime] = rptDate || [] ;
      return { startTime,endTime, ...info }
    },
    handleNodeClick(data) {
      let { classifyName: objectName, campaignId, adGroupId, classifyId } = data
      if (data.campaignId) {
        // 点击的是广告系列
        this.$router.push({
          name: 'newAdDataAnalysisGroup',
          query: {
            adType: 1,
            seriesName: objectName,
            groupObjectId: campaignId
            // classifyId: this.currentNode.classifyId
          }
        })
      } else if (data.adGroupId) {
        // 点击的是广告组
        this.$router.push({
          name: 'newAdDataAnalysisKeyword',
          query: {
            adType: 2,
            objectId: adGroupId,
            name: objectName,
            seriesName: this.$route.query.seriesName,
            groupObjectId: this.$route.query.groupObjectId
            // classifyId: this.currentNode.classifyId
          }
        })
      } else {
        // 点击的是自创分组
        this.$refs.layout.resetSort()
        this.$nextTick(() => {
          this.$router.push({ name: 'newAdDataAnalysis' })
        })
      }
    },
    updateColumn() {
      let adType =
        this.$route.name === 'otherNewAd' ||
        this.$route.name === 'newAdDataAnalysis'
          ? 0
          : this.$route.name === 'newAdDataAnalysisGroup'
          ? 1
          : 2

      let el = {},
        searchItemName = null,
        show1,show3,show4,show5,show6,show7,show8,show9,show14,show13,show19,             
        btnsItem = {}
      if (adType == 0) {
        el = {
          label: '广告系列',
          value: 'objectName',
          align: 'left',
          minWidth: '160px',
          render: (h, scope) => {
            let { objectName, objectId } = scope.row
            return (
              <el-tooltip content={objectName} placement="top" effect="light">
                <a
                  title={objectName}
                  class="url fix__row_1"
                  onClick={() => {
                    this.$router.push({
                      name: 'newAdDataAnalysisGroup',
                      query: {
                        adType: 1,
                        seriesName: objectName,
                        groupObjectId: objectId,
                        classifyId: this.currentNode.classifyId,
						timeRange:this.timeRange
                      }
                    })
                  }}
                >
                  {objectName}
                </a>
              </el-tooltip>
            )
          }
        }
        show1=false;show3=false;show4=false;show5=false;show6=false;show7=true;show8=true;show9=true;show14=true;show13=true;show19=true;
        searchItemName = '广告系列'
		if(this.searchFields[2].name === 'asin'){
			  this.searchFields.splice(2,1)
		}
      } else {
        if (adType == 1) {
          el = {
            label: '广告组',
            align: 'left',
            value: 'objectName',
            minWidth: '120px',
            render: (h, scope) => {
              let { objectName, objectId } = scope.row
              return (
                <el-tooltip content={objectName} placement="top" effect="light">
                  <a
                    type="text"
                    class="url fix__row_1"
                    onClick={() => {
                      this.$router.push({
                        name: 'newAdDataAnalysisKeyword',
                        query: {
                          adType: 2,
                          objectId,
                          name: objectName,
                          seriesName: this.$route.query.seriesName,
                          groupObjectId: this.$route.query.groupObjectId,
                          classifyId: this.currentNode.classifyId,
						  timeRange:this.timeRange
                        }
                      })
                    }}
                  >
                    {objectName}
                  </a>
                </el-tooltip>
              )
            }
          }
          show1=false;show3=false;show4=false;show5=false;show6=false;show7=false;show8=false;show9=true;show14=true;show13=true;show19=false;
          searchItemName = '广告组'
			if(this.searchFields[2].name === 'asin'){
				  this.searchFields.splice(2,1)
			}
        } else {
          el = {
            label: '关键词',
            value: 'objectName',
            align: 'left',
            minWidth: '220px',
            showTooltip:true,
          }
          show1=true;show3=true;show4=true;show5=true;show6=true;show7=false;show8=false;show9=false;show14=false;show13=false;show19=false;
          searchItemName = '关键词'
		  if(this.searchFields[2].name !== 'asin'){
			  this.searchFields.splice(2,0,{
			  	name: 'asin',
			  	type:'input',
			  	labelWidth: '75px',
			  	label: '产品',
			  	placeholder: '请输入ASIN/SKU',
			  })
		  }
			
        }
      }
      this.columns.splice(0, 1, el);this.columns[1].isShow = !show1;this.columns[3].isShow = !show3;this.columns[4].isShow = !show4;this.columns[5].isShow = !show5;this.columns[6].isShow = !show6;this.columns[7].isShow = !show7;this.columns[8].isShow = !show8;this.columns[9].isShow = !show9;this.columns[14].isShow = !show14;this.columns[13].isShow = !show13;this.columns[19].isShow = !show19;this.searchFields[0].label = searchItemName;this.searchFields[0].placeholder = `请输入${searchItemName}`;
    },
    sortChange({ column, prop, order }) {},
    getTaskClassifyList() {
      return this.$refs.treeTaskCustomCategory.refreshTree()
    },

    updateTree(type, parentKey) {
      // '添加分组', '添加下级分组', '编辑分组'
      switch (type) {
        case '添加分组':
          this.$refs.treeTaskCustomCategory.updateKeyChildren(parentKey)
          break;
        case '添加下级分组':
          
          break;
        case '编辑分组':
          
          break;
      
        default:
          break;
      }
    },

    showDialog(componentName = 'Add', title, row, edit) {
      
      let params = {
        row,
        objectId: this.objectId,
        adType: this.adType,
        treeList: this.$refs.treeTaskCustomCategory.data,
        parent: this,
        keyName: this.keyName,
        title,
        edit
      }
      if (title === '编辑分组' || title === '添加下级分组') {
        params.row.parentIds = this.$refs.treeTaskCustomCategory.getParentIds(
          row
        )
      }
      if (title === '添加下级分组') {
        params._next = true
      }
      if (title.indexOf('查看') > -1) {
        params.view = true
      }
      this.$refs.layout.$dialog({
        title,
        params,
        size: componentName === 'Add' ? 'medium' : 'small',
        component: () => import(`./dialogs/${componentName}.vue`),
        okBtnText: title.indexOf('查看') > -1 ? null : '确认',
        cancelBtnText: title.indexOf('查看') > -1 ? null : '取消'
      })
    },
    deleteTreeNode(data) {
      let ids = []
      if (!data) {
        ids = this.$refs.treeTaskCustomCategory.getCheckedKeys()
        if (ids.length) {
        } else {
          this.$message.warning('请选择一项进行删除')
          return
        }
      } else {
        ids.push(data.classifyId)
      }

      let params = {
        classifyIds: ids,
        classifyType: 4,
        flag: 1
      }
      this.$confirm('是否删除分组？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.$api[`taskClassifyRemove`](params)
            .then(data => {
              if (ids.indexOf(this.currentNode.classifyId) > -1) {
                this.currentNode = {}
              }
              this.getTaskClassifyList()
              this.$refs.layout.getList()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    //获取更新状态
    getManualUpdate() {
      this.$api['adDataGetLatestTime']({
        //siteId:this.listQuery.siteId,
        //siteId:this.listQuery.siteId,
        siteId: this.siteId,
        sellerId: this.sellerId,
        platformId: this.platformId
      })
        .then(data => {
          // debugger
          const { status, dataTime } = data
          if (status === 0) {
            this.refreshhtml = '更新中'
            this.loadingBtn1 = true
          }
          if (status === 1) {
            this.refreshhtml = '更新成功'
            this.loadingBtn1 = false
            this.BTNdisabled = true
          }
        })
        .catch(err => {
          // if (err && err.code) {
          //   this.refreshhtml = '正在刷新中'
          //   this.loadingBtn1 = true
          // }
        })
    },
    //手动更新
    setManualUpdate() {
      this.$confirm('数据更新可能需要1个小时，是否确认更新?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadingBtn1 = true
          this.refreshhtml = '正在刷新中'
          this.$api['adDataUpdateData']({
            //siteId:this.listQuery.siteId,
            //siteId:this.listQuery.siteId,
            siteId: this.siteId,
            sellerId: this.sellerId,
            platformId: this.platformId
          })
            .then(res => {
              if (res.code === 0) {
                // if(this.listQuery.cusCateId!==null){

                this.handleFilter()
                this.refreshhtml = '正在刷新中'
                this.BTNdisabled = true
                this.loadingBtn1 = false

                // }
              }
            })
            .catch(err => {
              //console.log(err);
              if (err.code === 400) {
                this.BTNdisabled = true
                this.refreshhtml = '今日数据已更新'
                this.loadingBtn1 = false
              } else if (err.code === 500) {
                this.BTNdisabled = true
                this.refreshhtml = '正在刷新中'
              }
            })
        })
        .catch(() => {})
    },
	getSummaries(param) {
		
		const { columns, data } = param;
		const sums = [];
		const sums1 = [];
		//循环处理所有列数据
		let indexList = {
			oldBid:4,
			cost:5,
			adOrderCnt:6,
			adConversionRates:7,
			cpc:8,
			acos:9,
			adSales:10,
			impressions:11,
			clicks:12,
			clickRates:13
		}
		if(this.$route.name === 'newAdDataAnalysisGroup'){
			indexList = {
				oldBid:null,
				cost:3,
				adOrderCnt:4,
				adConversionRates:5,
				cpc:6,
				acos:7,
				adSales:8,
				impressions:9,
				clicks:10,
				clickRates:11
			}
		}
		if(this.$route.name === 'newAdDataAnalysisKeyword'){
			indexList = {
				oldBid:null,
				cost:null,
				adOrderCnt:8,
				adConversionRates:9,
				cpc:10,
				acos:null,
				adSales:null,
				impressions:11,
				clicks:12,
				clickRates:13
			}
		}
		columns.forEach((column, index) => {
		  if (index === 0) {
			sums[index] = '合计';
			return;
		  }
		  if (index === indexList.adOrderCnt || index === indexList.impressions || index === indexList.clicks) {
			 const values = data.map(item => Number(item[column.property]));
			 if (!values.every(value => isNaN(value))) {
				sums[index] = totalMethod(values)
				sums[index] += '';
			 } else {
				sums[index] = '';
			 }
		  }
		  if (index === indexList.oldBid || index === indexList.cost || index === indexList.adSales) {
			 const values = data.map(item => Number(item[column.property]));
			 if (!values.every(value => isNaN(value))) {
				sums[index] = totalMethod(values)
				sums[index] = sums[index].toFixed(2) 
				sums[index] = '$ ' + sums[index];
			 } else {
				sums[index] = '';
			 }
		  }
		  if (index === indexList.acos) {
			 const values1 = data.map(e=>Number(e.cost));
			 const values2 = data.map(e=>Number(e.adSales));
			 if (!values1.every(value => isNaN(value))) {
				sums[index] = totalMethod(values1)			
				sums1[index] = totalMethod(values2)			
				sums[index] = sums[index] / sums1[index]
				sums[index] = sums[index] * 100
				sums[index] = sums[index].toFixed(2)
				if(isNaN(Number(sums[index]))) sums[index] = 0
				if(sums[index] == 'Infinity') sums[index] = 0
				sums[index] += '%';
			 } else {
				sums[index] = '';
			 }
		  }
		  if (index === indexList.cpc) {
			 const values1 = data.map(e=>Number(e.cost));
			 const values2 = data.map(e=>Number(e.clicks));
			 if (!values1.every(value => isNaN(value))) {
				sums[index] = totalMethod(values1)		
				sums1[index] = totalMethod(values2)			
				sums[index] = sums[index] / sums1[index]
				sums[index] = sums[index].toFixed(2) 
				if(isNaN(Number(sums[index]))) sums[index] = 0
				sums[index] += '';
			 } else {
				sums[index] = '';
			 }
		  }
		  if ( index === indexList.clickRates) {
			 const values1 = data.map(e=>Number(e.clicks));
			 const values2 = data.map(e=>Number(e.impressions));
			 if (!values1.every(value => isNaN(value))) {
				sums[index] = totalMethod(values1)			
				sums1[index] = totalMethod(values2)				
				sums[index] = sums[index] / sums1[index]
				sums[index] = sums[index] * 100
				sums[index] = sums[index].toFixed(2)
				if(isNaN(Number(sums[index]))) sums[index] = 0 
				sums[index] += '%';
			 } else {
				sums[index] = '';
			 }
		  }
		  if ( index === indexList.adConversionRates) {
			 const values1 = data.map(e=>Number(e.adOrderCnt));
			 const values2 = data.map(e=>Number(e.clicks));
			 if (!values1.every(value => isNaN(value))) {
				sums[index] = totalMethod(values1)			
				sums1[index] = totalMethod(values2)			
				sums[index] = sums[index] / sums1[index]
				sums[index] = sums[index] * 100
				sums[index] = sums[index].toFixed(2)
				if(isNaN(Number(sums[index]))) sums[index] = 0
				sums[index] += '%';
			 } else {
			 	sums[index] = '';
			 }
		  }
		});
			 
		return sums;
	},
  }
}
</script>

<style>
</style>
