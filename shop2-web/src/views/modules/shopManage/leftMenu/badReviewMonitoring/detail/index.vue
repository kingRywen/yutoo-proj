<template>
	<main-layout 
		@searchTrueData="val => searchData = val"
		:outerParams = "outerParams"
		:searchFields="searchFields" 
		:columns="columns" 
		:topBatchBtn="topBatchBtn"
		:searchDefaultData = 'searchDefaultData'
		:right-edit-btns="editBtns"
		@left-batch-change="handleLeftBatchChange"
		:defaultSortData = 'defaultSortData'
		tip="Top Reviews每日更新，Most recent保留30天数据"
		url="shopManage/negativeReviewReviewList"
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
				defaultSortData:{
					sort:0,
					field:"review_date"
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
				searchDefaultData:{
					sortBy:'TOP_REVIEWS'
				},
				searchFields: {
					sortBy: {
						label: "排序方式",
						labelWidth: '80px',
						widget: 'select',
						options:[{label:'Top Reviews',value:'TOP_REVIEWS'},{label:'Most recent',value:'MOST_RECENT'}],
						clearable:false,
					},
					buyerName: {
						hidden: true,
						label: "名称",
						placeholder:'评价者名称'
					},					
					queryReviewDate: {
						hidden: true,
						labelWidth: "80px",
						widget: 'daterange',
						label: '评价时间',
						fields: ['queryStartReviewDate', 'queryEndReviewDate']
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
			handleLeftBatchChange(val, selection) {
				let idArray = selection.map(el => el.reviewId)
				let params = {
					idArray,
					...this.outerParams,
					sortBy:this.searchData.sortBy
				}
				switch (val[0]) {
					case '导出Excel':
						this.expReview(idArray, true,this.searchData)
					break;
					case '设置为已处理':
						this.showConfirmGlobal('shopManage/negativeReviewReviewSetProcess',params,'设置为已处理')
					break;
					case '设置为未处理':
						this.showConfirmGlobal('shopManage/negativeReviewReviewSetUnprocess',params,'设置为未处理')
					break;
					case '删除':
						this.showConfirmGlobal('shopManage/negativeReviewReviewRemove',params,'删除')
					break;
				}
			},
			expReview(idArray, setLoading, searchData) {
				setLoading && (this.topBatchBtn.loading = true)
				return this.$api[`${setLoading ? 'shopManage/negativeReviewReviewExport' : 'shopManage/negativeReviewReviewExportQuery'}`]({
					idArray,
					...this.outerParams,
					...searchData
				})
			    .then(data => {
					setLoading && (this.topBatchBtn.loading = false)
					let ext = 'xlsx'
					downloadFile(data, `产品差评监控.${ext}`)
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
