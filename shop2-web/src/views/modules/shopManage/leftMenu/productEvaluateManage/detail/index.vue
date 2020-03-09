<template>
	<main-layout 
		@searchTrueData="val => searchData = val"
		:outerParams = "outerParams"
		:searchFields="searchFields" 
		:columns="columns" 
		:topBatchBtn="topBatchBtn"
		:right-edit-btns="editBtns"
		@left-batch-change="handleLeftBatchChange"
		:edit-btns="edits" 
		:defaultSortData = 'defaultSortData'
		tip="只保留近30天的评价数据，如需回复，请尽快处理"
		url="shopManage/productReviewReviewList"
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
							label:'回复'
						},
						{
							label:'设置已回复'
						},
						{
							label:'设置未回复'
						},
						{
							label:'删除'
						},
					]
				},
				defaultSortData:{
					sort:0,
					field:"review_date"
				},
				edits:[
					{
						name: '回复',
						fn: scope => {
							let params = {
								text:scope.row.content,
								idArray:[scope.row.reviewId],
								productId:this.$route.query.productId
							}
							this.showDialogGlobal(`回复`, '100%', params, () => import('../dialogs/reply.vue'),'发送','取消')
						}
					}
				],
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
					replyFlag: {
						label: "状态",
						widget: 'select',
						options:[{label:'已回复',value:true},{label:'未回复',value:false}]
					},
					reviewStar:{
						hidden: true,
						label: "评价星级",
						labelWidth:'80px',
						widget: 'select',
						options:[{label:'一星',value:1},{label:'二星',value:2},{label:'三星',value:3},{label:'四星',value:4},{label:'五星',value:5}]
					},
					queryReviewDate: {
						hidden: true,
						labelWidth: "80px",
						widget: 'daterange',
						label: '时间',
						fields: ['queryStartReviewDate', 'queryEndReviewDate']
					},
					buyerName: {
						hidden: true,
						labelWidth: "90px",
						label: '评价者名称',
					},
					
				},
				searchData: {},
				columns: [
					{
						label: '评价时间',
						value:'reviewDate',
						sortable: 'custom',
					},
					{
						label: '评价者名称',
						value:'buyerName',
						render(h, scope) {
							let {buyerName,buyerUrl} = scope.row
							return <a href={buyerUrl} target="_blank" type="text">{buyerName}</a>
						}
					},
					//123/
					{
						label: 'RANK',
						value:'reviewerRanking',
						sortable: 'custom',
					},
					{
						label: '评价星级',
						value:'reviewStar',
						sortable: 'custom',
					},
					{
						label: 'Helpful数',
						value: 'helpfulCnt',
						sortable: 'custom',
					},
					{
						label: '评价内容',
						value: 'content',
						noTooltip:true,
					},
					{
						label: '状态',
						value: 'replyFlag',
						_enum:{
							true:'已回复',
							false:'未回复'
						}
					},
					{
						label: '回复内容',
						value: 'replyContent',
						noTooltip:true,
					},
				]
			}
		},
		methods: {
			handleLeftBatchChange(val, selection) {
				let idArray = selection.map(el => el.reviewId)
				let params = {
					idArray,
					...this.outerParams
				}
				switch (val[0]) {
					case '导出Excel':
						this.expReview(idArray, true)
					break;			
					case '回复':
						this.showDialogGlobal(`回复`, '100%', params, () => import('../dialogs/reply.vue'),'发送','取消')
					break;		
					case '设置已回复':
						this.showConfirmGlobal('shopManage/productReviewReviewSetReply',params,'设置已回复')
					break;		
					case '设置未回复':
						this.showConfirmGlobal('shopManage/productReviewReviewSetUnreply',params,'设置未回复')
					break;		
					case '删除':
						this.showConfirmGlobal('shopManage/productReviewReviewRemove',params,'删除')
					break;		
				}
			},
			expReview(idArray, setLoading, searchData) {
				setLoading && (this.topBatchBtn.loading = true)
				return this.$api[`${setLoading ? 'shopManage/productReviewReviewExport' : 'shopManage/productReviewReviewExportQuery'}`]({
					idArray,
					...this.outerParams,
					...searchData
				})
			    .then(data => {
					setLoading && (this.topBatchBtn.loading = false)
					let ext = 'xlsx'
					downloadFile(data, `产品评价管理.${ext}`)
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
					productId:this.$route.query.productId
				}
			}
		},
	}
</script>
