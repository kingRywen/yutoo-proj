<template>
    <div class="refundForm">
        <el-form :model="form" ref="form" label-width="120px" size="small">
            <!-- 退款  -->
            <div class="refund-info-item">
                <h3 class="dialogItemTitle">订单信息</h3>
                <el-row class="border">
                    <el-col :span="8">
                        <el-form-item label="订单号：" prop="orderNumberSystem" :rules="[
                { required: true, message: '请输入订单号', trigger: 'change' },
              ]">
                            <el-input v-model="form.orderNumberSystem" v-if="isAdd" placeholder="请输入系统订单号">
                                <el-button slot="append" icon="el-icon-search" @click="getOrderId()" :loading="loadingOrderId"></el-button>
                            </el-input>
                            <template v-else>{{form.orderNumberSystem}}</template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="list.length">
                        <el-form-item label="下单时间：">{{form.createOrderTime || '-'}}</el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="list.length">
                        <el-form-item label="订单金额：">{{form.orderPrice || 0}}</el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div v-if="list.length" v-loading="loadingOrderId">
                <div class="refund-info-item">
                    <h3 class="dialogItemTitle">退款产品</h3>
                    <div class="border">
                        <!--  -->
                        <el-table :data="list" border style="width: 100%" class="mb10">
                            <el-table-column prop="productSku" label="SKU" align="center" />
                            <el-table-column prop="nameZh" label="产品名称" align="center" />
                            <el-table-column prop="productPrice" label="价格" align="center" />
                            <el-table-column prop="orderAmount" label="订购数量" align="center" />
                            <el-table-column label="退款数量" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-form-item class="inputmar" :prop="'products.' + scope.$index + '.returnAmount'" :rules="[
                      {required: true,validator:amount}                    
                    ]">
                                        <el-input
                                            :disabled="disabled"
                                            :value="form.products[scope.$index].returnAmount"
                                            @input="val => {                        
                        form.products[scope.$index].returnAmount = val    
                        if(form.products[scope.$index].flag){
                          $set(form.products[scope.$index],'returnPrice',val *   scope.row.productPrice)
                        } 
                      }"
                                            size="mini"
                                            type="number"
                                            :min="1"
                                            :max="scope.row.orderAmount"
                                        />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="退款金额" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-form-item class="inputmar" :prop="'products.' + scope.$index + '.returnPrice'" :rules="[
                      {required: true, validator:amount}                    
                    ]">
                                        <el-input
                                            :disabled="disabled"
                                            :value="form.products[scope.$index].returnPrice"
                                            @input="val => {
                        form.products[scope.$index].returnPrice = val
                        form.products[scope.$index].returnAmount?form.products[scope.$index].flag = false:true
                      }"
                                            size="mini"
                                            type="number"
                                            :min="1"
                                        />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--  -->
                    </div>
                </div>
                <div class="refund-info-item">
                    <h3 class="dialogItemTitle">退款信息</h3>
                    <div class="border">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="已退金额：">{{ form.retiredRetiredMoney || 0 }}</el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="退款总金额：">{{ refundMoney }}</el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="退款支付方式：" prop="refundPayType" :rules="[
                                  { required: true, message: '请选择退款支付方式', trigger: 'change' },
                                ]">
                                    <el-radio-group v-model="form.refundPayType" :disabled="disabled">
                                        <el-radio :label="1">在线支付</el-radio>
                                        <el-radio :label="2">线下汇款</el-radio>
                                        <el-radio :label="3">站内账号付款</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="退款银行：" prop="payBankId" :rules="[
                                  { required: true, message: '请选择退款银行', trigger: 'change' },
                                ]">
                                    <el-select v-model="form.payBankId" style="width:100%;" :disabled="disabled">
                                        <el-option :label="i.bankName" :value="i.bankId" v-for="(i,j) in bankList" :key="j" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="收款人：" prop="payee" :rules="[
                                  { required: true, message: '请输入收款人', trigger: 'change' },
                                ]">
                                    <el-input v-model="form.payee" :disabled="disabled"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="收款账号：" prop="payeeAccount" :rules="[
                                  { required: true, message: '请输入收款账号', trigger: 'change' },
                                ]">
                                    <el-input v-model.trim="form.payeeAccount" type="number" :disabled="disabled"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="16" style="display:flex;">
                                <el-form-item label="退款原因：" prop="refundReasonFirstId" :rules="[
                                  { required: true, message: '请选择一级退款原因', trigger: 'change' },
                                ]">
                                    <el-select :disabled="disabled" v-model="form.refundReasonFirstId" style="width:215px;" placeholder="一级原因" @change="changeReason">
                                        <el-option :label="i.name" :value="i.refundReasonId" v-for="(i,j) in oneReason" :key="j" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="refundReasonSecondId" class="cause">
                                    <el-select
                                        :disabled="disabled"
                                        v-model="form.refundReasonSecondId"
                                        placeholder="二级原因"
                                        :rules="[
                                      { required: twoReason.length?true:false, message: '请选择二级退款原因', trigger: 'change' },
                                    ]"
                                    >
                                        <el-option :label="i.name" :value="i.refundReasonId" v-for="(i,j) in twoReason" :key="j"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-button :disabled="disabled" size="small" type="primary" plain style="height:32px;margin-left:30px;" @click="manage">退款原因管理</el-button>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="是否退运费：" prop="shippingFlag" :rules="[
                  { required: true, message: '请选择是否退回运费', trigger: 'change' },
                ]">
                                    <el-select v-model="form.shippingFlag" style="width:100%;" :disabled="disabled">
                                        <el-option label="是" value="1" />
                                        <el-option label="否" value="2" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="平台退款原因：" prop="refundReasonPlatform" :rules="[
                  { required: true, message: '请选择平台退款原因', trigger: 'change' },
                ]">
                                    <el-select v-model="form.refundReasonPlatform" style="width:100%;" :disabled="disabled">
                                        <el-option :label="i.name" :value="i.orderRefundPlatformReasonId" v-for="(i) in platformReasonList" :key="i.refundId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="退款类型：" prop="refundType" :rules="[
                                  { required: true, message: '请选择退款类型：', trigger: 'change' },
                                ]">
                                    <el-select v-model="form.refundType" style="width:100%;" :disabled="disabled">
                                        <el-option label="未发货退款" value="1" />
                                        <el-option label="已发货退款" value="2" />
                                        <el-option label="部分退款" value="3" />
                                        <el-option label="全额退款" value="4" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="货物处理：" prop="cargoHandler" :rules="[
                                  { required: true, message: '请选择货物处理方式', trigger: 'change' },
                                ]">
                                    <el-select v-model="form.cargoHandler" style="width:100%;" :disabled="disabled">
                                        <el-option label="未退货" value="1" />
                                        <el-option label="退货上架" value="2" />
                                        <el-option label="退货退回" value="3" />
                                        <el-option label="未发货" value="4" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="退货备注：">
                            <el-input type="textarea" v-model="form.remark" class="textarea" :disabled="disabled"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </div>
        </el-form>

        <el-dialog title="退回原因管理" :visible.sync="dialogVisible" width="1200px" center top="90px" :append-to-body="true" lock-scroll>
            <div class="dialogVisible-content">
                <el-scrollbar style="height:100%;">
                    <backMoneyManage ref="backMoneyManage" :list="oneReason" :update="getReasonList" />
                </el-scrollbar>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import backMoneyManage from './backMoneyManage';
