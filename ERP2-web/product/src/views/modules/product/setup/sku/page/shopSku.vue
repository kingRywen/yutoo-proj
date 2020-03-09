<template>
	<div>
		<MainLayout 
			:topBatchBtn="topBatchBtn"
		    :outerParams="outerParams" 
			:edit-btns="edits" 
			@left-batch-change="handleLeftBatchChange" 
			:right-edit-btns="editBtns"
		    :columns="columns" 
			:searchFunc="searchFunc" 			
			:searchFields="searchFields"
			ref="layout" 
			url="product/PrConfigSkuRuleList">
		</MainLayout>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				topBatchBtn: {
					title: '规则',
					props: {
						label: 'label',
						value: 'label',
						expandTrigger: 'hover'
					},
					options: [
						{label: '删除'}
					],
					search: {
						field: 'keyword',
						placeholder: '请输入规则名称'
					}
				},
				searchFields: {
					activateFlag: {
					    labelWidth: '90px',
					    widget: 'select',
					    label: '是否激活',
					    options: [
							{label:'是',value:1},
							{label:'否',value:0}
						]
					},
				    createTime: {
						widget: 'daterange',
						label: '添加时间',
						time: true
				    },	
					
				},
				edits: [
					{
						name: '编辑',
						perm: 'addTask',
						fn: scope => {
							this.showDialog('编辑规则','100%',{type:'shop',edit:true,skuRuleId:scope.row.skuRuleId}, () => import('../dialog/add.vue'), '确认', '取消')
						}
					},
					{
						name: '删除',
						fn: scope => {						
							let params = {idArray:[scope.row.skuRuleId]}
							this.showConfirm('product/PrConfigSkuRuleRemove',params,'删除')						
						}
					},
					{
						name: '操作日志',
						fn: () => {
							this.showDialog('操作日志','100%',{}, () => import('Views/modules/product/setup/common/log.vue'))
						}
					}
				],
				editBtns: [
					{
						name: '添加规则',
						perm: 'addTask',
						fn: () => {
							this.showDialog('添加规则','100%',{type:'shop'}, () => import('../dialog/add.vue'), '确认', '取消')
						}
					},
				],
				columns: [
					{
						label: '规则名称',
						value: 'ruleName',
					},
					{
						label: '是否激活',
						value: 'activateFlag',
						_enum:{
							0:'否',
							1:'是'
						}
					},
					{
						label: '应用店铺',
						value: 'storeName',
					},
					{
						label: '公式',
						value: 'ruleFormal',
						showTooltip:true
					},
					{
						label: '添加日期',
						value: 'createTime',
						sortable: true,
					},
					{
						label: '添加人员',
						value: 'userName',
					},
					{
						label: '规则描述',
						value: 'ruleDesc',
					},
				]
			};
		},
		methods: {
			searchFunc(data) {
				let { createTime , ...el } = data
				let [ queryCreateStartTime , queryCreateEndTime ] = createTime || []
				return {queryCreateStartTime,queryCreateEndTime,...el};
			},
			handleLeftBatchChange(val, selection) {
				let data = selection.map(e=>e.skuRuleId)
				let params = {idArray:data}
				switch(val[0]){
					case '删除':					
						this.showConfirm('product/PrConfigSkuRuleRemove',params,'删除')
					break;
				}				
			},		
		},
		computed:{
			outerParams(){
				return {
					ruleUseType : 1
				}			
			},
		}
	};
</script>
