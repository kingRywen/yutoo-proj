<template>
    <!-- 采购清单列表 -->
    <div class="PurchaseOrderList">
        <universal-layout class="Orderwarp" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :btnList="btnList" :pageNo="pageNo" :pageSize="pageSize" :total="total" @clickBtn="clickBtn">
            <template slot="search" class="cursearch">
                <!-- <search :searchList="searchList" @search="search" :updatedModel="updatedModel">
          <simpleForm slot="right"></simpleForm>
                </search>-->
                <SimpleForm class="searchcp" :search="true" storage-name="procurementListSearchStore2" :fields="searchField()" :form-data.sync="searchInfo" label-width="100px" @search="handleSearch" style="margin-bottom: 2px;" ref="searchForm"></SimpleForm>
            </template>
            <template slot="btnRight">
                <userDefined slot="right" :data="columns" :defaultData="defaultData" :selectCheck="selectCheck">自定义列表展示</userDefined>
            </template>
            <template slot="table">
                <yt-table :data="tableList" ref="table" :reserveSelection="reserveSelection" :columns="defaultData" :border="true" @handleSelectionChange="handleSelectionChange">
                    <el-table-column label="操作" width="150" align="center" slot="left">
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip class="item" effect="dark" content="采购清单详情" placement="bottom">
                                    <i class="iconfont icon-xieyixiangqing iconBtn" @click="purchaseDetailed(scope.row.purchaseId,scope.row.purchaseNumber)"></i>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="查看日志" placement="bottom">
                                    <i class="iconfont icon-chakan iconBtn" @click="lookJournal(scope.row.purchaseNumber)"></i>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="采购下单" placement="bottom">
                                    <i class="iconfont icon-ERP_xiadan iconBtn" @click="placeAnOrder(scope.row)" v-if="scope.row.lowerSingleFlag"></i>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="bottom">
                                    <i class="el-icon-bell iconBtn" v-if="scope.row.orderCancelFlag==1"></i>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </yt-table>
            </template>
            <router-view/>
        </universal-layout>
        <!--  -->
        <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" center>
            <div class="dialog-content">
                <component :is="dialog.component" ref="component" :data="productsList" :purchaseIds="purchaseIds" :typeShow="dialog.typeShow" :importNumberCallback="importNumberCallback"/>
            </div>
            <span slot="footer" v-if="!(dialog.component == 'productsImg' || dialog.component == 'ImportExpressNumber')">
                <el-button @click="resetForm()">取 消</el-button>
                <el-button
                    :loading="dialogLoading"
                    type="primary"
                    @click="submitForm()"
                >{{ (dialog.typeShow == 3 || dialog.typeShow == 4 || dialog.typeShow == 5 || dialog.typeShow == 7)?'导出Excel':( dialog.component=='Write' || dialog.component=='msg' )?'发送':'确 定'}}</el-button>
            </span>
        </el-dialog>
        <transition name="bounce">
            <div class="quickEntry" v-show="!quickEntryStatus && currentRouter($route.name)">
                <quickEntryTree @hide="hide" :data="treelist" @nodeClick="nodeClick" @empty="empty"/>
            </div>
        </transition>
        <div class="handleQuickEntryStatus">
            <el-button v-show="currentRouter($route.name)" type="primary" round icon="el-icon-d-arrow-left" class="showquickEntry" size="mini" @click="show"></el-button>
        </div>
        <!--  -->
    </div>
</template>

