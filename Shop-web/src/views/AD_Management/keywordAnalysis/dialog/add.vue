<template>
	<div>
		<el-form :label-position="labelPosition" label-width="80px" :model="formData" ref='form' :rules="rules">
			<el-form-item label="关键词" prop='keyword' style="position: relative;">
				<el-input @input="setNameMethod" type="textarea" :rows="3" v-model="formData.keyword" placeholder='请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号' style="width: 90%;" size="small"></el-input>
				<span style='position: absolute;right:0;top:70px;line-height:20px;margin-right: 46px;color:rgb(48, 204, 123)'>{{'已输入'+keywordNum+"个"}}</span>
			</el-form-item>
			<el-form-item label="任务名称" prop='taskName'>
				<el-input v-model="formData.taskName" style="width: 90%;" size="small"></el-input>
			</el-form-item>			
		</el-form>
	</div>
</template>

<script>
export default{
	props:['params'],
	data(){
		var adKeywordsValidate = (rule, value, callback)=>{
		  if (!value) {
			callback(new Error('输入不能为空'))
			return
		  }
		  let val = value
			.split(/[\n|\r\n|\,|\，]/)
			.map(el => el.trim())
			.filter(el => el !== '')
				let reg = /^[ A-Za-z0-9\']*$/		
				if (!val.every(el => reg.test(el))) {
				  callback(new Error('只能输入数字,字母,单引号'))
				} else if (val.length > 500) {
				  callback(new Error('输入数量不能超过500个'))
				} else {
				  callback()
				}			
		}
		let vm = this
		return{
			labelPosition:'right',
			formData:{
				keyword:'',
				taskName:''
			},
			rules:{
				keyword:[
					{validator:adKeywordsValidate,trigger:'blur'},
					{required:true,message:'请输入关键词名称',trigger:'blur'}
				],
				taskName:[
					{required:true,message:'请输入任务名称',trigger:'blur'}
				]
			}
		}
	},
	methods:{
		setNameMethod(){
			if(this.formData.keyword){
				let keywords = this.formData.keyword
				.split(/[\n|\r\n|\,|\，]/)
				.map(el => el.trim())
				.filter(el => el !== '');
				this.formData.taskName = keywords[0] + this.keywordNum
			}else{
				this.formData.taskName = ''
			}
		},
		_submit(){
			return this.$refs.form.validate().then(() => {				  
				  let {platformId,sellerId,siteId} = this.sellerData;
				  let {keyword,taskName} = JSON.parse(JSON.stringify(this.formData))
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
				   }				  
				  return this.$api['adKeywordAnalysisSave'](params).then(()=>{
				      return  Promise.resolve("reset");
				  })
			})			
		},		
	},
	mounted(){
		// let keywords = this.params.data
		// this.formData.keywords = keywords.join('\n')
		// this.formData.taskName = keywords[0] + keywords.length
	},
	computed:{
		keywordNum(){
			return this.formData.keyword.split(/[\n|\r\n|\,|\，]/)
			.map(el => el.trim())
			.filter(el => el !== '').length;
		}
		
	}
}
</script>
