<template>
    <div>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules' label-width='90px'>
            <el-form-item label="源库存" prop='sourceQuantity'>
                <el-input  v-model.trim="formInline.sourceQuantity" placeholder="请输入值" size='small' clearable style='width:90%'></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        let validatePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error('输入不能为空'))
                return
            }
            if( isNaN(Number(value))){
                return   callback(new Error('请输入数字'))
            }
            if( !/^[1-9]\d*$/.test(+value)  ){
                return   callback(new Error('请输入正整数'))
            }
            if( String(value).indexOf('+')!==-1){
                return   callback(new Error('请输入数字'))
            }
            callback()
        };
        return {
            formInline:{
                sourceQuantity:null
            },
            rules:{
                sourceQuantity:[
                    { required: true, trigger: 'blur' , validator: validatePass }
                ]
            }
        };
    },
    methods: {   
        _submit(){
            return this.$refs.formInline.validate().then(()=>{
                return this.$api['imSaleProdAbleUpdateSourceQuantity']({
                    siteId : this.params.siteId,
                    sourceQuantity : +this.formInline.sourceQuantity,
                    asins :this.params.asins,
                })
            })
        }
    },
    created() {

    },
};
</script>

<style scoped lang="less">

</style>
