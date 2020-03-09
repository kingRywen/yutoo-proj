<template lang="html">
    <!-- 采购下单 -->
    <div class="placeAnOrderForm">
        <el-form :model="form" ref="form" label-width="90px" size="mini">
            <div class="orderItem">
                <h3 class="olrderItem-title">采购单详情</h3>
                <yt-table :data="listA" :columns="columnsA" :border="true" :selection="false"/>
            </div>
            <!--  -->
            <div class="orderItem">
                <h3 class="olrderItem-title">采购产品</h3>
                <el-table :data="listB" border>
                    <el-table-column  prop="date" label="图片" align="center" width="100">
                        <template slot-scope="scope">
                            <el-tooltip  effect="light" placement="right">
                                <div slot="content">
                                     <img :src="scope.row.productImg" alt="" width="200" height="auto"/>
                                </div>
                                <img :src="scope.row.productImg" alt="" width="50" height="auto"/>
                            </el-tooltip>                            
                        </template>
                    </el-table-column>
                    <el-table-column  prop="purchaseRemark" label="备注" align="center">
                        <template slot-scope="scope">
    <p style="color: #f56c6c;">{{scope.row.purchaseRemark}}</p>
</template>    
                    </el-table-column>
                    <el-table-column  prop="customSku" label="自定义SKU" align="center" width="180"></el-table-column>
                    <el-table-column  prop="productBarCode" label="条形码" align="center"></el-table-column>
                    <el-table-column  prop="productTypeName" label="产品类型" align="center"></el-table-column>
                    <el-table-column  prop="productName" label="产品名称" align="center"></el-table-column>
                    <el-table-column  prop="productStateName" label="产品状态" align="center" width="100"></el-table-column>
                    <el-table-column  prop="variantPropertys" label="属性" align="center">
                        <template slot-scope="scope">
    <p v-for="item in scope.row.variantPropertys" :key="item.id">{{item.propertyName}}-{{item.propertyValue}}</p>
</template>
                    </el-table-column>
                    <el-table-column  prop="requirement" label="总需求数量" align="center" width="100"></el-table-column>
                    <el-table-column  prop="requirement" label="下单数量" align="center" width="100"></el-table-column>
                    <el-table-column  prop="supplierPrice" label="供应商报价" align="center" width="100"></el-table-column>
                    <el-table-column  prop="lastPurchaseAmount" label="上次采购价格" align="center"></el-table-column>
                    <el-table-column  prop="" label="下单价格" align="center">
                        <template slot-scope="scope">
    <el-form-item class="nomarleft" :prop="'products.' + scope.$index + '.productPrice'" :rules="[{ required: true, message: '价格不能为空', trigger: 'change' }]">
        <!-- -->
        <el-input type="number" :min="0" v-model.number="form.products[scope.$index].productPrice"></el-input>
    </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column  prop="" label="合计" align="center">
                        <template slot-scope="scope">
    <span>$</span>
    <span style="font-weight: 600; font-size: 14px;">{{ (form.products[scope.$index].productPrice)?format(scope.row.requirement * form.products[scope.$index].productPrice):0 }}</span>
</template>
                    </el-table-column>
                    <el-table-column  prop="" label="操作" align="center" fixed="right" width="120">
                        <template slot-scope="scope">
    <el-tooltip class="item" effect="dark" content="历史采购价" placement="bottom">
        <i class="iconfont icon-caigoujiage iconBtn" @click="historyPrice(scope.row)"></i>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="产品详情" placement="bottom">
        <i class="iconfont icon-chakan iconBtn" @click="goProductLibrary(scope.row.productInfo)"></i>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="删 除" placement="bottom">
        <i class="el-icon-delete iconBtn" v-if="listB.length>1" @click="del(scope.row,scope.$index)"></i>
    </el-tooltip>
