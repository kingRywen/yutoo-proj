<template>
    <div>
        <ImportFile @success="handleSuccess" filename="关键词竞争分析详情模板" :data="ImportFileData" :downloadApi="downloadApi" :action="action" />
    </div>
</template>

<script>
import { host } from "Config";
export default {
    props:['params'],
    data() {
        return {
            ImportFileData:{
                taskId:this.params.taskId
            },//导入需传的数据+
            downloadApi: 'taskKeywordCompeteExportTemplate',//下载模板地址
            action: `${host}taskKeywordCompete/importData`,//上传的地址
        };
    },
    methods: {
        //导入数据成功
        handleSuccess({ res, file, fileList }) {
        if (res.code !== 0) {
            this.$message.error(res.msg)
        } else {
            this.$message.success(res.msg)
            this.params.success()
        }
        },
    },
    created() {

    },
};
</script>

<style scoped lang="less">

</style>
