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
			url="ebTaskCateDepthAysShopDetails"
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
						name:'新增订单数',
						icon:'el-icon-search',
						fn:scope=>{
							this.$refs.layout.$dialog({
								title: "数据展示",
								size:'large',
								params: {isSeller:true,taskId:this.outerParams.taskId,url:"ebTaskCateDepthAysListToNewOrderCnByShop"},
								component: () => import('@/views/ebayViews/categoryAnalysis/categoryAnalysisItem/common/echartsDialog.vue'),
							});
						},
						
					},
					{
						name:'新增评价数',
						icon:'el-icon-picture-outline',
						fn:scope=>{
							this.$refs.layout.$dialog({
								title: "数据展示",
								size:'large',
								params: {isSeller:true,sellerDouble:true,taskId:this.outerParams.taskId,url:"ebTaskCateDepthAysListToNewReviewCnByShop"},
								component: () => import('@/views/ebayViews/categoryAnalysis/categoryAnalysisItem/common/echartsDialog.vue'),
							});
						},
					},
					
				],
				searchFields:[
					{
						label:'卖家名称',
						name:'sellerId',
						type:'input',
						placeholder:'请输入卖家名称'
					},
				],
				editBtns:[
					{
						name:'导出',
						fn: ()=>{
							this.exportMethod()
						}
					}
				],
				columns:[
					{
						label:'卖家名称',
						value:'sellerId',
						minWidth:150,
						render(h,scope){
							let {sellerId} = scope.row
							return(
								 <a href={scope.row.sellerUrl} target='_blink'>
									<span  style={{color:"#108ee9"}}>{sellerId}</span>
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
						label:'开店时间',
						value:'openTime',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'卖家注册地',
						value:'sellerRegistration',
						minWidth:150,
					},
					{
						label:'账号类型',
						value:'accountType',
						minWidth:150,
						render(h,scope){
							let {accountType} = scope.row
							return accountType === 0 ? (
								<span>Business</span>
							) : (
								<span>个人</span>
							)
						}
					},
					{
						label:'发货地址数量',
						value:'deliveryAddrCnt',
						minWidth:150,
						render(h, scope) {
						  return (
						    <el-button
						      type="text"
						      onClick={() => {
						        vm.$refs.layout.$dialog({
						          title: "发货地址",
						          size:"medium",
						          params: {
									taskId:vm.parentParams.taskId,
									sellerId:vm.sellerId,
									url:'ebTaskCateDepthAysListToShopDeliveryAddr',
						          },
						          component: () => import("./common/tableDialog.vue")
						        });
						      }}
						    >
						      {scope.row.deliveryAddrCnt}
						    </el-button>
						  );
						}
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
					    label: "卖家四项评分",
						minWidth:'150',
					    merge:[
					        {
					            label: "Item as described",
					            value: "itemAsDescribed",
					            sortable:"custom",
								width:'150',
					        },
					         {
					            label: "Communication",
					            value: "communication",
					            sortable:"custom",
								width:'140',
					        },
							{
							    label: "Shipping time",
							    value: "shippingTime",
							    sortable:"custom",
								width:'130',
							},
							{
							    label: "Shipping charges",
							    value: "shippingCharges	",
							    sortable:"custom",
								width:'150',
							},

					    ],
					},
					{
						label:'店铺总反馈数',
						value:'feedbackCnt',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'店铺月反馈数',
						value:'feedbackCntD30',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'卖家好评率',
						value:'positiveRate',
						minWidth:150,
						sortable:"custom",
					},
					{
						label:'类目数',
						value:'categoryCnt',
						minWidth:150,
						sortable:"custom",
						render(h, scope) {
						  return (
						    <el-button
						      type="text"
						      onClick={() => {
						        vm.$refs.layout.$dialog({
						          title: "类目数",
						          size:"large",
						          params: {
									taskId:vm.parentParams.taskId,
									sellerId:vm.sellerId,
									url:'ebTaskCateDepthAysListToCategoryBySeller',
						          },
						          component: () => import("./common/tableDialog.vue")
						        });
						      }}
						    >
						      {scope.row.deliveryAddrCnt}
						    </el-button>
						  );
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
		methods:{
			selectChange(v){
				this.selectList = [];
				v.forEach(i => {
				  this.selectList.push(i.sellerId)
				});
			},
			exportMethod(){
				this.$confirm('此操作将导出').then(()=>{
					let sellerIds = []
					this.selectList.forEach((e)=>{
						sellerIds.push(e)
					})
					let params = {
						taskId:this.outerParams.taskId,
						sellerId:this.$refs.layout.searchTrueData.sellerId,
						sortField:this.$refs.layout.sortData.sortField,
						sort:this.$refs.layout.sortData.sort,
						sellerIds:sellerIds
					}
					this.$api['ebTaskCateDepthAysExportShopDetails'](params).then((res)=>{
						downloadFile(
						  res,
						  '类目深度卖家分析' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
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