</template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="orderItem">
                <h3 class="olrderItem-title">下单信息</h3>
                <el-table :data="listC" border>
                    <el-table-column  prop="settlementTimeTypeName" label="结算时间" align="center"></el-table-column>
                    <el-table-column  prop="accountPeriodList" label="账期" align="center" width="80"></el-table-column>
                    <el-table-column  prop="advanceTime" label="预计付款时间" align="center"></el-table-column>
                    <el-table-column  prop="" label="快递单号" align="center">
                        <template slot-scope="scope">
    <el-form-item class="nomarleft" prop="trackNumber">
        <el-input v-model="form.trackNumber"/>
    </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column  prop="" label="预计到货时间" align="center" width="130">
                        <template slot-scope="scope">
    <el-form-item class="nomarleft" prop="expectedArrivalTime" :rules="[
                               { required: true, message: '到货时间不能为空', trigger: 'change' }
                             ]">
        <div style="display:flex;">
            <el-input type="number" min="1" max="300" v-model="form.expectedArrivalTime"></el-input>
            <span>天</span>
        </div>
    </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column  prop="" label="运费" align="center" width="130">
                        <template slot-scope="scope">
    <el-form-item class="nomarleft" prop="freightAmount" :rules="[
                                { required: true, message: '运费不能为空', trigger: 'change' }]">
        <el-input type="number" v-model.number="form.freightAmount" min="0"></el-input>
    </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column  prop="" label="优惠总金额" align="center" width="130">
                        <template slot-scope="scope">
    <el-form-item class="nomarleft" prop="totalDiscount" :rules="[
                                { required: true, message: '金额不能为空', trigger: 'change' }]">
        <el-input type="number" v-model.number="form.totalDiscount" min="0"></el-input>
    </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column  prop="" label="交易号" align="center">
                        <template slot-scope="scope">
    <el-form-item class="nomarleft" prop="alipayTradeNumber" :rules="[
             { pattern:/^[a-zA-Z0-9_]{0,}$/,trigger: 'change', required: scope.row.purchaseType==2?true:false,message:'不能为空，不能包含中文'}
                                ]">
        <el-input v-model="form.alipayTradeNumber"/>
    </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column  prop="" label="采购平台订单号" align="center">
                        <template slot-scope="scope">
    <el-form-item class="nomarleft" prop="procurementPlatformNumber" :rules="[
             { pattern:/^[a-zA-Z0-9_]{0,}$/,trigger: 'change', required: scope.row.purchaseType==2?true:false,message:'不能为空，不能包含中文'}
                                ]">
        <el-input v-model="form.procurementPlatformNumber"/>
    </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column  label="支付账号" align="center">
                        <template slot-scope="scope">
    <el-form-item class="nomarleft" prop="alipayAccount" :rules="[
                                  {trigger: 'change', required: true,message:'请选择支付账号'}
                                ]">
        <!-- <el-input v-model="form.alipayAccount"/> -->
        <el-select v-model.number="form.alipayAccount" style="width:100%;">
            <el-option :label="item.name" :value="item.id" v-for="item in paymentList" :key="item.id"></el-option>
        </el-select>
    </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column  prop="" label="下单金额合计" align="center">
                        <template slot-scope="scope">
    <span style="color:red;font-weight: 600;font-size: 18px;">$ {{ format(total) || 0}}</span>
</template>
                    </el-table-column>
                </el-table>

            </div>
            <el-row style="padding-left:10px;">
                <el-col :span="3">
                    <el-form-item class="nomarleft">
                        <el-checkbox v-model="form.invoiceFlag" :true-label="1" :false-label="0">开增值税发票</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="2" style="margin-right:35px;">
                    <el-form-item class="nomarleft">
                        <el-checkbox v-model="form.payThePaymentFlag" :true-label="1" :false-label="0">是否运费到付</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="税率："
                        prop="taxRate"
                        :rules="[
                            { required: form.invoiceFlag?true:false, message: '税率不能为空', trigger: 'change' },
                        ]">
                        <p style="display:flex">                            
                            <el-input type="number" :min="0" v-model="form.taxRate"></el-input>
                            <span>%</span>
                        </p>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="打包备注：" prop="packageRemark">
                <el-input type="textarea" v-model="form.packageRemark" class="textarea"/>
            </el-form-item>
            <el-form-item label="订单备注：" prop="remark">
                <el-input type="textarea" v-model="form.remark" class="textarea"/>
            </el-form-item>
            <div style="text-align: center;margin:50px 0;">
                <!-- <el-button @click="resetForm('form')" size="medium">重 置</el-button> -->
                <el-button @click="preservation()" size="medium">保 存</el-button>
                <el-button type="primary" @click="submitForm('form')" size="medium" :loading="loading">提 交</el-button>
            </div>
        </el-form>

        <el-dialog :title="dialog.title"  :visible.sync="dialog.visible" width="1300px"  center>
            <historyRecord ref="historyRecord"/>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="dialog.visible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import historyRecord from '../../orderformList/components/historyRecord';
