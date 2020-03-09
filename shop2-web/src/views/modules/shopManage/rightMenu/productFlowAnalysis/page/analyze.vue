<template>
	<main-layout 
		@searchTrueData="val => searchData = val"
	    :outerParams = "outerParams"
		:searchFields="searchFields" 
		:right-edit-btns="editBtns"
		:showTable = 'false'
		:searchDefaultData = 'searchDefaultData'
		tip="可以分析所有的产品，需要导入流量报告才能展示。"
		ref="layout"
	></main-layout>
</template>
<script>
	import { downloadFile } from 'Utils'
	export default {
		data() {
			let vm = this
			return {
				searchDefaultData:{
					warningType:0
				},
				searchData: {},
				searchFields: {
					time: {
						widget: 'daterange',
						fields: ['startTime', 'endTime']
					},
					period: {
						widget: 'select',
						options:[{label:'按日',value:1},{label:'按周',value:7},{label:'按月',value:30}]
					},
					searchText: {
						hidden: true,
						placeholder: 'ASIN 、SKU',
						labelWidth: '70px'
					},
					
				},
				editBtns: [
					{
						name: '导入流量报告',
						perm: 'add',
						fn: () => {
							this.$router.push({
								path:'/common/trafficReportImport'
							})
						}
					},
				],
			}
		},
		methods: {
			showDialog(data){
				this.showDialogGlobal(`预警提示`, '100%', {data}, () => import('../dialogs/table.vue'),'','关闭')
			},
			expReview(sellerSkus, exportType, setLoading, searchData) {
				setLoading && (this.topBatchBtn.loading = true)
				return this.$api[`${this.isShowTab === 1 ? 'shopManage/productFlowSkuListWarnExport' : this.isShowTab === 2 ? 'shopManage/productFlowSkuListWarnToParentSkuExport' : 'shopManage/productFlowSkuListWarnToSkuExport'}`]({
					sellerSkus,
					...this.outerParams,
					exportType,
					...searchData
				})
			    .then(data => {
					setLoading && (this.topBatchBtn.loading = false)
					let ext = exportType ? 'csv' : 'xlsx'
					downloadFile(data, `流量预警.${ext}`)
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
			},	
		},
	}
</script>


