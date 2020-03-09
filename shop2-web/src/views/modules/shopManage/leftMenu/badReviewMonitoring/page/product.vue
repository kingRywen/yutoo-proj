<template>
	<main-layout 
		@searchTrueData="val => searchData = val"
		:outerParams = "outerParams"
		:searchFields="searchFields" 
		:columns="columns" 
		:edit-btns="edits" 
		:topBatchBtn="topBatchBtn"
		:right-edit-btns="editBtns"
		@left-batch-change="handleLeftBatchChange"
		url="shopManage/negativeReviewProductList"
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
						}
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
				edits: [
					{
						name: '查看',
						perm: 'addTask',
						fn: scope => {
							this.$router.push({
								path:'/shopManage/badReviewMonitoring/detail',
								query:{
									productId:scope.row.productId
								}
							})
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
					asinOrSku: {
						// hidden: true,
						// label: "关键词",
						placeholder:'ASIN,SKU'
					},
				},
				searchData: {},
				columns: [
					{
						label: 'SKU',
						value:'sku'
					},
					{
						label: 'ASIN',
						value:'asin'
					},
					{
						label: '店铺',
						value:'sellerId'
					},
					{
						label: '主图',
						value:'imageUrl',
						img:true,
						link: row => {
						  return this.storeUrls.asinUrl + row['asin']
						},
						title: 'title'
					},
					{
						label: 'Top Reviews差评数量',
						value: 'topReviewsNegativeCnt',
						sortable: 'custom',
					},
					{
						label: 'Most recent差评数量',
						value: 'mostRecentNegativeCnt',
						sortable: 'custom',
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
				let idArray = selection.map(el => el.productId)
				switch (val[0]) {
					case '导出Excel':
						this.expReview(idArray, true)
					break
				}
			},
			expReview(idArray, setLoading, searchData) {
				setLoading && (this.topBatchBtn.loading = true)
				return this.$api[`${setLoading ? 'shopManage/negativeReviewProductExport' : 'shopManage/negativeReviewProductExportQuery'}`]({
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
				}
			}
		},
		mounted(){
			this.getStore()
		}
	}
</script>
