<template>
	<div>
		<div v-if='$route.name==="adTargetingSourceDetail"'>
			<MainLayout
				:outerParams="outerParams"
				:edits="edits"
				:searchFields="searchFields"
				:editBtns="editBtns"
				:columns="columns"	
				:treeTable="treeTable"
				:treeTableOtions="treeTableOtions"
				:outSearchData="searchData"
				:initialParmas="initialParmas"
				@handleSearch = 'handleSearch'
				:searchFunc='searchFunc'
				:speReset = 'true'
				@speResetFn = 'speResetFn'
				:selectableFunc = 'selectableFunc'
				:url="urlName"
				ref="layout"
			></MainLayout>
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	export default{
		data(){
			let vm = this
			return{
				urlName:'adSourcePositionProductDetails',
				searchData:{
				    status: 0
				},
				initialParmas: {
					status: 0
				},
				edits:[],
				searchFields:[
					{
						label:'统计方式',
						name:'status',
						type:'select',
						labelWidth:'60px',
						clearable:false,
						placeholder:'请选择统计方式',
						options:[
							{label:'按产品',value:0},
							{label:'按类目统计',value:1}
						]
					},										
				],
				editBtns:[
					{
						name:'复制',
						disabled:selection => {
							return selection.length == 0
						},
						fn:()=>{
							let type = vm.columns.some(e=>e.label === 'ASIN')
							let data = []
							if(type){
								data = vm.getSelection().map(e=>e.asin)
							}else{
								data = vm.getSelection().map(e=>e.category)
							}
							let str = ''
							str = data.join('\n')
							vm.$copyText(str).then(function (e) {
							  vm.$message.success('复制成功')
							}, function (e) {
							  vm.$message.error('复制失败')
							})
						}
					},
					{
						name:'导出',
						showLoading:true,
						fn:()=>{
							let type = vm.columns.some(e=>e.label === 'ASIN')
							let data = []
							if(type){
								data = vm.getSelection().map(e=>e.asin)
							}else{
								data = vm.getSelection().map(e=>e.category)
							}
							return this.exportMethod(data,type)
						}
					},
					{
						name:'删除',
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let type = vm.columns.some(e=>e.label === 'ASIN')
							let data = []
							if(type){
								vm.getSelection().forEach(e=>{
									if(e.childList && e.childList.length){
										data.push({parentAsin:e.asin})
									}else{
										data.push({asin:e.asin})
									}
								})
								
							}else{
								vm.getSelection().forEach(e=>{
									data.push({category:e.category})
								})
							}
													
							vm.$confirm('此操作将删除,是否继续','提示',{type:'warning'}).then(()=>{
								vm.$api['adPositionSourceRemoveProduct']({parentTaskId:vm.outerParams.parentTaskId,data:data}).then(()=>{
									vm.getLayoutList()
								})
							}).catch(()=>{})
						}
					},
				],
				columns:[
					{
						label:'ASIN',
						value:'asin',
						width:160,	
						expand:true,
						url:'productUrl',
						async: true,
						asyncFunc(row) {							
							return vm.$api[`adPositionSourceProductChildDetails`]({parentTaskId:vm.outerParams.parentTaskId,parentAsin:row.asin}).then(data => {
								return (data.data.map(el => ({...el, isChild: 1})))
							})
						}						
					},	
					{
						label:'所属类目',
						value:'category',
						align:'left',								
					},
				],
				treeTable:true,
				treeTableOtions:{
					childs:'childList',
					expandFunc:row =>{
						return row.skuCnt && row.skuCnt!==0
					}
				},
				columnsType:0
			}
		},
		methods:{
			selectableFunc(row){
				return row.isChild != 1
			},
			exportMethod(data,type){
				let param = {				
					parentTaskId:this.outerParams.parentTaskId,					
				}
				if(type){
					//按产品
					param.parentAsins = data && data.length ? data : null					
					return this.$api['adSourcePositionExportDataBy'](param).then(data => {
					  downloadFile(
					    data,
					    '产品ASIN列表' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
					  )
					})
				}else{
					//按类目
					param.categorys = data && data.length ? data : null					
					return this.$api['adSourcePositionExportDataByCategory'](param).then(data => {
					  downloadFile(
					    data,
					    '类目列表' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
					  )
					})
				}
				
			},
			speResetFn(){
				this.columnsType = 0
				this.urlName='adSourcePositionProductDetails'
			},
			searchFunc(data) {
			    let {status} = data
				if(status === 0){
					this.columnsType = 0
					this.urlName='adSourcePositionProductDetails'
				}else {
					this.columnsType = 1
					this.urlName = 'adSourcePositionCategoryDetails'
				}
			},
			handleSearch(){
				let vm = this
				if(this.columnsType === 0){					
					this.columns=[
						{
							label:'ASIN',
							value:'asin',
							width:160,	
							expand:true,
							url:'productUrl',
							async: true,
							asyncFunc(row) {							
								return vm.$api[`adPositionSourceProductChildDetails`]({parentTaskId:vm.outerParams.parentTaskId,parentAsin:row.asin}).then(data => {
									return (data.data.map(el => ({...el, isChild: 1})))
								})
							}						
						},	
						{
							label:'所属类目',
							value:'category',
							align:'left',								
						},
					]
				}else{					
					this.columns=[
						{
							label:'类目',
							value:'category',
							align:'left',
							url:'categoryUrl'	
						},
						{
							label:'父产品数量',
							value:'productCnt',
							width:160,	
							align:'left',
						},	
						
					]
				}
			}
		},
		computed: {
			outerParams(){
				return {
					parentTaskId:this.$route.query.parentTaskId
				}
			},
			
		}
	}
</script>

