<template>
	<div class="w30p">
		<el-form :model="formData" ref='formData'>
			<el-form-item prop="keyword" :rules="keywordRule">
				<el-input v-model="formData.keyword"   :placeholder="`请输入关键词`" size="small"></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default{
		data(){
			let validateKeyword = (rule , value , cb) => {
				if(!value) return cb(new Error('请输入关键词'))
				if(!this.$const['OTHER/keywordExp'].test(value)) return cb(new Error('请输入正确的关键词'))
				cb()
			}
			return {
				formData:{
					keyword:null
				},
				keywordRule:[
					{required:true,message:'请输入关键词'},
					{ validator: validateKeyword, trigger: 'blur' }
				]
			}		
		},
		methods:{
			_submit(){
				return this.$refs.formData.validate().then(()=>{
					let params = {
						...this.storeInfo,
						keyword:this.formData.keyword
					}
					return this.$api['keyword/taskKeywordInteDigSave'](params)
				})
				
			}
		},
	}
</script>