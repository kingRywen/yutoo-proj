<template>
	<main-layout 
	    :outerParams = "outerParams"
		:searchFields="searchFields" 
		:columns="columns" 
		:edit-btns="edits" 
		edit-width="160px" 
		:right-edit-btns="editBtns"
		:topBatchBtn="topBatchBtn"
		:btnFn="btnFn"
		@left-batch-change = 'leftBatchChange'
		url="keyword/taskKeywordAsinReverseMerList"
		ref="layout"
	></main-layout>
</template>
<script>
	export default {
		data() {
			let vm = this
			return {
				topBatchBtn: {
				    options: [
						{
							label: '重新抓取'
						},
						{
							label: '删除'
						}
					]
				},
				editBtns: [
				    {
						name: '添加任务',
						// icon: 'el-icon-plus',
						perm: 'add',
						fn: () => {
							this.showDialogGlobal(`添加任务`, '100%', {}, () => import('./dialogs/add.vue'))
						}
				    },
				],
				searchFields: {
					taskName: {
						placeholder: '任务ID',
						labelWidth: '70px'
					},
					createTime: {
						hidden: true,
						labelWidth: "80px",
						widget: 'daterange',
						label: '创建时间',
						fields: ['createTimeMin', 'createTimeMax']
					},
					resultTime: {
						hidden: true,
						labelWidth: "80px",
						widget: 'daterange',
						label: '更新时间',
						fields: ['resultTimeMin', 'resultTimeMax']
					},
					status: {
						hidden: true,
						widget: 'select',
						options: vm.$const['KEYWORD/status'],
						label: '抓取状态',
						labelWidth: '80px'
					},
					compareType: {
						hidden: true,
						widget: 'select',
						options: vm.$const['OTHER/yesno'],
						label: '是否对比',
						labelWidth: '80px'
					},
					matchType: {
						hidden: true,
						widget: 'select',
						options: vm.$const['OTHER/yesno'],
						label: '是否完全匹配',
						labelWidth: '100px'
					},
					asin: {
						hidden: true,
						label: 'ASIN',
						labelWidth: '70px'
					},
					compareAsin: {
						hidden: true,
						label: '对比ASIN',
						labelWidth: '80px'
					},
				},
				edits: [
					{
						name: '查看',
						perm: 'addTask',
						fn: scope => {
							vm.$router.push({path:'/keyword/asinTheCheck/detail',query:{merchantTaskId:scope.row.merchantTaskId,compareType:scope.row.compareType,asin:scope.row.asin,compareAsin:scope.row.compareAsin}})
						}
					},
					{
						name: '重新抓取',
						fn: scope => {						
							let params = {merchantTaskIds:[scope.row.merchantTaskId],...vm.outerParams}
							this.showConfirmGlobal('keyword/taskKeywordAsinReverseMerReCrawl',params,'重新抓取')						
						}
					},
					{
						name: '删除',
						fn: scope => {
							let params = {merchantTaskIds:[scope.row.merchantTaskId],...vm.outerParams}
							this.showConfirmGlobal('keyword/taskKeywordAsinReverseMerRemove',params,'删除')
						}
					}
				],
				columns: [
					{
						label: '任务ID',
						value: 'taskName',
					},
					{
						label: 'ASIN',
						render(h, scope) {
							let {asin} = scope.row
							return <a href={vm.storeUrls.asinUrl + asin} target="_blank" type="text">{asin}</a>
						}
					},
					{
						label: '是否对比',
						value: 'compareType',
						_enum: {
							0: '否',
							1: '是'
						},
					},
					{
						label: '对比ASIN',
						value: 'compareAsin',
						render(h, scope) {
							let {compareAsin} = scope.row
							return compareAsin ? (
								<a href={vm.storeUrls.asinUrl + compareAsin} target="_blank" type="text">{compareAsin}</a>
							) : (
								<span>-</span>
							)
						}
					},
					//123/
					{
						label: '是否完全匹配',
						value: 'matchType',
						_enum: {
							0: '否',
							1: '是'
						},
					},
					{
						label: '创建时间',
						value: 'createTime',
						sortable: 'custom',
					},
					{
						label: '抓取状态',
						value: 'status',
						_enum: {
							0: '待处理',
							1: '处理中',
							2: '处理成功',
							3: '处理失败'
						},
					},
					{
						label: '数据更新时间',
						value: 'resultTime',
						sortable: 'custom',
					},				
				]
			}
		},
		methods: {
			btnFn({ status }) {
			  if (status == 1) {
			    return [3]
			  }
			  if (status == 2) {
			    return [1,2,3]
			  }
			  if (status == 3 || status > 3) {
			    return [2,3]
			  }
			},
			leftBatchChange(type,data){
				let params = {
					...this.outerParams,
					merchantTaskIds:data.map(e=>e.merchantTaskId)
				}
				switch(type[0]){
					case '重新抓取':
						this.showConfirmGlobal('keyword/taskKeywordAsinReverseMerReCrawl',params,'重新抓取')
					break;
					case '删除':
						this.showConfirmGlobal('keyword/taskKeywordAsinReverseMerRemove',params,'删除')
					break;
				}
			}
		},
		computed:{
			outerParams(){
				return {
					platformId:this.storeInfo.platformId,
					siteId:this.storeInfo.siteId
				}
			}
		},
	}
</script>
