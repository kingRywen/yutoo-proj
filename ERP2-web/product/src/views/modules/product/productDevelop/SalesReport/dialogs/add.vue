<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px"  size='small'>
            <el-form-item label='产品名称' prop="strategyName">
                <el-input v-model.trim="ruleForm.strategyName" clearable placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label="产品图片" prop='logoPath' :class='{"logoPath":ruleForm.logoPath ? true : false}'>
                <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-remove="handleRemove"
                    :on-change="handleChange"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :limit='1'
                    :file-list='fileList'
                    :http-request="handleHttpRequests"
                    :on-preview="handlePictureCardPreview"
                    >
                    <i class="el-icon-plus"></i>
                 </el-upload>
                <erpDialog  :append-to-body='true' :opts='opts'>
                    <img width="100%" :src="dialogImageUrl" alt="">
                </erpDialog>
            </el-form-item>
            <div style='display:flex;'>
                <div style='width:33.33%'>
                    <el-form-item label="产品类目" prop='platId'>
                        <el-select v-model="ruleForm.platId" placeholder="请选择" style='width:100%' @change='platIdChange' clearable>
                            <el-option
                            v-for="item in platdOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div style='width:33.33%'>
                    <el-form-item label="" prop='platId'>
                        <el-select v-model="ruleForm.platId" placeholder="请选择" style='width:100%' @change='platIdChange' clearable>
                            <el-option
                            v-for="item in platdOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div style='width:33.33%'>
                    <el-form-item label="" prop='platId'>
                        <el-select v-model="ruleForm.platId" placeholder="请选择" style='width:100%' @change='platIdChange' clearable>
                            <el-option
                            v-for="item in platdOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div style='display:flex;'>
                <div style='width:50%'>
                    <el-form-item label="销售平台" prop='platId'>
                        <el-select v-model="ruleForm.platId" placeholder="请选择" style='width:100%' @change='platIdChange' clearable>
                            <el-option
                            v-for="item in platdOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div style='width:50%'>
                    <el-form-item label="销售站点" prop='platId'>
                        <el-select v-model="ruleForm.platId" placeholder="请选择" style='width:100%' @change='platIdChange' clearable>
                            <el-option
                            v-for="item in platdOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <el-form-item label='销售价USD' prop="strategyName">
                <el-input v-model.trim="ruleForm.strategyName" clearable placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label='销售价RMB' prop="strategyName">
                <el-input v-model.trim="ruleForm.strategyName" clearable placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label='目标采购价' prop="strategyName">
                <el-input v-model.trim="ruleForm.strategyName" clearable placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label='成本采购价' prop="strategyName">
                <el-input v-model.trim="ruleForm.strategyName" clearable placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label='日销量估算' prop="strategyName">
                <el-input v-model.trim="ruleForm.strategyName" clearable placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label='参考链接' prop="strategyName">
                <el-input placeholder="" v-model="input2">
                    <template slot="append">
                        <a href="" target='_blink'>打开链接</a>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label='备注' prop="strategyName">
                <el-input v-model="ruleForm.strategyName" clearable placeholder="" type='textarea' :rows='5'></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import erpDialog from 'Components/MainLayout/src/dialog'
import { oss } from "@yutoo/yutoo/utils/utils.umd.min";
import { OSS_CONFIG } from "Config";
import storage from "Utils/saver";
export default {
    components:{
        erpDialog
    },
    data() {
        return {
            ruleForm:{

            },
            rules:{

            },
            platdOptions:[],

            opts:{
                visible :false,
                title:'预览图片'
            },
            dialogImageUrl:'',
            fileList:[
                // {name: 'food.jpg', url: 'http://pic16.nipic.com/20111006/6239936_092702973000_2.jpg'}
            ],
        };
    },
    methods: {
        handlePictureCardPreview(file){
            this.dialogImageUrl = file.url;
            this.opts.visible = true;
        },
        handleChange(file, fileList) {
            this.fileList = fileList;
        },
        handleRemove(file, fileList) {
            this.fileList = fileList;
        },
        onSuccess(res) {
            console.log(res);
        },
        onError(err) {
            console.log(err);
        },
        handleHttpRequests() {
            let vm = this;
            const token = storage.get("local", "token");
            vm.$api[`product/constantRealPathGet`](
                {"uploadType":'store-logo'}
            )
            .then(async data => {
                let { filePath:path } = data;
                let res = await oss.batchUpload(
                    vm.fileList.filter(el => el.ossUrl == null).map(el => el.raw),
                    path,
                    OSS_CONFIG.signUrl,
                    null,
                    token
                );
                //console.log(res.join());
                this.formData.logoPath = res[0]
                // eslint-disable-next-line
                    vm.fileList.forEach(async (element, index) => {
                        if (!element.ossUrl) {
                        element.ossUrl = res.shift();
                        }
                        element.url = element.ossUrl;
                    });
            })
            .catch(() => {});
        },
         _submit(){
              return this.$refs.ruleForm.validate().then(()=>{
                  return this.$api[`product/url`](params)
              })
        },
    },
    created() {

    },
};
</script>

<style scoped lang="scss">
.logoPath{
    /deep/{
        .el-upload--picture-card {
            display: none;
        }
    }
}
</style>
