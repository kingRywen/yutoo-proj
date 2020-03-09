<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"  size='small'>
            <el-form-item label="自定义账户名" prop="accountName">
                <el-input v-model.trim="ruleForm.accountName" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="apiUserName">
                <el-input v-model.trim="ruleForm.apiUserName" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="apiPassword">
                <el-input v-model.trim="ruleForm.apiPassword" clearable></el-input>
            </el-form-item>
            <el-form-item label="签名" prop="apiSignature">
                <el-input v-model.trim="ruleForm.apiSignature" clearable></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props:['type','paypalAccountId'],
    data() {
        return {
            ruleForm:{
                accountName:'',
                apiUserName:"",
                apiPassword:'',
                apiSignature:"",
            },
            rules:{
                accountName:[
                    { required: true, message: '请输入', trigger: ['blur','change'] }
                ],
                apiUserName:[
                    { required: true, message: '请输入', trigger: ['blur','change'] }
                ],
                apiPassword:[
                    { required: true, message: '请输入', trigger: ['blur','change'] }
                ],
                apiSignature:[
                    { required: true, message: '请输入', trigger: ['blur','change'] }
                ],
            },
        };
    },
    methods: {
        _submit(){
            return this.$refs.ruleForm.validate().then(()=>{
                let url = this.type === 'edit' ? 'product/PrConfigPaypalAccountEbayUpdate' : 'product/PrConfigPaypalAccountEbaySave'
                return this.$api[url]({
                    ...this.ruleForm
                })
            })
        },
        getInfo(){
            this.$api[`product/PrConfigPaypalAccountEbayInfo`]({
                id : this.paypalAccountId
            })
            .then((data) => {
                let { rows } = data
                this.ruleForm = rows
            })
        }
    },
    created() {
        if(this.type === 'edit'){
            this.getInfo()
        }
    },
};
</script>

<style scoped lang="scss">

</style>
