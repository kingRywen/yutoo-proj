<template>
    <!-- 查看详情，编辑，添加 -->
    <div class="look-info">
        <col-table :data="baseData" :config="baseConfig" style="margin-bottom:15px;" ref="coltable"></col-table>
        <!--  -->
        <div style="margin-bottom:15px;" v-if="isBtnShow">
            <el-button type="primary" size="small" @click="openPurchaseOrder">{{'选择'+title}}</el-button>
            <el-button type="danger" size="small" :disabled="!idslist.length" @click="batchDel">删 除</el-button>
        </div>
        <!--  -->

        <el-form :model="teableForm" ref="teableForm">
            <yt-table v-if="isOrderShow" :data="_orderData" :key="key" :columns="orderConfig" border :selection="selection" ref="table" @selectChange="selectChange">
                <template slot="right" v-if="isHandleShow">
                    <el-table-column label="借款金额" align="center" v-if="getType==1">
                        <template slot-scope="scope">
                            <el-form-item
                                :prop="'purchaseList.' + scope.$index + '.purchaseAmount'"
                                label-width="0"
                                :rules="[
                                        { required: true, message: '借款金额不能为空', trigger: 'blur' },                                        
                                    ]"
                            >
                                <el-input-number v-model="teableForm.purchaseList[ scope.$index].purchaseAmount" :precision="2" @change="changePurchaseAmount" size="small" controls-position="right" :min="1"></el-input-number>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" v-else>
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" content="删 除" placement="top">
                                <i class="iconBtn el-icon-delete" @click="del(scope.row,scope.$index)"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </template>
            </yt-table>
        </el-form>
        <!--  -->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="980px" append-to-body>
            <purchaseloan-order :title="title" :getType="getType" ref="purchase_loan_order" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="checked_select" :loading="purchaseloan_loading">确认选择</el-button>
            </span>
        </el-dialog>
        <!--  -->
        <el-dialog :title="outside.title" :visible.sync="outside.visible" :width="outside.width" @open="open" append-to-body>
            <component :is="outside.component" :key="indexKey" ref="outsideComp"></component>
        </el-dialog>
        <!--  -->
    </div>
