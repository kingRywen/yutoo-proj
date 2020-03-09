<template>
	<div>
		<tableTasks :isFlow = 'true' ref="child" />
	</div>
</template>

<script>
	import tableTasks from 'Views/modules/shopManage/common/dialogs/tableTasks.vue'
	export default{
		components:{
			tableTasks
		},
		methods:{
			_submit(){
				let childData = this.$refs.child.rightTableData
				if(childData && childData.length === 0) return this.$message.warning('请添加数据')		
				let params = {
					 ...this.storeInfo,
					 sellerSkus:this.getData(childData)
				}
				return this.$api['shopManage/productFlowSkuSave'](params)
			},
			getData(arr){
				let newArr = []
				arr.forEach(e => {
					newArr.push(e.sellerSku)
					if(e.childList && e.childList.length){
						e.childList.forEach(i => {
							newArr.push(i.sellerSku)	
						})
					}
				})
				return newArr
			}
		}		
	}
</script>

<style>
</style>
