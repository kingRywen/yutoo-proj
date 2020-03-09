<template>
	<div>
		<el-form :model="formData" ref="formData">
			<el-form-item prop="imageUrl" :rules="{required: true, message: '请上传产品图片', trigger: 'blur'}">
				<el-upload class="avatar-uploader1" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
				 :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar1">
					<i v-else class="el-icon-plus avatar-uploader-icon1"></i>
				</el-upload>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					imageUrl: ''
				}
			}
		},
		methods: {
			validate(){
				return this.$refs.formData.validate().then(()=>{})
			},
			handleAvatarSuccess(res, file) {
				this.formData.imageUrl = URL.createObjectURL(file.raw);
				console.log(this.formData.imageUrl)
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			}
		}
	}
</script>

<style>
	.avatar-uploader1 .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader1 .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon1 {
		font-size: 14px;
		color: #8c939d;
		width: 89px;
		height: 89px;
		line-height: 89px;
		text-align: center;
	}

	.avatar1 {
		width: 89px;
		height: 89px;
		display: block;
	}
</style>
