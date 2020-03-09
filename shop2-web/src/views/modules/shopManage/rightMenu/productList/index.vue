<template>
	<main-layout 
		@searchTrueData="val => searchData = val"
		:outerParams = "outerParams"
		:searchFields="searchFields" 
		:columns="columns" 
		:topBatchBtn="topBatchBtn"
		:treeTable="true"
		:treeTableOtions = 'treeTableOtions'
		:right-edit-btns="editBtns"
		:checkStrictly = 'false'
		@left-batch-change="handleLeftBatchChange"
		url="shopManage/priceSeoStrategyList"
		ref="layout"
	></main-layout>
</template>
<script>
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
				topBatchBtn: {
				    options: [{label: '开启防跟卖'},{label: '关闭防跟卖'},{label: '开启价格优化'},{label: '关闭价格优化'},{label: '开启流量分析'},{label: '关闭流量分析'},{label: '开启FBA管理'},{label: '关闭FBA管理'},{label: '修改价格'},{label: '修改库存'},
					]
				},
				editBtns: [
				    {
				        name: '手动更新',
				        perm: 'add',
				        fn: () => {
				            
						}
				    },
				],
				searchFields: {
					searchText:{
						placeholder: 'ASIN、SKU'
					},
					priceSeoFlag: {
						hidden: true,
						label: '是否开启价格优化',
						labelWidth: '120px',
						widget: 'select',
						options:[{label:'是',value:true},{label:'否',value:false}]
					},
					antiSaleFlag: {
						hidden: true,
						label: '是否开启防跟卖',
						labelWidth: '110px',
						widget: 'select',
						options:[{label:'是',value:true},{label:'否',value:false}]
					},		
					productFlowFlag: {
						hidden: true,
						label: '是否开启流量分析',
						labelWidth: '120px',
						widget: 'select',
						options:[{label:'是',value:true},{label:'否',value:false}]
					},		
				},
				searchData: {},
				columns: [
					{
						label: 'SKU',
						value:'sellerSku',
						numField: 'childList',
						expand: true,
						noTooltip: true
					},
					{
						label: 'ASIN',
						value:'asin'
					},
					{
						label: '主图',
						value:'imagePath',
						img:true,
						link: row => {
						  return this.storeUrls.asinUrl + row['asin']
						},
						title: 'title',
						width:'70px',
					},
					{
						label: '所属类目',
						value: 'category',
					},
					{
						label: '发货方式',
						value: 'category',
					},
					{
						label: '可售库存',
						value: 'defaultPrice',
						sortable: 'custom',
					},
					{
						label: '默认售价',
						value: 'listingPrice',
						sortable: 'custom',
					},
					{
						label: '当前售价',
						value: 'regularPrice',
						sortable: 'custom',
					},
					{
						label: '是否开启价格优化',
						value: 'priceSeoFlag',
						_enum:{
							false:'关闭',
							true:'开启'
						}
					},
					{
						label: '是否开启防跟卖',
						value: 'antiSaleFlag',
						_enum:{
							false:'关闭',
							true:'开启'
						}
					},
					{
						label: '是否开启流量分析',
						value: 'productFlowFlag',
						_enum:{
							false:'关闭',
							true:'开启'
						}
					},
					{
						label: '是否开启FBA管理',
						value: 'status',
						_enum:{
							false:'关闭',
							true:'开启'
						}
					},
				]
			}
		},
		methods: {
			handleLeftBatchChange(val, selection) {
				let strategyIds = selection.filter(e => e._level === 2).map(el => el.strategyId)
				if(strategyIds && strategyIds.length == 0) return this.$message.warning('不能单独勾选父产品')
				let params = {
					...this.storeInfo,
					strategyIds
				}
				switch (val[0]) {
					case '编辑定时调整价格策略':
						
					break;
				}
			},
		},
		computed:{
			outerParams(){
				return {
					...this.storeInfo,
				}
			}
		},
	}
</script>
