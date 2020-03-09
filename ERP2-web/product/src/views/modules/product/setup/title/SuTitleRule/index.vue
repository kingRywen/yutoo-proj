<template>
	<div>
		<MainLayout 
			:topBatchBtn="topBatchBtn"
			:edit-btns="edits" 
			@left-batch-change="handleLeftBatchChange" 
			:right-edit-btns="editBtns"
			:leftTree='leftTree'
		    :columns="columns" 
			:searchFunc="searchFunc" 			
			:searchFields="searchFields"
			ref="layout" 
			url="product/PrConfigTitleRuleList">
		</MainLayout>
	</div>
</template>

<script>
	export default {
		data() {
			let vm = this
			return {
				leftTree:{
				    props: {
				        label: 'showField',
				        children: 'titleWordGroupArray',
				        isLeaf: 'isChild'
				    },
				    topHandle:[
				        {
				            icon:"el-icon-refresh",
				            content:'刷新',
				            fn:()=>{
				                return this.refreshTree()
				            }
				        }
				    ],
				    dataFn(data) {
				        vm.treeClick(data)
				        return { systemCategoryId: data.systemCategoryId }
				    },
				    loadNode(node, resolve) {
				        if (node.level === 0) {
				            vm.getTreeData(0).then(res=>{
				                return resolve(res)
				            }).catch(err=>{
				                return resolve([])
				            })
				        }
				        if (node.level >= 1) {
				            if(node.data.childFlag === 0){
				                vm.getTreeData(node.data.systemCategoryId).then(res=>{
				                    return resolve(res)
				                }).catch(err=>{
				                    return resolve([])
				                })
				            }
				        }
				
				     }
				},
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
						placeholder: '请输入标题规则名称'
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
						hidden:true,
						widget: 'daterange',
						label: '添加时间',
						time: true
				    },	
					platId: {
						hidden:true,
					    labelWidth: '90px',
					    widget: 'select',
					    label: '适用平台',
					    options: "$store.common.platList",
						handler: {
							action: 'common/getPlatList'
						}
					},
					storeId: {
						hidden:true,
					    labelWidth: '90px',
					    widget: 'select',
					    label: '关联店铺',
					    options: "$store.common.shopList",
						handler: {
							action: 'common/getShopList'
						}
					},
				},
				edits: [
					{
						name: '编辑',
						perm: 'addTask',
						fn: scope => {
							this.showDialog('编辑规则','100%',{edit:true,titleRuleId:scope.row.titleRuleId}, () => import('./dialog/add.vue'), '确认', '取消')
						}
					},
					{
						name: '删除',
						fn: scope => {						
							let params = {idArray:[scope.row.titleRuleId]}
							this.showConfirm('product/PrConfigTitleRuleRemove',params,'删除')						
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
						perm: 'add',
						fn: () => {
							this.showDialog('添加规则','100%',{}, () => import('./dialog/add.vue'), '确认', '取消')
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
						label: '标题语言',
						value: 'ruleFormal',
						showTooltip:true
					},
					{
						label: '添加日期',
						value: 'createTime',
						sortable: true,
					},
					{
						label: '适用平台',
						value: 'platName',
					},
					{
						label: '适用店铺',
						value: 'storeNames',
					},
					{
						label: '适用类目',
						value: 'systemCategoryName',
					}
				],
				currentTreeId:null,
			};
		},
		methods: {
			searchFunc(data) {
				let { createTime , ...el } = data
				let [ queryCreateStartTime , queryCreateEndTime ] = createTime || []
				return {queryCreateStartTime,queryCreateEndTime,...el};
			},
			handleLeftBatchChange(val, selection) {
				let data = selection.map(e=>e.titleRuleId)
				let params = {idArray:data}
				switch(val[0]){
					case '删除':					
						this.showConfirm('product/PrConfigTitleRuleRemove',params,'删除')
					break;
				}				
			},	
			
			//左侧类目
			treeClick(data){
			    let {systemCategoryId } = data
			    this.currentTreeId = systemCategoryId
			},
			async refreshTree(){
			    this.$refs.layout.leftTreeData = []
			    this.currentTreeId = null
			    let res = await this.getTreeData(0)
			    this.$refs.layout.leftTreeData = res
			},
			getTreeData(v){
			    return this.$api[`product/CateSystemCategoryTreeTitleRule`]({
			        id:v,
			    })
			    .then((data) => {
			        let {rows} = data
			        if(this.currentTreeId === null){
			            let {systemCategoryId } = data
			            this.currentTreeId = systemCategoryId
			        }
					rows.forEach((e,index,arr)=>{
						arr[index].isChild = e.childFlag ? true : false
						arr[index].showField = e.systemCategoryName + '(' + e.quantity + ')'
					})
			        return rows
			    })
			},
		},		
	};
</script>
