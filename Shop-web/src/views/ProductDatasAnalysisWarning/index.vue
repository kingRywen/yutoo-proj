<template>
    <div>
        <div v-if='$route.name!=="ProductDatasAnalysisWarningLog"'>
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label='所有产品预警' name="first" :lazy='true'>
                    <product-warning />
                </el-tab-pane>
                <el-tab-pane label='问题SKU' name="three" :lazy='true'>
                    <problem-sku />
                </el-tab-pane>
                <el-tab-pane label='退货率异常' name="four" :lazy='true'>
                    <abnormal-return-rate />
                </el-tab-pane>
                <el-tab-pane  label='历史数据'  name="second" :lazy='true'>
                        <history-datas />
                </el-tab-pane>
            </el-tabs>
            <div style="position: absolute;right: 20px;top: 20px;">
                <el-tooltip content='文件名需以日期命名。文件名日期是哪一天，导入的就是该天的数据。如 "2019-01-01" 。' placement="top" effect="light">
                    <el-button  type="primary" plain @click="importMethod" size='small'> 
                        导入流量报告
                    </el-button>
                </el-tooltip>
                <el-button  type="primary" plain @click="linkMethod"  size='small'>
                    导入日志
                </el-button>
            </div>
            <yt-dialog :options="uploadOptions" :events="uploadEvents">
                <ImportFile @success="handleSuccess" filename="流量报告模板" :data="downloadData" :downloadApi="downloadApi" :action="action" />
            </yt-dialog>
        </div>
        <router-view v-else></router-view>
    </div>
</template>
<script>
import historyDatas from "./historyDatas"; //历史数据
import productWarning from  "./productWarning";//所有产品预警
import problemSku from  "./problemSku";//问题SKU
import AbnormalReturnRate from './AbnormalReturnRate';

import { CONST_PORT_CONFIG, host } from 'Config'
export default {
    data() {
        return {
            activeName: this.$route.params.name || "first",
            uploadOptions: {
                visible: false,
                width: '500px',
                title: '导入流量报告',
                showFooter: false
            },
            downloadApi:'',
            action: `${host}finance/flowImport`,
            uploadEvents: {
                handleOkClick: () => {
                    this.submitUploadForm()
                }
            },
            
        };
    },
    computed:{
        downloadData(){
            return {
                sellerId : this.sellerId,
                siteId : this.siteId,
            }
        }
    },
    methods: {
        handleSuccess({ res, file, fileList }) {
		  if (res.code !== 0) {
			this.$message.error(res.msg)
		  } else {
			this.$message.success(res.msg)
			this.uploadOptions.visible = false
			this.handleFilter()
		  }
	    },
        linkMethod(){
		  this.$router.push({
                name: "ProductDatasAnalysisWarningLog",
                query:{
                    type: 2
                }
		    });
        },
        importMethod(){
		  this.uploadOptions.visible = true
        },
        submitUploadForm() {
            if (this.fileList.length === 0) {
                this.$message.warning('请选择文件')
                return
            }
            const isLt2M = this.fileList[0].raw.size / 1024 / 1024 < 2
            if (!isLt2M) {
                this.$message.warning('上传文件大小不能超过 2MB!')
                return
            }
            let params = {
                siteId: this.siteId,
                sellerId: this.sellerId,
                file: this.fileList[0]
            }
            this.$api['productProductImport'](params).then(res => {
                let { code } = res
                if (code === 0) {
                this.uploadOptions.visible = false
                this.fileList = []
                this.handleFilter()
                }
            })
        },
    },
    created() {

    },
    components:{
        historyDatas,
        productWarning,
        problemSku,
        AbnormalReturnRate
        
    }
};
</script>

