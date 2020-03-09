<template>
	<div>
		<MainLayout 
			:topBatchBtn="topBatchBtn"
			:edit-btns="edits" 
			@left-batch-change="handleLeftBatchChange" 
			:right-edit-btns="editBtns"
		    :columns="columns" 
			:searchFunc="searchFunc" 			
			:searchFields="searchFields"
			ref="layout" 
			url="product/prSellStrategyAmzList">
		</MainLayout>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				topBatchBtn: {
					title: '策略',
					props: {
						label: 'label',
						value: 'label',
						expandTrigger: 'hover'
					},
					options: [
						{label: '删除'},
						{label: '激活'},
						{label: '禁用'},
					],
					search: {
						field: 'strategyName',
						placeholder: '请输入策略名称'
					}
				},
				searchFields: {									
				  createTime: {
				    widget: 'daterange',
				    label: '添加时间',
				    time: true // 是否显示时间
				  },	
					strategyType: {
					  labelWidth: '90px',
					  widget: 'select',
					  label: '类型',
					  options: [
							{label:'每日',value:0},
							{label:'周一到周日',value:1}
						]
					},
				},
				edits: [
					{
						name: '编辑',
						fn: scope => {
							this.showDialog('编辑策略','100%',{edit:true,row:scope.row,strategyId:scope.row.strategyId}, () => import('./dialog/add.vue'), '确认', '取消')
						}
					},
					{
						name: '复制添加',
						fn: scope => {
							this.showDialog('编辑策略','100%',{copyAdd:true,edit:true,row:scope.row,strategyId:scope.row.strategyId}, () => import('./dialog/add.vue'), '确认', '取消')
						}
					},
					{
						name: '删除',
						fn: scope => {
							let params = {strategyIds:[scope.row.strategyId]}
							this.showConfirm('product/prSellStrategyAmzRemove',params,'删除')
						}
					},
					{
						name: '操作日志',
						fn: () => {
							this.showDialog('操作日志','100%',{}, () => import('Views/modules/product/setup/common/log.vue'))
						}
					}
				],
				editBtns: [{
					name: '添加',
					perm: 'addTask',
					fn: () => {
						this.showDialog('添加策略','100%',{}, () => import('./dialog/add.vue'), '确认', '取消')
					}
				}],
				columns: [
					{
						label: '策略名称',
						value: 'strategyName',
					},
					{
						label: '类型',
						value: 'strategyType',
						_enum:{
							0:'每日',
							1:'周一到周日'
						}
					},
					{
						label: '是否激活',
						value: 'pauseFlag',
						_enum:{
							0:'禁用',
							1:'激活'
						}
					},
					{
						label: '添加人员',
						value: 'creator',
					},
					{
						label: '添加时间',
						value: 'createTime',
					},
				]
			};
		},
		methods: {
			searchFunc(data) {
				let { createTime , ...el } = data
				let [ startTime , endTime ] = createTime || []
				return {startTime,endTime,...el};
			},
			handleLeftBatchChange(val, selection) {
				let data = selection.map(e=>e.strategyId)
				let params = {strategyIds:data}
				switch(val[0]){
					case '删除':					
						this.showConfirm('product/prSellStrategyAmzRemove',params,'删除')
					break;
					case '激活':
						params.pauseFlag = 1
						this.showConfirm('product/prSellStrategyAmzPause',params,'激活')
					break;
					case '禁用':
						params.pauseFlag = 0
						this.showConfirm('product/prSellStrategyAmzPause',params,'禁用')
					break;
				}				
			},		
		},
		computed:{
			outerParams(){
				return {

				}			
			},
		}
	};
</script>
