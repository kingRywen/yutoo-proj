<template lang="html">
    <!-- 采购清单信息 -->
    <div class="procurementInfo">
        <div class="info marginbottom">
            <div class="statusAndbtn">
                <ul>
                    <li>
                        采购单详情: <span style="color:#009aff;font-size:14px;font-weight:600;">{{ state }}</span>
                    </li>
                    <li>
                        <p>系统SKU/自定义SKU/产品码：</p>
                        <el-input size="mini" class="skuOrCode_input"  clearable v-model="skuInput" @input="watchInput"/>
                    </li>
                    <li>
                        <el-button type="info" size="mini" class="btn" @click="location()" :disabled="!skuInput" icon="el-icon-search">搜索</el-button>
                        <el-button type="info" size="mini" class="btn" @click="print('打印采购单')">打印采购单（有图）</el-button>
                        <el-button type="info" size="mini" class="btn" @click="print('打印采购清单')">打印采购单（小图）</el-button>
                        <el-button type="info" size="mini" class="btn" @click="print('打印采购清单产品条码')">打印采购单产品条码</el-button>
                        <el-button type="info" size="mini" class="btn" @click="print('打印产品条码')">打印产品条码</el-button>
                    </li>
                </ul>
            </div>
            <yt-table :data="listA" :columns="columnsA" :border="true" :selection="false"/>
        </div>
        <!--  -->
        <div class="productList marginbottom">
            <div class="statusAndbtn">
                <ul>
                    <li>采购单产品</li>
                    <li>
                        <el-button type="info" size="mini" class="btn" @click="again()">选中产品打回重新采购</el-button>
                        <el-button type="info" size="mini" class="btn" @click="setProductState()">批量设置产品状态</el-button>
                        <p style="margin-left:130px;">已采购完成的产品：</p>
                        <el-button type="info" size="mini" class="btn" @click="display()" >显示</el-button>
                        <el-button type="info" size="mini" class="btn" @click="hide()" >隐藏</el-button>
                        <!-- <el-button type="info" size="mini" class="btn" @click="status=true">全部</el-button> -->
                    </li>
                </ul>
            </div>
            <yt-table :data="_listB" :columns="columnsB" :border="true" @handleSelectionChange="handleSelectionChange">
                <el-table-column label="操作" width="100" align="center" slot="right" fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="查看历史采购价" placement="bottom">
                            <i class="iconfont icon-caigoujiage iconBtn" @click="lookAtHistory(scope.row)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </yt-table>
        </div>
        <!--  -->
        <div class="remarks marginbottom">
            <span class="text">备注：</span>
            <div class="dynamicBox">
                <transition name="el-zoom-in-center" style="width:100%;">
                   <p class="content" v-if="!isModifyRemarksA">{{ remark }}</p>
                   <el-input v-else size="small" v-model.trim="remark" clearable type="textarea" autosize/>
               </transition>
            </div>
            <el-button style="height:32px;" plain icon="el-icon-edit"  @click="modifyRemarksA" size="small">{{ isModifyRemarksA ? '保 存': '修改备注' }}</el-button>
        </div>
        <!--  -->
        <div class="remarks marginbottom">
            <span class="text">打包备注：</span>
            <div class="dynamicBox">
                <transition name="el-zoom-in-center" style="width:100%;">
                   <p class="content" v-if="!isModifyRemarksB">{{ packRemark }}</p>
                   <el-input v-else size="small" v-model.trim="packRemark" clearable type="textarea" autosize/>
               </transition>
            </div>
            <el-button style="height:32px;" plain icon="el-icon-edit"  @click="modifyRemarksB" size="small">{{ isModifyRemarksB ? '保 存': '修改备注' }}</el-button>
        </div>
        <!--  -->
        <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.visible"
            :width="dialog.width"
            center>
            <component :is="dialog.component" ref="component"/>
            <span slot="footer" class="dialog-footer" v-if="dialog.btnshow">
              <el-button @click="resetForm()">取 消</el-button>
              <el-button type="primary" @click="submitForm()">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
import setStatusform from './setStatusform';
import historyRecord from '../../../orderformList/components/historyRecord';

