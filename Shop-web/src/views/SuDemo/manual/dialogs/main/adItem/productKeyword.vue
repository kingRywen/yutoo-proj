<template>
	<goods-on ref='child' :GoodsOnHint='GoodsOnHint' goodsWidth = '100%' />
</template>

<script>
	import goodsOn from 'Views/SuDemo/createAd/component/productPut1.vue'
	export default{
		props:['params'],
		data(){
			return{
				GoodsOnHint:false,
			}
		},
		methods:{
			_submit(){
				let GoodsOn = this.$refs.child.saveBtn()
				if ( !GoodsOn) {
				    this.$message.warning('请至少添加一项')
				}else {
				    this.GoodsOnHint = false
				}
				return this.$refs.child.saveBtn().then( res => {
					let adTarget = {
						...res
					}
				    return this.$api['adTargetSave']({...this.storeIds,...this.params,adTarget}).then((e)=>{
						return Promise.resolve(true)
					}) 
				})
				
			}
		},
		components:{
			goodsOn
		}
	}
</script>
