<template>
	<div class="speView-1" :style="{height:viewHeight}">
		<div>
			<div>
				<span>调价规则</span>
			</div>
			<div>
				<priceRules ref="form1" />
			</div>
		</div>
		<div>
			<div>
				<span>原价设置</span>
			</div>
			<div>
				<originalSet ref="form2" />
			</div>
		</div>
	</div>
</template>

<script>
	import priceRules from './items/priceRules.vue'
	import originalSet from './items/originalSet.vue'
	export default {
		props:{
			//是否为编辑
			isEdit:{
				type:Boolean,
				default:false
			},
			//可视高度
			viewHeight:{
				type:String,
				default:'760px'
			}
		},
		data(){
			return {
				
			}
		},
		methods:{
			validateFn(){
				let { form1, form2} = this.$refs
				let forms = [form1, form2]
				return Promise.all(forms.map(form => form.validateFn())).then((res)=>{
					return Promise.resolve(res)
				}).catch((error) => {
					console.log(error)
					return Promise.reject()
				})
			},
			_submit(){
				let { form1, form2} = this.$refs
				let forms = [form1, form2]
				return Promise.all(forms.map(form => form.validateFn())).then((res)=>{
					let params = {
						...this.storeInfo,
						...res[0],
						...res[1],
					}
					return this.$api[`${this.isEdit ? 'shopManage/priceSeoUpdateStrategy' : 'shopManage/priceSeoSaveStrategy'}`](params)
				}).catch((error) => {
					console.log(error)
				})
			}
		},
		components:{
			priceRules,
			originalSet
		}
	}
</script>

<style lang="scss" scoped>
	.speView-1{
		width: 100%;
		display: flex;
		justify-content: space-between;
		>div:nth-child(1){
			min-width: 785px;
			overflow-x: auto;
		}
		>div{
			width: 49%;
			height: 100%;
			border: 1px solid rgb(228,228,228);
			display: flex;
			flex-direction: column;
			>div:nth-child(1){
				width: 100%;
				height: 35px;
				line-height: 35px;
				background: rgb(241,241,241);
				>span{
					font-weight: 700;
					font-size: 14px;
					margin-left: 15px;
				}
			}
			>div:nth-child(2){
				width: 100%;
				height: 725px;
				overflow-y: auto !important;
				box-sizing: border-box;
				padding: 20px;
			}
		}
	}
</style>
