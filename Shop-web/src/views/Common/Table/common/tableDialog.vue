<template>
	<MainLayout
	  :outerParams="outerParams"
	  :searchFields="searchFields"
	  :editBtns="editBtns"
	  :edits="edits"
	  :showSearch="false"
	  :showSelection = 'false'
	  :columns="this.params.type == 1? columns1 : this.params.type == 2 ? columns2 :  this.params.type == 3 ? columns3 :  columns4"
	  ref="layout"
	  :url="this.params.url"
	  :isShowTableLoading = 'false'
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
			columns1:[
				{
					label:'品牌名称',
					value:'brand',
					// url:'brandUrl',		
					minWidth:150,
				},
			],
			columns2:[
				  {
					  label: "主图",
					  value: "imageUrl",
					  img:true,
				  },
				  {
					label:'ASIN',
					value:'asin',		
				  },
				  {
					label:'标题',
					value:'title',
					render(h,scope){
						let title = scope.row.title
						return title?(
							<el-tooltip content={title} placement="top" effect="light">
								<a class="fix__row_1" href={scope.row.productUrl} style={{color:"#108ee9"}} target='_blink'>{title}</a>
							</el-tooltip>
							
						):(
							<span>-</span>
						)
					}	
				  },
				  {
					label:'价格',
					value:'price',
					sortable:"custom",
				  },
			],
			columns3:[
				{
				    label: "主图",
				    value: "imageUrl",
					  img:true,
				},
				{
					label:'ASIN',
					value:'parentAsin',		
				},
				{
					label:'标题',
					value:'title',
					render(h,scope){
						let title = scope.row.title
						return title?(
							<el-tooltip content={title} placement="top" effect="light">
								<a class="fix__row_1" href={scope.row.productUrl} style={{color:"#108ee9"}} target='_blink'>{title}</a>
							</el-tooltip>
							
						):(
							<span>-</span>
						)
					}
				},
				{
					label:'评价数',
					value:'reviewCnt',
					sortable:"custom",
				},
			],
			columns4:[
				{
				    label: "主图",
				    value: "imageUrl",
					  img:true,
				},
				{
					label:'ASIN',
					value:'parentAsin',		
				},
				{
					label:'标题',
					value:'title',
					render(h,scope){
						let title = scope.row.title
						return title?(
							<el-tooltip content={title} placement="top" effect="light">
								<a class="fix__row_1" href={scope.row.productUrl} style={{color:"#108ee9"}} target='_blink'>{title}</a>
							</el-tooltip>
							
						):(
							<span>-</span>
						)
					}
				},
				{
					label:'评价数',
					value:'newReviewCntD30',
					sortable:"custom",
				},
			],
			
    }
  },
  methods: {
		toPercent(point){
			var str=Number(point*100).toFixed(1);
			str+="%";
			return str;
		},
  },
	computed: {
		outerParams(){
			return {
				category:this.params.category,
				taskId:this.params.taskId
			}
		},
	},
};
</script>

<style>
</style>

