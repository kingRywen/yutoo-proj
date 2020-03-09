<template>
	<div>
		<el-form :model="formData" ref="formData" label-width="110px">
			<el-form-item prop="enterWeb" label="输入网站" :rules="[{ required: true, message: '请输入网站', trigger: 'blur' }]" >
				<el-input  style="width: 90%;" v-model.trim="formData.enterWeb" size="small" type="textarea" rows="4" :autosize="{ minRows: 4, maxRows: 99}" ></el-input>
			</el-form-item>	
			<div class="textClass" >
				<div>系统支持采集以下网址：</div>
				<div>速卖通(www.aliexpress.com) , Ebay国际(www.ebay.com) , 亚马逊所有站 , Wish(www.wish.com) , Lazada(www.lazada.com.my)</div>
			</div>
			<el-form-item prop="claimantsName" label="指定认领人" :rules="[{ required: true, message: '请输入指定认领人', trigger: 'blur' }]" >
				<el-input  style="width: 90%;" v-model.trim="formData.claimantsName" size="small" ></el-input>
			</el-form-item>					
			<el-form-item prop="remark" label="备注" >
				<el-input  style="width: 90%;" v-model.trim="formData.remark" size="small" type="textarea" rows="3" :autosize="{ minRows: 3, maxRows: 99}" ></el-input>
			</el-form-item>	
			
		</el-form>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				formData: {
				    enterWeb:null,
					claimantsName:null,
					remark:null
				}
			}
		},
		methods:{
			_submit(){
				return this.$refs.formData.validate().then(()=>{
					console.log(this.formData)
				})
			}
		},
	}
</script>
<style scoped>
	.textClass{
		margin-bottom: 15px;
		margin-left: 110px;
	}
	.textClass div{
		font-family: '微软雅黑';
		font-weight: 400;
		font-style: normal;
		color: #999999;
		font-size: 14px;
	}
</style>