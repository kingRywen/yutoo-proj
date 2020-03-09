<template>
	<div class="content">
		<div class="title">创建广告组</div>
		<div class="mainForm">
			<el-form :model="formData" ref="formData" label-width="100px" label-position="top">
				<el-form-item label="广告组名称" prop="name" :rules="{required:true,message:'请输入广告系列名称'}">
					<el-input v-model.trim="formData.name" size="small" style="width: 500px;"></el-input>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				formData:{
					name:null,
				},
			}
		},
		methods:{
			validateFn(){
				let {formData} = this.$refs
				let forms = [formData]
				return Promise.all(forms.map(e=>e.validate())).then((res)=>{
					let {...obj} = this.formData
					return obj
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	@import '../css/common.less';
</style>
