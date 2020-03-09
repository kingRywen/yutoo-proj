<template>
	<div class="content">
		<div class="title">广告活动竞争策略</div>
		<div class="mainForm">
			<el-form :model="formData" ref="formData" label-width="100px" label-position="top">
				<el-form-item label="是否开启竞价" prop="premiumBidAdjustment" :rules="{required:true,message:'请选择是否开启竞价'}">
					<el-radio-group v-model="formData.premiumBidAdjustment">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
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
					premiumBidAdjustment:false,
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
