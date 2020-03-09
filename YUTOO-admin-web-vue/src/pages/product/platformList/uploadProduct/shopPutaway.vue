<template lang="html">
    <section class="putaway">
        <!--  -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>产品库</el-breadcrumb-item>
            <el-breadcrumb-item >
                <span class="nav-active" @click="toPlatform">平台产品</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/productInfo'}">刊登上架</el-breadcrumb-item>
            <el-breadcrumb-item>刊登上架信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!--  -->
        <div class="conten">
            <!--  -->
            <hgroup class="putaway-select">
                <!--  -->
                <el-form :inline="true" :model="selectForm" :rules="selectFormRules" class="selectForm" label-position="right" ref="selectForm">
                    <el-form-item label="选择语种：" prop="languageId">
                        <el-select v-model.number="selectForm.languageId" size="medium" @change="changeLanguage">
                            <el-option :label="item.languageName" :value="item.languageId" v-for="item in languageList"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择变体：" prop="variantIds" class="selectForm-item">
                        <el-select v-model="selectForm.variantIds"  size="medium" multiple collapse-tags @change="changeVariant">
                            <el-option :label="item.sku" :value="item.platformVariantId" :disabled="!item.uploadFlag" v-for="item in variantList">
                                <span style="float: left">{{ item.sku }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.errorMsg }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="销售类型：" prop="type">
                        <el-select v-model.number="selectForm.type" size="medium" @change="changeSaleType">
                            <el-option :label="item.label" :value="item.value" v-for="item in saleTypes"/>
                        </el-select>
                        <el-popover placement="top-start"  width="auto" trigger="hover">
                            <p>选择跟卖，为跟卖产品</p>
                            <p>选择自主上架，表示为自己的新产品</p>
                            <p>选择ASIN上架，表示更新店铺已有产品</p>
                            <i slot="reference" class="el-icon-question icon"/>
                        </el-popover>
                    </el-form-item>
                    <el-form-item v-if="selectForm.type && selectForm.languageId">
                        <el-button type="primary" plain size="medium" @click="onSelectStore">选择店铺</el-button>
                    </el-form-item>
                    <!-- 已选择店铺 -->
                    <el-card shadow="hover"  class="user-select-store" v-if="checkedStoreList.length">
                       已选择店铺：
                        <el-tag  class="mr15"  type="success" v-for="item in checkedStoreList">{{item.storeName}}</el-tag>
                    </el-card>
                </el-form>
                <!-- 跟卖 -->
                    <el-collapse-transition>
                        <el-card shadow="hover"  class="user-select-store" v-if="selectForm.type==1 && checkedStoreList.length">
                            <el-form label-position="right" :inline="true" ref="ruleForm">
                                <el-form-item label="跟卖产品ASIN：">
                                    <el-input size="medium"></el-input>
                                </el-form-item>
                                <el-form-item label="选择策略：">
                                    <el-input size="medium">
                                        <el-button slot="append" size="medium">设置单个店铺值</el-button>
                                    </el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" plain size="medium">添加跟卖策略</el-button>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-collapse-transition>
                <!-- 自主上架 -->
                <el-collapse-transition>
                    <el-card shadow="hover"  class="user-select-store" v-if="selectForm.type==2 && checkedStoreList.length">
                        <h5 class="striking">店铺SKU</h5>
                        <el-form v-for="(item,index) in skuList" :model="skuForm[index]" label-position="right" class="store-sku-box flex mb15" >
                            <p style="font-size:14px;">{{item.storeName}}:</p>
                            <!-- {{skuForm}} -->
                            <div class="border-pad store-info">
                                <el-form-item :label="`母体：${item.parentSku}`" class="flex" ref="ruleForm"
                                    :prop="item.parentSku"
                                    :rules="rule">
                                    <el-input size="medium" v-model="skuForm[index][item.parentSku]"></el-input>
                                </el-form-item>

                                <div class="shopSku">
                                    <el-form-item :label="j.skuCus" class="flex" v-for="(j,jindex) in item.variantList"
                                        :prop="'variantList.'+jindex+'.'+ j.skuCus"
                                        :rules="[{ required: true, message: '此项必填', trigger:['blur', 'change'] }]">
                                        <el-input size="medium" :disabled="j.uploadFlag"
                                            v-model="skuForm[index].variantList[jindex][j.skuCus]">
                                            <i slot="suffix" v-if="j.uploadFlag" style="margin-right:10px;">已上架</i>
                                        </el-input>
                                    </el-form-item>
                                </div>
                            </div>
                        </el-form>
                    </el-card>
                </el-collapse-transition>
                <!-- ASIN上架  -->
                <el-collapse-transition>
                    <el-card shadow="hover"  class="user-select-store" v-if="selectForm.type==3 && checkedStoreList.length">
                        <h5 class="striking">渠道SKU:</h5>
                        <!-- {{skuForm}} -->
                        <el-form class="storeAll-box flex" v-for="(item,index) in skuList" ref="ruleForm" :model="skuForm[index]" label-position="right">
                            <div class="store-asin" style="flex:1;flex-wrap: wrap;">
                                <p style="font-size:14px;">{{item.storeName}}</p>
                                <div class="store-asin-list border-pad" style="flex:1;">
                                    <!-- {{skuForm}} -->
                                    <el-form-item :label="j.skuCus" v-for="(j,jindex) in item.variantList" class="flex"
                                        :prop="'variantList.'+jindex+'.'+ j.skuCus"
                                        :rules="rule">
                                        <el-input size="medium" v-model="skuForm[index].variantList[jindex][j.skuCus]"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                        </el-form>
                    </el-card>
                </el-collapse-transition>
                <!--  -->
            </hgroup>
            <!--  站点、店铺差异 -->
            <el-collapse-transition>
                <div class="putaway-difference" v-if="checkedStoreList.length">
                    <!-- 站点差异 -->
                    <section class="putaway-site-list layout-padding" v-if="isAllSiteDiffArr">
                        <p class="striking">站点差异值</p>
                        <!-- {{siteDifferenceList}} -->
                        <el-card shadow="hover">
                            <div class="site-item flex mb15" v-for="(item,index) in siteDifferenceList"  v-if="item.properties.length">
                                <div class="site-logo mr15">
                                    <img :src="item.siteInfo.banner" width="60" height="50" :alt="item.siteNameZh">
                                    <p style="text-align: center;">{{item.siteInfo.siteNameZh}}</p>
                                </div>
                                <el-form :inline="true" :model="item" ref="ruleForm" class="putawayform border-pad" label-position="right">
                                    <el-form-item
                                        v-for="(j,jindex) in item.properties"
                                        :key="jindex"
                                        :label="j.propertyHead"
                                        :prop="'properties.' + jindex + '.propertyValue'"
                                        :rules="differenceRule(j.mustFlag,j.controlType)">
                                        <!-- 输入款 -->
                                        <div class="flex" v-if="j.controlType==1">
                                            <el-input v-model="j.propertyValue"></el-input>
                                            <el-button
                                                v-if="j.type==3 || j.type==5 || j.type==4"
                                                @click="setSingleMsg(j,j.propertyValue,index,jindex,item.siteId)">
                                                    {{j.type | isShow}}
                                            </el-button>
                                        </div>
                                        <!-- 单选款 -->
                                        <div class="flex" v-if="j.controlType==2">
                                            <el-select  v-model="j.propertyValue">
                                                <el-option v-for="k in j.itemProp"  :label="k.itemValue"  :value="k.salePfPropItemId"></el-option>
                                            </el-select>
                                            <el-button v-if="j.type==3 || j.type==5 || j.type==4"
                                                @click="setSingleMsg(j,j.propertyValue,index,jindex,item.siteId)">
                                                    {{j.type | isShow}}
                                            </el-button>
                                        </div>
                                        <!-- 多选框 -->
                                        <div class="flex" v-if="j.controlType==3">
                                            <el-select multiple  collapse-tags v-model="j.propertyValue">
                                                <el-option v-for="k in j.itemProp"  :label="k.itemValue"  :value="k.salePfPropItemId"></el-option>
                                            </el-select>
                                            <el-button v-if="j.type==3 || j.type==5 || j.type==4"
                                                @click="setSingleMsg(j,j.propertyValue,index,jindex,item.siteId)">
                                                    {{j.type | isShow}}
                                            </el-button>
                                        </div>
                                        <!-- 文本域 -->
                                        <div class="flex" v-if="j.controlType==4">
                                            <el-input type="textarea" class="textarea" v-model="j.propertyValue"></el-input>
                                            <el-button v-if="j.type==3 || j.type==5 || j.type==4"
                                                @click="setSingleMsg(j,j.propertyValue,index,jindex,item.siteId)">
                                                    {{j.type | isShow}}
                                            </el-button>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                    </section>
                    <!-- 店铺差异 -->
                    <section class="putaway-store-list layout-padding" v-if="isAllStoreDiffArr">

                        <el-card shadow="hover">
                            <!-- {{storeDifferenceList}} -->
                            <p class="striking">店铺差异值</p>
                            <div class="store-item flex mb15" v-for="(item,index) in storeDifferenceList" :key="index" v-if="item.properties.length">
                                <div class="mr15" style="font-size:14px;">{{item.name}}:</div>
                                <el-form :inline="true" :model="item" class="putawayform border-pad" label-position="right" ref="ruleForm">
                                    <el-form-item :label="j.propertyHead"  v-for="(j,jindex) in item.properties"
                                        :key="jindex"
                                        :prop="'properties.' + jindex + '.propertyValue'"
                                        :rules="differenceRule(j.mustFlag,j.controlType)">
                                        <!-- 输入款 -->
                                        <div class="flex" v-if="j.controlType==1">
                                            <el-input v-model="j.propertyValue"></el-input>
                                            <el-button
                                                v-if="j.type==3 || j.type==5 || j.type==4"
                                                @click="setSingleMsg(j,j.propertyValue,index,jindex,item.storeId)">
                                                    {{j.type | isShow}}
                                            </el-button>
                                        </div>
                                        <!-- 单选款 -->
                                        <div class="flex" v-if="j.controlType==2">
                                            <el-select  v-model="j.propertyValue">
                                                <el-option v-for="k in j.itemProp"  :label="k.itemValue"  :value="k.salePfPropItemId"></el-option>
                                            </el-select>
                                            <el-button v-if="j.type==3 || j.type==5 || j.type==4"
                                                @click="setSingleMsg(j,j.propertyValue,index,jindex,item.storeId)">
                                                    {{j.type | isShow}}
                                            </el-button>
                                        </div>
                                        <!-- 多选框 -->
                                        <div class="flex" v-if="j.controlType==3">
                                            <el-select multiple  collapse-tags v-model="j.propertyValue">
                                                <el-option v-for="k in j.itemProp"  :label="k.itemValue"  :value="k.salePfPropItemId"></el-option>
                                            </el-select>
                                            <el-button v-if="j.type==3 || j.type==5 || j.type==4"
                                                @click="setSingleMsg(j,j.propertyValue,index,jindex,item.storeId)">
                                                    {{j.type | isShow}}
                                            </el-button>
                                        </div>
                                        <!-- 文本域 -->
                                        <div class="flex" v-if="j.controlType==4">
                                            <el-input type="textarea" class="textarea" v-model="j.propertyValue"></el-input>
                                            <el-button v-if="j.type==3 || j.type==5 || j.type==4"
                                                @click="setSingleMsg(j,j.propertyValue,index,jindex,item.storeId)">
                                                    {{j.type | isShow}}
                                            </el-button>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                    </section>
                    <!-- 是否立即上架 -->
                   <section class="layout-padding">
                        <div class="mb15">
                           <p  v-if="selectForm.type!=3" style="font-size:12px;"><span style="margin-right:10px;">是否变体单个上架</span><el-checkbox v-model="isSingle">是</el-checkbox></p>

                           <p style="font-size:12px;margin-top:10px;"><span style="margin-right:10px;">是否审核通过后立即上架</span><el-checkbox v-model="isCheck">否</el-checkbox></p>
                        </div>
                        <el-collapse-transition>
                            <div class="isPromptly flex" v-if="isCheck">
                                <p style="padding-top: 10px;">上架时间：</p>
                                <div class="">
                                    <!-- {{publishDetailForm}} -->
                                    <el-form :inline="true" v-for="(item,index) in checkedStoreList" ref="ruleForm" :model="publishDetailForm[index]">
                                        <el-form-item>
                                            <el-button plain size="medium">{{item.storeName}}</el-button>
                                        </el-form-item>
                                        <el-form-item
                                            prop="autiPublish"
                                            :rules="[{ required: true, message: '请选择上架类型', trigger:['blur', 'change'] }]">
                                            <el-select size="medium" v-model="publishDetailForm[index]['autiPublish']">
                                              <el-option label="审核通过立即上架" value="1"></el-option>
                                              <el-option label="选择其他时间上架" value="0"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item v-if="(publishDetailForm[index]['autiPublish'])==0?true:false"
                                            prop="publishTime"
                                            :rules="[{ required: true, message: '请选择上架时间', trigger:['blur', 'change'] }]">
                                            <el-date-picker
                                                v-model="publishDetailForm[index]['publishTime']"
                                                :picker-options="pickerOptions"
                                                value-format="yyyy-MM-dd HH:mm:ss" type="datetime"  size="medium"></el-date-picker>
                                        </el-form-item>
                                        <!--  -->
                                        <el-form-item v-if="checkedStoreList.length != storeList.length">
                                            <el-button  size="medium"
                                                @click="syncStore(item,index,publishDetailForm[index]['autiPublish'],publishDetailForm[index]['publishTime'])">
                                                同步到店铺
                                            </el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                           </div>
                        </el-collapse-transition>
                   </section>

                   <footer>
                       <el-button type="primary" :loading="loading" @click="submitForm(1,'ruleForm')">保 存</el-button>
                       <el-button type="primary" :loading="loading" @click="submitForm(0,'ruleForm')">确 认 上 传</el-button>
                   </footer>
                </div>
            </el-collapse-transition>
            <!--  -->

        </div>

        <!-- 设置变体值弹框 -->
        <el-dialog :title="singleMsgTitle"  :visible.sync="singleMsgDialog" width="500px" center :modal-append-to-body="false">
            <el-form :model="singleMsgForm" ref="singleMsgForm" class="singform">
                <!-- {{singleMsgForm}} -->
                <el-form-item  v-for="(item,index) in singleMsgForm.list"
                    :key="index"
                    :label="item.id+'：'"
                    :prop="'list.' + index + '.value'"
                    :rules="item.mustFlag?commonRule:[]">
                    <!-- 输入款 -->
                    <el-input v-model="item.value"  v-if="item.type == 1" size="medium"></el-input>
                    <!-- 单选款 -->
                    <el-select v-model="item.value" v-if="item.type == 2" size="medium">
                        <el-option v-for="k in item.itemProp"  :label="k.itemValue"  :value="k.salePfPropItemId"></el-option>
                    </el-select>
                    <!-- 多选框 -->
                    <el-select multiple  collapse-tags v-model="item.value" v-if="item.type == 3" size="medium">
                        <el-option v-for="k in item.itemProp"  :label="k.itemValue"  :value="k.salePfPropItemId"></el-option>
                    </el-select>
                    <!-- 文本域 -->
                    <el-input type="textarea" class="textarea" v-model="item.value" v-if="item.type == 4" size="medium"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="singleMsgDialog = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="submitSingForm('singleMsgForm')" size="medium">确 定</el-button>
            </span>
        </el-dialog>
        <!--  -->
         <!-- 选择店铺弹框 -->
         <store-list
             :dialog="userStoreDialog"
             :changeDialogStatus="changeDialogStatus"
             :data="storeList"
             @onSelectStore="onUserStore"
             @onSeekStore="onSeekStore">
         </store-list>
        <!--  -->
        <!-- 同步店铺弹框 -->
        <store-list
            title="同步到其他店铺"
            :dialog="syncStoreDialog"
            :data="syncStoreList"
            :changeDialogStatus="changeDialogStatusSync"
            @onSelectStore="onSyncStore"
            @onSeekStore="onSyncSeekStore">
        </store-list>


    </section>
