<template>
	<div>
		<MainLayout
			:outerParams="outerParams"
			:edits="edits"
			:searchFields="searchFields"
			:editBtns="editBtns"
			:columns="columns"
			:searchFunc='searchFunc'
			:outSearchData="searchData"
			url="homeAdProductList"
			ref="layout"
		></MainLayout>
	</div>
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	import dayjs from 'dayjs'
	export default{
		data(){
			let vm = this
			return{
				edits:[],
				searchData: {
				  time: [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'),dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')]
				},
				searchFields:[
					{
						label:'预警时间',
						name:'time',
						type:'dateRange',
						pickerOptions:{
							disabledDate(time) {
								return  time.getTime() > Date.now() - 15 * 3600 * 1000
							}
						}
					},
					{
						label:'系列',
						name:'campaignName',
						type:'input',
						placeholder:'请输入系列',
					},
					{
						label:'广告组',
						name:'groupName',
						type:'input',
						placeholder:'请输入广告组',
					},
				],
				editBtns:[
					{
						name:'导出',
						showLoading:true,
						fn: ()=>{
							let data = vm.getSelection().map((e)=>{
								return {adGroupId:e.adGroupId,wornTime:e.wornTime}
							})
							return vm.exportMethod(data)
						}
					},
				],
				columns:[
					{
						label:'预警时间',
						sortable:"custom",
						value:'wornTime',
						align:'left',
						minWidth:100,	
					},
					{
						label:'广告系列',
						value:'campaignName',
						minWidth:100,	
						align:'left',
					},
					{
						label:'广告组',
						value:'groupName',
						minWidth:100,	
						align:'left',
					},
					{
					  label:'暂停子ASIN',
					  align:'left',
					  width:270,
					  render(h,scope){
						  let list = scope.row.adList
						  let str = '',asinList = []
						  list.forEach((e)=>{
							  asinList.push(e.asin)
						  })
						  if(asinList.length > 3){
							  str = asinList.join(',')
							  
							  let strName = `${asinList[0]},${asinList[1]},${asinList[2]}`
							  return (
								  <el-tooltip open-delay={300} content={str} placement="top">
								  		<span class="fix__row_1">{strName}</span>
								  </el-tooltip>
							  )
						  }else{
							  str = asinList.join(',')
							  return (
								  <span class="fix__row_1">{str}</span>
							  )
						  }
					  }
					},
					{
					  label:'暂停子SKU',
					  align:'left',
					  minWidth:140,
					  render(h,scope){
						  let list = scope.row.adList
						  let str = '',skuList = []
						  list.forEach((e)=>{
							  skuList.push(e.sku)
						  })
						  str = skuList.join(',')
						  return (
							  <el-tooltip open-delay={300} content={str} placement="top">
									<span class="fix__row_1">{str}</span>
							  </el-tooltip>
						  )
					  }
					},
				]
			}
		},
		methods:{
			searchFunc(data) {
			  let { time, ...info } = data;
			  let [startTime, endTime] = time || [];
			  return { startTime, endTime, ...info };
			},
			exportMethod(data){
				let params = {
					platformId:this.platformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
					campaignName:this.$refs.layout.searchTrueData.campaignName,
					groupName:this.$refs.layout.searchTrueData.groupName,
					startTime:this.$refs.layout.searchTrueData.startTime,
					endTime:this.$refs.layout.searchTrueData.endTime,
					wornList:data && data.length ? data : null,
					sortField:this.$refs.layout.sortData.sortField,
					sortOrder:this.$refs.layout.sortData.sort == 1 ? 'asc' : this.$refs.layout.sortData.sort == 0 ? 'desc' : null,
				}
				return this.$api['homeAdProductExport'](params).then((res)=>{
					downloadFile(
					  res,
					  '子SKU广告被暂停' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
					)
				})
			},
		},
		computed: {
			outerParams(){
				return {
					platformId:this.platformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
				}
			},
		},
		watch:{
			
		}
	}
</script>

<style>
</style>

