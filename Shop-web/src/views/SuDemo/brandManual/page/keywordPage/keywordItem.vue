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
		    ref="layout" 
			url="adManualList">
		</MainLayout>
	</div>
</template>

<script>
	import dayjs from 'dayjs'
	import { totalMethod } from 'Utils/tools'
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
						name: '添加关键词',
						fn: () => {
							vm.$refs.layout.$dialog({
								title: '添加关键词',
								width: '1000px',
								top: '10vh',
								params: {
									campaignId: vm.$route.query.objectId
								},
								component: () => import("Views/SuDemo/brandManual/dialogs/keyword/keywordBrand.vue"),
								okBtnText: '确认',
								cancelBtnText: '取消'
							});
						}
					},
					{
						name: '设置关键词状态',
						showDropBtn:true,
						dropWidth:'124px',
						dropList: [
							{
								name: '暂停',
								fn: () => {
									vm.showConfirm('暂停关键词', 'paused', 'adKeywordBrandUpdate',5)
								}
							},
							{
								name: '归档',
								fn: () => {
									vm.showConfirm('暂停关键词','archived','adKeywordBrandUpdate',5)
								}
							},
							{
								name:'开启',
								fn: ()=>{
									vm.showConfirm('开启关键词', 'enabled', 'adKeywordBrandUpdate',5)
								}
							}
						],
					},
					{
						name: '定时调整关键词竞价策略',
						disabled: () => {
							return this.$refs.layout && this.$refs.layout.selection.length === 0
						},
						showDropBtn:true,
						dropWidth:'173px',
						dropList: [{
								name: '添加',
								fn: () => {
									let data = this.$refs.layout.selection
									this.showDialog('addBudget', '添加定时调整关键词竞价策略', data,false,'1010px')
								}
							},
							{
								name: '编辑',
								fn: () => {
									let data = this.$refs.layout.selection
									this.showDialog('addBudget',`编辑定时调整关键词竞价策略`,data,true,'1010px')
								}
							},
							{
								name: '开启',
								fn: () => {
									vm.showConfirm('开启定时调整关键词竞价策略',1,'adManualUpdateStrategyStatus',0)
								}
							},
							{
								name: '关闭',
								fn: () => {
									vm.showConfirm('关闭定时调整关键词竞价策略',0,'adManualUpdateStrategyStatus',0)
								}
							},
						],
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
						name: '修改关键词出价',
						disabled: selection => {
							return selection.length == 0
						},
						fn: () => {
							vm.$refs.layout.$dialog({
								title: '修改关键词出价',
								width: '600px',
								params: {
									data: vm.getSelection().map(e => e.objectId)
								},
								component: () => import("Views/SuDemo/brandManual/dialogs/keyword/keywordChangeCPC.vue"),
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
							paused: '暂停',
							pending: '待审核'
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
					    sortable: 'custom',
						minWidth: '110px',
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
						label: '品牌新买家订单数量',
						minWidth: 160,
						value: 'adNewOrderCnt',
						sortable: 'custom'
					},
					{
						label: '品牌新买家订单百分比',
						minWidth: 180,
						value: 'adNewOrderCntRates',
						sortable: 'custom',
						isPercent:true,
						keepFew:2
					},
					{
						label: '品牌新买家销售额',
						minWidth: 160,
						value: 'adNewSales',
						sortable: 'custom',
						money:'us'
					},
					{
						label: '品牌新买家销售额百分比',
						minWidth: 180,
						value: 'adNewSalesRates',
						sortable: 'custom',
						isPercent:true,
						keepFew:2
					},
					{
						label: '定时调整CPC状态',
						minWidth: 160,
						value: 'status',
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
				return 5
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
					params: { strategyType: this.strategyType, objectId: scope.row.objectId,showCpc:true },
					component: () => import('Views/SuDemo/brandManual/dialogs/series/echartsDialog.vue')
				})
			},
			showDialog(componentName, title, row, edit, width = '600px') {
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
					width:width,
					component: () => import(`Views/SuDemo/brandManual/dialogs/series/${componentName}.vue`),
					okBtnText:'确认',
					cancelBtnText:'取消'
				})
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
								strategyType:this.strategyType,
								objectIds: data,
								status:type
							}
						break;
						case 4:
							params = {
								...this.storeIds,
								strategyType:this.strategyType,
								ignoreFlag: type,
								objectIds:data
							}
						break;
						case 5:
							params = {
								...this.storeIds,
								state:type,
								keywordIds:data
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
					clickRates:13,
					adNewOrderCnt:14,
					adNewOrderCntRates:15,
					adNewSales:16,
					adNewSalesRates:17,
				}
				columns.forEach((column, index) => {
				  if (index === 0) {
					sums[index] = '合计';
					return;
				  }
				  if (index === indexList.adOrderCnt || index === indexList.impressions || index === indexList.clicks || index === indexList.adNewOrderCnt) {
					 const values = data.map(item => Number(item[column.property]));
					 if (!values.every(value => isNaN(value))) {
						sums[index] = totalMethod(values)
						sums[index] += '';
					 } else {
						sums[index] = '';
					 }
				  }
				  if (index === indexList.oldBid || index === indexList.cost || index === indexList.adSales  || index === indexList.adNewSales) {
					 const values = data.map(item => Number(item[column.property]));
					 if (!values.every(value => isNaN(value))) {
						sums[index] = totalMethod(values)
						sums[index] = sums[index].toFixed(2) 
						sums[index] = '$ ' + sums[index];
					 } else {
						sums[index] = '';
					 }
				  }
				  if (index === indexList.adNewOrderCntRates || index === indexList.adNewSalesRates) {
					 const values = data.map(item => Number(item[column.property]));
					 if (!values.every(value => isNaN(value))) {
						sums[index] = totalMethod(values)
						sums[index] += '%';
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