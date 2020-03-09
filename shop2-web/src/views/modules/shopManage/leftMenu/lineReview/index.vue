<template>
	<main-layout 
		@searchTrueData="val => searchData = val"
		:outerParams = "outerParams"
		:searchFields="searchFields" 
		:columns="columns" 
		:topBatchBtn="topBatchBtn"
		:right-edit-btns="editBtns"
		@left-batch-change="handleLeftBatchChange"
		:showAsinDes="true"
		url="shopManage/productReviewRequestList"
		ref="layout"
	>
		<div slot="textDes">
			<span>自动索评 
				<ElTooltip content="开启后会自动索评" placement="bottom-end" style="margin-left: 2px;margin-right: 6px;">
					<i class="el-icon-info"></i>
				</ElTooltip>
				<el-switch
				  v-model="statusValue"
				  active-color="rgb(0,167,226)"
				  @change="changeStatus"
				  >
				</el-switch>
			</span>
		</div>
	</main-layout>
</template>
<script>
	import { downloadFile } from 'Utils'
	export default {
		data() {
			let vm = this
			return {
				statusValue:false,
				topBatchBtn: {
				    options: [
						{
							label: '索评'
						},
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
				searchFields: {
					sellerId: {
						placeholder: '店铺',
						labelWidth: '70px',
						widget: 'select',
						options:[]
					},
					purchaseDate: {
						hidden: true,
						labelWidth: "80px",
						widget: 'daterange',
						label: '下单时间',
						fields: ['purchaseDateMin', 'purchaseDateMax']
					},
					receiptDate: {
						hidden: true,
						labelWidth: "80px",
						widget: 'daterange',
						label: '送达日期',
						fields: ['receiptDateMin', 'receiptDateMax']
					},
					status: {
						hidden: true,
						label:'状态',
						labelWidth: '70px',
						widget: 'select',
						options:[{label:'未索评',value:0},{label:'已索评',value:1}]
					},
				},
				searchData: {},
				columns: [
					{
						label: '订单号',
						value:'amazonOrderId'
					},
					{
						label: '店铺',
						value:'sellerId'
					},
					{
						label: '下单时间',
						value:'purchaseDate'
					},
					{
						label: '送达日期',
						value:'receiptDate',
					},
					{
						label: '金额',
						value: 'amount',
					},
					{
						label: '客户名称',
						value: 'buyerName',
					},
					{
						label: '状态',
						value: 'status',
						_enum:{
							0:'未索评',
							1:'已索评'
						}
					},
				]
			}
		},
		methods: {
			changeStatus(e){
				this.$api['shopManage/sellerConfigUpdate']({...this.storeInfo,autoReviewRequest:e}).then((res)=>{
					this.getStatus()
				})
			},
			getStatus(){
				this.$api['shopManage/sellerConfigInfo']({...this.storeInfo}).then((res)=>{
					this.statusValue = res.data.autoReviewRequest
				})
			},
			getStore(){
				// this.$api['shopAuth/sellerAuthListToSeller']({platformId:this.storeInfo.platformId,siteId:this.storeInfo.siteId}).then((res)=>{
				// 	this.searchFields.sellerId.options = res.data.map(e=>({
				// 		label:e.sellerAlias,
				// 		value:e.sellerId
				// 	}))
				// })
			},
			handleLeftBatchChange(val, selection) {
				let idArray = selection.map(el => el.amazonOrderId)
				let params = {
					...this.storeInfo,
					idArray
				}
				switch (val[0]) {
					case '索评':
						this.showConfirmGlobal('shopManage/productReviewRequestSendReviewRequest',params,'索评')
					break
					case '导出Excel':
						this.expReview(idArray, true)
					break
				}
			},
			expReview(idArray, setLoading, searchData) {
				setLoading && (this.topBatchBtn.loading = true)
				return this.$api[`shopManage/productReviewRequestExport`]({
					idArray,
					...this.outerParams,
					...searchData
				})
			    .then(data => {
					setLoading && (this.topBatchBtn.loading = false)
					let ext = 'xlsx'
					downloadFile(data, `索评.${ext}`)
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
			this.$nextTick(()=>{
				this.getStore()
				this.getStatus()
			})
			
		}
	}
</script>
