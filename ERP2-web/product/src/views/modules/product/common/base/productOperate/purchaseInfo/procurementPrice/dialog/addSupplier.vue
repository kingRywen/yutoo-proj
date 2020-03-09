<template>
    <div>   
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size='small'>
            <el-form-item label="采购类型" prop="purchaseType">
                <el-select v-model="ruleForm.purchaseType" placeholder="请选择"  clearable  style='width:100%;'>
                    <el-option
                    v-for="item in supplierTypeOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="供应商名称" prop="supplierName">
                 <el-input placeholder="请输入" v-model.trim="ruleForm.supplierName"></el-input>
            </el-form-item>
            <el-form-item label="" >
                    <span slot='label'> 
                        <span class='red'>*</span>
                        <span>供应商发货地</span> 
                    </span>
                    <div class='loc'>
                        <div>
                            <el-form-item label="" prop="deliveryProvince">
                                <el-select v-model="ruleForm.deliveryProvince" placeholder="请选择省"  style='width:100%;' 
                                    @change='ruleForm.deliveryCity = null; cityOpts=[];ruleForm.deliveryArea = null ; areaOpts = [] ; getArea(ruleForm.deliveryProvince,"cityOpts")'>
                                    <el-option
                                    v-for="item in provinceOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item label="" prop="deliveryCity">
                                <el-select v-model="ruleForm.deliveryCity" placeholder="请选择市"  style='width:100%;' @change='ruleForm.deliveryArea = null ; areaOpts = [] ;getArea(ruleForm.deliveryCity,"areaOpts")'>
                                    <el-option
                                    v-for="item in cityOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item label="" prop="deliveryArea">
                                <el-select v-model="ruleForm.deliveryArea" placeholder="请选择区"  style='width:100%;'>
                                    <el-option
                                    v-for="item in areaOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
            </el-form-item>
            <el-form-item label="是否开具发票" prop="invoiceFlag">
                 <el-checkbox v-model="ruleForm.invoiceFlag">是 ( 一般纳税人税票 ) </el-checkbox>
                 <el-form-item label="开票人税点" prop="tax" style='display:inline-block;' v-if='ruleForm.invoiceFlag'>
                    <el-input placeholder="请输入" v-model.trim="ruleForm.tax"></el-input>
                </el-form-item>
            </el-form-item>
            <el-form-item label="开票人资质" prop="drawerAptitude">
                <el-select v-model="ruleForm.drawerAptitude" placeholder="请选择"  style='width:100%;'>
                    <el-option
                    v-for="item in drawerAptitudeOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开票人类型" prop="drawerType">
                <el-select v-model="ruleForm.drawerType" placeholder="请选择"  style='width:100%;'>
                    <el-option
                    v-for="item in drawerTypeOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开票人地址" >
                    <div class='loc'>
                        <div>
                            <el-form-item label="" prop="drawerProvince">
                                <el-select v-model="ruleForm.drawerProvince" placeholder="请选择省"  style='width:100%;'
                                @change='ruleForm.drawerCity = null; drawerCityOpts=[];ruleForm.drawerArea = null ; drawerAreaOpts = [] ; getArea(ruleForm.drawerProvince,"drawerCityOpts")'
                                >
                                    <el-option
                                    v-for="item in drawerProvinceOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item label="" prop="drawerCity">
                                <el-select v-model="ruleForm.drawerCity" placeholder="请选择市"  style='width:100%;'
                                @change='ruleForm.drawerArea = null;drawerAreaOpts = [] ; getArea(ruleForm.drawerCity,"drawerAreaOpts")'
                                >
                                    <el-option
                                    v-for="item in drawerCityOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item label="" prop="drawerArea">
                                <el-select v-model="ruleForm.drawerArea" placeholder="请选择区"  style='width:100%;'>
                                    <el-option
                                    v-for="item in drawerAreaOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
            </el-form-item>
            <el-form-item label="供应商传真" prop="supplierFax">
                <el-input placeholder="请输入" v-model.trim="ruleForm.supplierFax"></el-input>
            </el-form-item>
            <el-form-item label="法人代表" prop="legalDelegate">
                <el-input placeholder="请输入" v-model.trim="ruleForm.legalDelegate"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
                <el-input placeholder="请输入" v-model.trim="ruleForm.contact"></el-input>
            </el-form-item>
            <el-form-item label="联系人电话" prop="contactPhone">
                <el-input placeholder="请输入" v-model.trim="ruleForm.contactPhone"></el-input>
            </el-form-item>
            <el-form-item label="联系人旺旺" prop="contactWangwang">
                <el-input placeholder="请输入" v-model.trim="ruleForm.contactWangwang"></el-input>
            </el-form-item>
            <el-form-item label="联系人邮箱" prop="contactMail">
                <el-input placeholder="请输入" v-model.trim="ruleForm.contactMail"></el-input>
            </el-form-item>
            <el-form-item label="供应商网站" prop="supplierWebsite">
                <el-input placeholder="请输入" v-model.trim="ruleForm.supplierWebsite"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="bank">
                <el-input placeholder="请输入" v-model.trim="ruleForm.bank"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="bankAccount">
                <el-input placeholder="请输入" v-model.trim="ruleForm.bankAccount"></el-input>
            </el-form-item>
            <el-form-item label="账号名" prop="accountName">
                <el-input placeholder="请输入" v-model.trim="ruleForm.accountName"></el-input>
            </el-form-item>
            <el-form-item label="开户地址" prop="bankAddress">
                <el-input placeholder="请输入" v-model.trim="ruleForm.bankAddress"></el-input>
            </el-form-item>
            <el-form-item label="票据类型" prop="billType">
                <el-select v-model="ruleForm.billType" placeholder="请选择"  style='width:100%;'>
                    <el-option
                    v-for="item in billTypeOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算时间 " prop="settlementTimeType">
                <el-select v-model="ruleForm.settlementTimeType" placeholder="请选择"  style='width:100%;'>
                    <el-option
                    v-for="item in settlementTimeTypeOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="付款方式 " prop="paymentMethod">
                <el-select v-model="ruleForm.paymentMethod" placeholder="请选择"  style='width:100%;'>
                    <el-option
                    v-for="item in paymentMethodOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账期" prop="accountPeriod">
                <el-select v-model="ruleForm.accountPeriod" placeholder="请选择"  style='width:100%;'>
                    <el-option
                    v-for="item in accountPeriodOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="负责开发人" prop="responsibleDeveloper">
                <el-select v-model="ruleForm.responsibleDeveloper" placeholder="请选择"  style='width:100%;'>
                    <el-option
                    v-for="item in responsibleDeveloperOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="负责采购人" prop="purchaseId">
                <el-select v-model="ruleForm.purchaseId" placeholder="请选择"  style='width:100%;'>
                    <el-option
                    v-for="item in purchaseIdOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="采购点" prop="purchasePoint">
                <el-select v-model="ruleForm.purchasePoint" placeholder="请选择"  style='width:100%;'>
                    <el-option
                    v-for="item in purchasePointOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="" prop="fbaCodeFlag">
                <el-checkbox v-model="ruleForm.fbaCodeFlag">是否可以提供FBA条码服务 ( 提供贴FBA条码服务的供应商对应的产品支持走海外直采流程 ） </el-checkbox>
            </el-form-item>
            <el-form-item prop="supplierSystemFlag">
                <el-checkbox v-model="ruleForm.supplierSystemFlag">供应商登录系统供货</el-checkbox>
                <div>
                    <el-form-item label="账户" prop="supplierAccount" style='display:inline-block;margin-left:-52px;' v-if='ruleForm.supplierSystemFlag'>
                        <el-input placeholder="请输入" v-model.trim="ruleForm.supplierAccount"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="supplierPassword" style='display:inline-block;' v-if='ruleForm.supplierSystemFlag'>
                        <el-input placeholder="请输入" v-model.trim="ruleForm.supplierPassword" type='password'></el-input>
                    </el-form-item>
                </div>
            </el-form-item>
            <el-form-item label="供应商备注" prop="supplierRemarks" >
                <el-input placeholder="请输入" v-model.trim="ruleForm.supplierRemarks" type='textarea' :rows='5'></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        let taxValidatePass = (rule, value, callback) => {
            let name = rule.field
            // console.log(name);
            // console.log(value);
            if(isNaN(Number(value)) || !value){
                return  callback(new Error('请输入数字'));
            }   
            this.ruleForm[name] = value ? Math.abs(+value) : ''
            callback();
        }
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
            ruleForm:{
                purchaseType:"",
                supplierName:'',
                deliveryProvince:"",
                deliveryCity:"",
                deliveryArea:"",
                invoiceFlag:null,
                tax:'',
                drawerAptitude:"",
                drawerProvince:'',
                drawerCity:"",
                drawerArea:'',
                supplierFax:'',
                legalDelegate:'',
                contact:"",
                contactPhone:'',
                contactWangwang:'',
                contactMail:'',
                supplierWebsite:'',
                bank:"",
                bankAccount:'',
                accountName:'',
                bankAddress:'',
                billType:'',
                settlementTimeType:'',
                paymentMethod:"",
                accountPeriod:"",
                responsibleDeveloper:"",
                purchaseId:"",
                purchasePoint:"",
                fbaCodeFlag:false,
                supplierSystemFlag:false,
                supplierAccount:'',
                supplierPassword:'',

            },
            rules:{
                purchaseType:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                supplierName:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                deliveryProvince:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                deliveryCity:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                // deliveryArea:[
                //     { required: true, message: '请选择', trigger: ['blur','change'] },
                // ],
                tax:[
                     { required: true, trigger: ['blur'] ,validator: taxValidatePass},
                ],
                contact:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                contactPhone:[
                    { required: true, trigger: ['blur','change'], validator: phoneValidatePass},
                ],
                contactMail:[
                    { required: true, trigger: ['blur','change'] ,validator: mailValidatePass },
                ],
                bank:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                bankAccount:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                accountName:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                bankAddress:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                settlementTimeType:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                paymentMethod:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                accountPeriod:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                responsibleDeveloper:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                purchaseId:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                purchasePoint:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                supplierAccount:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                supplierPassword:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                

            },
            supplierTypeOpts:[],//采购类型下拉
            provinceOpts:[],//供应商省的下拉
            cityOpts:[],//供应商市的下拉
            areaOpts:[],//供应商区的下拉
            drawerAptitudeOpts:[ //开票人资质下拉
                {label:'一般纳税人认定满2年',value:1},
                {label:'一般纳税人认定不满2年',value:2},
                {label:'小规模',value:3},
            ],
            drawerTypeOpts:[//开票人类型下拉
                {label:'生产型',value:1},
                {label:'贸易型',value:2},
            ],
            drawerProvinceOpts:[],//开票人地址省的下拉
            drawerCityOpts:[],//开票人地址市的下拉
            drawerAreaOpts:[],//开票人地址区的下拉
            billTypeOpts:[//票据类型下拉
                {label:'增值税发票',value:1},
                {label:'普通发票',value:2},
                {label:'收据 ',value:3},
                {label:'其他 ',value:4},
            ],
            settlementTimeTypeOpts:[//结算时间下拉
                {label:'按下单时间',value:1},
                {label:'按销单时间',value:2},
                {label:'按入库时间 ',value:3},
            ],
            paymentMethodOpts:[],//付款方式下拉
            accountPeriodOpts:[],//账期的下拉
            responsibleDeveloperOpts:[],//负责开发人下拉
            purchaseIdOpts:[],//负责采购人下拉
            purchasePointOpts:[],//采购点下拉
        };
    },
    methods: {
        //获取采购类型的下拉
        getPurchaseTypeOpts(){
            this.$api[`product/glSelectPurchaseType`]()
            .then((data) => {
                let {rows} =  data
                this.supplierTypeOpts = rows.map(i=>{
                    return {
                        label:i.name,
                        value:i.id
                    }
                })
                // console.log(data);
            })
        },
        //获取账期的下拉
        getAccountPeriodOpts(){
            this.$api[`product/supplierPeriodGetPeriodList`]()
            .then((data) => {
                let {rows} =  data
                this.accountPeriodOpts = rows.map(i=>{
                    return {
                        label:i.periodName,
                        value:i.periodId
                    }
                })
            })
        },
        //获取付款方式的下拉
        getPaymentMethodOpts(){
            this.$api[`product/glSelectPaymentType`]()
            .then((data) => {
                let {rows} =  data
                this.paymentMethodOpts = rows.map(i=>{
                    return {
                         label:i.name,
                        value:i.id
                    }
                })
            })
        },
        //获取采购点下拉
        getPurchasePointOpts(){
            this.$api[`product/supplierAddressGetAddressList`]()
            .then((data) => {
                let {rows} =  data
                this.purchasePointOpts = rows.map(i=>{
                    return {
                         label:i.addressName,
                        value:i.addressId
                    }
                })
            })
        },
        //获取省的下拉
        getArea(id,options){
            return this.$api[`product/purchaseGlAreaGetChild`]({
                parentAreaId : id
            })
            .then((data) => {
                let {rows} =  data
               // console.log(rows);
                this[options] = rows.map(i=>{
                    return {
                        label:i.name,
                        value:i.id
                    }
                })
            })
        },
        //获取开发人员
        getPeoples(){
            this.$api[`product/SMpermissionUserList`](
                {
                    types:['Develop','Purchase']
                }
            )
            .then((data) => {
                console.log(data);
                let {rows} =  data 
                let Develop = []
                let Purchase = []
                rows.forEach(i=>{
                    if(i.type === 'Develop'){
                        Develop = i.users
                    }
                    if(i.type === 'Purchase'){
                        Purchase = i.users
                    }
                })
                //console.log(Purchase);
                this.responsibleDeveloperOpts = Develop.map(i=>{
                    return{
                        label:i.userName,
                        value:i.userId
                    }
                })
                this.purchaseIdOpts = Purchase.map(i=>{
                    return{
                        label:i.userName,
                        value:i.userId
                    }
                })
            })
        },
        saveBtn(){
            let params = JSON.parse(JSON.stringify(this.ruleForm))
            params.fbaCodeFlag = params.fbaCodeFlag ? 1 : 0
            params.supplierSystemFlag = params.supplierSystemFlag ? 1 : 0
            return this.$api[`product/glSupplierSave`](params)
        },

    },
    created() {
        this.getPurchaseTypeOpts()
        this.getAccountPeriodOpts()
        this.getPaymentMethodOpts()
        this.getPurchasePointOpts()
        this.getPeoples()
        let res = this.getArea(17,'provinceOpts')
        res.then(res=>{
            this.getArea(17,'drawerProvinceOpts')
        })
    },
    computed:{
        validate(){
            return ()=>{
                return this.$refs.ruleForm.validate()
            }
        }
    }
};
</script>

<style scoped lang="scss">
.loc{
    display: flex;
    justify-content: space-between;
    &>div{
        width:30%
    }
}
.red{
    color: #F56C6C;
    font-size: 14px;
    vertical-align: middle;
}
</style>
