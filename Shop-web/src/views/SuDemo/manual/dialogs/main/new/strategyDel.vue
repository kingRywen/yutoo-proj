<template>
	<div>
		<div>删除策略是否需要继续执行上级策略，不需要请勾选忽略，注：勾选忽略其他策略也将不进行</div>
		<div style="margin-top: 15px;">
			<el-checkbox  v-model="ignoreFlag" :true-label='1' :false-label='0'>忽略</el-checkbox>
		</div>
	</div>
</template>

<script>
	export default{
		props:['params'],
		data(){
			return {
				ignoreFlag:0
			}
		},
		methods:{
			_submit(){
				let { ...data } = this.params
				delete data.url
				return this.$api[`${this.params.url}`]({...data,ignoreFlag:this.ignoreFlag})
			}
		}
	}
</script>

