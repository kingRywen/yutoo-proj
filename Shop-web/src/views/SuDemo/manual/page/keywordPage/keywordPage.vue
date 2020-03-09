<template>
	<div>
		<MainLayout 
			:outerParams="outerParams" 
			:edits="edits" 
			:searchFields="searchFields"
		    :outSearchData="searchData" 
			:editBtns="editBtns" 
			:columns="columns" 
			:searchFunc="searchFunc" 
			:initialParmas="initialParmas"
			:getSummaries = 'getSummaries'
			@changeAdStrategy = 'changeAdStrategy'
			:customEmptyText = 'customEmptyText'
		    ref="layout" 
			url="adManualList">
		</MainLayout>
	</div>
</template>

<script>
	import dayjs from 'dayjs'
	import { totalMethod } from 'Utils/tools'
	import {seriesMethod} from 'Views/SuDemo/manual/js/seriesJs.js'
	export default {
		data() {
			let vm = this
			return {
				edits: [],
				searchFields: [
					{
						name: 'objectName',
						labelWidth: '50px',
						label: '关键词',
						placeholder: '请输入关键词'
					},
					{
						placeholder: '关键词状态',
						name: 'state',
						type: 'select',
						options: [{
								label: '启用',
								value: 'enabled'
							},
							{
								label: '暂停',
								value: 'paused'
							}
						]
					},
					{
						placeholder: '定时调整CPC状态',
						name: 'status',
						type: 'select',
						options: [{
								label: '开启',
								value: 1
							},
							{
								label: '关闭',
								value: 0
							},
							{
								label: '无',
								value: -1
							}
						]
					},
					{
						placeholder: '否定策略状态',
						name: 'ntStatus',
						type: 'select',
						options: [{
								label: '开启',
								value: 1
							},
							{
								label: '关闭',
								value: 0
							},
							{
								label: '无',
								value: -1
							}
						]
					},
					{
						placeholder: '调价策略状态',
						name: 'adjustStatus',
						type: 'select',
						options: [{
								label: '开启',
								value: 1
							},
							{
								label: '关闭',
								value: 0
							},
							{
								label: '无',
								value: -1
							}
						]
					},
					{
						placeholder: '降CPC策略状态',
						name: 'cpcStatus',
						type: 'select',
						options: [{
								label: '开启',
								value: 1
							},
							{
								label: '关闭',
								value: 0
							},
							{
								label: '无',
								value: -1
							}
						]
					},
					{
						placeholder: '是否忽略',
						name: 'ignoreFlag',
						type: 'select',
						options: [{
								label: '否',
								value: 0
							},
							{
								label: '是',
								value: 1
							}
						]
					},
					{
						name: 'rptDate',
						type: 'dateRange',
						placeholder: '请选择',
						clearable: false,
						pickerOptions: {
							disabledDate(time) {
								return time.getTime() > Date.now() - 15 * 3600 * 1000
							}
						}
					}
				],
				searchData: {
					rptDate:vm.$store.state.pubilcTime.adManualOptimizeTime && vm.$store.state.pubilcTime.adManualOptimizeTime.length ? vm.$store.state.pubilcTime.adManualOptimizeTime :  [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'), dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')],
					ignoreFlag: 0,
				},
				initialParmas: {
					rptDate:vm.$store.state.pubilcTime.adManualOptimizeTime && vm.$store.state.pubilcTime.adManualOptimizeTime.length ? vm.$store.state.pubilcTime.adManualOptimizeTime :  [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'), dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')],
					ignoreFlag: 0,
				},
				editBtns: [
					{
						name: `添加关键词`,
						show:()=>{
							return vm.$route.query.targetingType == 'manual'
						},
						fn: () => {
							vm.$nextTick(()=>{
								if(vm.$route.query.adGroupFlag == 1){
									vm.showDialogGlobal('商品投放','1000px',{adGroupId: vm.$route.query.objectId},() => import("@/views/SuDemo/manual/dialogs/main/adItem/productKeyword.vue"),'确认','取消','10vh')
								}else{
									vm.showDialogGlobal('添加关键词','1000px',{adGroupId: vm.$route.query.objectId},() => import("@/views/SuDemo/manual/dialogs/main/adItem/keywordAd.vue"),'确认','取消','10vh')
								}	
							})						
						}
					},
					{
						name: '设置关键词状态',
						disabled: () => {
							return this.$refs.layout && this.$refs.layout.selection.length === 0
						},
						showDropBtn:true,
						dropWidth:'118px',
						dropList: [
							{
								name: '开启',
								fn: () => {
									let data = this.getSelection().map((e)=>{return e.objectId})
									let params = {...this.storeIds,state:'enabled'}
									if(vm.$route.query.adGroupFlag == 1){
										params.targetIds = data
										vm.showConfirmGlobal('adTargetUpdate',params,'开启关键词')
									}else{
										params.keywordIds = data
										vm.showConfirmGlobal('adKeywordUpdate',params,'开启关键词')
									}
								}
							},
							{
								name: '暂停',
								fn: () => {
									let data = this.getSelection().map((e)=>{return e.objectId})
									let params = {...this.storeIds,state:'paused'}
									if(vm.$route.query.adGroupFlag == 1){
										params.targetIds = data
										vm.showConfirmGlobal('adTargetUpdate',params,'暂停关键词')
									}else{
										params.keywordIds = data
										vm.showConfirmGlobal('adKeywordUpdate',params,'暂停关键词')
									}
								}
							},
						],
					},
					{
						isShowAdStrategy:true,
						adType:3
					},
					{
						name: '忽略',
						disabled: () => {
							return this.$refs.layout && this.$refs.layout.selection.length === 0
						},
						showDropBtn:true,
						dropWidth:'88px',
						dropList: [{
								name: '忽略',
								fn: () => {
									vm.showConfirm('忽略',1,'adManualIgnore',4)
								}
							},
							{
								name: '取消忽略',
								fn: () => {
									vm.showConfirm('取消忽略',0,'adManualIgnore',4)
								}
							},
						],
					},					
					{
						name: '关键词出价',
						disabled: selection => {
							return selection.length == 0
						},
						fn: () => {
							vm.$refs.layout.$dialog({
								title: '关键词出价',
								width: '600px',
								params: {
									data: vm.getSelection().map(e => e.objectId),
									adFlag:vm.$route.query.adGroupFlag
								},
								component: () => import("@/views/SuDemo/manual/dialogs/main/adItem/adKeyword.vue"),
								okBtnText: '确认',
								cancelBtnText: '取消'
							});
						}
					}
				],
				columns: [
					{
						label: '关键词',
						value: 'objectName',
						width: '160px',
						align:'left',
						render: (h, scope) => {
							let { objectName, objectId } = scope.row
							return ( 
								<el-tooltip content = {objectName} placement = "top" effect = "light" >
									<a  type = "text"
										class = "url fix__row_1"
										onClick = {
											() => {
												vm.$parent.$parent.$parent.goCustomer(objectId)
											}
										} 
									>{objectName}</a> 
								</el-tooltip>
							)
						}
					},
					{
						label: '状态',
						value: 'state',
						enum: {
							enabled: '启用',
							paused: '暂停'
						}
					},
					{
						label: '匹配类型',
						value: 'matchType',
						enum: {
							exact: '精确匹配',
							phrase: '词组匹配',
							broad: '广泛匹配',
						}
					},
					{
					    label: '花费',
					    value: 'cost',
					    sortable: 'custom',
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
					    label: '关键词出价',
					    value: 'oldBid',
					    minWidth: '110px',
					    sortable: 'custom',
						render(h,scope){
							let {oldBid} = scope.row
							return (
								<span>
									$ {oldBid}
									<el-tooltip effect="light" placement="top-start">
										<div slot="content">关键词出价历史曲线</div>
										<el-button
											type="text"
											style="margin-left:6px"
											class="el-icon-picture-outline"
											onClick={() => { vm.lookAdEcharts(scope) }}
										></el-button>
									</el-tooltip>
								</span>
							)
						}
					},
					{ 
					    label: 'CPC',
					    value: 'cpc',
					    sortable: 'custom',
					},
					{
					    label: 'ACOS',
					    value: 'acos',
					    sortable: 'custom',
					    minWidth: '90px',
					    isPercent:true,
					    keepFew:2
					},
					{
					    label: '广告销售总额',
					    minWidth: 110,
					    value: 'adSales',
					    minWidth: '140px',
					    sortable: 'custom',
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
						label: '定时调整关键词出价',
						minWidth: 180,
						value: 'status',
						enum: {
							'<0': '无',
							0: '关闭',
							1: '开启'
						}
					},
					{
						label: '否定策略状态',
						minWidth: 130,
						value: 'ntStatus',
						enum: {
							'<0': '无',
							0: '关闭',
							1: '开启'
						}
					},
					{
						label: '调价策略',
						minWidth: 130,
						value: 'adjustStatus',
						enum: {
							'<0': '无',
							0: '关闭',
							1: '开启'
						}
					},
					{
						label: '降CPC策略',
						minWidth: 130,
						value: 'cpcStatus',
						enum: {
							'<0': '无',
							0: '关闭',
							1: '开启'
						}
					},
				],
				customEmptyText:"暂无关键词数据　　　　注：新创建的自动广告，需要第二天拉取关键词数据"
			}
		},
		computed: {
			strategyType() {
				return this.$route.query.adGroupFlag == 1 ? 3 : 2
			},
			objectId() {
				return 'keyword_id'
			},
			classifyId() {
				return this.$parent.$parent.$parent.classifyId || null
			},
			outerParams() {
				return {
					...this.storeIds,
					strategyType:this.strategyType,
					classifyId:this.classifyId,
					objectId:this.$route.query.objectId || null
				}
			},
			parentTree() {
				return this.$parent.$parent.$parent.$parent.$parent.$parent.$refs.treeTaskCustomCategory.data || null
			},
			keyName() {
				return this.$route.name === 'newAdKeyword' ? 'CPC' : '预算'
			},
		},
		methods: {
			searchFunc(data) {
				let { rptDate, ...info } = data
				let [startTime, endTime] = rptDate || [];
				this.$store.commit("pubilcTime/adManualOptimizeTime",[startTime,endTime]);
				return { startTime, endTime, ...info }
			},
			lookAdEcharts(scope) {
				this.$refs.layout.$dialog({
					title: '关键词出价历史曲线',
					width: '1200px',
					showMaxBtn: true,
					params: { strategyType: this.strategyType, objectId: scope.row.objectId, showCpc:true },
					component: () => import('Views/SuDemo/manual/dialogs/main/echarts/series.vue')
				})
			},
			showConfirm( title , type , url , paramsType){
				let data = this.getSelection().map((e)=>{return e.objectId})
				if(data && !data.length) return this.$message.warning('请至少选择一项!')
				this.$confirm(`此操作将${title},是否继续`,'提示',{type:'warning'}).then(()=>{					
					let params = {}
					switch(paramsType){
						case 4:
							params = {
								...this.storeIds,
								strategyType:this.strategyType,
								ignoreFlag: type,
								objectIds:data
							}
						break;												
					}
					this.$api[url](params).then(()=>{
						this.getLayoutList()
					})
				}).catch(()=>{})
			},
			changeAdStrategy(data){
				let selection = this.getSelection()
				let params = {
					row:selection,
					objectId: this.objectId,
					strategyType: this.strategyType,
					treeList: this.parentTree,
					parent: this,
					keyName: this.keyName,
					parentObjectId:this.$route.query.objectId || null
				}
				seriesMethod(this,data,selection,params)
			},
			getSummaries(param) {
				
				const { columns, data } = param;
				const sums = [];
				const sums1 = [];
				let indexList = {
					oldBid:7,
					cost:4,
					adOrderCnt:5,
					adConversionRates:6,
					cpc:8,
					acos:9,
					adSales:10,
					impressions:11,
					clicks:12,
					clickRates:13
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
						if(sums[index] == 'Infinity') sums[index] = 0
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
						if(sums[index] == 'Infinity') sums[index] = 0
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
						if(sums[index] == 'Infinity') sums[index] = 0
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