</template>

<script>
import {showModal, toUrl, toParamUrl} from "common/common";
import StoreList from './store-list';
import {
    getData
} from "common/http";

function showText(val) {
    if (val == 3 || val == 5) {
        return "设置单个变体值";
    } else if (val == 4) {
        return "设置单个店铺值"
    }
    return ""
}
export default {
    data() {
        return {
            syncStoreDialog:false,
            syncStoreList:[],
            syncIndex:null,
            autiPublish:null,
            publishTime:null,
            //
            loading:false,
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
              }
            },
            singleMsgDialog: false,
            userStoreDialog: false,
            saleTypes: [
                // {
                //     label: "跟卖",
                //     value: 1
                // },
                {
                    label: "自主上架",
                    value: 2
                },
                {
                    label: "ASIN上架",
                    value: 3
                },
            ],
            selectFormRules:{
                languageId: [
                    { required: true, message: '请选择语种', trigger: 'change' }
                ],
                variantIds: [
                    { required: true, message: '请选择变体', trigger: 'change' }
                ],
                type: [
                    { required: true, message: '请选择销售类型', trigger: 'change' }
                ],
            },
            singleMsgTitle: "",
            languageList: [],
            variantList: [],
            storeList: [], //店铺列表
            checkedStoreList: [],

            siteDifferenceList: [],
            storeDifferenceList: [],
            skuList: [],
            singleMsgForm: {
                list:[],
            },
            singleMsgList: [], //单个变体值、店铺渲染的数组

            //
            isAllSiteDiffArr: true,
            isAllStoreDiffArr: true,
            //
            selectForm: {
                languageId: null,
                variantIds: [],
                type: null
            },
            skuForm:[],
            publishDetailForm:[],
            isSingle: false, //是否单个上架
            isCheck: false, //是否审核在上架

            index:null,
            jindex:null,
            startMsg:null,

            commonRule:[
                { required: true, message: '此项为必填', trigger: 'blur' },
                { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
            ]

        };
    },
    watch: {
        skuList:{
            handler(val){
                this.skuForm = val.map(item=>{
                    // console.log(item)
                    //跟卖
                    if(this.selectForm.type==1){

                    }
                    //自主上架
                    if(this.selectForm.type==2){
                        return {
                            storeId:item.storeId,
                            [item.parentSku]:item.parentSkuStore,
                            variantList:item.variantList.map(citem=>{
                                return {
                                    [citem.skuCus]:citem.skuStore,
                                    sole:citem.skuCus
                                }
                            })
                        }
                    }
                    //ASIN上架
                    if(this.selectForm.type==3){
                        return {
                            storeId:item.storeId,
                            variantList:item.variantList.map(citem=>{
                                return {
                                    sole:citem.skuCus
                                }
                            })

                        }
                    }
                })
            },
            deep:true
        },
        //选中的店铺
        checkedStoreList:{
            handler(val){
                if(val.length){
                    this.publishDetailForm = val.map(item=>{
                        return {
                            storeId:item.storeId,
                            publishTime:"",
                            autiPublish:"1",
                        }
                    })
                }
            },
            deep:true
        }
    },
    methods: {
        changeVariant(val){
            if(this.checkedStoreList.length){
                console.log('手动改变',val)
                this.selectForm.variantIds = val
                // console.log("123",this.checkedStoreList)
                this.onUserStore(this.checkedStoreList)
            }
        },
        differenceRule(flag,type){
            if(flag){
                if(type !=4){
                    return this.commonRule
                }
                return [
                    { required: true, message: '此项为必填', trigger: 'blur' },
                    { min: 1, max: 250, message: '长度在 1 到 250 个字符', trigger: 'blur' }
                ]
            }else{
                return []
            }
        },
        toPlatform(){
            toUrl("/product/platformList.html")
        },
        //确认1 、 保存0
        submitForm(saveType, formName) {
            this.$refs.selectForm.validate(valid=>{
                if(valid){
                    if(this.$refs.ruleForm !=undefined && this.$refs.ruleForm.length){
                        let isAllInput = []
                        this.$refs.ruleForm.forEach(item=>{
                            item.validate(valid=>{
                                isAllInput.push(valid)
                            })
                        })
                        if(isAllInput.every(item=>item==true)){
                            console.log("全部通过")
                            let variantInfo = this.skuForm.map(i=>{
                                console.log(i)
                                let obj = {
                                    variantList:[]
                                }
                                this.skuList.forEach(j=>{
                                    if(i.storeId == j.storeId){
                                        //自主上架返回数据
                                        if(this.selectForm.type ==2 ){
                                            obj['storeName'] = j.storeName;
                                            obj['storeId'] = j.storeId;
                                            obj['parentSkuStore'] = j.parentSkuStore;
                                            obj['baseParentProductId'] = j.baseParentProductId;
                                            obj['detailParentProductId'] = j.detailParentProductId;
                                            i.variantList.map(k=>{
                                                // let variantObj = {}
                                                j.variantList.forEach(h=>{
                                                    if(k.sole == h.skuCus && !h.uploadFlag){
                                                        // variantObj['nationNameEn'] = h.nationNameEn;
                                                        // variantObj['skuCus'] = h.skuCus;
                                                        // variantObj['baseVariantId'] = h.baseVariantId;
                                                        // variantObj['size'] = h.size;
                                                        // variantObj['color'] = h.color;
                                                        // variantObj['skuStore'] = k[h.skuCus];
                                                        // variantObj['parentSku'] = h.parentSku;
                                                        // variantObj['skuSys'] = h.skuSys;
                                                        // variantObj['storeName'] = h.storeName;
                                                        // variantObj['platformVariantId'] = h.platformVariantId
                                                        obj.variantList.push({
                                                            nationNameEn:h.nationNameEn,
                                                            skuCus:h.skuCus,
                                                            baseVariantId:h.baseVariantId,
                                                            size: h.size,
                                                            color:h.color,
                                                            skuStore:k[h.skuCus],
                                                            parentSku:h.parentSku,
                                                            skuSys:h.skuSys,
                                                            storeName:h.storeName,
                                                            platformVariantId:h.platformVariantId
                                                        })
                                                    }
                                                })
                                                // return variantObj

                                            })
                                        }
                                        //Asin上架
                                        if(this.selectForm.type == 3 ){
                                            obj['storeId'] = j.storeId;
                                            obj['storeName'] = j.storeName;
                                            obj['baseParentProductId'] = j.baseParentProductId;
                                            obj['detailParentProductId'] = j.detailParentProductId;
                                            obj['variantList'] = i.variantList.map(h=>{
                                                let curobj = {}
                                                j.variantList.forEach(k=>{
                                                    if(h.sole == k.skuCus){
                                                        curobj["skuCus"] =  k.skuCus;
                                                        curobj["baseVariantId"] =  k.baseVariantId;
                                                        curobj["skuStore"] =  h[k.skuCus];
                                                        curobj["platformVariantId"] =  k.platformVariantId;
                                                    }
                                                })
                                                return curobj
                                            })
                                        }
                                        //跟卖
                                        if(this.selectForm.type == 1){

                                        }
                                    }
                                })
                                return obj
                            })
                            let storeInfo = []
                            let obj = {}
                            this.storeDifferenceList.forEach(i=>{
                                storeInfo =  i.properties.map(j=>{
                                    obj['storeId'] = i.storeId
                                    obj['propertyName'] = j.propertyName
                                    obj['propertyValue'] = j.propertyValue
                                    obj['type'] = j.type
                                    obj['mustFlag'] = j.mustFlag

                                    let isDifference = (j.type==3 || j.type==4 || j.type==5)?true:false;

                                    if(j.hasOwnProperty('list')){
                                        obj['list'] = j.list
                                    }else if(!j.hasOwnProperty('list') && isDifference ){
                                        let singArr = this.selectForm.variantIds.map(variantId=>{
                                            let variantInfo = {}
                                            this.variantList.forEach(variantItem=>{
                                                if(variantItem.platformVariantId == variantId){
                                                    variantInfo['id'] = variantItem.baseVariantId
                                                    variantInfo['value'] = j.propertyValue
                                                }
                                            })
                                            return variantInfo
                                        })
                                        obj['list'] = singArr
                                    }
                                    return Object.assign({},obj)
                                })
                            })
                            let params = {
                                variantInfo,
                                diffProperties:[...storeInfo],
                                "detailId":this.$route.query.detailId,
                                "publishDetail": this.publishDetailForm,
                                "saveType": saveType, //保存 和上传
                                "saleType": this.selectForm.type,   //是否isAsin销售类型
                                "isIndependent":this.isSingle?1:0 //是否單個上架
                            }
                            console.log(params)
                            this.loading = true;
                            this.commitAllform(params)
                        };
                    }else{
                        this.$message({
                          message: '请选择店铺',
                          type: 'warning'
                        });
                    }
                }else{
                    return false;
                };
            });
        },
        //提交数据
        commitAllform(params){
            this.getSuccessData("putaway/commit",params,data=>{
                this.$message({
                  showClose: true,
                  message: data,
                  type: 'success'
                });
                this.$router.back(-1)
            })
        },
        //设置单个店铺值确定
        submitSingForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('submit!');
                    //
                    if(this.singleMsgTitle == "设置单个变体值"){
                        console.log(this.singleMsgForm.list)
                        let list = this.singleMsgForm.list.map(item=>{
                            return {
                                id:item.id,
                                value:item.value,
                                active:this.startMsg == item.value?false:true
                            }
                        })
                        let index = this.index;
                        let jindex = this.jindex;
                        this.$set(this.storeDifferenceList[index].properties[jindex],'list',list)
                        this.singleMsgDialog = false;
                    }else if(this.singleMsgTitle == "设置单个店铺值"){
                        console.log(this.singleMsgForm.list)
                        alter("123")
                    }
                } else {
                    return false;
                }
            });
        },
        //设置单个店铺值
        setSingleMsg(inputItem, value,index,jindex,storeId) {
            console.log(inputItem,value,index,jindex)
            this.startMsg = value;
            this.index = index;
            this.jindex = jindex
            this.singleMsgTitle = showText(inputItem.type)
            this.singleMsgDialog = true;
            //单个变体值 =>则弹框内显示选中的变体
            if (this.singleMsgTitle == "设置单个变体值") {
                this.singleMsgForm.list = this.selectForm.variantIds.map((variantId,kindex) => {
                    let [id,newVal,active] = [null,null,false];
                    this.variantList.forEach(item => {
                        if (variantId == item.platformVariantId) id = item.sku;
                    })
                    //判断单个变体值是否设置过,是否和外面一致
                    if(this.storeDifferenceList[index].properties[jindex].hasOwnProperty('list')){
                        newVal = this.storeDifferenceList[index].properties[jindex].list[kindex].value
                        active = this.storeDifferenceList[index].properties[jindex].list[kindex].active
                    }
                    return {
                        id,
                        value:newVal !=null && active==true? newVal:value,
                        type: inputItem.controlType,
                        itemProp: inputItem.itemProp,
                        mustFlag: inputItem.mustFlag,
                    }
                })
            //单个店铺值 => 显示选中的店铺
            } else if (this.singleMsgTitle == "设置单个店铺值") {
               // this.singleMsgForm.list =
                alter("123")
            };
        },
        //销售类型切边时候，替换数据
        changeSaleType(val) {
            if (this.checkedStoreList.length && this.selectForm.languageId) {
                let params = {
                    "storeIds": this.checkedStoreList.map(item => item.storeId),
                    "detailId": this.$route.query.detailId,
                    "variantIds": this.selectForm.variantIds,
                    "saleType": val
                }
                this.getSuccessData("putaway/store/choose", params, data => {
                    this.skuList = data.sku
                })
            }
        },
        //选择确定店铺
        onUserStore(arr) {

            this.checkedStoreList = arr;
            if (arr.length) {
                let params = {
                    "storeIds": arr.map(item => item.storeId),
                    "detailId": this.$route.query.detailId,
                }
                //获取销售类型数据
                this.getSuccessData("putaway/store/choose", { ...params,
                    "variantIds": this.selectForm.variantIds,
                    "saleType": this.selectForm.type
                }, data => {
                    this.skuList = data.sku
                })

                //获取差异属性
                this.getSuccessData("putaway/diff", params, data => {
                    let siteDiffList = data.siteDiffList;
                    let storeDiffList = data.storeDiffList;
                    storeDiffList.forEach(item=>{
                        item.properties.forEach(j=>{
                            j['propertyValue'] = ""
                        })
                    })
                    siteDiffList.forEach(item=>{
                        item.properties.forEach(j=>{
                            j['propertyValue'] = ""
                        })
                    })
                    //判断全都是否有差异控制页面显示
                    this.isAllSiteDiffArr = siteDiffList.every(item => item.properties.length)
                    this.isAllStoreDiffArr = storeDiffList.every(item => item.properties.length)
                    //
                    this.siteDifferenceList = siteDiffList
                    this.storeDifferenceList = storeDiffList

                })
                this.userStoreDialog = false;
            } else {
                this.$message({
                    message: '请选择店铺',
                    type: 'warning'
                });
            }
        },
        //选择店铺搜索
        onSeekStore(storeName) {
            let params = {
                "languageId": this.selectForm.languageId,
                "detailId": this.$route.query.detailId,
                "storeName": storeName
            }
            this.handleStoreList(params)
        },
        //打开选择店铺弹框 ==>获取店铺列表
        onSelectStore() {
            this.userStoreDialog = true;
        },
        changeDialogStatus(val) {
            this.userStoreDialog = val
        },
        changeDialogStatusSync(val){
            this.syncStoreDialog= val
        },
        handleStoreList(params) {
            this.getSuccessData('putaway/store/info', params, data => {
                this.storeList = data;
            })
        },
        //语种切换获取店铺
        changeLanguage(languageId) {
            let params = {
                "languageId": languageId,
                "detailId": this.$route.query.detailId,
            }
            this.handleStoreList(params)
        },
        //获取语种 / 变体
        getLanguage(params) {
            getData("putaway/language/info", params).then(res => {
                if (res.data.code == 0) {
                    this.languageList = res.data.rows.languageInfo;
                    this.variantList = res.data.rows.variantInfo;
                    //变体默认选中
                    this.variantList.forEach(item => {
                        if (item.uploadFlag == true) {
                            this.selectForm.variantIds.push(item.platformVariantId)
                        }
                    })
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        //获取数据
        getSuccessData(url, params, callback) {
            getData(url, params).then(res => {
                this.loading = false
                if (res.data.code == "0") {
                    let data = res.data.hasOwnProperty('rows')?res.data.rows:res.data.msg
                    callback && callback(data)
                } else {
                    let msg = res.data.msg
                    this.$message.error(msg)
                }
            })
        },
        onSyncStore(val){
            val.forEach(item=>{
                if(this.publishDetailForm.find(j=>j.storeId == item.storeId)){
                    let index = this.publishDetailForm.findIndex(k=>k.storeId==item.storeId)
                    this.publishDetailForm[index].autiPublish = this.autiPublish
                    this.publishDetailForm[index].publishTime = this.publishTime
                    this.publishDetailForm[index].storeId = item.storeId
                }else{
                    this.publishDetailForm.push({
                        autiPublish:this.autiPublish,
                        publishTime:this.publishTime,
                        storeId:item.storeId
                    })
                }
            })
            console.log(this.publishDetailForm)
            this.syncStoreDialog = false;
        },
        onSyncSeekStore(val){
            this.syncStoreList.forEach(item=>{
                if(item.storeName.indexOf(val) !=-1){
                    console.log("有")
                }else{
                    console.log("沒有")
                }
            })
        },
        //同步到店铺
        syncStore(item,index,autiPublish,publishTime) {
            this.syncStoreList = this.storeList.filter(el=>el.storeId!=item.storeId)
            this.syncIndex = index;
            this.autiPublish = autiPublish;
            this.publishTime = publishTime;
            this.syncStoreDialog = true;
        },
    },
    components: {
        StoreList,
    },
    filters: {
        isShow(val) {
            return showText(val)
        }
    },
    mounted() {
        this.getLanguage({
            productId: this.$route.query.productId,
            detailId: this.$route.query.detailId,
            platformProductId: this.$route.query.platformProductId
        })
    },
    computed:{
        rule(){
            let isSame
            let befor = null
            //

            var validateAsin = (rule, value, callback) => {
                console.log(value)
                let reg =  /^[A-Z0-9]{10,10}$/;
                if (!value) {
                    callback(new Error('请输入SKU'));
                }else if(!value.length>25){
                    callback(new Error('最多只能输入25个字符'));
                }else{
                     callback();
                }
            };
            var arr =  [{ validator: validateAsin, trigger: 'blur' }]

            let type = this.selectForm.type

            switch(type) {
                case 3:
                    return arr
                case 2:
                    return this.commonRule
                case 1:
                    return []
            }


        }
    }
}
</script>

<style lang="scss">
.nav{
    font-size: 14px;
    padding: 15px 0 15px;
    background: #ececec;
    margin-top: -12px;
}
.nav-active{
    font-weight: 700;
    color: #303133;
    transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:hover{
        cursor: pointer;
        color:#108ee9;
    }
}
.flex {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.striking {
    font-size: 17px;
    color: #108ee9;
}
.border-pad {
    border: 1px dashed #ccc;
    padding: 22px 0 0 10px;
    border-radius: 5px;
}
.layout-padding {
    padding: 20px 30px 5px;
}
.mr15 {
    margin-right: 15px;
}
.mb15 {
    margin-bottom: 15px;
}
//
//
.putaway {
    .conten{
        position: fixed;
        left: 0;
        bottom: 0;
        top: 32px;
        right: 0;
        overflow-y: auto;
    }
    .putaway-select {
        padding: 20px 30px 0;
        .selectForm {
            .icon {
                color: #00bd5d;
                font-size: 24px;
            }
            .selectForm-item{
                .el-select{
                    width: 290px;
                    overflow: auto;

                }
            }
        }
        .user-select-store {
            margin-bottom: 10px;
            .store-sku-box {
                p {
                    padding-top: 10px;
                    margin-right: 10px;
                }
                .store-info {
                    flex: 1;
                }
            }
            .el-card__body {
                padding: 10px 15px!important !important;
            }
            .storeAll-box {
                margin-right: 10px;
                .store-asin {
                    display: flex;
                    flex-direction: row;
                    margin-bottom: 10px;
                    p {
                        padding-top: 10px;
                        margin-right: 10px;
                    }
                    .store-asin-list {
                        // border: 1px solid #ccc;
                        // padding: 22px 0 0 10px;
                        // border-radius: 5px;
                         display: flex;
                         flex-direction: row;
                         flex-wrap: wrap;
                        .el-form-item{
                            margin-left: 20px;
                        }
                    }
                }
            }
        }
    }
}
//
.el-popover {
    text-align: center;
}
//
.putawayform {
    flex: 1;
    .el-input {
        flex: 1;
    }
    .el-input__inner {
        width: 217px;
    }
    .textarea {
        width: 217px;
        .el-textarea__inner {
            height: 40px;
        }
    }
}
.shopSku{
    margin-left:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .el-form-item{
        margin-left: 25px;
    }
}
.singform{
    max-height: 400px;
    overflow-y: auto;
    padding-right: 10px;
    .el-form-item{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .el-form-item__content{
            flex:1;
        }
    }
}
.putaway-difference{
    .el-form-item__label{
        min-width: 120px;
        text-align: center;
    }
}
footer {
    text-align: center;
    padding: 20px 0 50px;
}
</style>
