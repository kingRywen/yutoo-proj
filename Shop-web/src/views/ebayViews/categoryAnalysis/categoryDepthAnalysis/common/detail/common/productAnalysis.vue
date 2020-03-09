<template>
	<div>
		 <MainLayout
			:outerParams="outerParams"
			:edits="edits"
			:searchFields="searchFields"
			:editBtns="editBtns"
			:columns="columns"
			@selectChange='selectChange' 
			ref="layout"
			url="ebTaskCateDepthAysProductDetails"
		  ></MainLayout>
		</div>
	</div>
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	export default{
		props:{
			parentParams:{
				type:Object,
				default:()=>{}
			}
		},
		data(){
			let vm = this
			return{
				selectList:[],
				edits:[
					{
						name:'产品信息随时间的更改记录',
						icon:'el-icon-search',
						fn:scope=>{
							window.open(scope.row.itemRevisionUrl,'_blank')
						},
					},
					{
						name:'新增评价数',
						icon:'el-icon-picture-outline',
						fn:scope=>{
							this.$refs.layout.$dialog({
								title: "数据展示",
								size:'large',
								params: {isProduct:true,asin:[scope.row.asin],taskId:this.outerParams.taskId,url:"ebTaskCateDepthAysListToNewReviewCnByProduct"},
								component: () => import('@/views/ebayViews/categoryAnalysis/categoryAnalysisItem/common/echartsDialog.vue'),
							});
						},
					},
				],
				searchFields:[
					{
						label:'产品ASIN',
						name:'asin',
						type:'input',
						placeholder:'请输入产品ASIN'
					},
					{
						name:'topRated',
						type:'select',
						placeholder:'是否为TOP RATED',
						options:[
							{label:'否',value:0},
							{label:'是',value:1}
						]
					},
				],
				editBtns:[
					{
						name:'趋势分析',
						fn:scope=>{
							this.$refs.layout.$dialog({
								title: "数据展示",
								size:'large',
								params: {isProduct:true,asin:this.selectList,taskId:this.outerParams.taskId,url:"ebTaskCateDepthAysListToNewReviewCnByProduct"},
								component: () => import('@/views/ebayViews/categoryAnalysis/categoryAnalysisItem/common/echartsDialog.vue'),
							});
						},
					},
					{
						name:'导出',
						fn:()=>{
							this.exportMethod()
						},
					}
				],
				columns:[
					{
						label:'ASIN',
						value:'asin',
						minWidth:150,
						render(h,scope){
							let {asin} = scope.row
							return(
								 <a href={scope.row.productUrl} target='_blink' style={{color:"#108ee9"}}>
									<span  style={{color:"#108ee9"}}>{asin}</span>
								 </a>
							)
						}
					},
					{
					    label: "主图",
					    value: "imageUrl",
						img: true,
					},
					{
						label:'价格',
						value:'price',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'日均销量',
						value:'salesCntAvgD30',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'评分',
						value:'starCnt',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'评价数',
						value:'reviewCnt',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'是否Top-rated',
						value:'topRated',
						minWidth:150,
						render(h,scope){
							let {topRated} = scope.row
							return topRated === 0 ? (
								<span>否</span>
							) : (
								<span>是</span>
							)
						}
					},
					{
						label:'运费',
						value:'shipping',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'发货地',
						value:'deliveryAddr',
						minWidth:150,
					},
					{
						label:'子SKU数',
						value:'skuCnt',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'接受可退货天数',
						value:'supportReturnDays',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'预计到达需天数',
						value:'expressDeliveryDays',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'卖家名',
						value:'sellerId',
						minWidth:150,
						render(h,scope){
							let {sellerId} = scope.row
							return(
								 <a href={scope.row.sellerUrl} target='_blink' style={{color:"#108ee9"}}>
									<span>{sellerId}</span>
								 </a>
							)
						}
					},
					{
						label:'卖家总评价数',
						value:'feedbackCnt',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'卖家最近月评价数',
						value:'feedbackCntD30',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'卖家一口价产品数',
						value:'buyItNowProductCnt',
						minWidth:150,
						sortable:"custom",
					},
				]
			}
		},
		methods:{
			selectChange(v){
				this.selectList = [];
				v.forEach(i => {
				  this.selectList.push(i.asin)
				});
			},
			exportMethod(){
				this.$confirm('此操作将导出').then(()=>{
					let asins = []
					this.selectList.forEach((e)=>{
						asins.push(e)
					})
					let params = {
						taskId:this.outerParams.taskId,
						asin:this.$refs.layout.searchTrueData.asin,
						topRated:this.$refs.layout.searchTrueData.topRated,
						sortField:this.$refs.layout.sortData.sortField,
						sort:this.$refs.layout.sortData.sort,
						asins:asins
					}
					this.$api['ebTaskCateDepthAysExportProductDetails'](params).then((res)=>{
						downloadFile(
						  res,
						  '类目深度产品分析' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
						)
					})
				}).catch(()=>{})
			},
		},
		computed: {
			outerParams(){
				return {
					platformId:this.ebayPlatformId,
					taskId:this.parentParams.taskId
				}
			},
		},
	}
</script>

<style>
</style>
