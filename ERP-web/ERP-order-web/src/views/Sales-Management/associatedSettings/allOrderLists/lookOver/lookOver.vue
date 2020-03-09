<template>
    <div class="orderform-info">
        <div class="orderform—status">
            <h3>查看详情- {{ baseInfo.orderNumSystem }}</h3>
            <div class="status-warp">
                <p class="status">
                    订单状态：【
                    <span class="status" v-if="($route.query.orderType==1)">{{baseInfo.paymentStatusName}}；</span>

                    <span class="status" v-if="($route.query.orderType==1 && baseInfo.overseaPurchaseFlag!=1)">{{baseInfo.deliveryStatusName}}；</span>
                    <span class="status">{{baseInfo.orderStatusName}}</span>
                    】
                </p>
                <div class="statusBtn">
                    <div class="item">
                        <!-- 
                完结状态 baseInfo.endFlag =0为未完结 1为已完结
                     已完结状态1  啥都没有，优先级最高适用所有规则类型订单 
              
                付款状态 baseInfo.paymentStatus 
                          1-未付款 2-部分付款 3-已付款
                当付款状态为 未支付时1 ，按钮有（支付；付款状态）
                当为已支付时3，按钮有（退款）；
                当状态为部分付款时2，有（退款，支付）
                
                
                订单类型状态 baseInfo.orderType
                      1-客户订单 2-本地仓备库订单 3-海外仓库订单 4-FBA发货订单(通过Amazon获取) 5-FBA备货订单(通过ERP创建)
                  客户订单 => 才有支付，退款
                  本地仓备库订单2 ==> 只有审核，作废   
                  海外仓库订单3==>    只有审核，作废，有货先发  
                        -->
                        <el-button-group>
                            <el-button
                                plain
                                type="primary"
                                size="small"
                                @click="payment()"
                                v-if="(baseInfo.paymentStatus==1 || baseInfo.paymentStatus==2) && baseInfo.orderStatus!=4 && baseInfo.orderStatus!=3 && baseInfo.endFlag==0 && $route.query.orderType==1"
                            >支付</el-button>
                            <el-button plain type="primary" size="small" @click="refund()" v-if="(baseInfo.paymentStatus==2 || baseInfo.paymentStatus==3) && baseInfo.endFlag==0 && $route.query.orderType==1">退款</el-button>

                            <el-button plain type="primary" size="small" @click="backAndExchange()" v-if="(baseInfo.deliveryStatus==3 || baseInfo.deliveryStatus==2) && baseInfo.endFlag==0 && baseInfo.orderStatus!=4">申请退换货</el-button>

                            <el-button plain type="primary" size="small" @click="backAndExchange()">申请退换货</el-button>
                        </el-button-group>
                    </div>
                    <div class="item">
                        <el-button-group>
                            <!--
                                发货状态 deliveryStatus 1-未发货 2-发货中  3-部分发货 4-全部发货、
                                发货状态 deliveryStatus 1-未发货  2部分发货 3-全部发货、

                                当发货状态为未发货时1，操作有  （有货先发）；                            
                                当发货状态为部分发货时3，操作有 （申请退换货，有货先发）；
                                当发货状态为已发货时（部分，全部）3-4，操作有 （申请退换货）。
                                当发货状态为全部发货发货时4  只有（有货先发）                           
                            -->
                            <el-button
                                plain
                                type="primary"
                                size="small"
                                @click="prior()"
                                v-if="(baseInfo.deliveryStatus==1 || baseInfo.deliveryStatus==2) && baseInfo.endFlag==0 && baseInfo.orderStatus!=3 && baseInfo.orderStatus!=4 && $route.query.orderType!=2 && baseInfo.overseaPurchaseFlag!=1"
                            >有货先发</el-button>

                            <!--	当仓库未打单之前，订单都有修改订单的操作按钮（未完结、全部发货除外）。 intimidateState-->
                            <el-button
                                plain
                                type="primary"
                                size="small"
                                @click="editOrderForm()"
                                v-if="(baseInfo.intimidateState==1) && baseInfo.endFlag==0 && baseInfo.orderStatus!=3 && baseInfo.orderStatus!=4 &&$route.query.orderType==1 && baseInfo.deliveryStatusName !== '全部发货'"
                            >修改订单</el-button>
                        </el-button-group>
                    </div>
                    <div class="item">
                        <el-button-group>
                            <!--
                订单状态 orderStatus

                1-正常 2-待审核 3-作废（该订单作废，不可进行后续操作）
                4-锁定（锁定订单中的库存，该订单的所有产品不能进行后续操作）
                5-已完成 6-部分生成包裹单 7-已生成包裹单
                8-采购中 9-质检中 10-待发货  11-发货中 12-待入库  13-入库中 14-审核不通过

                当订单状态为正常时  1，  操作有 （锁定、作废）；
                当订单状态为待审核时 2， 操作有 （审核通过、作废、锁定）；                
                当订单状态为作废时  3，  操作有 （正常，审核通过）；
                当订单状态为锁定时  4，  操作有 （正常,作废，审核通过）；               
                            -->
                            <el-button plain type="primary" size="small" v-if="(baseInfo.orderStatus==2 ||baseInfo.orderStatus==3 || baseInfo.orderStatus==4) && baseInfo.endFlag==0" @click="handleState(1)">审核通过</el-button>

                            <el-button plain type="primary" size="small" v-if="(baseInfo.orderStatus==2 || baseInfo.orderStatus==1 || baseInfo.orderStatus==4 || baseInfo.orderStatus==8) && baseInfo.endFlag==0" @click="handleState(2)">作废</el-button>

                            <el-button plain type="primary" size="small" v-if="baseInfo.orderStatus==3 || baseInfo.orderStatus==4" @click="handleState(4)">正常</el-button>

                            <el-button
                                plain
                                type="primary"
                                size="small"
                                v-if="(baseInfo.orderStatus==2 || baseInfo.orderStatus==1 ||  baseInfo.orderStatus==8) && baseInfo.endFlag==0 && $route.query.orderType!=3 && $route.query.orderType!=2"
                                @click="handleState(3)"
                            >锁定</el-button>
                        </el-button-group>
                    </div>
                </div>
            </div>
        </div>
        <el-tabs tab-position="left" type="border-card" class="infotabs" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="one">
                <basicInfo :info="info" :update="baseInfoUpdate"/>
            </el-tab-pane>
            <el-tab-pane label="收退款记录" name="two" v-if="($route.query.orderType==1 || $route.query.orderType==2)">
                <paymentRecord ref="paymentRecord"/>
            </el-tab-pane>
            <el-tab-pane label="收发货记录" name="three">
                <collectEmit ref="collectEmit"/>
            </el-tab-pane>
            <el-tab-pane label="客户售后处理" name="four" v-if="($route.query.orderType==1)">
                <afterSaleHandle ref="afterSaleHandle"/>
            </el-tab-pane>
            <el-tab-pane label="客服日志" name="five" v-if="($route.query.orderType==1)">
                <customerService ref="customerService"/>
            </el-tab-pane>
            <el-tab-pane label="订单日志" name="six">
                <record ref="record"/>
            </el-tab-pane>
            <el-tab-pane label="订单利润" name="seven" v-if="($route.query.orderType==1)">
                <profit ref="profit"/>
            </el-tab-pane>
        </el-tabs>
        <!-- 弹框  -->
        <el-dialog :title="formComponentsInfo.title" :visible.sync="formComponentsInfo.isShow" :width="formComponentsInfo.width" center>
            <div class="dialogconten">
                <el-scrollbar style="height:100%;">
                    <component :is="formComponentsInfo.component" ref="form" :update="baseInfoUpdate" :data="orderEditData"></component>
                </el-scrollbar>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="submitForm">{{formComponentsInfo.statusText}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import profit from './components/profit';
import record from './components/record';
import customerService from './components/customerService';
import afterSaleHandle from './components/afterSaleHandle';
import collectEmit from './components/collectEmit';
import paymentRecord from './components/paymentRecord';
import basicInfo from './components/basicInfo';
import paymentForm from './components/paymentForm';
import refundForm from './components/refundForm';
import backAndExchangeForm from './components/backAndExchangeForm';
import priorForm from './components/priorForm';
import addEditOrderForm from '../components/addOrder';

export default {
    data() {
        return {
            orderEditData: {},
            formComponentsInfo: {
                isShow: false,
                title: '',
                width: '',
                component: '',
                statusText: ''
            },

            baseInfo: {},
            info: {},
            activeName: 'one'
        };
    },
    methods: {
        handleState(state) {
            // state 1正常   2作废   3锁定 4.作废订单设置为正常
            let str;
            if (state == 1) str = '确定审核通过吗, 是否继续?';
            if (state == 2) str = '确定作废该订单吗, 是否继续?';
            if (state == 3) str = '确定锁定吗, 是否继续?';
            if (state == 4) {
                str = '是否将此订单设为正常订单?';
                state = 1;
            }
            this.confirm(str, state);
        },
        confirm(str, state) {
            let self = this;
            this.$confirm(str, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        orderIds: Array.of(self.$route.query.orderServiceId),
                        state
                    };
                    self.$api['order/setOrderState'](params)
                        .then(res => {
                            self.$message.success(res.msg);
                            self.baseInfoUpdate();
                        })
                        .catch(err => {
                            self.$message.error(err.msg);
                        });
                })
                .catch(() => {
                    return false;
                });
        },
        handleClick(tab) {
            switch (tab.name) {
                case 'two':
                    this.$refs.paymentRecord.getList();
                    break;
                case 'three':
                    this.$refs.collectEmit.getList();
                    break;
                case 'four':
                    this.$refs.afterSaleHandle.getList();
                    break;
                case 'five':
                    this.$refs.customerService.getList();
                    break;
                case 'six':
                    this.$refs.record.getList();
                    break;
                case 'seven':
                    this.$refs.profit.getList();
                    break;
            }
        },
        //更新基础信息
        baseInfoUpdate() {
            this.getOrderInfo(this.$route.query.orderServiceId);
        },
        //支付
        payment() {
            this.handle('paymentForm', '订单支付');
            this.$nextTick(() => {
                this.$refs.form.getInfo();
                this.$refs.form.getBankList();
                this.$refs.form.initCommonList(3);
            });
        },
        //退款 fromReview:为true表示从收退款记录的查看按钮进入
        refund(fromReview) {
            this.handle('refundForm', '退款', '1100px', '确认退款');
            this.$nextTick(() => {
                this.$refs.form.getInfo(fromReview);
                this.$refs.form.getBankList();
                this.$refs.form.getReasonList();
                this.$refs.form.getPlatformReasonList();
            });
        },
        //退换货
        backAndExchange() {
            this.handle('backAndExchangeForm', '退换货', '1100px');
            this.$nextTick(() => {
                this.$refs.form.getInfo();
                this.$refs.form.getWarehouseList();
                this.$refs.form.initCountryList();
            });
        },
        //有货先发
        prior() {
            this.handle('priorForm', '有货先发', '1100px', '确认发货');
            this.$nextTick(() => {
                this.$refs.form.getInfo();
            });
        },
        //修改订单
        editOrderForm() {
            this.handle('addEditOrderForm', '修改订单', '1300px', '保存');
        },
        //确定
        submitForm() {
            if (this.formComponentsInfo.component === 'addEditOrderForm') {
                this.editOrder().then(() => {
                    this.baseInfoUpdate();
                });
                return;
            }
            this.$refs.form.submitForm(bool => {
                if (bool) {
                    this.baseInfoUpdate();
                    this.resetForm();
                }
            }, this.baseInfo.sourceType);
        },

        // 修改订单
        editOrder() {
            let vm = this;
            const {
                baseForm,
                receiverForm,
                senderForm,
                payForm,
                productInfoTbList
            } = vm.$refs.form;
            let params = {
                ...baseForm,
                ...receiverForm,
                ...senderForm,
                ...payForm
            };
            if (params.storeId) {
                params.storeId = params.storeId.slice(0).pop();
            }

            if (!productInfoTbList.length) {
                vm.$message.warning('请添加产品');
                vm.$refs.form.$el.parentNode.scrollTop = 0;
                return;
            }

            params.orderProductInfo = productInfoTbList.map(el => ({
                deliveryWarehouseId: el.stock,
                storeProductId: el.storeProductId,
                amount: el.num
            }));
            return vm.$refs.form
                .validForm()
                .then(valid => {
                    console.log(valid);
                    if (valid) {
                        return vm.$api['order/update'](params)
                            .then(data => {
                                vm.formComponentsInfo.isShow = false;
                                return data;
                            })
                            .catch(err => {});
                    } else {
                        vm.$message.warning('请填写必填项');
                        return;
                    }
                })
                .catch(err => {
                    vm.$message.warning('请填写必填项');
                });
        },
        //取消
        resetForm() {
            this.$refs.form.resetForm();
            this.formComponentsInfo.isShow = false;
        },
        //
        handle(component, title, width = '750px', statusText = '确定') {
            if (!component && !title) return;
            this.formComponentsInfo.isShow = true;
            this.formComponentsInfo.component = component;
            this.formComponentsInfo.width = width;
            this.formComponentsInfo.title = title;
            this.formComponentsInfo.statusText = statusText;
            if (component === 'addEditOrderForm') {
                // 修改订单
                this.$api['order/orderInfo']({
                    orderId: this.info.essentialInfo.orderId
                }).then(data => {
                    this.orderEditData = data.rows;
                });
            }

            // 支付和退款时带入信息
            if (component === 'paymentForm' || component === 'refundForm') {
                this.orderEditData = this.info.buyerInfo;
            }
        },
        //获取订单信息
        getOrderInfo(orderId) {
            this.$api['order/orderInfo']({ orderId })
                .then(res => {
                    this.baseInfo = res.rows.essentialInfo;
                    let obj = Object.assign({}, res.rows);
                    obj.buyerInfo['address'] =
                        obj.buyerInfo.cneeProvince +
                        obj.buyerInfo.cneeCity +
                        obj.buyerInfo.cneeArea +
                        obj.buyerInfo.region;

                    obj.senderInfo['address'] =
                        obj.buyerInfo.cneeProvince +
                        obj.buyerInfo.cneeCity +
                        obj.buyerInfo.cneeArea +
                        obj.buyerInfo.region;
                    this.info = obj;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        }
    },
    mounted() {
        if (this.$route.query.orderServiceId) {
            this.getOrderInfo(this.$route.query.orderServiceId);
        } else {
            this.$router.push({
                name: 'allOrderLists'
            });
        }
    },
    components: {
        profit,
        record,
        customerService,
        afterSaleHandle,
        collectEmit,
        paymentRecord,
        basicInfo,
        paymentForm,
        refundForm,
        backAndExchangeForm,
        priorForm,
        addEditOrderForm
    }
};
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
.orderform-info {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    top: 10px;
}
.orderform—status {
    h3 {
        font-size: 16px;
        // color:#67C23A;
        background: $bgColor;
        @extend .pad10;
        border-radius: 5px;
    }
    .status-warp {
        @include flex(row);
        justify-content: space-evenly;
        padding: 10px 0;
        .status {
            color: #409eff;
            line-height: 32px;
            font-weight: 800;
            font-size: 16px;
        }
        .statusBtn {
            @include flex(row);
            .item {
                margin-right: 25px;
            }
        }
    }
}
.infotabs {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    top: 88px;
    .el-tabs__content {
        overflow-y: auto !important;
        height: 100%;
    }
}
.dialogconten {
    height: 500px;
    overflow-y: auto;
}
.el-scrollbar__wrap {
    overflow-x: hidden;
}
</style>
