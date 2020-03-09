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
			columns:[
				{
					label:'关键词',
					value:'keyword',
					minWidth:150,
				},
			],
			list:[]
			
		}
	},
	created(){
		this.params.list.forEach((e)=>{
			this.list.push({keyword:e})
		})	
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

