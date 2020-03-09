<template>
	<main-layout 
	    :outerParams = "outerParams"
		:searchFields="searchFields" 
		:columns="columns" 
		:edit-btns="edits" 
		:topBatchBtn="topBatchBtn"
		@left-batch-change = 'leftBatchChange'
		:tip = "parseInt($route.query.type) === 9 || parseInt($route.query.type) === 10 ? '每日6点和16点更新数据' : null"
		ref="layout"
		url="shopManage/warnTypeList"
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
							label: '设置已读'
						},
						{
							label: '设置未读'
						},
						{
							label:'导出Excel'
						},
						{
							label:'删除'
						}
					]
				},
				searchFields: {
					sellerId: {
						placeholder: '店铺',
						labelWidth: '70px',
						widget: 'select',
						options:[]
					},
					time: {
						hidden: true,
						labelWidth: "80px",
						widget: 'daterange',
						label: '时间',
						fields: ['queryStartDateTime', 'queryEndDateTime']
					},
					status: {
						hidden: true,
						widget: 'select',
						options:[{label: '未读',value: 0 },{label: '已读',value: 1},{label: '已删除',value: 2}],
						label: '状态',
						labelWidth: '80px'
					},
				},
				edits: [],
				columns: [
					{
						label:'发货ID',
						value:'id',
						isShow:true,
					},
					{
						label:'SKU',
						value:'sku',
						isShow:true,
					},
					{
						label:'订单号',
						value:'id',
						isShow:true,
					},
					{
						label:'下单时间',
						value:'dateTime',
						isShow:true,
					},
					{
						label: '店铺',
						value: 'sellerId',
					},	
					{
						label:'客户名称',
						value:'budgetName',
						isShow:true,
					},
					{
						label:'订购产品',
						value:'productCnt',
						isShow:true,
						render(h,scope){
							let {productCnt,item} = scope.row
							return <el-button type="text" onClick={() => { vm.showDialog(item,'产品列表',1) }}  >{productCnt}</el-button>
						}
					},
					//123/
					{
						label:'订单金额',
						value:'amount',
						isShow:true,
					},
					{
						label:'地址',
						value:'address',
						isShow:true,
					},
					{
						label: '时间',
						value:'dateTime',
						sortable: 'custom',
						isShow:false,
					},
					{
						label:'发件人',
						value:'buyerName',
						isShow:true,
					},
					{
						label:'A-Z数量',
						value:'azCnt',
						isShow:true,
						sortable: 'custom',
					},
					{
						label:'发货数量',
						value:'shippedCnt',
						isShow:true,
					},
					{
						label:'入仓数量',
						value:'receivedCnt',
						isShow:true,
					},
					{
						label:'差异数量',
						value:'differencesCnt',
						isShow:true,
						render(h,scope){
							let {differencesCnt,item} = scope.row
							return <el-button type="text" onClick={() => { vm.showDialog(item,'详情',2) }}  >{differencesCnt}</el-button>
						}
					},
					//123/
					{
						label: '状态',
						value: 'status',
						_enum: {
							0: '未读',
							1: '已读',
							2: '已删除',
						},
					},
					{
						label: '主题',
						value: 'subject',
						isShow:false,
					}			
				]
			}
		},
		methods: {
			showDialog(item,title,type){
				this.showDialogGlobal(title, '100%', {item,type}, () => import('Views/modules/shopManage/leftMenu/warningMessage/dialogs/table.vue'),'','关闭')
			},
			leftBatchChange(type,data){
				let params = {
					...this.outerParams,
					idArray:data.map(e=>e.id)
				}
				switch(type[0]){
					case '设置已读':
						this.showConfirmGlobal('shopManage/warnSetRead',params,'设置已读')
					break;
					case '设置未读':
						this.showConfirmGlobal('shopManage/warnSetUnread',params,'设置未读')
					break;
					case '设置无需回复':
						this.showConfirmGlobal('shopManage/warnSetReply',params,'设置无需回复')
					break;
					case '导出Excel':
						this.expReview(params, true)
					break;
					case '删除':
						this.showConfirmGlobal('shopManage/warnRemove',params,'删除')
					break;
				}
			},
			expReview(params, setLoading, searchData) {
				setLoading && (this.topBatchBtn.loading = true)
				return this.$api[`shopManage/warnExportExcel`]({
					...params,
					...searchData
				})
			    .then(data => {
					setLoading && (this.topBatchBtn.loading = false)
					let ext = 'xlsx'
					downloadFile(data, `预警消息.${ext}`)
			    })
			    .catch(err => {
					setLoading && (this.topBatchBtn.loading = false)
					return Promise.reject(err)
			    })
			},
			getStore(){
				this.$api['shopAuth/sellerAuthListToSeller']({platformId:this.storeInfo.platformId,siteId:this.storeInfo.siteId}).then((res)=>{
					this.searchFields.sellerId.options = res.data.map(e=>({
						label:e.sellerAlias,
						value:e.sellerId
					}))
				})
			},
			setOptions(){
				let type = this.$route.query.type
				let show0,show1,show2,show3,show5,show6,show7,show8,show9,show10,show11,show12,show13,show14,show16
				show0=true;show1=true;show2=true;show3=true;show5=true;show6=true;show7=true;show8=true;show9=false;show10=true;show11=true;show12=true;show13=true;show14=true;show16=false;
				switch(parseInt(type)){
					case 1:
						show1=false;
					break;
					case 7:
						show10 = false;
						this.columns[9].label = '最后发件时间'
						this.topBatchBtn.options.splice(2,0,{label:'设置无需回复'})
						this.edits = [{
							name: '设置无需回复',
							fn: scope => {
								let params = {
									...this.outerParams,
									idArray:[scope.row.id]
								}
								this.showConfirmGlobal('shopManage/warnSetReply',params,'设置无需回复')						
							}
						}]
					break;
					case 8:
						show9 = true;show11 = false;show16 = true;
						delete this.searchFields.time
					break;
					case 9:
						show2=false;show3=false;show5=false;show6=false;show7=false;show8=false;show9=true;show16=true;
					break;
					case 10:
						show0=false;show3=false;show9=true;show12=false;show13=false;show14=false;show16=true;
						this.columns[3].label = '时间'
					break;
				}
				this.columns[0].isShow = show0
				this.columns[1].isShow = show1
				this.columns[2].isShow = show2
				this.columns[3].isShow = show3
				this.columns[5].isShow = show5
				this.columns[6].isShow = show6
				this.columns[7].isShow = show7
				this.columns[8].isShow = show8
				this.columns[9].isShow = show9
				this.columns[10].isShow = show10
				this.columns[11].isShow = show11
				this.columns[12].isShow = show12
				this.columns[13].isShow = show13
				this.columns[14].isShow = show14
				this.columns[16].isShow = show16
			}
		},
		computed:{
			outerParams(){
				return {
					...this.storeInfo,
					type:this.parentType
				}
			},
			parentType(){
				return parseInt(this.$route.query.type)
			}
		},
		mounted() {
			//获取店铺信息
			this.getStore()
		},
		created(){
			//判断是哪个点进来的
			this.setOptions()
		}
	}
</script>
