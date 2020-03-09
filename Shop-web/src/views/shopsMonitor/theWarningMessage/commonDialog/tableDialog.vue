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
	  :outerTableList = 'outerTableList'
	  :isShowPag = 'false'
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
				label:'ASIN',
				value:'asin',
				minWidth:150,
				url:'productUrl'
			},
			{
				label:'SKU',
				value:'sku',
				minWidth:150,
			},
			{
				label:'标题',
				value:'title',
				minWidth:150,
				showTooltip:true
			},
		],
		outerTableList:[]
    }
  },
  methods: {
		
  },
	computed: {
		outerParams(){
			return {

			}
		},
	},
	created(){
		this.outerTableList = this.params.data
	}
};
</script>

<style>
</style>

