<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="上传凭证：" prop="name">
            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange" :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="备注：" prop="name">
            <el-input type="textarea" v-model="ruleForm.reason" :rows="6"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    data() {
        return {
            ruleForm: {},
            rules: {},
            fileList: [
                {
                    name: 'food.jpeg',
                    url:
                        'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }
            ]
        };
    },
    methods: {
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-3);
        },
        submitForm(cb) {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    cb && cb(this.ruleForm);
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.ruleForm.resetFields();
        }
    }
};
</script>
