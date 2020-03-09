<template>
	<div style="margin-top: 20px;">
		<priceStrategy viewHeight="660px" ref="child"  />
	</div>
</template>

<script>
	import priceStrategy from 'Views/modules/shopManage/rightMenu/priceOptimize/dialogs/priceStrategy.vue'
	export default {
		components:{
			priceStrategy
		},
		methods:{
			validateFn(){
				return this.$refs.child.validateFn()
			}
		}
	}
</script>