import { mapActions, mapGetters } from 'vuex';

export default {
    props: {
        update: Function,
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            amount: (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('数量不能为空'));
                }
                if (value > 0) {
                    callback();
                } else {
                    callback(new Error('必须大于0'));
                }
            },
            list: [],
            loadingOrderId: false,
            form: {
                orderId: '',
                orderNumberSystem: '',
                createOrderTime: '',
                orderPrice: '',
                retiredRetiredMoney: '',

                refundType: '',
                payBankId: '',
                payee: '',
                shippingFlag: '',
                payeeAccount: '',
                refundReasonFirstId: '',
                refundReasonSecondId: '',
                refundMode: 1,
                products: [],
                remark: '',
                refundReasonPlatform: '',
                refundPayType: 1,
                cargoHandler: ''
            },
            dialogVisible: false,

            isAdd: true,
            oneReason: [],
            twoReason: [],
            platformReasonList: []
        };
    },
    watch: {
        list(val) {
            this.form.products = val.map(item => {
                return {
                    orderProductId: item.orderProductId,
                    returnAmount: item.refundAmount,
                    returnPrice: item.refundPrice,
                    flag: true
                };
            });
        }
    },
    methods: {
        getOrderId() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    this.loadingOrderId = true;
                    try {
                        const { orderId } = await this.$api[
                            'order/getOrderIdByNumber'
                        ]({
                            orderNumber: this.form.orderNumberSystem
                        });
                        this.form.orderId = orderId;
                        const platformId = await this.getAddOrderInfo(orderId);
                        // eslint-disable-next-line
                        if (platformId) {
                            await this.getPlatformReasonList(platformId);
                        }
                        this.loadingOrderId = false;
                    } catch {
                        this.loadingOrderId = false;
                    }
                }
            });
        },
        //添加时候获取信息
        getAddOrderInfo(orderId) {
            return this.$api['order/orderInfo']({
                orderId
            })
                .then(res => {
                    let {
                        products,
                        retiredMoney,
                        essentialInfo: {
                            // unrelatedFlag,
                            orderNumSystem,
                            createOrderTime,
                            orderPrice,
                            platformId
                        }
                    } = res.rows;
                    // if (unrelatedFlag) {
                    //     this.$message.warning('该订单是api获取，不能退')
                    //     return false
                    // }
                    if (!products.length) {
                        this.$message.warning('该订单下无退款产品');
                        return false;
                    }
                    this.list = products;
                    this.form.orderNumberSystem = orderNumSystem;
                    this.form.createOrderTime = createOrderTime;
                    this.form.orderPrice = orderPrice;
                    this.form.retiredRetiredMoney = retiredMoney;
                    return platformId;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                    return false;
                });
        },
        async edit(orderId, orderRefundId) {
            this.isAdd = false;
            let {
                createOrderTime,
                orderNumberSystem,
                orderPrice,
                platformId
            } = await this.getOrderInfo(orderId);

            await this.getPlatformReasonList(platformId);
            let {
                products,
                refundMode,
                payBankId,
                payee,
                payeeAccount,
                refundReasonFirstId,
                refundReasonSecondId,
                refundReasonPlatform,
                refundPayType,
                cargoHandler,
                shippingFlag,
                refundType,
                remark,
                retiredMoney
            } = await this.getRefundInfo(orderRefundId);
            //订单,产品信息

            this.form.orderId = orderId;

            this.form.orderNumberSystem = orderNumberSystem;
            this.form.createOrderTime = createOrderTime;
            this.form.orderPrice = orderPrice;

            this.form.retiredRetiredMoney = retiredMoney;
            //退款信息
            this.list = products;
            this.form.refundMode = refundMode;
            this.form.payBankId = payBankId;
            this.form.payee = payee;
            this.form.payeeAccount = payeeAccount;
            this.form.refundReasonFirstId = refundReasonFirstId;

            await this.changeReason(refundReasonFirstId);

            this.form.refundReasonSecondId = refundReasonSecondId;

            this.form.refundReasonPlatform = refundReasonPlatform;
            this.form.refundPayType = refundPayType;

            this.form.refundType = refundType + '';
            this.form.cargoHandler = cargoHandler + '';
            this.form.remark = remark;
            this.form.shippingFlag = shippingFlag + '';
        },
        //编辑时获取订单,产品信息
        getOrderInfo(orderId) {
            return this.$api['order/refundInfo']({
                orderId
            }).then(res => res.rows);
        },
        //编辑时获取退款信息
        getRefundInfo(orderRefundId) {
            return this.$api['email/refundInfo']({
                orderRefundId
            }).then(res => res.rows);
        },
        changeReason(val) {
            this.form.refundReasonSecondId = '';
            this.oneReason.forEach(item => {
                if (item.refundReasonId == val) {
                    this.twoReason = item.child;
                }
            });
        },
        submitForm(callback, orderRefundId) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (!this.list.length) {
                        this.getOrderId();
                        return;
                    }
                    let params = Object.assign({}, this.form, {
                        refundMoney: this.refundMoney
                    });
                    if (orderRefundId) {
                        params = Object.assign({}, this.form, {
                            orderRefundId,
                            refundMoney: this.refundMoney
                        });
                    }
                    this.$api['order/refundSave'](params)
                        .then(res => {
                            this.$message.success(res.msg);
                            callback && callback();
                        })
                        .catch(err => {
                            this.$message.error(err.msg);
                        });
                } else {
                    return false;
                }
            });
        },
        //退款原因管理
        manage() {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.backMoneyManage.getReasonList();
            });
        },
        //获取平台退款原因
        getPlatformReasonList(platformId) {
            return this.$api['order/refundGetReasonList']({
                platformId
            })
                .then(res => {
                    this.platformReasonList = res.rows;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        getReasonList() {
            this.$api['order/refundReasonGetReasonList']()
                .then(res => {
                    this.oneReason = res.rows;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        ...mapActions(['getBankList', 'initCommonList'])
    },
    computed: {
        refundMoney() {
            if (this.form.products.length) {
                let val = this.form.products
                    .map(item => item.returnPrice)
                    .reduce((item, val) => item + val);
                if (val > 0) return val;
                return 0;
            } else {
                return 0;
            }
        },
        ...mapGetters(['bankList', 'paymentMethod'])
    },
    mounted() {
        this.getBankList();
        this.getReasonList();
    },
    components: {
        backMoneyManage
    }
};
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
.refund-info-item {
    margin-bottom: 25px;
    .cause {
        .el-form-item__content {
            margin-left: 10px !important;
        }
    }
    .textarea {
        textarea {
            height: 120px;
            resize: none;
        }
    }
}
.dialogVisible-content {
    height: 700px;
    overflow-y: auto;
    .UniversalLayout {
        position: inherit;
    }
}
.inputmar {
    .el-form-item__content {
        margin-left: 0 !important;
    }
}
</style>
