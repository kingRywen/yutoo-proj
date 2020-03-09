<template>
  <el-upload class="uploadnum" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :on-change="filechange">
    <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="download">下载模板</el-button>
  </el-upload>
</template>
<script>
export default {
    data() {
        return {
            fileList: []
        }
    },
    methods: {
        download() {
            this.$api['warehouse/downloadTrackingNumber']({}).then(res => {
                window.location.href = res.path
            })
        },
        handleRemove(file, fileList) {
            this.fileList = fileList
        },
        filechange(file, fileList) {
            this.fileList = fileList
        },
        submitForm(cb) {
            if (!this.fileList.length) {
                return this.$message.warning('请上传模板在导入')
            }
            cb && cb(this.fileList)
        },
        resetForm() {
            //
        }
    }
}
</script>
<style lang="scss">
.uploadnum {
    max-height: 480px;
    overflow-y: auto;
    min-height: 300px;
}
</style>