</template>
<script>
/* eslint-disable */
import ColTable from './col-table';
import PurchaseloanOrder from './purchaseLoan-order';
export default {
    name: 'LookInfo',
    props: {
        baseData: {
            type: Object,
            default: () => {}
        },
        baseConfig: {
            type: Array,
            default: () => []
        },
        orderData: {
            type: Array,
            default: () => []
        },
        orderConfig: {
            type: Array,
            default: () => []
        },
        isBtnShow: {
            type: Boolean,
            default: false
        },
        isHandleShow: {
            type: Boolean,
            default: false
        },
        isOrderShow: {
            type: Boolean,
            default: true
        },
        selection: {
            type: Boolean,
            default: false
        },
        idName: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        getType: Number //1借款单获取  2报销获取     3  网络采购获取
    },
    components: { ColTable, PurchaseloanOrder },
    watch: {
        orderData: {
            handler(val) {
                this._orderData = [...val];
                this.key++;
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            idslist: [],
            _orderData: [],
            dialogVisible: false,
            outside: {
                title: '',
                visible: false,
                width: '',
                component: '',
                fnName: '',
                params: ''
            },
            indexKey: null,
            purchaseloan_loading: false,
            teableForm: {
                purchaseList: []
            },
            key: 1
        };
    },
    methods: {
        //借款金额改变时候
        changePurchaseAmount(val) {
            let loanAmount = this.teableForm.purchaseList
                .map(i => i.purchaseAmount)
                .reduce((j, v) => j + v);

            console.log(loanAmount);
            this.$emit('setloanAmount', loanAmount);
        },
        //
        checked_select() {
            if (this.title == '关联采购单') {
                if (this.$refs.purchase_loan_order.purchaseIds.length) {
                    this.purchaseloan_loading = true;
                    this.$api['finance/financePurchaseAdd']({
                        purchaseIds: this.$refs.purchase_loan_order.purchaseIds
                    })
                        .then(res => {
                            this.purchaseloan_loading = false;
                            this.dialogVisible = false;
                            this._orderData = res.rows;
                            //如果是借款单关联
                            if (this.getType == 1) {
                                //设置可用额度
                                this.$emit(
                                    'setQuota',
                                    res.rows[0] &&
                                        res.rows[0].totalAmount &&
                                        res.rows[0].totalAmount
                                );
                                //生成可输入借款金额,默认借款金额就是采购金额
                                this.teableForm.purchaseList = res.rows.map(
                                    item => {
                                        return {
                                            purchaseId: item.purchaseId,
                                            purchaseAmount: item.orderAmount
                                        };
                                    }
                                );
                                //计算借款总金额
                                let loanAmount = res.rows
                                    .map(i => i.orderAmount)
                                    .reduce((j, v) => j + v);
                                this.$emit('setloanAmount', loanAmount);
                            }
                        })
                        .catch(() => {
                            this.purchaseloan_loading = false;
                        });
                } else {
                    this.$message.warning('请先选择');
                }
            } else if (this.title == '关联借款单') {
                if (this.$refs.purchase_loan_order.loanList.length) {
                    this.purchaseloan_loading = true;
                    this.$api['finance/financeRepaymentLoanAdd']({
                        loanIds: this.$refs.purchase_loan_order.loanList
                    })
                        .then(res => {
                            this.purchaseloan_loading = false;
                            this.dialogVisible = false;
                            console.log(res.rows);
                            this._orderData = res.rows;
                        })
                        .catch(() => {
                            this.purchaseloan_loading = false;
                        });
                } else {
                    this.$message.warning('请先选择');
                }
            }
        },

        //
        $dialog({ title, visible, width, component, fnName, params }) {
            component().then(res => {
                this.indexKey = Math.random();
                this.outside.visible = visible;
                this.outside.title = title;
                this.outside.width = width || '980px';
                this.outside.fnName = fnName;
                this.outside.params = params;
                this.outside.component = res.default || '';
            });
        },
        //关联采购单
        openPurchaseOrder() {
            this.dialogVisible = true;
        },
        //单个删除
        // del(row, index) {
        //     this._orderData.splice(index, 1);
        // },
        //批量删除
        batchDel() {
            let nArr = [];
            this._orderData.forEach((i, index) => {
                let everp = this.idslist.findIndex(j => i[this.idName] == j);
                if (everp != -1) {
                    return;
                } else {
                    nArr.push(i);
                }
            });
            this._orderData = nArr;
            this.$refs.table.clearSelection();

            if (this.getType == 1) {
                let loanAmount;
                if (nArr.length) {
                    loanAmount = nArr
                        .map(i => i.orderAmount)
                        .reduce((j, v) => j + v);
                } else {
                    loanAmount = 0;
                }
                this.$emit('setloanAmount', loanAmount);
            }
        },
        selectChange(val) {
            this.idslist = val.map(i => i[this.idName]);
        },
        submitForm(cb) {
            const _this = this;
            this.$refs.coltable.submitForm(val => {
                //是否关联采购单
                if (_this._orderData.length) {
                    //如果是借款单
                    if (_this.getType == 1) {
                        //借款金额是否全部填写
                        _this.$refs.teableForm.validate(valid => {
                            if (valid) {
                                cb &&
                                    cb({
                                        ...val,
                                        loanAmount: _this.baseData.loanAmount,
                                        purchaseList:
                                            _this.teableForm.purchaseList
                                    });
                            } else {
                                return false;
                            }
                        });
                    } else {
                        cb &&
                            cb({
                                ...val,
                                purchaseList: _this._orderData.map(
                                    i => i[_this.idName]
                                )
                            });
                    }
                } else {
                    //如果是报销单添加，可以不管理采购单
                    if (_this.getType == 2) {
                        cb &&
                            cb({
                                ...val,
                                purchaseList: _this._orderData.map(
                                    i => i[_this.idName]
                                )
                            });
                        return;
                    }
                    _this.$message.warning('请选择' + _this.title);
                }
            });
        },
        resetForm() {
            this.$refs.coltable.resetForm();
        },
        open() {
            this.$nextTick(() => {
                try {
                    if (this.outside.fnName) {
                        this.$refs.outsideComp[this.outside.fnName](
                            this.outside.params
                        );
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        },
        //编辑还款
        editRepayment(repaymentAmount, remark) {
            this.$refs.coltable.ruleForm.repaymentAmount = repaymentAmount;
            this.$set(this.$refs.coltable.ruleForm, 'remark', remark);
        },
        //编辑借款
        editLoad(loanType, remark) {
            this.$set(this.$refs.coltable.ruleForm, 'loanType', loanType);
            this.$set(this.$refs.coltable.ruleForm, 'remark', remark);
        },
        //編輯报销
        editReimbursement(
            expenseAmount,
            alreadyRemark,
            applicantVoucherList,
            purchaseList
        ) {
            this.$set(
                this.$refs.coltable.ruleForm,
                'expenseAmount',
                expenseAmount
            );
            this.$set(this.$refs.coltable.ruleForm, 'remark', alreadyRemark);
            let _fileList = applicantVoucherList.map(url => {
                return {
                    url
                };
            });
            this.$set(this.$refs.coltable.ruleForm, 'fileList', _fileList);
            this._orderData = purchaseList;
            this.key++;
        }
    }
};
</script>
<style>
.look-info {
    padding: 0 10px;
    max-height: 560px;
    overflow-y: auto;
}
</style>
