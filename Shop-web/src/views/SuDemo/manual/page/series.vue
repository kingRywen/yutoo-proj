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
		    ref="layout" 
			url="adManualList" 
			>
		</MainLayout>
	</div>
</template>

<script>
	import dayjs from 'dayjs'
	import { totalMethod } from 'Utils/tools'
	import {seriesMethod} from './../js/seriesJs.js'
	export default {
		data() {
			let vm = this
			return {
				edits: [{
					name: '编辑',
					icon: 'el-icon-edit-outline',
					fn: (scope, item) => {
						this.$refs.layout.$dialog({
							title: '编辑广告系列',
							width: '600px',
							top:'10vh',
							params: {
								objectId:scope.row.objectId,
							},
							component: () => import('Views/SuDemo/manual/dialogs/main/adItem/adSeries.vue'),
							okBtnText:'确认',
							cancelBtnText:'取消'
						})
					}
				}],
				searchFields: [
					{
						name: 'objectName',
						labelWidth: '60px',
						label: '广告系列',
						placeholder: '请输入广告系列'
					},
					{
						placeholder: '系列状态',
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
						placeholder: '定时调整预算状态',
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
					rptDate: vm.$store.state.pubilcTime.adManualOptimizeTime && vm.$store.state.pubilcTime.adManualOptimizeTime.length ? vm.$store.state.pubilcTime.adManualOptimizeTime : [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'), dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')],
					ignoreFlag: 0,
				},
				initialParmas: {
					rptDate: vm.$store.state.pubilcTime.adManualOptimizeTime && vm.$store.state.pubilcTime.adManualOptimizeTime.length ? vm.$store.state.pubilcTime.adManualOptimizeTime :  [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'), dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')],
					ignoreFlag: 0,
				},
				editBtns: [
					{
						name: '移入分组',
						disabled: () => {
							return this.$refs.layout && this.$refs.layout.selection.length === 0
						},
						fn: () => {
							let data = this.$refs.layout.selection
							this.showDialog('MoveGroup', '移入分组', data)
						}
					},
					{
						name: '添加广告',
						showDropBtn:true,
						dropWidth:'120px',
						dropList: [
							{
								name: '添加单个',
								fn: () => {
									vm.$router.push({
										name:'newManualCreateAd'
									})
								}
							},
							{
								name: '批量导入添加',
								fn: () => {
									vm.$refs.layout.$dialog({
									    title:'批量导入添加',
									    width:'500px',
									    params:{
									        fn:vm.$refs.layout.closeDialog,
									        success: vm.$refs.layout.getList
									    },
									    component: () => import("Views/SuDemo/manual/dialogs/main/import.vue"),
									    cancelBtnText:'关闭',
									}); 
								}
							},
							{
								name: '导入日志',
								fn: () => {
									vm.$router.push({
										name: "AdLog",
										query:{
										    type: 3
										}
									})
								}
							},
						],
					},
					{
						name: '设置系列状态',
						showDropBtn:true,
						dropWidth:'124px',
						dropList: [
							{
								name: '暂停',
								fn: () => {
									vm.showConfirm('暂停广告','paused','adCampaignUpdate',1)
								}
							},
							{
								name: '归档',
								fn: () => {
									vm.showConfirm('归档广告','archived','adCampaignUpdate',1)
								}
							},
							{
								name:'开启',
								fn: ()=>{
									vm.showConfirm('开启广告','enabled','adCampaignUpdate',1)
								}
							}
						],
					},
					{
						isShowAdStrategy:true,
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
									vm.showConfirm('忽略',1,'adManualIgnore',6)
								}
							},
							{
								name: '取消忽略',
								fn: () => {
									vm.showConfirm('取消忽略',0,'adManualIgnore',6)
								}
							},
						],
					},
					{
						name: '修改预算',
						disabled: () => {
							return this.$refs.layout && this.$refs.layout.selection.length === 0
						},
						fn:()=>{
							let data = this.$refs.layout.selection
							this.showDialog('changeBudget', '修改预算', data)
						}
					},
				],
				columns: [
					{
						label: '广告系列',
						value: 'objectName',
						width: '160px',
						align:'left',
						render: (h, scope) => {
							let {
								objectName,
								objectId,
								targetingType
							} = scope.row
							return ( <a 
							    type = "text"
								class = "url fix__row_1"
								onClick = {
									() => {
										this.$router.push({
											name: 'newAdGroup',
											query: {
												groupObjectId: objectId,
												seriesName: objectName,
												targetingType:targetingType
											}
										})
									}
								}>{objectName}</a>
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
						label: '投放类型',
						value: 'targetingType',
						enum: {
							auto: '自动',
							manual: '手动'
						}
					},
					{
						label: '竞价',
						value: 'premiumBidAdjustment',
						enum: {
							true: '启用',
							false: '暂停'
						}
					},
					{
						label: '广告预算',
						value: 'oldBid',
						width: 120,
						headerTooltip: '最新的广告预算',
						sortable: 'custom',
						render(h,scope){
							let {oldBid} = scope.row
							return (
								<span>
									$ {oldBid}
									<el-tooltip effect="light" placement="top-start">
										<div slot="content">广告预算历史曲线</div>
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
					    label: 'CPC',
					    value: 'cpc',
					    sortable: 'custom'
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
						label: '调整预算状态',
						minWidth: 110,
						value: 'status',
						enum: {
							'<0': '无',
							0: '关闭',
							1: '开启'
						}
					},
					{
						label: '否定策略状态',
						minWidth: 110,
						value: 'ntStatus',
						enum: {
							'<0': '无',
							0: '关闭',
							1: '开启'
						}
					},
					{
						label: '调价策略',
						minWidth: 90,
						value: 'adjustStatus',
						enum: {
							'<0': '无',
							0: '关闭',
							1: '开启'
						}
					},
					{
						label: '降CPC策略',
						minWidth: 90,
						value: 'cpcStatus',
						enum: {
							'<0': '无',
							0: '关闭',
							1: '开启'
						}
					},
					{
						label: '广告暂停策略',
						minWidth: 110,
						value: 'pausedStatus',
						enum: {
							'<0': '无',
							0: '关闭',
							1: '开启'
						}
					},
					{
						label: '分组',
						value: 'classifyName',
						render(h, scope) {
							let {
								classifyName
							} = scope.row
							return classifyName ? ( 
								<el-tooltip content={classifyName} effect = "light" placement = "top">
									<span class = "fix__row_1">{classifyName}</span>
								</el-tooltip>
							) : '未分组'
						}
					}
				],

				loadingBtn1: false,
				refreshhtml: '手动刷新',
				BTNdisabled: false,
			}
		},
		computed: {
			strategyType() {
				return 0
			},
			objectId() {
				return this.strategyType == 0 ?
					'campaign_id' :
					this.strategyType == 1 ?
					'ad_group_id' :
					'keyword_id'
			},
			classifyId() {
				return this.$parent.$parent.$parent.currentNode.classifyId || null
			},
			outerParams() {
				return {
					...this.storeIds,
					strategyType:0,
					classifyId:this.classifyId,				
				}
			},
			parentTree() {
				return this.$parent.$parent.$parent.$refs.treeTaskCustomCategory.data || null
			},
			keyName() {
				return this.$route.name === 'newAdKeyword' ? 'CPC' : '预算'
			},
		},
		methods: {
			changeAdStrategy(data){
				let selection = this.getSelection()
				let params = {
					row:selection,
					objectId: this.objectId,
					strategyType: this.strategyType,
					treeList: this.parentTree,
					parent: this,
					keyName: this.keyName,
				}
				seriesMethod(this,data,selection,params)
			},
			showConfirm( title , type , url , paramsType){
				let data = this.getSelection().map((e)=>{return e.objectId})
				if(data && !data.length) return this.$message.warning('请至少选择一项!')
				this.$confirm(`此操作将${title},是否继续`,'提示',{type:'warning'}).then(()=>{					
					let params = {}
					switch(paramsType){
						case 1:
							params = {
								...this.storeIds,
								state:type,
								campaignIds:data
							}
						break;
						case 6:
							params = {
								...this.storeIds,
								strategyType:0,
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
			showDialog(componentName, title, row, edit) {
				let params = {
					row,
					objectId: this.objectId,
					strategyType: this.strategyType,
					treeList: this.parentTree,
					parent: this,
					keyName: this.keyName,
					title,
					edit
				}
				this.$refs.layout.$dialog({
					title,
					params,
					width:componentName === 'addPrivative' || componentName === 'changePrice' || componentName === 'lowerCpc' || componentName === 'changeBudget' ? '600px' : componentName === 'MoveGroup' ? '500px' : componentName === 'noWord' ? '1000px' : '800px',
					component: () => import(`../dialogs/main/${componentName}.vue`),
					okBtnText: '确认',
					cancelBtnText: '取消'
				})
			},
			searchFunc(data) {
				let { rptDate, ...info } = data
				let [startTime, endTime] = rptDate || [];
				this.$store.commit("pubilcTime/adManualOptimizeTime",[startTime,endTime]);
				return { startTime, endTime, ...info }
			},
			lookAdEcharts(scope) {
				this.$refs.layout.$dialog({
					title: '广告预算历史曲线',
					width: '1200px',
					showMaxBtn: true,
					params: { strategyType: 0, objectId: scope.row.objectId },
					component: () => import('Views/SuDemo/manual/dialogs/main/echarts/series.vue')
				})
			},
			getSummaries(param) {
				const { columns, data } = param;
				const sums = [];
				const sums1 = [];
				console.log(param)
				let indexList = {
					oldBid:5,
					cost:6,
					adOrderCnt:7,
					adConversionRates:8,
					cpc:9,
					acos:10,
					adSales:11,
					impressions:12,
					clicks:13,
					clickRates:14
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

<style>
</style>
