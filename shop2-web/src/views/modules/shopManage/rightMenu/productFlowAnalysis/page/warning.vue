<template>
	<main-layout 
		@searchTrueData="val => searchData = val"
	    :outerParams = "outerParams"
		:searchFields="searchFields" 
		:columns="columns" 
		edit-width="160px" 
		:topBatchBtn="topBatchBtn"
		@left-batch-change = 'leftBatchChange'
		:right-edit-btns="editBtns"
		:treeTable="dynaTreeTable" 
		:treeTableOtions="treeTableOtions" 
		:searchDefaultData = 'searchDefaultData'
		:url="dynaUrl"
		:tip="dynaTip"
		ref="layout"
		:key = 'isShowTab'
	></main-layout>
</template>
<script>
	import { downloadFile } from 'Utils'
	export default {
		data() {
			let vm = this
			return {
				treeTableOtions: {
					childs: 'childList',
					expandFunc: row => {
						return row.childList && row.childList.length > 0
					}
				},
				searchDefaultData:{
					warningType:0
				},
				searchData: {},
				topBatchBtn: {
				    options: [
						{
							label:'导出Excel'
						},
						{
							label:'删除'
						}
					]
				},
				isShowTab:1,
				dynaTreeTable:true,
				dynaUrl:'shopManage/productFlowSkuListWarn',
				dynaTip:'只分析添加的产品，流量数据需要导入流量报告，广告数据需要授权广告API，默认展示导入流量报告最近更新时间当日数据。',
				searchFields: {
					warningType: {
					  widget: 'radio',
					  options: [{ label: '所有产品', value: 0 },{ label: '问题父产品', value: 1 },{ label: '问题子产品', value: 2 }],
					  isCanCelList:true,
					  change: e => {
						let show3,show4,show5,show6,show7,show8,show9,show10,show11,show12
						if(e.warningType === 0){
							vm.searchDefaultData.warningType = 0
							vm.topBatchBtn = {options: [{label:'导出Excel'},{label:'删除'}]}
							vm.editBtns = [{name: '添加',perm: 'add',fn: () => {vm.showDialogGlobal(`添加任务`, '100%', {}, () => import('../dialogs/add.vue'))}},{name: '导入流量报告',perm: 'add',fn: () => {vm.$router.push({path:'/common/trafficReportImport'})}},]
							vm.dynaTreeTable = true
							vm.dynaUrl = 'shopManage/productFlowSkuListWarn'
							vm.dynaTip = '只分析添加的产品，流量数据需要导入流量报告，广告数据需要授权广告API，默认展示导入流量报告最近更新时间当日数据。'
							show3=false;show4=false;show5=false;show6=false;show7=false;show8=false;show9=false;show10=true;show11=true;show12=true;
							vm.isShowTab = 1
						}else if(e.warningType === 1){
							vm.searchDefaultData.warningType = 1
							vm.topBatchBtn = {options: [{label:'导出Excel'}]}
							vm.editBtns = [{name: '导出Excel',perm: 'add',fn: () => {vm.expReview(undefined, null, this.searchData)}}]
							vm.dynaTreeTable = false
							vm.dynaUrl = 'shopManage/productFlowSkuListWarnToParentSku'
							vm.dynaTip = '排名低于订单排名的数据才会展示并且用红色标记。'
							show3=true;show4=true;show5=true;show6=true;show7=true;show8=true;show9=true;show10=false;show11=false;show12=false;
							vm.isShowTab = 2
						}else if(e.warningType === 2){
							vm.searchDefaultData.warningType = 2
							vm.topBatchBtn = {options: [{label:'导出Excel'}]}
							vm.editBtns = [{name: '导出Excel',perm: 'add',fn: () => {vm.expReview(undefined, null, this.searchData)}}]
							vm.dynaTreeTable = true
							vm.dynaUrl = 'shopManage/productFlowSkuListWarnToSku'
							vm.dynaTip = '排名低于订单排名的数据才会展示并且用红色标记。'
							show3=true;show4=true;show5=true;show6=true;show7=true;show8=true;show9=true;show10=false;show11=false;show12=false;
							vm.isShowTab = 3
						}
						vm.columns[3].isShow=show3;vm.columns[4].isShow=show4;vm.columns[5].isShow=show5;vm.columns[6].isShow=show6;vm.columns[7].isShow=show7;vm.columns[8].isShow=show8;vm.columns[9].isShow=show9;vm.columns[10].isShow=show10;vm.columns[11].isShow=show11;vm.columns[12].isShow=show12;
					  },
					},
					searchText: {
						placeholder: 'ASIN 、SKU',
						labelWidth: '70px'
					},
					time: {
						hidden: true,
						widget: 'daterange',
						label: '日期',
						fields: ['startTime', 'endTime']
					},
				},
				editBtns: [
					{
						name: '添加',
						perm: 'add',
						fn: () => {
							this.showDialogGlobal(`添加任务`, '100%', {}, () => import('../dialogs/add.vue'))
						}
					},
					{
						name: '导入流量报告',
						perm: 'add',
						fn: () => {
							this.$router.push({
								path:'/common/trafficReportImport'
							})
						}
					},
				],
				columns: [
					{
						label: 'SKU',
						value: 'sellerSku',
						numField: 'childList',
						width:'400px',
						expand: true,
						noTooltip:true,
						render(h, scope) {
							let {sellerSku,asin} = scope.row
							return <a href={vm.storeUrls.asinUrl + asin} target="_blank" type="text">{sellerSku}</a>
						}
					},
					//123/
					{
						label: 'ASIN',
						width:'200px',
						value:'asin'
					},
					{
						label: '主图',
						width:'80px',
						value: 'imagePath',
						img:true,
					},
					{
					    label: "访客数",
						isShow:false,
					    merge:[
					        {
								label: "总数", 
								width:'60px',
					            value: "sessions",							
								sortable: 'custom',
					        },
							{
								label: "广告", 
								width:'60px',
							    value: "adSessions",
								sortable: 'custom',
							},
							{
								label: "自然", 
								width:'60px',
							    value: "normalSessions",
								sortable: 'custom',
							},
					    ],
					},
					{
					    label: "订单量",
						isShow:false,
					    merge:[
					        {
								label: "总数", 
								width:'60px',
					            value: "orderCnt",
								sortable: 'custom',
					        },
							{
								label: "广告", 
								width:'60px',
							    value: "adOrderCnt",
								sortable: 'custom',
							},
							{
								label: "自然", 
								width:'60px',
							    value: "normalOrderCnt",
								sortable: 'custom',
							},
					    ],
					},
					{
					    label: "转化率",
						isShow:false,
					    merge:[
					        {
								label: "总数", 
								width:'60px',
					            value: "conversionRates",
								isPercent:true,
								sortable: 'custom',
					        },
							{
								label: "广告", 
								width:'60px',
							    value: "adConversionRates",
								isPercent:true,
								sortable: 'custom',
							},
							{
								label: "自然", 
								width:'60px',
							    value: "normalConversionRates",
								isPercent:true,
								sortable: 'custom',
							},
					    ],
					},
					{
						label: '购物车获得率',
						value: 'buyBoxPercentage',
						width:'100px',
						isPercent:true,
						isShow:false,
						sortable: 'custom',
					},
					{
						label: '广告曝光量',
						value: 'impressions',
						width:'100px',
						sortable: 'custom',
						isShow:false,
					},
					{
						label: '广告点击率',
						value: 'adClickRates',
						width:'100px',
						isPercent:true,
						sortable: 'custom',
						isShow:false,
					},
					{
						label: '预警内容',
						value: 'pdWarnContents',
						isShow:false,
						minWidth:'300px',
						render(h,scope){
							let {pdWarnContents} = scope.row
							let num = 0
							if(pdWarnContents && pdWarnContents.length) num = pdWarnContents.length - 1
							return pdWarnContents !== undefined && num ? (
								<el-button onClick={ ()=>{ vm.showDialog(pdWarnContents)} }>{pdWarnContents[0].warnContent}<span style="color:rgb(0,167,226)">+{num}</span></el-button>
							) : pdWarnContents !== undefined && !num ? (
								<el-button onClick={ ()=>{ vm.showDialog(pdWarnContents)} }>{pdWarnContents[0].warnContent}</el-button>
							) : (
								<span>-</span>
							)
							
						}
					},
					//123/
					{
						label: '访客数',
						value: 'sessions',
						sortable: 'custom',
						isShow:true,
						render(h,scope){
							let {sessions,sessionsType} = scope.row
							return sessions !== undefined ? sessionsType ? (
								<span style="color:rgb(245,108,108);">{sessions}</span>
							) : (
								<span>{sessions}</span>
							) : (
								<span>-</span>
							)
						}
					},
					//123/
					{
						label: '订单量',
						value: 'orderCnt',
						sortable: 'custom',
						isShow:true,
					},
					{
						label: '转化率',
						value: 'conversionRates',
						isPercent:true,
						sortable: 'custom',
						isShow:true,
						render(h,scope){
							let {conversionRates,cvrType} = scope.row
							return conversionRates !== undefined ? cvrType ? (
								<span style="color:rgb(245,108,108);">{conversionRates}</span>
							) : (
								<span>{conversionRates}</span>
							) : (
								<span>-</span>
							)
						}
					},
					//123/
				]
			}
		},
		methods: {
			showDialog(data){
				this.showDialogGlobal(`预警提示`, '100%', {data}, () => import('../dialogs/table.vue'),'','关闭')
			},
			leftBatchChange(type,data){
				let sellerSkus = data.map(e=>e.sellerSku)
				let params = {
					...this.storeInfo,
					sellerSkus
				}
				switch(type[0]){
					case '导出Excel':
						this.expReview(sellerSkus, 0, true)
					break;
					case '删除':
						this.showConfirmGlobal('shopManage/productFlowSkuRemove',params,'删除')
					break;
				}
			},
			expReview(sellerSkus, exportType, setLoading, searchData) {
				setLoading && (this.topBatchBtn.loading = true)
				return this.$api[`${this.isShowTab === 1 ? 'shopManage/productFlowSkuListWarnExport' : this.isShowTab === 2 ? 'shopManage/productFlowSkuListWarnToParentSkuExport' : 'shopManage/productFlowSkuListWarnToSkuExport'}`]({
					sellerSkus,
					...this.outerParams,
					exportType,
					...searchData
				})
			    .then(data => {
					setLoading && (this.topBatchBtn.loading = false)
					let ext = exportType ? 'csv' : 'xlsx'
					downloadFile(data, `流量预警.${ext}`)
			    })
			    .catch(err => {
					setLoading && (this.topBatchBtn.loading = false)
					return Promise.reject(err)
			    })
			},
		},
		computed:{
			outerParams(){
				return {
					...this.storeInfo,
				}
			},	
		},
	}
</script>
