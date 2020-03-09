<template>
	<div>
		<div v-if='$route.name==="newAdKeyword"'>
			<MainLayout
				:outerParams="outerParams"
				:edits="edits"
				:searchFields="searchFields"
				:initialParmas="initialParmas"
				:outSearchData="searchData"
				:editBtns="editBtns"
				:columns="columns"	
				:showWdg = 'false'
				:searchFunc="searchFunc"
				url="adProductRptList"
				ref="layout"
			></MainLayout>
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
	import dayjs from 'dayjs'
	import { downloadFile } from 'Utils/tools'
	export default{
		data(){
			let vm = this
			return{
				edits:[],
				searchData: {
					rptDate: [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'), dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')],
				},
				initialParmas: {
					rptDate: [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'), dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')],
				},
				searchFields:[
					{
						label:'SKU',
						name:'sku',
						type:'input',
						labelWidth:'50px',
						placeholder:'请输入SKU名称',
					},
					{
						label:'状态',
						name:'state',
						type:'select',
						placeholder:'请选择状态',
						options:[
							{label:'启用',value:'enabled'},
							{label:'暂停',value:'paused'},
							{label:'归档',value:'archived'},
						]
					},
					{
						label: '太平洋时间',
						name: 'rptDate',
						type: 'dateRange',
						placeholder: '请选择',
						clearable: false,
						pickerOptions: {
							disabledDate(time) {
								return time.getTime() > Date.now() - 15 * 3600 * 1000
							}
						}
					}
				],
				editBtns:[
					{
						name: '要推广的产品',
						showDropBtn:true,
						dropWidth:'124px',
						dropList: [{
								name: '添加',
								fn: () => {
									vm.$refs.layout.$dialog({
										title:'添加要推广的产品',
										width:'1000px',
										params:{
											adGroupId:this.$route.query.objectId
										},
										component: () => import("Views/SuDemo/manual/dialogs/main/adItem/adProduct.vue"),
										okBtnText:'确认',
										cancelBtnText:'取消'
									});
								}
							},
							{
								name: '开启',
								fn: () => {
									vm.showConfirm('开启要推广的产品','enabled','adProductUpdate')
								}
							},
							{
								name: '暂停',
								fn: () => {
									vm.showConfirm('暂停要推广的产品','paused','adProductUpdate')
								}
							},
							{
								name: '归档',
								fn: () => {
									vm.showConfirm('归档要推广的产品','archived','adProductUpdate')
								}
							},
						],
					},
					// {
					// 	name:'暂停',
					// 	disabled:selection => {
					// 		return selection.length === 0
					// 	},
					// 	fn: ()=>{
					// 		let data = vm.getSelection().map(e=>e.adId)
					// 		let params = {
					// 			...vm.storeIds,
					// 			adIds:data,
					// 			state:'paused'
					// 		}
					// 		vm.$confirm('此操作将暂停广告,是否继续','提示',{type:'warning'}).then(()=>{
					// 			vm.$api['adProductUpdate'](params).then(()=>{
					// 				vm.getLayoutList()
					// 			})
					// 		}).catch(()=>{})
					// 	}
					// },
				],
				columns: [
					{
					  label:'SKU',
					  value: "sku",
					  minWidth:170,
					  showTooltip:true,
					},
					{
					  label:'ASIN',
					  value: "asin",
					  minWidth:170,
					},
					{
						label:'主图',
						value:'imageUrl',
						img:true,
					},
					{
					  label: '状态',
					  value: 'state',
					  enum: {
					    enabled: '启用',
					    paused: '暂停',
						archived:'存档',
					  }
					},
				  {
				    label: '曝光量',
				    value: 'impressions',
				    minWidth: '90px',
				    sortable: 'custom'
				  },
				  {
				    label: '点击量',
				    value: 'clicks',
				    minWidth: '90px',
				    sortable: 'custom'
				  },
				  {
				    label: '点击率',
				    value: 'clickRates',
				    minWidth: '90px',
				    sortable: 'custom',
				    render(h, scope) {
				      let { clickRates } = scope.row
				      return (
				        <span>
				          {clickRates == null
				            ? '-'
				            : Math.round(clickRates * 1000000) / 10000 + '%'}
				        </span>
				      )
				    }
				  },
				  {
				    label: '订单量',
				    value: 'adOrderCnt',
				    minWidth: '90px',
				    sortable: 'custom'
				  },
				  {
				    label: '转化率',
				    value: 'adConversionRates',
				    minWidth: '90px',
				    sortable: 'custom',
				    render(h, scope) {
				      let { adConversionRates } = scope.row
				      return (
				        <span>
				          {adConversionRates == null
				            ? '-'
				            : Math.round(adConversionRates * 1000000) / 10000 + '%'}
				        </span>
				      )
				    }
				  },
				  {
				    label: 'CPC',
				    value: 'cpc',
				    sortable: 'custom'
				  },
				  {
				    label: '花费',
				    value: 'cost',
				    sortable: 'custom',
						  isShow: false
				  },
				  {
				    label: '广告销售总额',
				    minWidth: 110,
				    value: 'adSales',
				    minWidth: '140px',
				    sortable: 'custom',
						  isShow: false
				  },
				  {
				    label: 'ACOS',
				    value: 'acos',
				    sortable: 'custom',
				    minWidth: '90px',
					  isShow: false,
					  isPercent:true,
					  keepFew:2
				  },
				],
			}
		},
		methods:{
			showConfirm( title , type , url ){
				let data = this.getSelection().map((e)=>{return e.adId})
				if(data && !data.length) return this.$message.warning('请至少选择一项!')
				this.$confirm(`此操作将${title},是否继续`,'提示',{type:'warning'}).then(()=>{
					let params = {
						...this.storeIds,
						state:type,
						adIds:data
					}
					this.$api[url](params).then(()=>{
						this.getLayoutList()
					})
				}).catch(()=>{})
			},
			searchFunc(data) {
				let {
					rptDate,
					...info
				} = data
				let [startTime, endTime] = rptDate || [];
				return {
					startTime,
					endTime,
					...info
				}
			},
		},
		computed: {
			outerParams(){
				return {
					platformId:this.platformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
					adGroupIds:[this.$route.query.objectId] || null
				}
			},
		}
	}
</script>

