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
				edits: [{
					name: '编辑',
					icon: 'el-icon-edit-outline',
					fn: (scope, item) => {
						this.$refs.layout.$dialog({
							title: '编辑广告组',
							width: '700px',
							top: '10vh',
							params: {
								objectId: scope.row.objectId,
							},
							component: () => import('Views/SuDemo/manual/dialogs/main/adItem/adGroup.vue'),
							okBtnText: '确认',
							cancelBtnText: '取消'
						})
					}
				}],
				searchFields: [
					{
						name: 'objectName',
						labelWidth: '50px',
						label: '广告组',
						placeholder: '请输入广告组'
					},
					{
						placeholder: '组状态',
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
					rptDate: vm.$store.state.pubilcTime.adManualOptimizeTime && vm.$store.state.pubilcTime.adManualOptimizeTime.length ? vm.$store.state.pubilcTime.adManualOptimizeTime :  [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'), dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')],
					ignoreFlag: 0,
				},
				initialParmas: {
					rptDate: vm.$store.state.pubilcTime.adManualOptimizeTime && vm.$store.state.pubilcTime.adManualOptimizeTime.length ? vm.$store.state.pubilcTime.adManualOptimizeTime :  [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'), dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')],
					ignoreFlag: 0,
				},
				editBtns: [
					{
						name: '添加广告组',
						fn: () => {
							vm.$router.push({
								name: 'newManualCreateAd',
								query: {
									objectId: vm.$route.query.groupObjectId,
									targetingType:vm.$route.query.targetingType
								}
							})
						}
					},
					{
						name: '设置组状态',
						dropWidth: '113px',
						showDropBtn: true,
						dropList: [
							
							{
								name: '暂停',
								fn: () => {
									vm.showConfirm('暂停广告组', 'paused', 'adGroupUpdate',6)
								}
							},
							{
								name: '归档',
								fn: () => {
									vm.showConfirm('归档广告组', 'archived', 'adGroupUpdate',6)
								}
							},
							{
								name: '开启',
								fn: () => {
									vm.showConfirm('开启广告组', 'enabled', 'adGroupUpdate',6)
								}
							}
						],
					}, 
					{
						isShowAdStrategy:true,
						adType:2
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
					// {
					// 	name: '导入关键词出价',
					// 	fn: () => {
					// 		
					// 	},					
					// },				
				],
				columns: [{
						label: '广告组',
						value: 'objectName',
						width: '160px',
						align:'left',
						render: (h, scope) => {
							let { objectName, objectId, adGroupFlag } = scope.row
							return ( 
								<a  type = "text"
									class = "url fix__row_1"
									onClick = {
										() => {
											this.$router.push({
												name: 'newAdKeyword',
												query: {
													objectId,
													name: objectName,
													groupObjectId: this.$route.query.groupObjectId || null,
													seriesName: this.$route.query.seriesName,
													adGroupFlag:adGroupFlag,
													targetingType:this.$route.query.targetingType
												}
											})
										}
									} 
								>{objectName}</a>
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
					    label: '默认出价',
					    minWidth: 110,
					    value: 'oldBid',
					    minWidth: '110px',
					    sortable: 'custom',
						render(h,scope){
							let {oldBid} = scope.row
							return (
								<span>
									$ {oldBid}
									<el-tooltip effect="light" placement="top-start">
										<div slot="content">默认出价历史曲线</div>
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
						label: '定时调整默认CPC状态',
						minWidth: 160,
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
				],
			}
		},
		computed: {
			strategyType() {
				return 1
			},
			objectId() {
				return this.strategyType == 0 ?
					'campaign_id' :
					this.strategyType == 1 ?
					'ad_group_id' :
					'keyword_id'
			},
			classifyId() {
				return this.$parent.$parent.$parent.classifyId || null
			},
			outerParams() {
				return {
					...this.storeIds,
					strategyType:1,
					classifyId:this.classifyId,
					objectId:this.$route.query.groupObjectId || null
				}
			},
			parentTree() {
				return this.$parent.$parent.$parent.$parent.$parent.$parent.$refs.treeTaskCustomCategory.data || null
			},
			keyName() {
				return 'CPC'
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
					title: '默认出价历史曲线',
					width: '1200px',
					showMaxBtn: true,
					params: { strategyType: 1, objectId: scope.row.objectId,showGroup:true },
					component: () => import('Views/SuDemo/manual/dialogs/main/echarts/series.vue')
				})
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
				}
				seriesMethod(this,data,selection,params)
			},
			showConfirm( title , type , url , paramsType){
				let data = this.getSelection().map((e)=>{return e.objectId})
				if(data && !data.length) return this.$message.warning('请至少选择一项!')
				this.$confirm(`此操作将${title},是否继续`,'提示',{type:'warning'}).then(()=>{					
					let params = {}
					switch(paramsType){
						case 0:
							params = {
								...this.storeIds,
								strategyType:1,
								objectIds: data,
								status:type
							}
						break;
						case 4:
							params = {
								...this.storeIds,
								strategyType:1,
								ignoreFlag: type,
								objectIds:data
							}
						break;
						case 6:
							params = {
								...this.storeIds,
								state:type,
								adGroupIds:data
							}
						break;
						
						
					}
					this.$api[url](params).then(()=>{
						this.getLayoutList()
					})
				}).catch(()=>{})
			},
			getSummaries(param) {
				
				const { columns, data } = param;
				const sums = [];
				const sums1 = [];
				//循环处理所有列数据
				let indexList = {
					oldBid:6,
					cost:3,
					adOrderCnt:4,
					adConversionRates:5,
					cpc:7,
					acos:8,
					adSales:9,
					impressions:10,
					clicks:11,
					clickRates:12
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
