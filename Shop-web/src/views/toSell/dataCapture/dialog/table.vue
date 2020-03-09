<template>
	<MainLayout
	  :outerParams="outerParams"
	  :searchFields="searchFields"
	  :editBtns="editBtns"
	  :edits="edits"
	  :showSearch="false"
	  :showSelection = 'false'
	  :columns="columns"
	  ref="layout"
	  :isShowPag = 'false'
	  :outerTableList = 'list'
	    >  
	</MainLayout> 
	
</template>

<script>
export default {
  props: ["params"],
  data() {
	let vm = this
		return {
			edits:[],
			editBtns:[],
			searchFields:[],
			columns:[],
			keycolumns:[
				{
					label:'关键词',
					value:'keyword',
					minWidth:150,
				},
			],
			storecolumns:[
				{
					label:'产品ASIN',
					value:'sellerId',
					minWidth:150,
				}
			],
			list:[]
			
		}
	},
	created(){
		if(this.params.shoreId) this.storecolumns[0].label = '店铺Id'
		let type = this.params.type
		switch(type){
			case 'keyword':
				this.columns = this.keycolumns
				this.params.list.forEach((e)=>{
					this.list.push({keyword:e})
				})
			break;
			case 'store':
				this.columns = this.storecolumns
				this.params.list.forEach((e)=>{
					this.list.push({sellerId:e})
				})
			break;
		}
		
	},
	computed: {
		outerParams(){
			return {

			}
		},
	},
};
</script>

<style>
</style>

