<template>
    <el-form :model="ruleForm" ref="ruleForm" label-width="130px" class="supplier-ruleForm" size="small">
        <el-row :gutter="10">
            <el-col :span="7">
                <el-form-item label="采购类型：" prop="purchaseType" :rules="[
              { required: true,  message: '请选择采购类型', trigger: 'change' }
          ]">
                    <el-select v-model="ruleForm.purchaseType">
                        <el-option :label="i.label" :value="i.value" v-for="i in purchaseTypeList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="3">
                <el-checkbox style="padding-left: 20px;line-height: 32px;" v-model="ruleForm.supplierSystemFlag" :true-label="1" :false-label="0">供应商登录系统供货</el-checkbox>
            </el-col>
            <el-col :span="7" v-if="ruleForm.supplierSystemFlag">
                <el-form-item label="账号：" prop="supplierAccount" :rules="[              
              { pattern:/^[a-zA-Z0-9_]{0,}$/,trigger: 'change', required: ruleForm.supplierSystemFlag?true:false,message:'不能包含中文'}
          ]">
                    <el-input v-model="ruleForm.supplierAccount"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="7" v-if="ruleForm.supplierSystemFlag">
                <el-form-item label="密码：" prop="supplierPassword" :rules="[
              { pattern:/^[a-zA-Z0-9_]{0,}$/,trigger: 'change', required: ruleForm.supplierSystemFlag?true:false,message:'不能包含中文'}
          ]">
                    <el-input v-model="ruleForm.supplierPassword"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <!--  -->
        <el-row :gutter="10">
            <el-col :span="12">
                <el-row>
                    <el-col :span="14">
                        <el-form-item label="供应商发货地：" prop="deliveryProvince" :rules="[
              { required: true,  message: '请输入省份', trigger: 'change' }
            ]">
                            <el-input v-model="ruleForm.deliveryProvince" placeholder="请输入省"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="deliveryCity" class="itemMargin" :rules="[
              { required: true,  message: '请输入城市', trigger: 'change' }
            ]">
                            <el-input v-model="ruleForm.deliveryCity" placeholder="请输入城市"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-col :span="12">
                    <el-checkbox style="padding-left: 20px;line-height: 32px;" v-model="ruleForm.invoiceFlag" :true-label="1" :false-label="0">
                        是否开具发票
                        <span>（一般纳税人税票）</span>
                    </el-checkbox>
                </el-col>
                <el-col :span="12" v-if="ruleForm.invoiceFlag">
                    <el-form-item label="开票税点：" prop="tax" :rules="[
              { required: ruleForm.invoiceFlag?true:false,  message: '请输入开票税点', trigger: 'change' }
            ]">
                        <el-input v-model="ruleForm.tax" type="number"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>
        </el-row>
        <!--  -->
        <el-row>
            <el-col :span="12">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="开票人资质：" prop="drawerAptitude" :rules="[
              { required: ruleForm.invoiceFlag?true:false,  message: '请选择开票人资质', trigger: 'change' }
            ]">
                            <el-select v-model="ruleForm.drawerAptitude">
                                <el-option :label="i.label" :value="i.value" v-for="i in drawerAptitudeList"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开票人类型：" prop="drawerType" :rules="[
              { required: ruleForm.invoiceFlag?true:false,  message: '请选择开票人类型', trigger: 'change' }
            ]">
                            <el-select v-model="ruleForm.drawerType">
                                <el-option :label="i.label" :value="i.value" v-for="i in drawerTypeList"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="开票人地址：" prop="drawerProvince" :rules="[
              { required: ruleForm.invoiceFlag?true:false,  message: '请输入开票人省份', trigger: 'change' }
            ]">
                            <el-input v-model="ruleForm.drawerProvince" placeholder="请输入省"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item class="itemMargin" prop="drawerCity" :rules="[
              { required: ruleForm.invoiceFlag?true:false,  message: '请输入开票人城市', trigger: 'change' }
            ]">
                            <el-input v-model="ruleForm.drawerCity" placeholder="请输入城市" style="width:100%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!--  -->
        <el-form-item label="供应商名称：" prop="supplierName" :rules="[
              { required: true,  message: '请输入供应商名称', trigger: 'change' }
            ]">
            <el-input v-model="ruleForm.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="供应商传真：" prop="supplierFax" :rules="[
      { pattern:/^[a-zA-Z0-9_]{0,}$/,trigger: 'change', required: ruleForm.supplierFax?true:false,message:'不能包含中文'}
    ]">
            <el-input v-model="ruleForm.supplierFax"></el-input>
        </el-form-item>
        <!--  -->
        <el-row>
            <el-col :span="15">
                <div>
                    <el-form-item label="对应的仓库：" prop="depot">
                        <el-select v-model="ruleForm.depot">
                            <el-option :label="i.label" :value="i.value" v-for="i in depotList"></el-option>
                        </el-select>
                        <span style="color:#c0c4cc;">（有多个本地仓库打印采购单时选择）</span>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="9">
                <el-form-item label="供应商地址：" prop="supplierAddress" :rules="[
              { required: true,  message: '请输入供应商地址', trigger: 'change' }
            ]">
                    <el-input v-model="ruleForm.supplierAddress"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <!--  -->
        <el-row>
            <el-col :span="8">
                <el-form-item label="法人代表：" prop="legalDelegate" :rules="[
              { required: true,  message: '请输入法人代表', trigger: 'change' }
            ]">
                    <el-input v-model="ruleForm.legalDelegate"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="总经理：" prop="manager">
                    <el-input v-model="ruleForm.manager"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="总经理电话：" prop="managerPhoneCode" :rules="[              
              { pattern:/^[a-zA-Z0-9_]{0,}$/,trigger: 'change', required: true,message:'不能为空，不能包含中文'}              
            ]">
                    <el-input v-model="ruleForm.managerPhoneCode"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="联系人：" prop="contact" :rules="[
              { trigger: 'change', required: true,message:'联系人不能为空'}
            ]">
                    <el-input v-model="ruleForm.contact"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系人电话：" prop="contactPhone" :rules="[
              { pattern:/^[a-zA-Z0-9_]{0,}$/,trigger: 'change', required: true,message:'不能为空，不能包含中文'}
              
            ]">
                    <el-input v-model="ruleForm.contactPhone"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系人微信：" prop="contactWechat" :rules="[
          { pattern:/^[a-zA-Z0-9_]{0,}$/,trigger: 'change', required: ruleForm.contactWechat?true:false,message:'不能包含中文'}]">
                    <el-input v-model="ruleForm.contactWechat"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="联系人旺旺：" prop="contactWangwang" :rules="[
          { pattern:/^[a-zA-Z0-9_]{0,}$/,trigger: 'change', required: ruleForm.contactWangwang?true:false,message:'不能包含中文'}]">
                    <el-input v-model="ruleForm.contactWangwang"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系人MNS：" prop="contactMsn" :rules="[
          { pattern:/^[a-zA-Z0-9_]{0,}$/,trigger: 'change', required: ruleForm.contactMsn?true:false,message:'不能包含中文'}]">
                    <el-input v-model="ruleForm.contactMsn"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系人邮箱：" prop="contactMail" :rules="[
              { required: true,  message: '请输入联系人邮箱', trigger: 'change' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]">
                    <el-input v-model="ruleForm.contactMail"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item
                    label="供应商网站："
                    prop="supplierWebsite"
                    :rules="[
          { pattern:/^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/,trigger: 'change', required: ruleForm.supplierWebsite?true:false,message:'请输入正确的网址'}]"
                >
                    <el-input v-model="ruleForm.supplierWebsite"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="供应商级别：" prop="supplierLevel">
                    <el-select v-model="ruleForm.supplierLevel">
                        <el-option :label="i.label" :value="i.value" v-for="i in supplierLevelList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="是否供应商备货：" prop="supplierStockFlag">
                    <el-select v-model="ruleForm.supplierStockFlag">
                        <el-option :label="i.label" :value="i.value" v-for="i in supplierStockFlagList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="是否黑名单：" prop="blacklistFlag">
                    <el-select v-model="ruleForm.blacklistFlag">
                        <el-option :label="i.label" :value="i.value" v-for="i in supplierStockFlagList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="开户银行：" prop="bank" :rules="[
              { required: true,  message: '请输入开户银行', trigger: 'change' }
            ]">
                    <el-input v-model="ruleForm.bank"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item label="开户地址：" prop="bankAddress">
                    <el-input v-model="ruleForm.bankAddress"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="银行账号：" prop="bankAccount" :rules="[
              
               { pattern:/^[a-zA-Z0-9_]{0,}$/,trigger: 'change', required: true,message:'不能为空,不能包含中文'}
            ]">
                    <el-input v-model="ruleForm.bankAccount"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item label="账户名：" prop="accountName" :rules="[
             { trigger: 'change', required: true,message:'不能为空,不能包含中文'}
            ]">
                    <el-input v-model="ruleForm.accountName"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item label="票据类型：" prop="billType" :rules="[
              { required: true,  message: '请选择票据类型', trigger: 'change' }
            ]">
                    <el-select v-model="ruleForm.billType">
                        <el-option :label="i.label" :value="i.value" v-for="i in billTypeList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="结算时间：" prop="settlementTimeType" :rules="[
              { required: true,  message: '请选择结算时间', trigger: 'change' }
            ]">
                    <el-select v-model="ruleForm.settlementTimeType">
                        <el-option :label="i.label" :value="i.value" v-for="i in settlementTimeTypeList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="付款方式：" prop="paymentMethod" :rules="[
              { required: true,  message: '请选择付款方式', trigger: 'change' }
            ]">
                    <el-select v-model="ruleForm.paymentMethod">
                        <el-option :label="i.label" :value="i.value" v-for="i in paymentMethodList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item label="账期：" prop="accountPeriod" :rules="[
              { required: true,  message: '请选择账期', trigger: 'change' }
            ]">
                    <el-select v-model="ruleForm.accountPeriod">
                        <el-option :label="i.label" :value="i.value" v-for="i in accountPeriodList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="起始日：" prop="startDay" :rules="[
              { required: true,  message: '请选择起始日期', trigger: 'change' }
            ]">
                    <el-date-picker v-model="ruleForm.startDay" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width:100%;"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="负责开发人：" prop="responsibleDeveloper">
                    <el-select v-model="ruleForm.responsibleDeveloper">
                        <el-option :label="i.label" :value="i.value" v-for="i in purchaseIdList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="采购点：" prop="purchasePoint" :rules="[
              { required: true,  message: '请选择采购点', trigger: 'change' }
            ]">
                    <el-select v-model="ruleForm.purchasePoint">
                        <el-option :label="i.label" :value="i.value" v-for="i in purchasePointList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="采购人：" prop="purchaseId">
                    <el-select v-model="ruleForm.purchaseId">
                        <el-option :label="i.label" :value="i.value" v-for="i in purchaseIdList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="供应商备注：" prop="supplierRemarks">
                    <el-input type="textarea" v-model="ruleForm.supplierRemarks" class="textarea"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item>
                    <el-checkbox style="line-height: 32px;" v-model="ruleForm.fbaCodeFlag" :true-label="1" :false-label="0">是否可以提供FBA条码服务</el-checkbox>
                    <span style="color:#c0c4cc;">（提供贴FBA条码服务的供应商对应的产品支持走海外直采流程）</span>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
