<template>
	<main-layout 
	    :outerParams = "outerParams"
		:searchFields="searchFields" 
		:columns="columns" 
		:edit-btns="edits" 
		edit-width="160px" 
		:btnFn="btnFn"
		url="keyword/importLogList"
		ref="layout"
	></main-layout>
</template>
<script>
	import { downloadFile } from 'Utils'
	export default {
		data() {
			let vm = this
			return {
				searchFields: {
					name: {
						placeholder: '模块/功能名称/文件名称',
						labelWidth: '70px'
					},
					importTime: {
						hidden: true,
						labelWidth: "80px",
						widget: 'daterange',
						label: '上传时间',
						fields: ['importTimeMin', 'importTimeMax']
					},
					finishTime: {
						hidden: true,
						labelWidth: "80px",
						widget: 'daterange',
						label: '完成时间',
						fields: ['finishTimeMin', 'finishTimeMax']
					},
					status: {
						hidden: true,
						widget: 'select',
						options: [
							{
							    label: '上传中',
							    value: 0
							},
							{
							    label: '上传成功',
							    value: 1
							},
							{
							    label: '上传失败',
							    value: 3
							},
						],
						label: '上传状态',
						labelWidth: '80px'
					},
				},
				edits: [
					{
						name: '下载错误报告',
						perm: 'addTask',
						fn: scope => {
							vm.$api['keyword/importLogExport']({...vm.storeInfo,logId:scope.row.logId})
							  .then(data => {
							    if (data.code && data.code !== 0) {
							      return
							    }
							    downloadFile(
							      data,
							      '错误报告下载'
							    )
							    
							  })
						}
					},
				],
				columns: [{
						label: '模块名称',
						value: 'moduleName',
					},
					{
						label: '功能名称',
						value:'featureName'
					},
					{
						label: '文件名称',
						value: 'fileName',
					},
					{
						label: '上传时间',
						value: 'importTime',
						sortable: 'custom',
					},
					{
						label: '上传状态',
						value: 'status',
						_enum:{
							0:'上传中',
							1:'上传成功',
							2:'上传成功',
							3:'上传失败',
						}
					},
					{
						label: '上传结果',
						value: 'description',
					},
				]
			}
		},
		methods: {
			btnFn({ status }) {
			  if(status == 1 || status == 0 || status == 3) {
				  return []
			  }else if(status == 2) {
				  return [1]
			  }
			},
		},
		computed:{
			outerParams(){
				return {
					...this.storeInfo,
					// importType:this.$route.query.importType || 0
				}
			}
		}
	}
</script>