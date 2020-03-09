<template>
    <div>
        <el-form :label-position="'center'" :model="formData" ref='formData'>
			<el-form-item label="标题组名称" prop='groupName'  label-width='90px' :rules="[{required:true,message:'请输入标题组名称',trigger:'blur'}]">
				<el-input @input.native="groupNameMethod" v-model.trim="formData.groupName" placeholder="请输入标题组名称"  clearable></el-input>
			</el-form-item>	
        </el-form>
    </div>
</template>
<script>
export default {
    props:['params'],
    data() {
        return {
            formData:{
                groupName:null,
            },
        };
    },
    methods: {
		groupNameMethod(){
			this.formData.groupName = this.formData.groupName.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g,'')
		},
        _submit(){
            return this.$refs.formData.validate().then(()=>{
				let params = {
					groupName:this.formData.groupName,
					systemCategoryIdArray : [this.params.id]
				}
				return this.$api[`product/PrConfigTitleWordGroupSave`](params).then(data=>{
					this.params.fn()
				}).then(()=>{
					return  Promise.resolve(true);
				})
			})
        },
    },
    created() {
		
    },
};
</script>

