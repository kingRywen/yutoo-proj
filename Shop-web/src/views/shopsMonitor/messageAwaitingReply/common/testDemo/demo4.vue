<template>
	<div>
		<el-form ref="formData" :model="formData" label-width="100px">
			<el-form-item label='出价方式计算' >
				<el-radio-group v-model="formData.radio2">
					<div>
						<el-radio :label="3">备选项</el-radio>
					</div>
					<div>
						<el-radio :label="6">备选项</el-radio>
					</div>
					<div>
						<el-radio :label="9">备选项</el-radio>
					</div>				
				</el-radio-group>
			</el-form-item>
			
		</el-form>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				formData:{
					radio2:3
				}			
			}
		}
	}
</script>


