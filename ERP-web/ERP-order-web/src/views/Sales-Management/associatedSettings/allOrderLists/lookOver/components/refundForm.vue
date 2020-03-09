<template>
    <div class="refundForm">
        <el-form :model="form" ref="form" label-width="120px" size="small">
            <!-- 退款  -->
            <div class="refund-info-item">
                <h3 class="dialogItemTitle">订单信息</h3>
                <el-row class="border" style="padding:20px 10px;">
                    <el-col :span="8">订单号：{{info.orderNumberSystem}}</el-col>
                    <el-col :span="8">下单时间：{{info.createOrderTime}}</el-col>
                    <el-col :span="8">订单金额：{{info.orderPrice}}</el-col>
                </el-row>
            </div>
            <div class="refund-info-item">
                <h3 class="dialogItemTitle">退款产品</h3>
                <div class="border">
                    <el-table :data="list" border style="width: 100%" class="mb10">
                        <el-table-column prop="productSku" label="SKU" align="center"/>
                        <el-table-column prop="nameZh" label="产品名称" align="center"/>
                        <el-table-column prop="productPrice" label="价格" align="center"/>
                        <el-table-column prop="orderAmount" label="订购数量" align="center"/>
                        <el-table-column label="退款数量" width="180" align="center">
                            <template slot-scope="scope">
                                <el-form-item class="inputmar" :prop="'products.' + scope.$index + '.returnAmount'" :rules="[
                      {required: true,validator:amount}                    
                    ]">
                                    <el-input-number
                                        :disabled="disabled"
                                        :value="form.products[scope.$index].returnAmount"
                                        controls-position="right"
                                        @change="val => {                        
                        form.products[scope.$index].returnAmount = val
                        $set(form.products[scope.$index],'returnPrice',val * scope.row.productPrice)
                      }"
                                        size="mini"
                                        type="number"
                                        :min="0"
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
                                    <el-input-number
                                        :disabled="disabled"
                                        controls-position="right"
                                        :value="form.products[scope.$index].returnPrice"
                                        @change="val => {
                        form.products[scope.$index].returnPrice = val
                        form.products[scope.$index].returnAmount?form.products[scope.$index].flag = false:true
                      }"
                                        size="mini"
                                        type="number"
                                        :min="0"
                                        :max="Math.min(info.orderPrice, scope.row.productPrice * scope.row.orderAmount)"
                                    />
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="refund-info-item">
                <h3 class="dialogItemTitle">退款信息</h3>
                <div class="border">
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="已退金额：">{{ info.retiredMoney || 0 }}</el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="退款总金额：">{{ refundMoney }}</el-form-item>
                        </el-col>
                        <el-col :span="14">
                            <el-form-item label="退款支付方式：" prop="refundMode" :rules="[
                                  { required: true, message: '请选择退款支付方式', trigger: 'change' },
                                ]">
                                <el-radio-group v-model="form.refundMode" :disabled="disabled">
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
                                    <el-option :label="i.bankName" :value="i.bankId" v-for="(i,j) in bankList" :key="j"/>
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
                                <el-input v-model="form.payeeAccount" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16" style="display:flex;">
                            <el-form-item label="退款原因：" prop="refundReasonFirstId" :rules="[
                                  { required: true, message: '请选择一级退款原因', trigger: 'change' },
                                ]">
                                <el-select :disabled="disabled" v-model="form.refundReasonFirstId" style="width:215px;" placeholder="一级原因" @change="changeReason">
                                    <el-option :label="i.name" :value="i.refundReasonId" v-for="(i,j) in oneReason" :key="j"/>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="cause" prop="refundReasonSecondId" :rules="[
                     { required: twoReason.length?true:false, message: '请选择二级退款原因', trigger: 'change' },
                  ]">
                                <el-select v-model="form.refundReasonSecondId" placeholder="二级原因" :disabled="disabled">
                                    <el-option :label="i.name" :value="i.refundReasonId" v-for="(i,j) in twoReason" :key="j"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-button size="small" type="primary" plain style="height:32px;margin-left:30px;" @click="manage" :disabled="disabled">退款原因管理</el-button>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否退运费：" prop="shippingFlag" :rules="[
                  { required: true, message: '请选择是否退回运费', trigger: 'change' },
                ]">
                                <el-select v-model="form.shippingFlag" style="width:100%;" :disabled="disabled">
                                    <el-option label="是" value="1"/>
                                    <el-option label="否" value="2"/>
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
                            <el-form-item label="退款类型：" prop="refundPayType" :rules="[
                                  { required: true, message: '请选择退款类型：', trigger: 'change' },
                                ]">
                                <el-select v-model="form.refundPayType" style="width:100%;" :disabled="disabled">
                                    <el-option label="未发货退款" value="1"/>
                                    <el-option label="已发货退款" value="2"/>
                                    <el-option label="部分退款" value="3"/>
                                    <el-option label="全额退款" value="4"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="货物处理：" prop="cargoHandler" :rules="[
                                  { required: true, message: '请选择货物处理方式', trigger: 'change' },
                                ]">
                                <el-select v-model="form.cargoHandler" style="width:100%;" :disabled="disabled">
                                    <el-option label="未退货" value="1"/>
                                    <el-option label="退货上架" value="2"/>
                                    <el-option label="退货退回" value="3"/>
                                    <el-option label="未发货" value="4" v-if="deliveryStatus == 1"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="退货备注">
                        <el-input type="textarea" v-model="form.remark" class="textarea" :disabled="disabled"></el-input>
                    </el-form-item>
                </div>
            </div>
        </el-form>

        <el-dialog title="退回原因管理" :visible.sync="dialogVisible" width="1200px" center top="90px" :append-to-body="true" lock-scroll>
            <div class="dialogVisible-content">
                <el-scrollbar style="height:100%;">
                    <backMoneyManage ref="backMoneyManage" :list="oneReason" :update="getReasonList"/>
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
        data: Object
    },
    data() {
        return {
            amount: (rule, value, callback) => {
                if (value == null) {
                    return callback(new Error('数量不能为空'));
                }
                if (value >= 0) {
                    callback();
                } else {
                    callback(new Error('必须大于等于0'));
                }
            },
            list: [],
            form: {
                refundType: 1,
                payBankId: '',
                payee: '',
                payeeAccount: '',
                refundReasonFirstId: '',
                refundReasonSecondId: '',
                refundReasonPlatform: '',
                refundPayType: '',
                cargoHandler: '',
                shippingFlag: '',
                products: [],
                refundMode: '',
                remark: ''
            },
            dialogVisible: false,
            info: {},
            oneReason: [],
            twoReason: [],
            platformReasonList: [],
            disabled: false,
            deliveryStatus: ''
        };
    },
    watch: {
        list(val) {
            this.form.products = val.map(item => {
                return {
                    orderProductId: item.orderProductId,
                    returnAmount: item.refundAmount,
                    returnPrice: item.refundPrice || undefined,
                    flag: true
                };
            });
        }
    },
    methods: {
        changeReason(val) {
            this.form.refundReasonSecondId = null;
            this.oneReason.forEach(item => {
                if (item.refundReasonId == val) {
                    this.twoReason = item.child;
                }
            });
        },
        submitForm(callback, sourceType) {
            const h = this.$createElement;
            if (this.disabled) {
                callback && callback(true);
                return;
            }
            this.$refs.form.validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.form, {
                        orderId: this.$route.query.orderServiceId,
                        refundMoney: this.refundMoney
                    });
                    // 如果是api拉取的提示
                    if (sourceType == 1) {
                        this.$msgbox({
                            title: '提示',
                            message: h('p', null, [
                                h(
                                    'span',
                                    null,
                                    '发现该订单为API获取的平台订单，是否退款的同时一并在平台取消订单,'
                                ),
                                h(
                                    'i',
                                    { style: 'color: red' },
                                    '注平台取消后将不不可再恢复'
                                )
                            ]),
                            showCancelButton: true,
                            confirmButtonText: '只退款不取消订单',
                            cancelButtonText: '退款并取消订单'
                        })
                            .then(() => {
                                params = Object.assign({}, params, {
                                    cancelFlag: 0
                                });
                                this.refundSave(params, callback);
                            })
                            .catch(() => {
                                params = Object.assign({}, params, {
                                    cancelFlag: 1
                                });
                                this.refundSave(params, callback);
                            });
                    } else {
                        this.refundSave(params, callback);
                    }
                    //
                } else {
                    return false;
                }
            });
        },
        refundSave(params, callback) {
            this.$api['order/refundSave'](params)
                .then(res => {
                    this.$message.success(res.msg);
                    this.update();
                    callback && callback(true);
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        resetForm() {
            this.$refs.form.resetFields();
        },
        //退款原因管理
        manage() {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.backMoneyManage.getReasonList();
            });
        },
        //获取平台退款原因
        getPlatformReasonList() {
            this.$api['order/refundGetReasonList']({
                platformId: this.$route.query.platformId
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
        // fromReview:为true表示从收退款记录的查看按钮进入
        getInfo(fromReview) {
            fromReview ? (this.disabled = true) : (this.disabled = false);
            this.$api[fromReview ? 'order/refundDetail' : 'order/refundInfo'](
                fromReview
                    ? {
                          orderRefundId: fromReview
                      }
                    : { orderId: this.$route.query.orderServiceId }
            )
                .then(res => {
                    if (fromReview) {
                        let {
                            orderNumSystem,
                            createTime,
                            orderPrice,
                            refundMoney,

                            refundMode,
                            payBankId,
                            payee,
                            payeeAccount,
                            refundReasonFirstId,
                            refundReasonSecondId,
                            refundReasonPlatform,
                            refundPayType,
                            cargoHandler,
                            remark,
                            shippingFlag,
                            products,
                            deliveryStatus
                        } = res.rows;
                        this.info = {
                            orderNumberSystem: orderNumSystem,
                            createOrderTime: createTime,
                            orderPrice: orderPrice,
                            retiredMoney: refundMoney
                        };

                        this.deliveryStatus = deliveryStatus;

                        this.form.refundMode = refundMode;
                        this.form.payBankId = payBankId;
                        this.form.payee = payee;
                        this.form.payeeAccount = payeeAccount;
                        this.form.refundReasonFirstId = refundReasonFirstId;
                        this.changeReason(refundReasonFirstId);
                        this.form.refundReasonSecondId = refundReasonSecondId;
                        this.form.refundReasonPlatform = refundReasonPlatform;
                        this.form.refundPayType = refundPayType + '';
                        this.form.cargoHandler = cargoHandler + '';
                        this.form.remark = remark;
                        this.form.shippingFlag = shippingFlag + '';
                        this.list = products;
                    } else {
                        this.info = res.rows;
                        this.list = res.rows.products;
                        this.deliveryStatus = res.rows.deliveryStatus;
                    }
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        ...mapActions('common', ['getBankList', 'initCommonList'])
    },
    computed: {
        refundMoney() {
            let products = this.form.products;
            if (!products.length) {
                return 0;
            }
            let val = products
                .map(item => item.returnPrice)
                .reduce((item, val) => {
                    return Number(item) + Number(val);
                });
            if (val > 0) return val;
            return 0;
        },
        ...mapGetters('common', ['bankList', 'paymentMethod'])
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
