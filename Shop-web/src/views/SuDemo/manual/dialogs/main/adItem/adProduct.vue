<template>
	<product-view viewHeight='400px' ref="child" />
</template>

<script>
	import productView from 'Views/KeyLexicon/KeyLexicon/components/commodity.vue'
	export default{
		props:['params'],
		methods:{
			_submit(){
				let data = this.$refs.child.oldPushId
				
				if(data && data.length){
					let params = {
						...this.storeIds,
						...this.params,
						productIds:data
					}
					return this.$api[`adProductSave`](params).then(data=>{
						return  Promise.resolve(true);
					}) 
				}else{
					this.$message.warning('请添加要推广的产品')
				}
			}
		},
		components:{
			productView
		}
	}
</script>