export default {
    data() {
        return {
            loading: false,
            listA: [],
            columnsA: [
                { value: 'purchaseNumber', label: '采购单号' },
                { value: 'supplierName', label: '供应商' },
                { value: 'purchaseTypeName', label: '采购类型' },
                { value: 'generateTime', label: '生单时间' },
                { value: 'warehouseName', label: '入库仓库' }
            ],
            listB: [],
            listC: [],
            form: {
                invoiceFlag: 0, //开增值税发票
                payThePaymentFlag: 0, //是否到付运费
                advanceTime: null,
                taxRate: '', //税率
                productAmount: null,
                products: [],
                trackNumber: null, //快递单号
                alipayAccount: null, //支付账号
                expectedArrivalTime: null, //预计到货时间
                freightAmount: null, //运费
                procurementPlatformNumber: null, //采购平台订单号
                alipayTradeNumber: null, //交易号
                remark: null, //订单备注
                packageRemark: null, //打包备注
                totalDiscount: null //优惠总金额
            },
            dialog: {
                title: '',
                visible: false
            },
            paymentList: []
            // exclusive: (rule, value, callback) => {
            //     if (!value) {
            //         console.log(value)
            //         return callback(new Error('不能为空'))
            //     }
            //     var reg = /^[a-zA-Z0-9_]{0,}$/
            //     if (!reg.test(value)) {
            //         return callback(new Error('须数字值，不能包含中文'))
            //     } else {
            //         return callback()
            //     }
            // }
        };
    },
    watch: {
        listB(val) {
            this.form.products = val.map(item => {
                return {
                    purchaseProductId: item.purchaseProductId,
                    productQuantity: item.requirement,
                    productPrice: item.supplierPrice
                };
            });
        }
    },
    computed: {
        total() {
            if (
                this.listB.length &&
                this.form.freightAmount != null &&
                this.form.totalDiscount != null
            ) {
                let arr = [];
                this.listB.forEach(item => {
                    this.form.products.forEach(citem => {
                        if (item.purchaseProductId == citem.purchaseProductId) {
                            if (citem.productPrice) {
                                let num = item.requirement * citem.productPrice;
                                arr.push(num);
                            }
                        }
                    });
                });
                if (arr.length) {
                    let result = arr.reduce((item, value) => {
                        return item + value;
                    });

                    let isResult =
                        result +
                        this.form.freightAmount -
                        this.form.totalDiscount;
                    return isResult > 0 ? isResult : 0;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        }
    },
    methods: {
        getDropdownBox() {
            this.$api['procurement/purchaseGetDropdownBox']({}).then(res => {
                this.paymentList = res.rows;
            });
        },
        handleChange(val) {
            console.log(val);
        },
        del(item, index) {
            this.$confirm('此操作将使该产品不下单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.form.products.splice(index, 1);
                    this.listB.splice(index, 1);
                })
                .catch(() => {
                    return false;
                });
        },
        goProductLibrary(productInfo) {
            let url;
            if (productInfo.storeProductId) {
                url = `/product.html#/product/platformList/viewProduct.html?productId=${
                    productInfo.productId
                }&categoryId=${productInfo.categoryId}&eleteFlag=${
                    productInfo.deleteFlag
                }&isshow=${productInfo.isshow}&deleteFlag=${
                    productInfo.deleteFlag
                }&productType=${productInfo.productType}&storeProductId=${
                    productInfo.storeProductId
                }&variant=${productInfo.variant}`;
            } else {
                url = `/product.html#/product/productList/viewProduct.html?productId=${
                    productInfo.productId
                }&isshow=${productInfo.isshow}`;
            }
            console.log(url);
            window.open(url);
        },
        historyPrice(item) {
            console.log(item);
            this.dialog.title = `历史采购记录 - ${item.productSku}`;
            this.dialog.visible = true;
            this.$nextTick(() => {
                this.$refs.historyRecord.getHistoryInfo(
                    0,
                    item.productId,
                    item.purchaseProductId
                );
            });
        },
        preservation() {
            localStorage.setItem(
                `purchase${this.$route.params.purchaseId}`,
                JSON.stringify(this.form)
            );
            this.$message.success('保存成功');
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.total > 0) {
                        this.loading = true;
                        let params = Object.assign({}, this.form, {
                            purchaseId: this.$route.params.purchaseId
                        });
                        params.productAmount = this.total;
                        params.invoiceFlag = params.invoiceFlag;
                        params.payThePaymentFlag = params.payThePaymentFlag
                            ? 1
                            : 0;
                        if (this.$route.params.purchaseOrderManageId) {
                            params[
                                'purchaseOrderManageId'
                            ] = this.$route.params.purchaseOrderManageId;
                        }
                        this.$api['procurement/lowerSingle'](params)
                            .then(res => {
                                this.loading = false;
                                this.$message.success(res.msg);
                                localStorage.removeItem(
                                    `purchase${this.$route.params.purchaseId}`
                                );
                                setTimeout(() => {
                                    this.$router.back(-1);
                                }, 1000);
                            })
                            .catch(err => {
                                this.loading = false;
                                this.$message.error(err.msg);
                            });
                    } else {
                        this.$message.error('总金额合计错误,请重新输入');
                    }
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        async getOrderFormInfo() {
            let success = false;

            await this.$api['procurement/lowerSinglePage']({
                purchaseId: this.$route.params.purchaseId,
                type: this.$route.params.type
            })
                .then(res => {
                    success = true;
                    this.listA = res.rows.list1;
                    this.listB = res.rows.products;
                    this.listC = res.rows.list2;

                    this.form.advanceTime = res.rows.list2[0].advanceTime;
                    this.form.taxRate = res.rows.taxInvoice;
                    this.form.invoiceFlag = res.rows.invoiceFlag;
                    this.form.expectedArrivalTime = res.rows.purchaseDay;
                })
                .catch(err => {
                    success = false;
                    this.$message.error(err.msg);
                });
            return success;
        },
        format(num) {
            var str = Number(num).toFixed(2);
            return str;
            // .split('')
            // .reverse()
            // .reduce((prev, next, index) => {
            //     return (index % 3 ? next : next + ',') + prev
            // })
        }
    },
    mounted() {
        this.getDropdownBox();
        if (this.$route.params.purchaseId) {
            this.getOrderFormInfo().then(success => {
                let info = localStorage.getItem(
                    `purchase${this.$route.params.purchaseId}`
                );
                if (success && info != null) {
                    this.form = Object.assign({}, JSON.parse(info));
                }
            });
        }
        let list = this.$route.params.productList;

        if (list) {
            let obj = list[0];
            this.form.invoiceFlag = obj.invoiceFlag;
            this.form.payThePaymentFlag = obj.payThePaymentFlag;
            this.form.taxRate = obj.taxRate;
            this.form.trackNumber = obj.trackNumber;
            this.form.alipayAccount = Number(obj.alipayAccount);
            this.form.expectedArrivalTime = obj.expectedArrivalTime;
            this.form.freightAmount = obj.freightAmount;
            this.form.procurementPlatformNumber = obj.procurementPlatformNumber;
            this.form.alipayTradeNumber = obj.alipayTradeNumber;
            this.form.remark = obj.remark;
            this.form.packageRemark = obj.packageRemark;
            this.form.totalDiscount = obj.totalDiscount;
        }
    },
    components: {
        historyRecord
    }
};
</script>

<style lang="scss">
.placeAnOrderForm {
    height: 100%;
    .orderItem {
        margin-bottom: 25px;
        .olrderItem-title {
            height: 40px;
            line-height: 40px;
            border: 1px solid #ebeef5;
            border-bottom: none;
            text-indent: 20px;
            background: #ececec;
            position: relative;
            bottom: -2px;
            font-weight: 600;
            font-size: 14px;
        }
    }
    .nomarleft {
        .el-form-item__content {
            margin-left: 0 !important;
        }
    }
    .textarea {
        textarea {
            height: 80px;
        }
    }
}
</style>
