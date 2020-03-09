<template>
    <div>
        <el-form :label-position="'center'" label-width="100px" :model="formData" size="small" :rules='rules' ref='formData'>
            <div class='flex'>
                <div class='two'>
                    <el-form-item label="名称" prop='name'>
                        <el-input v-model.trim="formData.name"  clearable placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class='two' style='display:flex;justify-content: space-between;'>
                    <div style='width:91%'>
                        <el-form-item label="域名" prop='domain'>
                            <el-input v-model.trim="formData.domain"  clearable placeholder=""></el-input>
                        </el-form-item>
                    </div>
                    <div class='damin-hint'>
                        针对B2C网站
                    </div>
                </div>
            </div>
            <div class='flex'>
                <div class='three'>
                    <el-form-item label="国家" prop='country'>
                        <el-input v-model.trim="formData.country"  clearable placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class='three'>
                    <el-form-item label="省份" prop='province'>
                        <el-input v-model.trim="formData.province"  clearable placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class='three'>
                    <el-form-item label="城市" prop='city'>
                        <el-input v-model.trim="formData.city"  clearable placeholder=""></el-input>
                    </el-form-item>
                </div>
            </div>
            <div class="flex">
                <div class='one'>
                    <el-form-item label="地址" prop='address'>
                        <el-input v-model.trim="formData.address"  clearable placeholder=""></el-input>
                    </el-form-item>
                </div>
            </div>
            <div class='flex'>
                <div class='three'>
                    <el-form-item label="邮编" prop='postcode'>
                        <el-input v-model.trim="formData.postcode"  clearable placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class='three'>
                    <el-form-item label="电话" prop='phone'>
                        <el-input v-model.trim="formData.phone"  clearable placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class='three'>
                    <el-form-item label="邮箱" prop='email'>
                        <el-input v-model.trim="formData.email"  clearable placeholder=""></el-input>
                    </el-form-item>
                </div>
            </div>
            <div>
                <el-form-item label="logo" prop='imgLogo' :class='{"logoPath":formData.imgLogo ? true : false}'>
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
            </div>
            <div class="flex">
                <div class='one'>
                    <el-form-item label="包裹感谢信" prop='thanksLetter'>
                        <el-input v-model="formData.thanksLetter"  clearable placeholder="" type="textarea" rows='6'></el-input>
                    </el-form-item>
                </div>
            </div>
            <div>
                <el-form-item label="是否激活" prop='activateFlag'>
                    <el-checkbox v-model="formData.activateFlag">是</el-checkbox>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
import erpDialog from '../../../components/MainLayout/src/dialog'
import { oss } from "@yutoo/yutoo/utils/utils.umd.min";
import { OSS_CONFIG } from "Config";
import storage from "Utils/saver";
export default {
    components:{
        erpDialog
    },
    props:['storeId'],
    data() {
        let phoneValidatePass = (rule, value, callback) => {
            let name = rule.field
            // console.log(name);
            // console.log(value);
            if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))){
                return  callback(new Error('请正确输入号码'));
            }   
            callback();
        }
        let mailValidatePass = (rule, value, callback) => {
            let name = rule.field
            // console.log(name);
            // console.log(value);
            if(!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))){
                return  callback(new Error('请正确输入邮箱'));
            }   
            callback();
        }
        return {
            formData:{
                activateFlag :false,
                name:'',
                domain:'',
                country:'',
                province:'',
                city:'',
                address:'',
                postcode:'',
                phone:'',
                email:'',
                imgLogo:'',
                thanksLetter:"",
            },
            rules:{
                name:[
                    { required: true, message: '请输入', trigger: ['blur'] },
                ],
                domain:[
                    { required: true, message: '请输入', trigger: ['blur'] },
                ],
                country:[
                    { required: true, message: '请输入', trigger: ['blur'] },
                ],
                province:[
                    { required: true, message: '请输入', trigger: ['blur'] },
                ],
                city:[
                    { required: true, message: '请输入', trigger: ['blur'] },
                ],
                address:[
                    { required: true, message: '请输入', trigger: ['blur'] },
                ],
                postcode:[
                    { required: true, message: '请输入', trigger: ['blur'] },
                ],
                phone:[
                    { required: true, trigger: ['blur'] , validator: phoneValidatePass },
                ],
                email:[
                    { required: true,trigger: ['blur'] , validator: mailValidatePass },
                ],
                imgLogo:[
                    { required: true, message: '请上传图片', trigger: ['blur','change'] },
                ],

            },
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
            this.formData.imgLogo = ''
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
                vm.formData.imgLogo = res[0]
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
             return this.$refs.formData.validate().then(res=>{
                return this.submitData()
            })
        },
        submitData(){
            let params = JSON.parse(JSON.stringify(this.formData))
            params.activateFlag  = params.activateFlag ? 1 : 0
            params = this.$.dealObjectValue(params)
            params.storeIdArray = Array.isArray(this.storeId) ? this.storeId : [this.storeId]
            return this.$api[`product/GlStoreInvoiceSet`](params)
        },
        getInfo(v){
            this.$api[`product/GlStoreInvoiceInfo`]({
                idArray : [v]
            })
            .then((data) => {
                let {rows} = data
                for(let key in rows){
                    if(rows.hasOwnProperty(key)){
                        this.formData[key] = rows[key]
                    }
                }
                if( rows.imgLogo ){
                    this. fileList =[
                        {name: 'food.jpg', url: rows.imgLogo}
                    ]
                }
                this.formData.activateFlag =  this.formData.activateFlag === 1 ? true : false
                console.log(rows);
            })
        }
    },
    created() {
        console.log(this.storeId);
        if(Array.isArray(this.storeId)){
            this.getInfo(this.storeId[0])
        }else{
            this.getInfo(this.storeId)
        }
        
    },
};
</script>

<style scoped lang="scss">
.flex{
    display: flex;
    .two{
        &:first-child{
            width:33.33%
        }
        &:last-child{
            width:66.67%
        }
    }
    .three{
        width:33.33%
    }
    .one{
        width: 100%;
    }
}
.damin-hint{
    font-size: 14px;
    color: red;
    line-height: 32px;
}
.logoPath{
    /deep/{
        .el-upload--picture-card {
            display: none;
        }
    }
}
</style>
