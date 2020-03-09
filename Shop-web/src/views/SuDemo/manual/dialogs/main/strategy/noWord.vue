<template>
	<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane label="广告词" name="first">
			<noWordChild ref="first" type='first' />		
		</el-tab-pane>
		<el-tab-pane label="客户搜索词" name="second">
			<noWordChild ref="second" type='second' />
		</el-tab-pane>
		<el-tab-pane label="ASIN" name="third">
			<noWordChild ref="third" type='third' />
		</el-tab-pane>
		<el-tab-pane label="搜索ASIN" name="fourth">
			<noWordChild ref="fourth" type='fourth' />
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import noWordChild from 'Views/SuDemo/manual/dialogs/main/item/noWord/noWordChild.vue'
	import {resultData} from 'Views/SuDemo/manual/js/noWord.js'
	export default{
		props:['params'],
		data(){
			return{
				activeName:'first'
			}
		},
		methods:{
			tabClick(e){

			},
			_initData(){
				if(this.params.edit){
					let data = this.params
					let { first, second, third, fourth} = this.$refs
					first.adLoading = true
					let params = {
						...this.storeIds,
						strategyType:data.strategyType,
					}
					if(data.row && data.row.length == 1) params.objectId = data.row[0].objectId
					this.$api['adManualNtInfo'](params).then((res)=>{
						let resData = res.data						
						if(resData.keywordStrategy) first.getInfo(resData.keywordStrategy)
						if(resData.queryStrategy) second.getInfo(resData.queryStrategy)
						if(resData.targetStrategy) third.getInfo(resData.targetStrategy)
						if(resData.asinStrategy) fourth.getInfo(resData.asinStrategy)
					}).catch(()=>{
						first.adLoading = false
					})
				}
			},
			_submit(){
				let {first,second,third,fourth} = this.$refs
				let forms = [first,second,third,fourth]
				return Promise.all(forms.map(e=>e.validateFn())).then(()=>{
					let data1 = this.deepCopyGlobal(first.formData)				
					let data2 = this.deepCopyGlobal(second.formData)
					let data3 = this.deepCopyGlobal(third.formData)
					let data4 = this.deepCopyGlobal(fourth.formData)
					let params = {
						...this.storeIds,
						strategyType:this.params.strategyType,
						objectIds:this.params.row && this.params.row.length ? this.params.row.map(e=>e.objectId) : null,
						keywordStrategy:resultData(data1),
						queryStrategy:second.validType ? resultData(data2) : null,
						targetStrategy:third.validType ? resultData(data3) : null,
						asinStrategy:fourth.validType ? resultData(data4) : null,				
					}
					return this.$api['adManualNtSave'](params)
				}).catch(e=>{
					if(e === 'first' || e === 'second' || e === 'third' || e === 'fourth') this.activeName = e				
				})
			}
		},
		components:{
			noWordChild
		},		
	}
</script>

<style>
</style>
