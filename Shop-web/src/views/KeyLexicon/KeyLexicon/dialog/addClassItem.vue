<template>
    <div>
        <el-form :label-position="'right'" :model="formData" ref='formData'  :rules='rules'>
			<el-form-item label="分类名称" prop='classifyName'  label-width='80px'>
				<el-input  v-model.trim="formData.classifyName" placeholder="请输入分类名称" size="small" ></el-input>
			</el-form-item>	
        </el-form>
    </div>
</template>
<script>
export default {
    props:['params'],
    data() {
        return {
            rules:{
				classifyName:[
					{required:true,message:'请输入分类名称'}
				]
            },
            formData:{
                classifyName:null,
            },
        };
    },
    methods: {
        _submit(){
            return this.$refs.formData.validate().then(()=>{
				let params = {
					...this.params,
					classifyName:this.formData.classifyName
				}
				return this.$api[`keywordClassifySave`](params)
			})
        },
    },
};
</script>

