<template>
	<main-layout 
		:outerTableList = 'outerTableList'
		:columns="columns" 
		:showSelection = 'false'
		ref="layout"
	></main-layout>
</template>
<script>
	export default {
		props:['params'],
		data() {
			let vm = this
			return {
				columns: [
					{
						label: '退货原因',
						value: 'reason',
					},		
					{
						label: '数量',
						value: 'returnCnt',
					},
					{
						label: '占比',
						value: 'reasonRate',
						isPercent:true,
					},
				],
				outerTableList:[]
			}
		},
		mounted(){
			this.$api['shopManage/productHealthStatReturnReasonList'](this.params).then((res)=>{
				this.outerTableList = res.data.map((e)=>({
					reason:e.reason,
					returnCnt:e.returnCnt,
					reasonRate:e.reasonRate
				}))
			})
		}
	}
</script>
