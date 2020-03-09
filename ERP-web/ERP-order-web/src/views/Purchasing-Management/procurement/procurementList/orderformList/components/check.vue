<template lang="html">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="是否通过：">
            <el-radio-group v-model="form.examineResult">
                <el-radio :label="0">通过</el-radio>
                <el-radio :label="1">不通过</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="原因：" prop="remark">
            <el-input type="textarea" v-model.trim="form.remark" class="textarea"/>
        </el-form-item>
    </el-form>
</template>

<script>

export default {
    data() {
        return {
            form:{
                examineResult:1,
                remark:""
            },
            rules:{
                remark:[
                    { required: false, message: '请填写原因', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        submitForm(callback){
            callback && callback(this.form)
            // this.$refs.form.validate((valid) => {
            //     if (valid) {
            //
            //     } else {
            //         return false;
            //     }
            // });
        },
        resetForm() {
            this.$refs.form.resetFields();
            this.form.examineResult = 1
        },
    }
}
</script>

<style lang="scss">
    .textarea{
        textarea{
            height:150px;
            resize: none;
        }
    }
</style>
