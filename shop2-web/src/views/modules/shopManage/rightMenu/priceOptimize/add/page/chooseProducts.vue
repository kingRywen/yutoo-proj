<template>
	<div style="width: 100%;height: 670px;">
		<tableTasks viewHeight='670px' ref="child" />
	</div>
</template>

<script>
	import tableTasks from 'Views/modules/shopManage/common/dialogs/tableTasks.vue'
	export default{
		methods:{
			validateFn(){
				return this.$refs.child.validateFn()
			}
		},
		components:{
			tableTasks
		},
		
	}
</script>

<style>
</style>
