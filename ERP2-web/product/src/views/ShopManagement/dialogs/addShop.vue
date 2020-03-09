<template>
    <div>
        <el-form :label-position="'center'" label-width="100px" :model="formData" size="small" :rules='rules' ref='formData'>
            <el-form-item label="店铺名称" prop='storeName'>
                <el-input v-model.trim="formData.storeName"  clearable placeholder="该名称会显示在任何地方,建议隐藏真实店铺名称,用渠道来源类型+编号+国家,如：Amazon-01-US"></el-input>
            </el-form-item>
            <el-form-item label="真实店铺名称" prop='storeRealName'>
                <el-input v-model.trim="formData.storeRealName" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="平台" prop='platId'>
                <el-select v-model.trim="formData.platId" placeholder="请选择" style='width:100%' @change='platIdChange' clearable>
                    <el-option
                    v-for="item in platdOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="站点" prop='platSiteId'>
                <el-select v-model="formData.platSiteId" placeholder="注：Amazon选择区域站，其他平台选择具体的站点" style='width:100%' clearable @change='platSiteIdChange'> 
                    <el-option
                    v-for="item in platSiteIdOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="店铺logo" prop='logoPath' :class='{"logoPath":formData.logoPath ? true : false}'>
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
            <el-form-item label="VAT" prop='VAT'>
                <div class='vat'>
                    <div>国家</div>
                    <div>VAT税号</div>
                    <div>VAT税率（%）</div>
                    <div>销售VAT比例（%）</div>
                </div>
                <div class='vatCont' v-for='(item,index) in formData.vatArray' :key='item.id'>
                    <div style='line-height:60px;'>
                        {{item.countryCnName}}
                    </div>
                    <div>
                        <el-form-item
                            :prop="'vatArray.' + index + '.vatTaxNumber'"
                            :rules='grounpdayFormRules(index)'
                        >
                            <el-input v-model.trim="item.vatTaxNumber" style='width:90%;' clearable></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item
                            :prop="'vatArray.' + index + '.vatTaxRate'"
                            :rules='grounpdayFormRules(index)'
                        >
                            <el-input v-model.trim="item.vatTaxRate" style='width:90%;' clearable></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item
                            :prop="'vatArray.' + index + '.salesVatRatio'"
                            :rules='grounpdayFormRules(index)'
                        >
                            <el-input v-model.trim="item.salesVatRatio" style='width:90%;' clearable></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="是否激活" prop='activateFlag'>
                 <el-checkbox v-model="formData.activateFlag">是</el-checkbox>
            </el-form-item>
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
        return {
            rules:{
                storeName:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                storeRealName:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                platId:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                platSiteId:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                VAT:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                activateFlag:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                logoPath:[
                     { required: true, message: '请上传图片', trigger: ['blur','change'] },
                ]
            },
            formData:{
                storeName:'',
                storeRealName:'',
                platId:'',
                platSiteId:"",
                logoPath:'',
                VAT:"VAT",
                activateFlag:false,
                vatArray:[]
            },
             grounpdayFormRules(index){
                let checkAge = (rule, value, callback) => {
                    // console.log(rule);
                    // console.log(value);
                    // console.log(index);
                    let fild=rule.field.split('.');
                    let name=fild[fild.length-1]; //label名字
                    //console.log(name);
                    if(!value){
                         return callback(new Error('请输入') );
                    };
                    if( isNaN(Number(value))){
                        return callback(new Error('请输入数字') );
                    };
                    callback();
                        
                };
                return  { validator: checkAge, trigger: ['change','blur'] }
            },
            platdOptions:[],
            platSiteIdOptions:[],
            opts:{
                visible :false,
                title:'预览图片'
            },
            dialogImageUrl:'',
            fileList:[
                // {name: 'food.jpg', url: 'http://pic16.nipic.com/20111006/6239936_092702973000_2.jpg'}
            ],

            amazonPlatId:"",//保存amazon平台的id

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
            // console.log(fileList);
            this.fileList = fileList;
            this.formData.logoPath = ''

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
        //平台选择改变
        platIdChange(v){
            this.platSiteIdOptions = []
            this.formData.platSiteId = null
            if( v || v===0 ){
                if(v === this.amazonPlatId){
                    this.getamazonSites()
                }else{
                    this.getSites()
                }
            }
        },
        //平台站点选择改变
        async platSiteIdChange(){
            let rows = await this.getCountryOpts()
            this.formData.vatArray = rows.map(i=>{
                return{
                    platSiteId: i.platSiteId,
                    countryCnName: i.countryCnName,
                    vatTaxNumber:null,
                    vatTaxRate:null,
                    salesVatRatio:null,
                }
            })
        },
        //获取平台
        getPlats(){
            this.$api[`product/SMGlPlatList`]({})
            .then((res) => {
                let {rows} = res
                let  arr = rows.map(i=>{
                    return {label:i.platName,value:i.platId}
                })
                this.platdOptions = arr
                this.platdOptions.forEach(i=>{
                    if(i.label === 'Amazon'){
                        this.amazonPlatId = i.value
                    }
                })
            })
        },
        //获取平台站点
        getSites(){
            this.$api[`product/SMGlPlatSiteList`](
                {
                    platId:this.formData.platId
                }
            )
            .then((res) => {
                let { rows } = res
                //console.log(rows);
                let arr = rows.map(i=>{
                   return {label:i.siteNameCn , value:i.platSiteId }
                })
                this.platSiteIdOptions = arr
            })
        },
        //amazon查区域站
        getamazonSites(){
            this.$api[`product/SMGlPlatSiteContinentList`](
                {
                    platId:this.formData.platId
                }
            )
            .then((res) => {
                let { rows } = res
                //console.log(rows);
                let arr = rows.map(i=>{
                   return {label:i.continentCn , value:i.continentKey }
                })
                this.platSiteIdOptions = arr
            })
        },
        //查国家
       getCountryOpts(){
            return this.$api[`product/SMGlPlatSiteList`](
                {
                    platId:this.formData.platId,
                    continentKey: this.formData.platSiteId
                }
            )
            .then((res) => {
                let { rows } = res
                //console.log(rows);
                return rows
            })
        },
        _submit(){
            return this.$refs.formData.validate().then(res=>{
                return this.submitData()
            })
        },
        submitData(){
            let url = this.storeId ? 'product/GlStoreUpdate' : 'product/GlStoreSave'
            let params = JSON.parse(JSON.stringify(this.formData))
            params.activateFlag  = params.activateFlag ? 1 : 0
            delete params.VAT
            params = this.$.dealObjectValue(params)
            let isAmazon = false 
            this.platdOptions.forEach(i=>{
                if(i.value === this.formData.platId){
                    if( i.label === 'Amazon'){
                        isAmazon = true
                    }
                }
            });
            //如果平台是亚马逊传的字段不一样
            if(isAmazon){
                params.continentShort = this.formData.platSiteId
                delete params.platSiteId
            }else{
                params.platSiteId = this.formData.platSiteId
                delete params.continentShort
            }
            return this.$api[url](params)
        },
        getInfo(){
            if(!this.storeId) return
            this.$api[`product/GlStoreInfo`]({
                id : this.storeId
            })
            .then(async (data) => {
                let {rows} = data
                for(let key in rows){
                    if(rows.hasOwnProperty(key)){
                        //vatArray单独处理
                        if( key!=='vatArray'){
                            this.formData[key] = rows[key]
                        }
                        //亚马逊平台的回显
                        if( key === 'continentShort' && rows['continentShort'] ){
                            this.formData.platSiteId = rows['continentShort']
                            this.getamazonSites(rows.platId)
                            let { vatArray } = rows
                            let datas = await this.getCountryOpts()
                            let CountryOpts = datas.map(i=>{
                                return {
                                    platSiteId: i.platSiteId,
                                    countryCnName : i.countryCnName
                                }
                            })
                            CountryOpts.forEach(i=>{
                                vatArray.forEach(k=>{
                                    if( i.platSiteId === k.platSiteId ){
                                        i.vatTaxNumber = k.vatTaxNumber
                                        i.vatTaxRate = k.vatTaxRate
                                        i.salesVatRatio = k.salesVatRatio
                                        i.platSiteId = k.platSiteId

                                    }
                                })
                            })
                            this.formData.vatArray = CountryOpts

                        }else{
                            
                        }
                    }
                }
    
               
                this. fileList =[
                    {name: 'food.jpg', url: rows.logoPath}
                ],
                this.formData.activateFlag =  this.formData.activateFlag === 1 ? true : false
               
                console.log( this.formData);
            })
        }


    },
    created() {
        this.getPlats()
        this.getInfo()
        
    }
};
</script>

<style scoped lang="scss">
.vat{
    display: flex;
    border-top:1px solid #ccc;
    border-bottom:1px solid #ccc;
    border-left:1px solid #ccc;
    div{
        width:25%;
        text-align: center;
        line-height: 40px;
        background-color: #f9f9f9;
        border-right:1px solid #ccc;
    }
}
.vatCont{
    display: flex;
    border-bottom:1px solid #ccc;
    border-left:1px solid #ccc;
    &>div{
        width:25%;
        border-right:1px solid #ccc;
        text-align: center;
        /deep/{
            .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
                margin-bottom: 16px;
                margin-top: 16px;
            }
            .el-form-item--small .el-form-item__error{
                margin-left:5%;
            }
        }
    }
}
.logoPath{
    /deep/{
        .el-upload--picture-card {
            display: none;
        }
    }
}

</style>
