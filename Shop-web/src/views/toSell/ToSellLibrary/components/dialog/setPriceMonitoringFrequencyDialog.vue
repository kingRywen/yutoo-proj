<template>
<!-- 设置价格库存监控频率 -->
    <div>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules' label-width='90px'>
            <el-form-item label="监控频率" prop='frequency'>
                <el-input v-model.number="formInline.frequency" placeholder="请输入值" size='small' style='width:87%;' clearable></el-input> 小时
            </el-form-item>
         </el-form>

    </div>
</template>

<script>
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入'));
            };
            if(isNaN(Number(value))){
                 return callback(new Error('请输入数字'));
            };
            callback()
        };
        return {
            formInline:{
                frequency:null
            },
            rules:{
                 frequency: [
                    { validator: validatePass, trigger: ['blur' ,'change'] ,  required: true,},
                ],
            }
        };
    },
    methods: {
         _submit(){
            return this.$refs.formInline.validate().then(()=>{
                    return this.$api['imSaleMonitorSave'](this.formInline)
            })
         },
        _initData(){
            this.$api['imSaleMonitorInfo']()
            .then(data => {
                this.formInline.frequency = data.data.frequency;
            })
        },
    },
    created() {

    },
};
</script>

<style scoped lang="less">
.el-form-item{
    margin-bottom: 18px;
}
</style>