<script>
/* eslint-disable */
import log from './log';
import quickEntryTree from '@/components/quickEntryTree/quickEntryTree';
import Write from './Write';
import msg from './msg';
import { mapActions, mapGetters } from 'vuex';
import userDefined from '@/components/userDefined/userDefined.vue';
import productsImg from './productsImg.vue';
import paymentMethod from './paymentMethod.vue';
import ImportExpressNumber from './ImportExpressNumber.vue';
export default {
    data() {
        return {
            reserveSelection: 'purchaseId',
            dialogLoading: false,
            searchList: [],
            btnList: [
                {
                    name: '打回采购清单',
                    fn: () => {
                        if (this.purchaseIds.length) {
                            this.$prompt('请输入打回原因', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                inputPattern: /\S/,
                                inputErrorMessage: '打回原因不能为空'
                            })
                                .then(({ value }) => {
                                    this.$api['procurement/purchaseRepluse']({
                                        purchaseIds: this.purchaseIds,
                                        repulseReason: value
                                    })
                                        .then(res => {
                                            this.$message.success(res.msg);
                                            this.getList();
                                        })
                                        .catch(err => {
                                            this.$message.error(err.msg);
                                        });
                                })
                                .catch(() => {
                                    return false;
                                });
                        } else {
                            this.$message.warning('请选择需要打回的数据');
                        }
                    }
                },
                {
                    name: '批量打印',
                    children: [
                        { name: '打印采购清单' },
                        { name: '打印采购清单产品条码' },
                        { name: '打印产品条码' },
                        { name: '打印入库单' }
                    ]
                },
                {
                    name: '批量设置采购清单状态',
                    children: [
                        { name: '加急' },
                        { name: '取消加急' },
                        { name: '完结' },
                        { name: '未完结' }
                    ]
                },
                {
                    name: '批量设置',
                    children: [
                        { name: '修改采购清单采购人员' },
                        { name: '设置付款方式' }
                    ]
                },
                {
                    name: '批量导出',
                    children: [
                        { name: '当前条件导出采购清单有图' },
                        { name: 'sku采购总额报表' },
                        { name: 'sku采购数量报表' },
                        { name: 'sku采购进度报表' },
                        { name: '采购下单记录' },
                        { name: '按供应商导出采购总额报表' }
                    ]
                },
                {
                    name: '导入快递单号',
                    fn: () => {
                        this.dialog.title = '导入快递单号';
                        this.dialog.visible = true;
                        this.dialog.width = '1000px';
                        this.dialog.component = 'ImportExpressNumber';
                        this.$nextTick(() => {
                            this.$refs.component.resetForm();
                        });
                    }
                }
            ],
            tableList: [],
            columns: [
                {
                    value: 'purchaseNumber',
                    label: '采购清单号',
                    width: 130
                },
                {
                    value: 'productImg',
                    label: '图片',
                    badge(scope) {
                        return scope.row.urgentFlag === 1 ? '加急' : null;
                    },
                    img: true,
                    width: 110,
                    style: {
                        width: 50,
                        height: 50
                    },
                    bulkyHeight: 180
                },
                {
                    label: 'sku数',
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                size="mini"
                                onClick={this.looksku.bind(this, scope.row)}
                                style={{
                                    color: '#30CC7B',
                                    fontSize: '12px',
                                    fontWeight: 700
                                }}
                            >
                                {scope.row.skuQuantity}
                            </el-button>
                        );
                    }
                },
                {
                    value: 'warehouseName',
                    label: '采购仓库'
                },
                {
                    value: 'generateTime',
                    label: '生单时间',
                    width: 140
                },
                {
                    value: 'purchasersName',
                    label: '采购人员'
                },
                {
                    value: 'purchaseStateName',
                    label: '采购清单状态',
                    width: 100
                },
                {
                    value: 'endFlagName',
                    label: '完结状态'
                },
                {
                    label: '供应商',
                    render: (h, scope) => {
                        if (scope.row.suppliers.supplierWebsite) {
                            return (
                                <a
                                    style={{
                                        color: '#30CC7B',
                                        textDecoration: 'none'
                                    }}
                                    href={scope.row.suppliers.supplierWebsite}
                                    target="_blank"
                                >
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 700
                                        }}
                                    >
                                        {scope.row.suppliers.supplierName}
                                    </span>
                                </a>
                            );
                        } else {
                            return (
                                <span>{scope.row.suppliers.supplierName}</span>
                            );
                        }
                    }
                },
                {
                    value: 'purchaseTypeName',
                    label: '采购类型'
                },
                {
                    value: 'estimatePrice',
                    label: '预计金额'
                },
                {
                    value: 'actualPrice',
                    label: '实际金额'
                },
                {
                    value: 'printingTime',
                    label: '打单时间'
                },
                {
                    value: 'lastOrderTime',
                    label: '下单时间',
                    width: 140
                },
                {
                    value: 'endTime',
                    label: '完结时间',
                    width: 140
                },
                {
                    value: 'developName',
                    label: '开发人员'
                },
                {
                    value: 'printFlagName',
                    label: '打印状态'
                },
                {
                    value: 'stillNeedQuantity',
                    label: '还需数量'
                },
                {
                    value: 'expectedArrivalTime',
                    label: '预计到货时间',
                    width: 160
                },
                {
                    label: '供应商采购点',
                    width: 120,
                    render: (h, scope) => {
                        return <span>{scope.row.suppliers.purchasePoint}</span>;
                    }
                },
                {
                    label: '付款方式',
                    width: 120,
                    render: (h, scope) => {
                        return <span>{scope.row.paymentMethodName}</span>;
                    }
                },
                {
                    label: '供应商qq',
                    width: 120,
                    render: (h, scope) => {
                        return (
                            <a
                                href={`http://wpa.qq.com/msgrd?v=3&uin=${
                                    scope.row.suppliers.contactQq
                                }&site=qq&menu=yes`}
                                target="_blank"
                            >
                                <el-button
                                    type="warning"
                                    icon="iconfont icon-qq"
                                    size="mini"
                                    plain
                                >
                                    QQ交谈
                                </el-button>
                            </a>
                        );
                    }
                },
                {
                    label: '供应商邮箱',
                    width: 120,
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="success"
                                icon="iconfont icon-email"
                                size="mini"
                                plain
                                onClick={this.sendMail.bind(this, scope.row)}
                            >
                                发送邮件
                            </el-button>
                        );
                    }
                },
                {
                    label: '供应商短信',
                    width: 120,
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="info"
                                icon="iconfont icon-14"
                                size="mini"
                                plain
                                onClick={this.sendMsg.bind(this, scope.row)}
                            >
                                发送消息
                            </el-button>
                        );
                    }
                },
                {
                    label: '供应商旺旺',
                    width: 120,
                    render: (h, scope) => {
                        return (
                            <a
                                target="_blank"
                                href="http://amos.alicdn.com/msg.aw?v=2&uid=swcj_jsxf&site=cnalichn&s=10&charset=UTF-8"
                            >
                                <el-button
                                    type="primary"
                                    icon="iconfont icon-msg"
                                    size="mini"
                                    plain
                                >
                                    发送消息
                                </el-button>
                            </a>
                        );
                    }
                }
            ],
            defaultData: [],
            total: 0,
            pageNo: 1,
            pageSize: 10,
            dialog: {
                title: '',
                visible: false,
                width: '1100px',
                component: '',
                typeShow: 1
            },
            purchaseIds: [],
            treelist: [],
            quickEntryStatus: true,
            searchInfo: {},
            productsList: [],
            isCondition: {},
            accountPeriodList: []
        };
    },
    mounted() {
        this.getList(1)
        if (localStorage.getItem('procurementList2')) {
            let arr = localStorage.getItem('procurementList2');
            this.defaultData = this.columns.filter(
                (item, index) => arr.indexOf(item.label) >= 0
            );
        } else {
            this.defaultData = this.columns;
        }
        this.getAccountPeriod();
    },
    computed: {
        ...mapGetters('common', [
            'allHandleUser',
            'purchaseList',
            'supplierList',
            'warehouseList'
        ])
    },
    watch: {
        $route(to, from) {
            this.getList();
        }
    },
    methods: {
        handleSearch() {
            this.$refs.table.clearSelection();
            this.$nextTick(() => {
                this.pageNo = 1;
                this.getList('search');
            });
        },
        searchField() {
            let vm = this;
            return [
                {
                    label: '供应商',
                    name: 'supplierId',
                    type: 'select',
                    options: this.supplierList
                },
                {
                    label: '账期',
                    name: 'accountPeriod',
                    type: 'select',
                    options: this.accountPeriodList
                },
                {
                    label: '仓库',
                    name: 'warehouseId',
                    type: 'select',
                    options: this.warehouseList
                },
                {
                    label: '采购点',
                    name: 'purchaseAddress',
                    type: 'select',
                    options: this.purchaseList
                },
                {
                    label: '采购人员',
                    name: 'purchasersId',
                    type: 'select',
                    options: this.allHandleUser.procurement
                },
                {
                    label: '开发人员',
                    name: 'developId',
                    type: 'select',
                    options: this.allHandleUser.delevlop
                },
                {
                    label: '采购单状态',
                    name: 'purchaseState',
                    type: 'select',
                    default: true,

                    options: [
                        { label: '正常', value: 1 },
                        { label: '超期', value: 2 },
                        { label: '异常', value: 3 }
                    ]
                },
                {
                    label: '下单状态',
                    name: 'lowerSingleState',
                    type: 'select',
                    default: true,

                    options: [
                        { label: '已下单', value: 2 },
                        { label: '未下单', value: 1 }
                    ]
                },
                {
                    label: '打印状态',
                    name: 'printState',
                    type: 'select',
                    default: true,
                    options: [
                        { label: '已打印', value: 1 },
                        { label: '未打印', value: 0 }
                    ]
                },
                {
                    label: '采购类型',
                    name: 'purchaseType',
                    type: 'select',
                    default: true,
                    options: [
                        { label: '市场采购', value: '1' },
                        { label: '网络采购', value: '2' },
                        { label: '工厂采购', value: '3' },
                        { label: '自主生产', value: '4' }
                    ]
                },
                {
                    label: '产品状态',
                    name: 'productState',
                    type: 'select',
                    default: true,
                    options: [
                        { label: '正常', value: 1 },
                        { label: '仅批量', value: 2 },
                        { label: '暂时缺货', value: 3 },
                        { label: '停产 ', value: 4 },
                        { label: '锁定 ', value: 5 },
                        { label: '清库 ', value: 6 }
                    ]
                },
                {
                    label: '有无不良品',
                    name: 'undesirableProductsFlag',
                    type: 'select',
                    options: [
                        { label: '有', value: 1 },
                        { label: '无', value: 0 }
                    ]
                },
                {
                    label: '追踪号',
                    name: 'trackNumber',
                    type: 'input'
                },
                {
                    label: '下单号',
                    name: 'lowerSingleNumber',
                    type: 'input'
                },
                {
                    label: '销单时间',
                    name: 'pinTime',
                    type: 'datetimerange'
                },
                {
                    label: '完结时间',
                    name: 'time',
                    type: 'datetimerange'
                },
                {
                    label: '下单时间',
                    name: 'lowerSingleTime',
                    type: 'datetimerange'
                },
                {
                    label: '生单时间',
                    name: 'generateTime',
                    type: 'datetimerange'
                },
                {
                    label: '产品条形码',
                    name: 'productBarCode',
                    type: 'input'
                },
                {
                    label: '是否完结',
                    name: 'isEnd',
                    type: 'select',

                    options: [
                        { label: '是', value: 1 },
                        { label: '否', value: 0 }
                    ]
                },
                {
                    label: '采购平台订单号',
                    name: 'procurementPlatformNumber',
                    default: true,
                    type: 'input'
                },
                {
                    label: '采购/系统单号',
                    name: 'purchaseNumber',
                    type: 'input'
                },
                {
                    label: '付款类型/方式',
                    name: 'paymentMethod',
                    type: 'select',
                    default: true,
                    options: [
                        { label: '现金付款', value: 1 },
                        { label: '网络在线付款', value: 2 },
                        { label: '转账付款', value: 3 },
                        { label: '阿里账期付款', value: 4 }
                    ]
                },
                {
                    label: '欠货天数(开始)',
                    name: 'enoughDayStart',
                    type: 'input'
                },
                {
                    label: '欠货天数(结束)',
                    name: 'enoughDayEnd',
                    type: 'input'
                },

                {
                    label: '产品数量(开始)',

                    name: 'productQuantityStart',
                    type: 'input'
                },
                {
                    label: '产品数量(结束)',
                    name: 'productQuantityEnd',
                    type: 'input'
                },

                {
                    label: '产品金额(开始)',
                    name: 'productAmountStart',
                    type: 'input'
                },
                {
                    label: '产品金额(结束)',
                    name: 'productAmountEnd',
                    type: 'input'
                }
            ];
        },
        clickBtn(val) {
            switch (val) {
                case '加急':
                    this.setState(this.purchaseIds, 1, 'setUrgentState');
                    break;
                case '取消加急':
                    this.setState(this.purchaseIds, 0, 'setUrgentState');
                    break;
                case '完结':
                    this.setState(this.purchaseIds, 1, 'setEndState');
                    break;
                case '未完结':
                    this.setState(this.purchaseIds, 0, 'setEndState');
                    break;
                case '设置付款方式':
                    this.setVariedState(1, val);
                    break;
                case '修改采购清单采购人员':
                    this.setVariedState(2, val);
                    break;
                case '打印采购清单产品条码':
                    if (!this.purchaseIds.length) {
                        this.$message.warning('请选择要打印条码的产品');
                        return;
                    }
                    window.open(
                        `#/print?title=打印采购清单产品条码&purchaseIds=${this.purchaseIds.join(
                            ','
                        )}`
                    );
                    break;
                case '打印产品条码':
                    if (!this.purchaseIds.length) {
                        this.$message.warning('请选择要打印条码的产品');
                        return;
                    }
                    window.open(
                        `#/print?title=打印产品条码&purchaseIds=${this.purchaseIds.join(
                            ','
                        )}`
                    );
                    break;

                case '打印采购清单':
                    if (!this.purchaseIds.length) {
                        this.$message.warning('请选择要打印的产品');
                        return;
                    }
                    window.open(
                        `#/print?title=打印采购清单&purchaseIds=${this.purchaseIds.join(
                            ','
                        )}`
                    );
                    break;

                case '打印入库单':
                    if (!this.purchaseIds.length) {
                        this.$message.warning('请选择要打印的产品');
                        return;
                    }
                    window.open(
                        `#/print?title=打印入库单&purchaseIds=${this.purchaseIds.join(
                            ','
                        )}`
                    );
                    break;

                case '当前条件导出采购清单有图':
                    let obj = this.searchInfo;
                    let data = {};
                    if (Object.keys(obj).length) {
                        for (let key in obj) {
                            if (
                                key == 'pinTime' &&
                                data[key] != null &&
                                data[key] instanceof Array &&
                                data[key].length
                            ) {
                                obj['pinStartTime'] = data[key][0];
                                obj['pinEndTime'] = data[key][1];
                                continue;
                            }
                            if (
                                key == 'time' &&
                                data[key] != null &&
                                data[key] instanceof Array &&
                                data[key].length
                            ) {
                                obj['endStartTime'] = data[key][0];
                                obj['endEndTime'] = data[key][1];
                                continue;
                            }
                            if (
                                key == 'lowerSingleTime' &&
                                data[key] != null &&
                                data[key] instanceof Array &&
                                data[key].length
                            ) {
                                obj['lowerSingleStartTime'] = data[key][0];
                                obj['lowerSingleEndTime'] = data[key][1];
                                continue;
                            }
                            if (
                                key == 'generateTime' &&
                                data[key] != null &&
                                data[key] instanceof Array &&
                                data[key].length
                            ) {
                                obj['generateStartTime'] = data[key][0];
                                obj['generateEndTime'] = data[key][1];
                                continue;
                            }
                            if (
                                obj[key] === null ||
                                obj[key] === undefined ||
                                obj[key] === ''
                            ) {
                                continue;
                            } else {
                                data[key] = obj[key];
                            }
                        }
                    }
                    if (Object.keys(data).length) {
                        console.log(data);
                        this.$api['procurement/currentConditions'](data).then(
                            res => {
                                window.location.href = res.path;
                            }
                        );
                    } else {
                        this.$message.warning('至少需要一个搜索条件才能导出');
                    }
                    break;
                case 'sku采购总额报表':
                    this.setVariedState(3, val);
                    break;
                case 'sku采购数量报表':
                    this.setVariedState(4, val);
                    break;
                case 'sku采购进度报表':
                    this.setVariedState(5, val);
                    break;
                case '采购下单记录':
                    let purchaseIds;
                    if (this.purchaseIds.length) {
                        purchaseIds = this.purchaseIds;
                    } else {
                        purchaseIds = this.tableList.map(
                            item => item.purchaseId
                        );
                    }
                    this.$api['procurement/purchaseLowerSingle']({
                        purchaseIds
                    }).then(res => {
                        window.location.href = res.path;
                    });
                    break;
                case '按供应商导出采购总额报表':
                    this.setVariedState(7, val);
                    break;
                default:
                    break;
            }
        },
        importNumberCallback(val) {
            if (val) {
                this.dialog.visible = false;
            }
        },
        //设置是否加急状态, //设置是否完结状态
        setState(purchaseIds, state, url) {
            if (purchaseIds.length) {
                this.$api['procurement/' + url]({
                    purchaseIds,
                    state
                })
                    .then(res => {
                        this.$message.success(res.msg);
                        this.getList();
                    })
                    .catch(err => {
                        this.$message.error(res.msg);
                    });
            } else {
                this.$message.warning('请先选择需要操作的采购单数据');
            }
        },
        //批量设置设置付款方式  //批量修改采购清单采购人员
        setVariedState(typeShow, val) {
            if (
                typeShow == 3 ||
                typeShow == 4 ||
                typeShow == 5 ||
                typeShow == 7
            ) {
                this.dialog.title = val;
                this.dialog.visible = true;
                this.dialog.width = '480px';
                this.dialog.component = 'paymentMethod';
                this.dialog.typeShow = typeShow;
                this.$nextTick(() => {
                    this.$refs.component.resetForm();
                });
                return;
            }
            if (this.purchaseIds.length) {
                this.dialog.title = val;
                this.dialog.visible = true;
                this.dialog.width = '480px';
                this.dialog.component = 'paymentMethod';
                this.dialog.typeShow = typeShow;
                this.$nextTick(() => {
                    this.$refs.component.resetForm();
                });
            } else {
                this.$message.warning('请选择需要批量设置的数据');
            }
        },
        updatedModel(val) {
            this.isCondition = val;
        },
        empty() {
            delete this.searchInfo['keyId'];
            delete this.searchInfo['countState'];
            this.$message.success('产品类目搜索筛选状态已重置');
        },
        //sku查看
        looksku(row) {
            this.dialog.title = 'SKU图片';
            this.dialog.visible = true;
            this.dialog.component = 'productsImg';
            this.dialog.width = '600px';
            this.productsList = row.products;
        },
        selectCheck(val) {
            console.log(val);
            this.defaultData = this.columns.filter(
                (item, index) => val.indexOf(item.label) >= 0
            );

            let storage = this.defaultData.map(i => i.label);
            localStorage.setItem('procurementList2', JSON.stringify(storage));
        },
        //发短信
        sendMsg(row) {
            console.log(row);
            this.dialog.title = '发送短信';
            this.dialog.visible = true;
            this.dialog.width = '680px';
            this.dialog.component = 'msg';
            this.$nextTick(() => {
                this.$refs.component.resetForm();
            });
        },
        //发邮件
        sendMail(row) {
            console.log(row);
            this.dialog.title = '发送邮件';
            this.dialog.visible = true;
            this.dialog.width = '1100px';
            this.dialog.component = 'Write';
            this.$nextTick(() => {
                this.$refs.component.resetForm();
            });
        },
        currentRouter(name) {
            return name == 'procurementList' ? true : false;
        },
        nodeClick(listCount) {
            this.searchInfo = Object.assign({}, this.searchInfo, listCount);
            this.getList('search');
        },
        hide() {
            this.quickEntryStatus = true;
        },
        show() {
            this.quickEntryStatus = false;
            this.getTreeData();
        },
        resetForm() {
            this.dialog.visible = false;
            this.$refs.component.resetForm();
        },
        submitForm() {
            let title = this.dialog.title;
            switch (title) {
                case '操作日志':
                    this.dialog.visible = false;
                    break;
                case '设置付款方式' || '修改采购清单采购人员':
                    this.$refs.component.submitForm(val => {
                        if (val) {
                            this.dialog.visible = false;
                            this.getList();
                        }
                    });
                    break;
                case '修改采购清单采购人员':
                    this.$refs.component.submitForm(val => {
                        if (val) {
                            this.dialog.visible = false;
                            this.getList();
                        }
                    });
                    break;
                case 'sku采购总额报表':
                    this.$refs.component.submitForm(val => {
                        if (val) this.dialog.visible = false;
                    });
                    break;
                case 'sku采购数量报表':
                    this.$refs.component.submitForm(val => {
                        if (val) this.dialog.visible = false;
                    });
                    break;
                case 'sku采购进度报表':
                    this.$refs.component.submitForm(val => {
                        if (val) this.dialog.visible = false;
                    });
                    break;
                case '按供应商导出采购总额报表':
                    this.$refs.component.submitForm(val => {
                        if (val) this.dialog.visible = false;
                    });
                    break;
                case '发送短信':
                    this.$refs.component.submitForm(() => {
                        this.dialog.visible = false;
                    });
                    break;
                case '发送邮件':
                    this.$refs.component.submitForm(val => {
                        this.dialog.visible = false;
                    });
                    break;
                default:
                    break;
            }
        },
        lookJournal(purchaseNumber) {
            console.log(purchaseNumber);
            this.dialog.visible = true;
            this.dialog.title = '操作日志';
            this.dialog.width = '1100px';
            this.dialog.component = 'log';
            this.$nextTick(() => {
                this.$refs.component.getLogList(purchaseNumber);
            });
        },
        // 采购下单
        placeAnOrder(item) {
            this.$router.push({
                name: 'placeAnOrder',
                params: {
                    purchaseId: item.purchaseId,
                    type: 'save'
                }
            });
        },
        // 采购清单详情
        purchaseDetailed(purchaseId, purchaseNumber) {
            this.$router.push({
                name: 'purchaseDetailed',
                query: {
                    purchaseId,
                    purchaseNumber
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getList('search');
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getList('search');
        },
        handleSelectionChange(selection) {
            console.log(selection);
            this.purchaseIds = selection.map(item => item.purchaseId);
        },
        //获取列表数据
        getList(val) {
            let self = this;
            val === 1 ? (self.pageNo = 1) : self.pageNo;
            let params = {
                sortOrder: 'asc',
                pageSize: self.pageSize,
                pageNumber: self.pageNo
            };
            if (val == 'search') {
                let data = { ...this.searchInfo };
                let obj = {};
                for (let key in data) {
                    if (
                        key == 'pinTime' &&
                        data[key] != null &&
                        data[key] instanceof Array &&
                        data[key].length
                    ) {
                        obj['pinStartTime'] = data[key][0];
                        obj['pinEndTime'] = data[key][1];
                        continue;
                    }
                    if (
                        key == 'time' &&
                        data[key] != null &&
                        data[key] instanceof Array &&
                        data[key].length
                    ) {
                        obj['endStartTime'] = data[key][0];
                        obj['endEndTime'] = data[key][1];
                        continue;
                    }
                    if (
                        key == 'lowerSingleTime' &&
                        data[key] != null &&
                        data[key] instanceof Array &&
                        data[key].length
                    ) {
                        obj['lowerSingleStartTime'] = data[key][0];
                        obj['lowerSingleEndTime'] = data[key][1];
                        continue;
                    }
                    if (
                        key == 'generateTime' &&
                        data[key] != null &&
                        data[key] instanceof Array &&
                        data[key].length
                    ) {
                        obj['generateStartTime'] = data[key][0];
                        obj['generateEndTime'] = data[key][1];
                        continue;
                    }
                    if (
                        data[key] !== '' &&
                        data[key] != null &&
                        data[key] != undefined
                    ) {
                        obj[key] = data[key];
                    }
                }

                params = Object.assign({}, params, obj);
            }
            self.$api['procurement/purchaseList'](params).then(res => {
                self.tableList = res.rows;
                self.pageNo = res.pageNo;
                self.pageSize = res.pageSize;
                self.total = res.total;
            });
        },
        getTreeData() {
            this.$api['procurement/purchaseListCount']()
                .then(res => {
                    let obj = res.rows;
                    let list = [];
                    if (!typeof obj == 'object') return;
                    for (let key in obj) {
                        switch (key) {
                            case 'waitPurchase':
                                list.push({
                                    name: `待采购（${obj[key].count}）`,
                                    id: 1,
                                    childs: obj[key].childs
                                });
                                break;
                            case 'procurement':
                                list.push({
                                    name: `采购中（${obj[key].count}）`,
                                    id: 2,
                                    childs: obj[key].childs
                                });
                                break;
                            case 'saleList':
                                list.push({
                                    name: `已销单（${obj[key].count}）`,
                                    id: 3,
                                    childs: obj[key].childs
                                });
                                break;
                            case 'end':
                                list.push({
                                    name: `已完结（${obj[key].count}）`,
                                    id: 4,
                                    childs: obj[key].childs
                                });
                                break;
                            case 'exception':
                                list.push({
                                    name: `异常（${obj[key].count}）`,
                                    id: 5,
                                    childs: obj[key].childs
                                });
                                break;
                        }
                    }
                    if (!list.length) return;
                    list.forEach(item => {
                        item.childs.forEach(j => {
                            j.name = `${j.name}（${j.count}）`;
                        });
                    });
                    let result = [
                        {
                            id: 99,
                            name: '采购单列表',
                            childs: list
                        }
                    ];
                    this.treelist = result;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        getHuser() {
            this.getHandleUser();
        },
        getPurchase() {
            this.getPurchaseList();
        },
        //获取账期类型
        getAccountPeriod() {
            this.$api['procurement/periodPeriodList']().then(res => {
                this.accountPeriodList = res.rows.map(i => {
                    return {
                        label: i.periodName,
                        value: i.periodId
                    };
                });
            });
        },
        //获取供应商
        getSupplier() {
            this.getSupplierList();
        },
        //获取仓库
        getWarehouse() {
            this.getWarehouseList();
        },
        ...mapActions('common', [
            'getHandleUser',
            'getPurchaseList',
            'getSupplierList',
            'getWarehouseList'
        ])
    },
    components: {
        log,
        quickEntryTree,
        Write,
        userDefined,
        productsImg,
        paymentMethod,
        ImportExpressNumber,
        msg
    }
};
</script>

<style lang="scss" scoped>
.PurchaseOrderList {
    height: 100%;
    display: flex;
    flex-direction: column;
    .Orderwarp {
        flex: 1;
    }
}
.dialog-content {
    max-height: 580px;
    min-height: 300px;
    overflow-y: auto;
}
.quickEntry {
    position: fixed;
    right: 0;
    top: 122px;
    bottom: 80px;
    width: 264px;
    background: rgba(242, 242, 242, 1);
    text-align: center;
    z-index: 99;
    .showquickEntry {
        position: absolute;
        top: 0;
        i {
            font-size: 12px;
        }
    }
}
.handleQuickEntryStatus {
    position: fixed;
    right: -10px;
    top: 122px;
}
.bounce-enter-active,
.bounce-leave-active {
    transition: all 0.5s ease-out;
}
.bounce-enter {
    transform: translateX(264px);
    // opacity: 0;
}
.bounce-leave-active {
    transform: translateX(264px);
    // opacity: 0;
}

.searchcp {
    margin: 0;
}
</style>
