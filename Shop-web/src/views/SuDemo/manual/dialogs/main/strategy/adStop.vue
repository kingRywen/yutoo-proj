<template>
	<div>
		<ad-stop-child ref="first" />
	</div>
</template>

<script>
	import adStopChild from 'Views/SuDemo/manual/dialogs/main/item/adStop/adStopChild.vue'
	import {resultData} from 'Views/SuDemo/manual/js/adStop.js'
	export default{
		props:['params'],
		methods:{
			_initData(){
				if(this.params.edit){
					let data = this.params
					let { first} = this.$refs
					first.adLoading = true
					let params = {
						...this.storeIds,
						strategyType:data.strategyType			
					}
					if(data.row && data.row.length == 1) params.objectId = data.row[0].objectId
					this.$api['adManualPausedInfo'](params).then((res)=>{
						let resData = res.data						
						if(resData){
							first.getInfo(resData)
						}else{
							first.adLoading = false
						}
					}).catch(()=>{
						first.adLoading = false
					})
				}
			},
			_submit(){
				let {first} = this.$refs
				let forms = [first]
				return Promise.all(forms.map(e=>e.validateFn())).then(()=>{
					let data1 = this.deepCopyGlobal(first.formData)				
					let params = {
						...this.storeIds,
						strategyType:this.params.strategyType,
						objectIds:this.params.row && this.params.row.length ? this.params.row.map(e=>e.objectId) : null,
						pausedStrategy:resultData(data1),			
					}
					return this.$api['adManualPausedSave'](params)
					
				})
			}
		},
		components:{
			adStopChild
		},		
	}
</script>

<style>
</style>