export default {
    props: {
        listA: {
            type: Array,
            default: () => []
        },
        listB: {
            type: Array,
            default: () => []
        },
        state: [String],
        purchaseId: [String, Number],
        update: Function
    },
    data() {
        const isSet = () => {
            if (localStorage.getItem('isEndFlag') != undefined) {
                if (localStorage.getItem('isEndFlag') == 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        };
        return {
            columnsA: [
                { value: 'generateTime', label: '生单时间' },
                { value: 'endFlagName', label: '采购单状态' },
                // { value: 'purchaseAmount', label: '采购单金额' },
                { value: 'lowerSingleAmount', label: '下单总金额' },
                { value: 'procuctAmount', label: '产品总金额' },
                { value: 'toatlDiscount', label: '优惠总金额' },
                { value: 'freightAmount', label: '运费总金额' },
                { value: 'pinProductAmount', label: '销单产品总金额' }
            ],
            columnsB: [
                {
                    value: 'productImg',
                    label: '图片',
                    img: true,
                    style: {
                        width: 50,
                        height: 50
                    },
                    bulkyHeight: 180
                },
                { value: 'customSku', label: '自定义SKU', width: 140 },
                { value: 'productBarCode', label: '条形码' },
                { value: 'productTypeName', label: '产品类型' },

                { value: 'productName', label: '产品名称' },
                { value: 'productStateName', label: '产品状态' },
                {
                    children: 'variantPropertys',
                    label: '属性',
                    width: 140,
                    prop: {
                        key: 'propertyName',
                        value: 'propertyValue'
                    }
                },
                { value: 'supplierName', label: '供应商' },

                { value: 'availableStock', label: '可用库存' },
                { value: 'requirement', label: '总需求量' },
                { value: 'lowerSingleQuantity', label: '总下单量' },
                { value: 'pinQuantity', label: '总销单量' },

                { value: 'qualityInspection', label: '已质检量' },
                { value: 'warehousesQuantity', label: '入库数量' },
                { value: 'supplierPrice', label: '供应商报价' },
                { value: 'lowerSinglePrice', label: '下单价格' },

                { value: 'totalDiscount', label: '优惠金额' }
            ],
            isModifyRemarksA: false,
            isModifyRemarksB: false,
            remark: null,
            packRemark: null,
            afterRemark: null,
            afterPackRemark: null,
            status: isSet(),
            skuInput: null,
            selectArr: [],
            productIds: [],
            purchaseProductIds: [],
            dialog: {
                title: '',
                visible: false,
                component: null,
                width: '300px',
                btnshow: true
            },
            purchaseIds: [],
            isBack: false
        };
    },
    computed: {
        _listB() {
            if (this.status) {
                return this.listB;
            } else {
                return this.selectArr;
            }
        }
    },
    methods: {
        print(type) {
            let purchaseIds = this.listB.map(el => el.purchaseId);
            switch (type) {
                case '打印采购清单':
                    window.open(
                        `#/print?title=打印采购清单&purchaseIds=${purchaseIds.join(
                            ','
                        )}`
                    );
                    break;
                case '打印采购单':
                    window.open(
                        `#/print?title=打印采购单&purchaseIds=${purchaseIds.join(
                            ','
                        )}`
                    );
                    break;

                case '打印采购清单产品条码':
                    window.open(
                        `#/print?title=打印采购清单产品条码&purchaseIds=${purchaseIds.join(
                            ','
                        )}`
                    );
                    break;

                case '打印产品条码':
                    window.open(
                        `#/print?title=打印产品条码&purchaseIds=${purchaseIds.join(
                            ','
                        )}`
                    );
                    break;

                default:
                    break;
            }
        },
        watchInput(val) {
            if (!val) {
                this.status = true;
            }
        },
        location() {
            let self = this;
            this.status = false;
            this.selectArr = this.listB.filter(item => {
                let arr = new Set();
                if (item.customSku && typeof item.customSku == 'string') {
                    if (item.customSku.indexOf(self.skuInput) != -1) {
                        arr.add(item);
                    }
                }
                if (item.productSku && typeof item.productSku == 'string') {
                    if (item.productSku.indexOf(self.skuInput) != -1) {
                        arr.add(item);
                    }
                }
                if (item.productBarCode) {
                    if (item.productBarCode.indexOf(self.skuInput) != -1) {
                        arr.add(item);
                    }
                }
                return arr.size;
            });
            console.log(this.selectArr);
        },
        resetForm() {
            this.$refs.component.resetForm();
            this.dialog.visible = false;
        },
        submitForm() {
            if (this.dialog.component == 'setStatusform') {
                this.$refs.component.submitForm(data => {
                    let params = Object.assign({}, data, {
                        purchaseProductIds: this.purchaseProductIds
                    });
                    this.$api['procurement/setProductState'](params)
                        .then(res => {
                            this.$message.success(res.msg);
                            this.update();
                            this.dialog.visible = false;
                        })
                        .catch(err => {
                            this.$message.error(err.msg);
                        });
                });
                return;
            }
        },
        //查看历史采购价
        lookAtHistory(item) {
            this.dialog.visible = true;
            this.dialog.width = '1200px';
            this.dialog.component = 'historyRecord';
            this.dialog.btnshow = false;
            this.dialog.title = `历史采购记录-${item.purchaseNumber}`;
            this.$nextTick(() => {
                this.$refs.component.getHistoryInfo(
                    0,
                    item.productId,
                    item.purchaseId
                );
            });
        },
        //选中产品打回重新采购
        again() {
            if (this.purchaseProductIds.length) {
                let url, params;
                if (this.listB.length == this.purchaseProductIds.length) {
                    url = 'purchaseRepluse';
                    params = {
                        purchaseIds: this.purchaseIds
                    };
                    this.isBack = true;
                } else {
                    url = 'deleteProduct';
                    params = {
                        purchaseProductIds: this.purchaseProductIds
                    };
                }

                this.$prompt('请输入打回原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '打回原因不能为空'
                })
                    .then(({ value }) => {
                        this.$api['procurement/' + url](
                            Object.assign({}, params, {
                                repulseReason: value
                            })
                        )
                            .then(res => {
                                this.$message.success(res.msg);
                                if (this.isBack) {
                                    this.$router.back(-1);
                                    return;
                                }
                                this.update();
                            })
                            .catch(err => {
                                this.$message.error(err.msg);
                            });
                    })
                    .catch(() => {
                        return false;
                    });
            } else {
                this.$message.warning('请选择需要打回采购的产品数据');
            }
        },
        //批量设置产品状态
        setProductState() {
            if (this.productIds.length) {
                this.dialog.visible = true;
                this.dialog.title = '批量设置产品状态';
                this.dialog.component = 'setStatusform';
                this.dialog.width = '500px';
                this.dialog.btnshow = true;
            } else {
                this.$message.warning('请选择需要设置的产品状态数据');
            }
        },
        // 显示
        display() {
            this.status = true;
            localStorage.setItem('isEndFlag', 1);
        },
        // 隐藏
        hide() {
            this.status = false;
            this.selectArr = this.listB.filter(item => item.isEndFlag == 1);
            localStorage.setItem('isEndFlag', 0);
            console.log(this.listB);
            return this.selectArr;
        },
        handleSelectionChange(val) {
            console.log(val);
            this.productIds = val.map(item => item.productId);
            this.purchaseProductIds = val.map(item => item.purchaseProductId);

            this.purchaseIds = val.map(item => item.purchaseId);
        },
        modifyRemarksA() {
            this.isModifyRemarksA = !this.isModifyRemarksA;
            if (!this.isModifyRemarksA && this.remark != this.afterRemark) {
                this.amendRemark(1, this.remark);
            }
        },
        modifyRemarksB() {
            this.isModifyRemarksB = !this.isModifyRemarksB;
            if (
                !this.isModifyRemarksB &&
                this.packRemark != this.afterPackRemark
            ) {
                this.amendRemark(2, this.packRemark);
            }
        },
        amendRemark(state, remark) {
            this.$api['procurement/saveRemark']({
                purchaseId: +this.purchaseId,
                state,
                remark
            })
                .then(res => {
                    this.$message.success(res.msg);
                    this.getRemark();
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        getRemark() {
            this.$api['procurement/getRemark']({
                purchaseId: +this.purchaseId
            })
                .then(res => {
                    this.remark = res.rows.remark;
                    this.packRemark = res.rows.packRemark;

                    this.afterRemark = res.rows.remark;
                    this.afterPackRemark = res.rows.packRemark;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        }
    },
    mounted() {
        if (this.purchaseId) {
            this.getRemark();
        }
    },
    components: {
        setStatusform,
        historyRecord
    }
};
</script>

<style lang="scss" scoped>
// @import '@/assets/css/common.scss';
.procurementInfo {
    .marginbottom {
        margin-bottom: 25px;
    }

    .statusAndbtn {
        height: 45px;
        line-height: 45px;
        border: 1px solid #ebeef5;
        background: #ececec;
        border-bottom: none;
        text-indent: 15px;
        ul {
            display: flex;
            flex-direction: row;
            height: 100%;

            li {
                margin-right: 50px;
                display: flex;
                flex-direction: row;
                &:last-child {
                    line-height: 45px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .btn {
                    height: 32px;
                    display: inline-block;
                    // line-height: 32px;
                }
                .skuOrCode_input {
                    width: 180px;
                    height: 28px;
                    line-height: 28px;
                    margin-top: 8px;
                }
            }
        }
    }
    .remarks {
        display: flex;
        // border: 1px solid #ebeef5;
        // border-radius: 3px;
        // padding:8px;
        // background: $bgColor;
        .text {
            width: 80px;
            text-align: right;
            line-height: 32px;
        }
        .dynamicBox {
            min-width: 300px;
            max-width: 100%;
            margin-right: 10px;
            display: flex;
        }
        .content {
            line-height: 32px;
            width: 100%;
            word-wrap: break-word;
        }
    }
}
</style>
