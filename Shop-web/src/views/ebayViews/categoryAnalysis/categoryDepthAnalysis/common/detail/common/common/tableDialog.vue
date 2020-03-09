<template>
	<MainLayout
	  :outerParams="outerParams"
	  :searchFields="searchFields"
	  :editBtns="editBtns"
	  :edits="edits"
	  :showSearch="false"
	  :showSelection = 'false'
	  :columns="this.params.url==='ebTaskCateDepthAysListToCategoryBySeller'?columnsCage:columns"
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
					label:'发货地址',
					value:'deliveryAddr',
					minWidth:150,
				},
				{
					label:'产品数量',
					value:'productCnt',
					minWidth:150,
					sortable:"custom",
				},
				{
					label:'占比',
					value:'productCntRate',
					minWidth:150,
					sortable:"custom",
					render(h,scope){
						return(
							<span>{scope.row.productCntRate*1000/10+"%"}</span>
						)
					}
				},
			],
			columnsCage:[
				{
					label:'类目',
					value:'category',
					minWidth:150,
					render(h,scope){
						let {category} = scope.row
						return(
							 <a href={scope.row.categoryUrl} target='_blink'>
								<span  style={{color:"#108ee9"}}>{category}</span>
							 </a>
						)
					}
				},
				{
					label:'一口价产品数',
					value:'buyItNowProductCnt',
					minWidth:150,
					sortable:"custom",
				},
				{
					label:'拍卖产品数',
					value:'auctionProductCnt',
					minWidth:150,
					sortable:"custom",
				},
				{
					label:'拍卖产品数近30天日均订单数',
					value:'auctionProdOrderCntAvgD30',
					minWidth:200,
					sortable:"custom",
				},
				{
					label:'近30天日均销售额',
					value:'salesAvgD30',
					minWidth:150,
					sortable:"custom",
					render(h,scope){
						let {salesAvgD30} = scope.row
						return (
							<span>¥{salesAvgD30}</span>
						)						
					}
				},
				{
					label:'创建时间',
					value:'createTime',
					minWidth:150,
					sortable:"custom",
				},
			]
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
				taskId:this.params.taskId,
				sellerId:this.params.sellerId 
			}
		},
	},
};
</script>

<style>
</style>

