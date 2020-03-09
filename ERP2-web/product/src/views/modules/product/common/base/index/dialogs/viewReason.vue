<template>
	<div>{{msg}}</div>
</template>

<script>
	export default{
		props:['params'],
		data(){
			return{
				msg:''
			}
		},
		mounted(){
			this.$api['product/prProductRepoReason'](this.params).then((res)=>{
				this.msg = res.reason
			})
		}
	}
</script>

<style>
</style>
