<template>
    <div>
        <ImportFile :downloadParams = 'downloadParams' @success="handleSuccess" filename="广告系列模板" :data="downloadParams" :downloadApi="downloadApi" :action="action" />
    </div>
</template>

<script>
import { host } from "Config";
export default {
    props:['params'],
    data() {
		let vm = this
        return {
            ImportFileData:{
                
            },
            downloadApi: 'adCampaignTemplate',
            action: `${host}adCampaign/batchSaveImport`,
        };
    },
    methods: {
        //导入数据成功
        handleSuccess({ res, file, fileList }) {
			if (res.code === 0) {
				this.$message.success('操作成功')
				this.params.fn()
				this.params.success()						
			}else{
				this.$message.error(res.msg)
			}
        },
    },
	computed:{
		downloadParams(){
			return {
				...this.storeIds
			}			
		},
	}
};
</script>
