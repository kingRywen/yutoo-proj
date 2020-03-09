<template>
	<MainLayout
	    :outerParams="outerParams"
	    :searchFields="searchFields"
	    :editBtns="editBtns"
		:edits="edits"
	    :columns="columns"
		@requestSuccess = "requestSuccess"
		:showSearch = 'false'
		reserveSelection = "keywordQuery"
	    ref="layout"
	    url="adKeywordQueryList"
		:cancelGetList = "false"
	    >  
	</MainLayout> 
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	export default{
		data(){
			let vm = this
			return{
				tableLoading:false,
				edits:[
					{
					    name: "查看分析",
					    icon: "el-icon-search",
					    show: scope => {
					          return  true
					    },
					    fn: (scope) => {
							this.$refs.layout.$dialog({
								title: '数据展示',
								width: '1200px',
								showMaxBtn: true,
								params: { dealFlag:0,keywordQuery: scope.row.keywordQuery,adGroupIds: [this.$route.query.objectId],keywordIds:this.$parent.$parent.$parent.keywordIds && this.$parent.$parent.$parent.keywordIds.length ? this.$parent.$parent.$parent.keywordIds : null ,url:'adKeywordQueryAdHistoryStat'},
								component: () => import('../dialog/echarts.vue'),
							})
					    }
					}
				],
				searchFields:[],
				editBtns:[
					{
						name:'导出',
						showLoading:true,
						fn:()=>{
							let data = vm.getSelection().map(e=>e.keywordQuery)
							return this.exportMethod(data)
						}
					},
					{
						name:'复制关键词',
						disabled:selection => {
							return selection.length == 0
						},
						fn:()=>{
							let data = vm.getSelection().map(e=>e.keywordQuery)
							let str = ''
							str = data.join('\n')
							vm.$copyText(str).then(function (e) {
							  vm.$message.success('复制成功')
							}, function (e) {
							  vm.$message.error('复制失败')
							})
						}
					},
					{
						name:'加入系列否定词',
						disabled:selection => {
							return selection.length == 0
						},
						fn:()=>{
							let datas = vm.getSelection().map(e=>e.keywordQuery)
							this.$refs.layout.$dialog({
								title: "加入系列否定词",
								width:'600px',
								params: {datas:datas},
								component: () => import('../dialog/add.vue'),
								okBtnText:'确认',
								cancelBtnText:'取消'
							});
						}
					},
					{
						name:'广告排名监控',
						showDropBtn:true,
						disabled: () => {
							return this.$refs.layout && this.$refs.layout.selection.length === 0
						},
						dropWidth:'124px',
						dropList:[
							{
								name:'编辑',
								fn:()=>{
									let data = vm.getSelection().map(e=>e.keywordQuery)
									vm.$refs.layout.$dialog({
										title:'编辑广告排名监控',
										size:'small',
										params:{adGroupId:vm.$route.query.objectId,keywordQuerys:data,adFlag:1},
										component:() => import('@/views/SuDemo/manual/dialogs/main/item/addWarning.vue'),
										okBtnText: '确认',
										cancelBtnText:'取消'
									})
								}
							},
							{
								name:'关闭',
								fn:()=>{
									let params = {
										adGroupId:vm.$route.query.objectId,
										keywordQuerys:vm.getSelection().map(e=>e.keywordQuery),
										adFlag:1
									}
									vm.$confirm('此操作将关闭广告排名监控,是否继续','提示',{type:'warning'}).then(()=>{
										vm.$api['adKeywordQueryRankCloseMonitor'](params).then(()=>{
											vm.getLayoutList()
										})
									}).catch(()=>{})
								}
							},
						]
					},
					{
						name:'自然排名监控',
						showDropBtn:true,
						disabled: () => {
							return this.$refs.layout && this.$refs.layout.selection.length === 0
						},
						dropWidth:'124px',
						dropList:[
							{
								name:'编辑',
								fn:()=>{
									let data = vm.getSelection().map(e=>e.keywordQuery)
									vm.$refs.layout.$dialog({
										title:'编辑广告排名监控',
										size:'small',
										params:{adGroupId:vm.$route.query.objectId,keywordQuerys:data,adFlag:0},
										component:() => import('@/views/SuDemo/manual/dialogs/main/item/addWarning.vue'),
										okBtnText: '确认',
										cancelBtnText:'取消'
									})
								}
							},
							{
								name:'关闭',
								fn:()=>{
									let params = {
										adGroupId:vm.$route.query.objectId,
										keywordQuerys:vm.getSelection().map(e=>e.keywordQuery),
										adFlag:0
									}
									vm.$confirm('此操作将关闭自然排名监控,是否继续','提示',{type:'warning'}).then(()=>{
										vm.$api['adKeywordQueryRankCloseMonitor'](params).then(()=>{
											vm.getLayoutList()
										})
									}).catch(()=>{})
								}
							},
						]
					}
				],
				columns:[
					
					{
					    label: "客户搜索词",
					    value: "keywordQuery",
						align:'left',
						showTooltip:true,
					},
					{
					    label: "曝光量",
					    value: "impressions",
						sortable:"custom",
					},
					{
					    label: "点击量",
					    value: "clicks",
						sortable:"custom",
					},
					{
					    label: "点击率",
					    value: "clickRates",
						sortable:"custom",
						isPercent:true,
						keepFew:2,
					},
					{
					    label: "广告排名监控状态",
					    value: "adMonitorFlag",
						minWidth:'120px',
						enum:{
							0:'关闭',
							1:'开启'
						}
					},
					{
					    label: "广告排名",
					    value: "adWebRank",
						sortable:"custom",
						minWidth:'100px',
					},
					{
					    label: "自然排名监控状态",
					    value: "monitorFlag",
						minWidth:'120px',
						enum:{
							0:'关闭',
							1:'开启'
						}
					},
					{
					    label: "自然排名",
					    value: "webRank",
						sortable:"custom",
						minWidth:'100px',
					},
				],
			}
		},
		methods:{
			requestSuccess(){
				this.$parent.$parent.$parent.tableLoading = false
			},
			exportMethod(data){
				let parentData = this.$parent.$parent.$parent.searchMethod(true)
				let param = {
				  ...this.outerParams,
				  ...parentData,
				  sortField:this.$refs.layout.sortData.sortField,
				  sort:this.$refs.layout.sortData.sort == 1 ? 'asc' : this.$refs.layout.sortData.sort == 0 ? 'desc' : null,
				  keywordQuerys:data && data.length ? data : null,
				}
				return this.$api['adKeywordQueryExportData'](param).then(data => {
				  downloadFile(
				    data,
				    '广告客户搜索词列表' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
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
					dealFlag:0,
					flag:1,
					adGroupIds:[this.$route.query.objectId] || null,
				}
			},
		},
	}
</script>

<style>
</style>
