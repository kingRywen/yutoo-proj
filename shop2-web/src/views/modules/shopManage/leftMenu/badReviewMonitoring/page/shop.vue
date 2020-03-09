<template>
	<main-layout 
		@searchTrueData="val => searchData = val"
		:outerParams = "outerParams"
		:searchFields="searchFields" 
		:columns="columns" 
		:topBatchBtn="topBatchBtn"
		:right-edit-btns="editBtns"
		@left-batch-change="handleLeftBatchChange"
		tip="列表只保留近90天的数据，请尽快处理"
		url="shopManage/negativeReviewSellerList"
		ref="layout"
	></main-layout>
</template>
<script>
	import { downloadFile } from 'Utils'
	export default {
		data() {
			let vm = this
			return {
				topBatchBtn: {
				    options: [
						{
							label: '导出Excel'
						},
						{
							label:'设置为已处理'
						},
						{
							label:'设置为未处理'
						},
						{
							label:'删除'
						},
					]
				},
				editBtns: [
				    {
				        name: '导出Excel',
				        perm: 'add',
				        showLoading: true,
				        fn: () => {
				            return this.expReview(undefined, null, this.searchData)
						}
				    },
				],
				searchFields: {
					sellerId: {
						placeholder: '店铺',
						labelWidth: '70px',
						widget: 'select',
						options:[]
					},
					queryFeedbackDate: {
						hidden: true,
						labelWidth: "80px",
						widget: 'daterange',
						label: '评价时间',
						fields: ['queryStartFeedbackDate', 'queryEndFeedbackDate']
					},
					buyerName: {
						hidden: true,
						label:'评价者',
					},				
					status: {
						hidden: true,
						label: "状态",
						widget: 'select',
						options:[{label:'未处理',value:0},{label:'已处理',value:1},{label:'已删除',value:2}]
					},
				},
				searchData: {},
				columns: [
					{
						label: '店铺',
						value:'sellerId',
					},
					{
						label: '评价时间',
						value:'feedbackDate',
						sortable: 'custom',
					},
					{
						label: '评价者名称',
						value:'buyerName',
					},
					{
						label: 'RANK',
						value:'reviewerRanking',
						sortable: 'custom',
					},
					{
						label: '评价星级',
						value: 'reviewStar',
						sortable: 'custom',
					},
					{
						label: '评价内容',
						value: 'content',
						noTooltip:true,
					},
					{
						label: '状态',
						value: 'status',
						_enum:{
							0:'未处理',
							1:'已处理',
							2:'已删除'
						}
					},
				]
			}
		},
		methods: {
			getStore(){
				this.$api['shopAuth/sellerAuthListToSeller']({platformId:this.storeInfo.platformId,siteId:this.storeInfo.siteId}).then((res)=>{
					this.searchFields.sellerId.options = res.data.map(e=>({
						label:e.sellerAlias,
						value:e.sellerId
					}))
				}) 
			},
			handleLeftBatchChange(val, selection) {
				let idArray = selection.map(el => el.feedbackId)
				let params = {
					idArray,
					...this.storeInfo
				}
				switch (val[0]) {
					case '导出Excel':
						this.expReview(idArray, true)
					break;
					case '设置为已处理':
						this.showConfirmGlobal('shopManage/negativeReviewSellerSetProcess',params,'设置为已处理')
					break;
					case '设置为未处理':
						this.showConfirmGlobal('shopManage/negativeReviewSellerSetUnprocess',params,'设置为未处理')
					break;
					case '删除':
						this.showConfirmGlobal('shopManage/negativeReviewSellerRemove',params,'删除')
					break;
				}
			},
			expReview(idArray, setLoading, searchData) {
				setLoading && (this.topBatchBtn.loading = true)
				return this.$api[`${setLoading ? 'shopManage/negativeReviewSellerExport' : 'shopManage/negativeReviewSellerExportQuery'}`]({
					idArray,
					...this.outerParams,
					...searchData
				})
			    .then(data => {
					setLoading && (this.topBatchBtn.loading = false)
					let ext = 'xlsx'
					downloadFile(data, `店铺差评监控.${ext}`)
			    })
			    .catch(err => {
					setLoading && (this.topBatchBtn.loading = false)
					return Promise.reject(err)
			    })
			},
		},
		computed:{
			outerParams(){
				return {
					...this.storeInfo,
				}
			}
		},
		mounted(){
			this.getStore()
		}
	}
</script>
