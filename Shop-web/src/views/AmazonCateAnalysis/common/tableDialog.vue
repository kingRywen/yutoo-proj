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
	  :url="this.params.url"
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
					label:'品牌名称',
					value:'deliveryAddr',
					minWidth:150,
				},				
			],
			
        }
    },
    methods: {
		_submit(){
			return this.$router.push({
				name:'BrandManage',
				params:{isSecond:true}
			})
		}
    },
	computed: {
		outerParams(){
			return {
				taskId:this.params.taskId,
				sellerId:this.params.sellerId 
			}
		},
	},
};
</script>

<style>
</style>