import { getData } from 'common/http';
import {
    BASE_URL,
    ORDER_URL,
    PURCHASE_URL,
    PROCUREMENT_URL
} from 'common/config';

export default {
    data() {
        return {
            depotList: [
                { label: '系统本的仓库', value: 0 },
                { label: '本地中国仓库', value: 1 }
            ],
            drawerTypeList: [
                { label: '生产型', value: 1 },
                { label: '贸易型', value: 2 }
            ],
            drawerAptitudeList: [
                { label: '一般纳税人认定满2年', value: 1 },
                { label: '一般纳税人认定不满2年', value: 2 },
                { label: '小规模', value: 3 }
            ],
            purchaseTypeList: [
                { label: '市场采购', value: 1 },
                { label: '网络采购', value: 2 },
                { label: '工厂采购', value: 3 },
                { label: '自主生产', value: 4 }
            ],
            supplierLevelList: [
                { label: 'A', value: 1 },
                { label: 'B', value: 2 },
                { label: 'C', value: 3 },
                { label: 'D', value: 4 },
                { label: 'E', value: 5 }
            ],
            supplierStockFlagList: [
                { label: '是', value: 1 },
                { label: '否', value: 0 }
            ],
            billTypeList: [
                { label: '增值税发票', value: 1 },
                { label: '普通发票', value: 2 },
                { label: '收据', value: 3 },
                { label: '其他', value: 4 }
            ],
            settlementTimeTypeList: [
                { label: '按下单时间', value: 1 },
                { label: '按销单时间', value: 2 },
                { label: '按入库时间', value: 3 }
            ],
            paymentMethodList: [
                { label: '现金付款', value: 1 },
                { label: '网络在线付款', value: 2 },
                { label: '转账付款', value: 3 },
                { label: '阿里账期付款', value: 4 }
            ],
            accountPeriodList: [],

            purchasePointList: [],
            purchaseIdList: [],
            ruleForm: {
                purchaseType: '',
                supplierSystemFlag: 0,
                supplierAccount: '',
                supplierPassword: '',

                deliveryProvince: '',
                deliveryCity: '',
                invoiceFlag: 0,
                tax: '',

                drawerAptitude: '',
                drawerType: '',
                drawerProvince: '',
                drawerCity: '',
                supplierName: '',
                supplierFax: '',

                depot: '',
                supplierAddress: '',

                legalDelegate: '',
                manager: '',
                managerPhoneCode: '',
                contact: '',
                contactPhone: '',
                contactWechat: '',
                contactWangwang: '',
                contactMsn: '',
                contactMail: '',
                supplierWebsite: '',
                supplierRemarks: '',
                supplierLevel: '',
                supplierStockFlag: 0,
                blacklistFlag: 0,
                bank: '',
                bankAddress: '',
                bankAccount: '',
                accountName: '',
                billType: '',
                settlementTimeType: '',
                paymentMethod: '',
                accountPeriod: '',
                startDay: '',
                responsibleDeveloper: '',
                purchasePoint: '',
                purchaseId: '',
                fbaCodeFlag: 0
            }
        };
    },
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    watch: {
        info: {
            handler(val) {
                if (Object.keys(val).length) {
                    for (let k in this.ruleForm) {
                        for (let j in val) {
                            if (k === j) {
                                this.ruleForm[k] = val[j];
                            }
                        }
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        submitForm(callback) {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    callback && callback(this.ruleForm);
                } else {
                    this.$nextTick(() => {
                        let pDom = this.$refs.ruleForm.$el;
                        let dom = document.getElementsByClassName('is-error');
                        let domT = dom[0];
                        pDom.scrollTop = domT.offsetTop;
                    });
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.ruleForm.resetFields();
        },

        //采购人
        getPurchaserPeople() {
            this.http('product/develop/user/list', {}, BASE_URL, 'get').then(
                res => {
                    this.purchaseIdList = res.data.rows.map(i => {
                        return {
                            label: i.nickName,
                            value: i.userId
                        };
                    });
                }
            );
        },

        //获取账期
        getAccountPeriodList() {
            this.http(
                'supplier/period/getPeriodList',
                {},
                PROCUREMENT_URL
            ).then(res => {
                this.accountPeriodList = res.data.rows.map(i => {
                    return {
                        label: i.periodName,
                        value: i.periodId
                    };
                });
            });
        },
        //获取采购点
        getPurchasePointList() {
            this.http(
                'supplier/address/getAddressList',
                {},
                PROCUREMENT_URL
            ).then(res => {
                this.purchasePointList = res.data.rows.map(i => {
                    return {
                        label: i.addressName,
                        value: i.addressId
                    };
                });
            });
        },
        // //获取仓库列表
        // getWarehouseList() {
        //     this.http('warehouse/list', {}, BASE_URL).then(res => {
        //         this.depotList = res.data.rows.map(i => {
        //             return {
        //                 label: i.warehouseName,
        //                 value: i.warehouseId
        //             }
        //         })
        //     })
        // },
        http(url, params, ip = BASE_URL, methods = 'post') {
            return getData(url, params, ip, methods).then(res => {
                if (res.data.code == 0) {
                    return res;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        }
    },
    mounted() {
        // this.getWarehouseList()
        this.getPurchasePointList();
        this.getAccountPeriodList();
        this.getPurchaserPeople();
    }
};
</script>
<style lang="scss">
.supplier-ruleForm {
    max-height: 500px;
    padding-right: 20px;
    padding-top: 10px;
    overflow-y: auto;
    .itemMargin {
        .el-form-item__content {
            margin-left: 10px !important;
        }
    }
    .textarea {
        textarea {
            height: 100px;
            resize: none;
        }
    }
}
</style>