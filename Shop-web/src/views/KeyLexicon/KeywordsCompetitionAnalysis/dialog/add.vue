<template>
	<div>
		<el-form :label-position="labelPosition" label-width="100px" :model="formData" ref='form' :rules="rules">
			<el-form-item label="选择来源" prop='searchSites'>
				<el-checkbox-group v-model="formData.searchSites">
					<el-checkbox label="0">Google</el-checkbox>
					<!-- <el-checkbox label="1">速卖通</el-checkbox>
					<el-checkbox label="2">merchantword</el-checkbox> -->
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="关键词" prop='keyword' style='position:relative;'>
				<el-input type="textarea" :rows="5" v-model.trim="formData.keyword" placeholder="请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号" style="width: 90%;" size="small" @input='inpChange'></el-input>
				<span style='position: absolute;right:0;top:104px;line-height:20px;margin-right: 46px;color:rgb(48, 204, 123)'>{{'已输入'+keywordNum+"个"}}</span>
			</el-form-item>
			<el-form-item label="任务名称" prop='taskName'>
				<el-input v-model.trim="formData.taskName" style="width: 90%;" size="small"></el-input>
			</el-form-item>			
		</el-form>
	</div>
</template>

<script>
export default{
	props:['params'],
	data(){		
		return{
			labelPosition:'right',
			formData:{
				searchSites:['0'],
				keyword:'',
				taskName:''
			},
			keywordNum:0,//关键词数量
			rules:{
				searchSites:[
					{ required: true, message: '请选择来源', trigger: ['blur','change' ]},
				],
				keyword: [
					{ required: true, message: '请输入关键词', trigger: ['blur'] }
				],
				taskName: [
					{ required: true, message: '请输入任务名称', trigger: ['blur'] }
				],
			}
		}
	},
	methods:{
		inpChange(){
			if( !this.formData.keyword){
				this.keywordNum = 0 ;
				this.formData.taskName = ''
			}else{
				this.keywordNum 
				let arr = this.formData.keyword.split(/[\n|\r\n|\,|\，]/)
						.map(el => el.trim())
						.filter(el => el !== '');
				this.keywordNum = arr.length
				this.formData.taskName = arr[0] + ' '+this.keywordNum 
			}
		},
		_submit(){
			return this.$refs.form.validate().then(() => {
				let {platformId,sellerId,siteId} = this.sellerData;
				let { searchSites,keyword,taskName} = JSON.parse(JSON.stringify(this.formData))
				let keywords = keyword
						.split(/[\n|\r\n|\,|\，]/)
						.map(el => el.trim())
						.filter(el => el !== '');
				let params = {
					platformId,
					sellerId,
					siteId,
					keywords,
					taskName,
					searchSites
				  }
				  return this.$api['taskKeywordCompeteSave'](params).then(()=>{
				      return  Promise.resolve("reset");
				  })
			})			
		},		
	},
}
</script>
