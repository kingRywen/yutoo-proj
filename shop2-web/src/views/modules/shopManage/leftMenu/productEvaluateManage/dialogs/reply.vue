<template>
	<div class="w600">
		<p v-if="params.text" style="font-size: 16px; font-weight: 700;">评价内容</p>
		<p v-if="params.text">{{params.text}}</p>
		<new-form
		  ref="formData"
		  v-model="formData"
		  label-width="80px"
		  :form-schema="dataFormSchema"
		></new-form>
	</div>
</template>

<script>
	export default{
		props:['params'],
		data() {
			return {
				formData:{},
				dataFormSchema:{
					replyContent: {
					  widget: 'textarea',
					  span: 24,
					  rows:4,
					  required:true
					},
				},
			}
		},
		methods:{
			_submit(){
				return this.$refs.formData.validate().then(()=>{
					let params = {
						...this.storeInfo,
						productId:this.params.productId,
						idArray:this.params.idArray,
						replyContent:this.formData.replyContent
					}
					return this.$api['shopManage/productReviewReviewReply'](params)
				})
			}
		}
	}
</script>

<style>
</style>
