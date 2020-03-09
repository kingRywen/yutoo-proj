<template>
	<MainLayout 
		:outerParams="outerParams" 
		:searchFields="searchFields" 
		:editBtns="editBtns" 
		:edits="edits" 
		:showSearch="false"
	    :showSelection='false' 
		:columns="this.params.dataType == 0? columns0 : this.params.dataType == 1 ? columns1 :  this.params.dataType == 2 ? columns2 :  columns3"
	    ref="layout" 
		:outerTableList = 'tableList'	
		:isShowPag = 'false'
		:isShowTableLoading='false'>
	</MainLayout>

</template>

<script>
	export default {
		props: ["params"],
		data() {
			let vm = this
			return {
				edits: [],
				editBtns: [],
				searchFields: [],				
				columns0: [{
					label: 'ASIN',
					value: 'name',	
					minWidth: 150,
					url:'url'
				}],
				columns1: [{
					label: '关键词',
					value: 'name',	
					minWidth: 150,
					url:'url'
				},{
					label: '搜索页数',
					value: 'searchPages',	
					minWidth: 100,
				}],
				columns2: [
					{
						label:'类目',
						value:'name',
						width:300,
						align:'left',
						render(h, scope) {
							let {name,url} = scope.row
							if(name.length>50){
								let newArr = name.split(':')
								var newStr = ''
								newStr = `${newArr[0]}...${newArr.pop()}`
							}
							return name ? (
							  <el-tooltip open-delay={300} content={name} placement="top"  effect="light">					
								<a class="fix__row_1" href={url} style="color:#108ee9;" target='_blink'>{name.length>50?newStr:name}</a>
							  </el-tooltip>
							  
							) : (
							  <span>-</span>
							)
						}	
					},
					{
						label: '搜索页数',
						value: 'searchPages',	
						minWidth: 100,
					},
				],
				columns3: [{
					label: '链接',
					value: 'name',	
					minWidth: 150,
					render(h,scope){
						let {name,url} = scope.row
						return name ? (
							<a href={url} style={{color:"#108ee9"}} target='_blink' class="fix__row_1">{name}</a>
						) : (
							<span>-</span>
						)
					}
				}],

			}
		},
		computed: {
			outerParams() {
				return {

				}
			},
			tableList(){
				let list = this.params.list
				list.forEach((e,i,arr)=>{
					arr[i].searchPages = this.params.searchPages
				})
				return this.params.list
			}
		},
	};
</script>

<style>
</style>
