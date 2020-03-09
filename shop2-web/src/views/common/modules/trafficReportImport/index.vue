<template>
	<main-layout 
	    :outerParams = "outerParams"
		@searchTrueData="val => searchData = val"
		:searchFields="searchFields" 
		:columns="columns" 
		:right-edit-btns="editBtns"
		:searchDefaultData = 'searchDefaultData'
		edit-width="160px" 
		url="keyword/productFlowRptLogList"
		ref="layout"
		:btnTip="true"
	>
		<span slot="btnTip">
			最近365天成功上传子产品报告数，<span  @click="goImport" style="color:#ff9966;margin-right:0;cursor:pointer;">{{tipData.successChildCnt}}</span> 份；未导入变体报告：<span  @click="showDialog" style="color:#ff9966;margin-right:0;cursor:pointer;">{{tipData.noChildCnt}} </span>份，为不影响系统数据分析，每天请及时导入业务报告
		</span>
	</main-layout>
</template>
<script>
	import { downloadFile } from 'Utils'
	export default {
		data() {
			let vm = this
			let { today, computedDay } = this.cfuns.getDay(365)
			return {
				searchDefaultData:{
					rptDate:[computedDay,today]
				},
				editBtns: [
					{
						name: '导入变体报告',
						perm: 'add',
						// icon: 'el-icon-plus',
						fn: () => {
							let params = {
								fn:this.$refs.layout.closeDialog,
								success: this.$refs.layout.getList,
							}
							return this.showDialogGlobal('导入变体报告','100%',params,() => import("./dialogs/import"),'','关闭')
						}
					},
				],
				searchData:{},
				searchFields: {
					rptDate: {
						widget: 'daterange',
						fields: ['rptDateMin', 'rptDateMax'],
						clearable:false,
					},
					childStatus: {
						hidden: true,
						widget: 'select',
						options: this.$const[`IMPORT/status`],
						label: '变体报告',
						labelWidth: '80px'
					},
				},
				columns: [{
						label: '日期',
						value: 'rptDate',
					},
					{
						label: '变体报告',
						value: 'childStatus',
						_enum:{
							0:'未导入',
							1:'已导入'
						}
					}
				],
				tipData:{
					successChildCnt:0,
					noChildCnt:0
				}
			}
		},
		methods:{
			goImport(){
				this.$router.push({
					path:'/common/importLogs'
				})
			},
			showDialog(){
				this.showDialogGlobal(`详情`, '100%', {}, () => import('./dialogs/calendar.vue'),'','关闭')
			},
			getData(){
				let { today, computedDay } = this.cfuns.getDay(365)
				let params = {
					...this.storeInfo,
					rptDateMin:computedDay,
					rptDateMax:today,
				}
				this.$api['keyword/productFlowRptLogStat'](params).then((res)=>{
					this.tipData = {
						successChildCnt: res.data.successChildCnt,
						noChildCnt:res.data.noChildCnt
					}
				})
			}
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
				this.getData()
			})
		}
	}
</script>