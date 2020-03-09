<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px"  size='small'>
            <el-form-item label="名称" prop="name" >
                <el-input v-model="ruleForm.name"  type="textarea" placeholder="多个换行输入，一次限500个" rows='24'></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props:['titleWordGroupId','systemCategoryId','languageId','type','titleWordId'],
    data() {
        return {
            ruleForm:{
                name:''
            },
            rules:{
                name:[
                    { required: true, message: '请输入', trigger: ['change','blur'] }
                ]
            }

        };
    },
    methods: {
        _submit(){
            return this.$refs.ruleForm.validate().then(()=>{
                let ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
                let params = {};
                let url
                 let name =  ruleForm.name 
                if(this.type === 'add'){ //新增
                    url = `product/PrConfigTitleWordSave`
                    params.titleWordGroupId = this.titleWordGroupId
                    params.languageId = this.languageId
                    params.systemCategoryId = this.systemCategoryId
                    name = name ? name.split('\n')
                                        .map(el => el.trim())
                                        .filter(el => el !== ''): []
                    if(name.length>500){
                        this.$message.warning('限500个')
                        return
                    }
                    params.wordArray = name
                }else{
                    params.titleWordId = this.titleWordId
                    url = 'product/PrConfigTitleWordUpdate'
                    params.word = name
                }
                return this.$api[url](
                  params
                )
            })
        },
        getInfo(){
            this.$api[`product/PrConfigTitleWordInfo`]({
                id : this.titleWordId
            })
            .then((data) => {
                let {rows} = data 
                this.ruleForm.name = rows.word
            })
        }
    },
    created() {
        //console.log(this.currentTreeId);
        if(this.type === 'edit'){
            this.getInfo()
        }
    },
};
</script>

<style scoped lang="scss">

</style>
