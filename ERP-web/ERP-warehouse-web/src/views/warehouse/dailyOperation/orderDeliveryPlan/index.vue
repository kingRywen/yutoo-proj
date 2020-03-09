<template>
    <!-- <div>订单包裹发货计划</div> -->
    <div>
        <yt-page url="warehouse/packageLsit" reserveSelection="wmPackageId" :leftCustom="true" :tableConfig="tableConfig" :btnConfig="btnConfig" @submitForm="submitForm" @selectChange="selectChange" ref="page" @onClickBtn="clickBtn">
            <!--  -->
            <template slot="search">
                <yt-form class="customsearch" storageName="orderDeliveryPlanSearch" :search="true" @search="search" :fields="searchConfig" :formData="curSearchInfo"/>
            </template>
            <!--  -->
            <template slot="tableLeft">
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!-- <el-tooltip effect="dark" content="查看包裹明细" placement="top">
                            <i class="iconBtn el-icon-search" @click="lookdetails(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="操作日志" placement="top">
                            <i class="iconBtn el-icon-document" @click="log(scope.row.wmPackageId)"></i>
                        </el-tooltip>
                        <el-tooltip effect="light" placement="top">
                            <template slot="content">
                                <p>发货备注：{{scope.row.deliveryRemark || '暂无'}}</p>
                                <p>礼品备注：{{scope.row.giftRemark || '暂无'}}</p>
                            </template>
                            <i class="iconBtn el-icon-date tips"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="打印拣货清单" placement="top">
                            <i class="iconBtn el-icon-printer" @click="pickingPrint(scope.row.wmPackageId)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="打印发货清单" placement="top">
                            <i class="iconBtn iconfont icon-print" @click="print('发货清单', 'shippinglist', scope.row.wmPackageId)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="合并提示" placement="top">
                            <i class="iconBtn el-icon-bell tips" @click="merge(scope.row.wmPackageId)"></i>
                        </el-tooltip>-->
                        <!--  -->
                        <el-tooltip effect="dark" :content="item.value" placement="top" v-for="(item,j) in scope.row.buttonList" :key="j">
                            <template slot="content" v-if="item.key==3">
                                <p>发货备注：{{scope.row.deliveryRemark || '暂无'}}</p>
                                <p>礼品备注：{{scope.row.giftRemark || '暂无'}}</p>
                            </template>
                            <i class="iconBtn tips" :class="item.data" v-if="item.key==3"></i>
                            <i class="iconBtn" :class="item.data" v-else @click="tableBtn(item.key,scope.row)"></i>
                        </el-tooltip>
                        <!--  -->
                    </template>
                </el-table-column>
            </template>
            <router-view/>
        </yt-page>

        <yt-menuSelect v-if="isSidebar" :loadData="loadData" :defaultProps="defaultProps" title="包裹状态列表" @nodeclick="sidebarClick"/>
    </div>
</template>
<script>
/* eslint-disable */
import { mapActions } from 'vuex';
import { mixins } from '../mixins';
export default {
    mixins: [mixins],
    data() {
        const vm = this;
        return {
            tableConfig: [
                { value: 'packageNumber', label: '包裹单号', width: '130px' },
                {
                    value: 'skuCount',
                    label: '产品sku数量',
                    width: '100px',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={vm.skuimg.bind(
                                    vm,
                                    scope.row.wmPackageId
                                )}
                            >
                                {scope.row.skuCount}
                            </el-button>
                        );
                    }
                },
                { value: 'statusName', label: '状态', width: '120px' },
                {
                    label: '订单来源平台',
                    children: 'platforms',
                    value: 'platformName',
                    width: '130px'
                },
                {
                    value: 'storeName',
                    label: '订单来源店铺',
                    children: 'stores',
                    width: '130px'
                },
                { value: 'transportName', label: '运输方式', width: '110px' },
                { value: 'customerName', label: '客户名称' },
                { value: 'customerNationName', label: '目的国家' },
                { value: 'customerAddress', label: '具体地址', width: '200px' },
                { value: 'customerPostcode', label: '邮编' },
                { value: 'customerTelephone', label: '电话', width: '130px' },
                { value: 'createTime', label: '包裹生成时间', width: '150px' },
                {
                    value: 'pickerAmount',
                    label: '拣货人员',
                    render(h, scope) {
                        if (scope.row.pickerAmount == 0) {
                            return <span>{scope.row.pickerAmount}</span>;
                        }
                        return (
                            <el-button
                                type="text"
                                onClick={vm.lookPicking.bind(
                                    vm,
                                    scope.row.wmPackageId,
                                    1
                                )}
                            >
                                {scope.row.pickerAmount}
                            </el-button>
                        );
                    }
                },
                { value: 'packagerName', label: '包装人员' }
            ],
            btnConfig: [
                {
                    name: '批量打印',
                    type: 'success',
                    children: [
                        { name: '打印拣货清单' },
                        { name: '打印发货清单' },
                        { name: '打印面单' },
                        { name: '打印发票' },
                        { name: '报关资料打印' },
                        { name: '打印超重标签' },
                        { name: '打印易碎标签' },
                        { name: '打印箱子条码' }
                    ]
                },
                {
                    name: '拆分包裹',
                    disabled: () => {
                        return this.wmPackageIds.length == 1 &&
                            this.statusList[0] == 1
                            ? false
                            : true;
                    },
                    fn: () => {
                        if (
                            this.wmPackageIds.length &&
                            this.wmPackageIds.length == 1
                        ) {
                            this.$router.push({
                                path:
                                    '/warehouse/dailyOperation/orderDeliveryPlan/parcelSplitting/' +
                                    this.wmPackageIds[0]
                            });
                        } else {
                            this.$message.warning(
                                '请选择要拆分的包裹单，只能选择一个'
                            );
                        }
                    }
                },
                {
                    name: '合并包裹',
                    disabled: () => {
                        return this.wmPackageIds.length > 1 ? false : true;
                    },
                    fn: () => {
                        this.$confirm('确定将所选包裹合并吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.mergeParcel(this.wmPackageIds, 0);
                        });
                    }
                },
                {
                    name: '修改包裹运输方式',
                    disabled: () => {
                        return this.wmPackageIds.length > 0 ? false : true;
                    },
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '修改运输方式',
                            visible: true,
                            width: '380px',
                            component: () => import('./changeTransport')
                        });
                    }
                },
                {
                    name: '导入追踪号',
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '导入追踪号',
                            visible: true,
                            confirmButtonText: '导入',
                            width: '480px',
                            component: () => import('./uploadNumber')
                        });
                    }
                },
                {
                    name: '修改拣货人员',
                    disabled: () => {
                        return this.wmPackageIds.length == 1 ? false : true;
                    },
                    fn: () => {
                        const wmPackageId = this.wmPackageIds.join();
                        this.lookPicking(Number(wmPackageId), 2);
                    }
                },
                {
                    name: '修改打包人员',
                    disabled: () => {
                        return this.wmPackageIds.length > 0 ? false : true;
                    },
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '设置负责人',
                            visible: true,
                            width: '380px',
                            component: () => import('./changeUser')
                        });
                    }
                },
                {
                    name: '设置已发货',
                    disabled: () => {
                        return this.wmPackageIds.length ? false : true;
                    },
                    fn: () => {
                        this.setDeliverGoodsStatus(
                            'packageDeliver',
                            '确定包裹单设置成已发货吗？'
                        );
                    }
                },
                {
                    name: '撤销已发货',
                    disabled: () => {
                        return this.wmPackageIds.length ? false : true;
                    },
                    fn: () => {
                        if (this.wmPackageIds.length) {
                            this.setDeliverGoodsStatus(
                                'packageDeliverCancel',
                                '确定撤销包裹单发货状态吗？'
                            );
                        } else {
                            this.$message.warning('请选择包裹单');
                        }
                    }
                },
                {
                    name: '设置已签收',
                    disabled: () => {
                        return this.wmPackageIds.length ? false : true;
                    },
                    fn: () => {
                        this.$confirm('确定将包裹设置已签收状态吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        })
                            .then(() => {
                                this.$api['warehouse/packagesetsignfor']({
                                    wmPackageIds: this.wmPackageIds
                                }).then(res => {
                                    this.coincident(res.msg);
                                });
                            })
                            .catch(() => {
                                return false;
                            });
                    }
                },
                {
                    name: '撤销已签收',
                    disabled: () => {
                        return this.wmPackageIds.length ? false : true;
                    },
                    fn: () => {
                        this.$confirm('确定撤销已签收吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        })
                            .then(() => {
                                this.$api['warehouse/packagecancelsignfor']({
                                    wmPackageIds: this.wmPackageIds
                                }).then(res => {
                                    this.coincident(res.msg);
                                });
                            })
                            .catch(() => {
                                return false;
                            });
                    }
                },
                {
                    name: '当前条件导出',
                    disabled: () => {
                        return this.wmPackageIds.length ? false : true;
                    },
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '当前条件导出',
                            visible: true,
                            width: '980px',
                            component: () => import('./export.vue'),
                            params: {
                                searchInfo: this.outerSearch,
                                wmPackageIds: this.wmPackageIds
                            },
                            fnName: 'getParams',
                            display: false
                        });
                    }
                }
            ],
            wmPackageIds: [], //  包裹单id
            defaultProps: {
                children: 'child',
                label: 'name',
                count: 'count'
            },
            curSearchInfo: {},
            statusList: [],
            outerSearch: {}
        };
    },
    computed: {
        searchConfig() {
            const self = this;
            return [
                {
                    label: '发货仓库（多选）',
                    name: 'warehouseIds',
                    type: 'select',
                    multi: true,
                    default: true,
                    noLabel: true,
                    options: self.$store.state.daily.warehouseList,
                    span: 3
                },
                {
                    label: '订单类型（多选）',
                    name: 'orderTypes',
                    type: 'select',
                    multi: true,
                    default: true,
                    noLabel: true,
                    options: [
                        { label: '客户订单', value: 1 },
                        { label: '海外仓备库', value: 2 },
                        { label: 'FBA备库', value: 3 }
                    ],
                    span: 3
                },
                {
                    label: '包裹状态（多选）',
                    name: 'packageStatus',
                    type: 'select',
                    multi: true,
                    default: true,
                    noLabel: true,
                    options: this.$store.state.daily.packageList,
                    span: 3
                },
                {
                    label: '订单来源（多选）',
                    name: 'storeIds',
                    type: 'cascader',
                    multi: true,
                    default: true,
                    noLabel: true,
                    options: this.$store.state.daily.storeAllList,
                    placeholder: '选择订单来源',
                    bind: {
                        value: 'storeId',
                        label: 'name',
                        children: 'stores'
                    },
                    span: 3
                },
                {
                    label: '运输方式（多选）',
                    name: 'transportTypes',
                    type: 'select',
                    multi: true,
                    default: true,
                    noLabel: true,
                    options: self.$store.state.daily.logisticTlist,
                    span: 3
                },
                {
                    label: '选择时间',
                    name: 'timeInfo',
                    type: 'select',
                    default: true,
                    noLabel: true,
                    options: [
                        { label: '包裹生成时间', value: 1 },
                        { label: '打印拣货单时间', value: 2 },
                        { label: '打包时间', value: 3 },
                        { label: '发货时间', value: 4 },
                        { label: '拣货时间', value: 5 }
                    ],
                    span: 2
                },
                {
                    label: '时间',
                    name: 'time',
                    type: 'datetimerange',
                    // format: 'yyyy-MM-dd HH:mm:ss',
                    default: true,
                    noLabel: true,
                    span: 4
                },
                {
                    label: '是否有发货备注',
                    name: 'deliverRemarkFlag',
                    type: 'select',
                    default: true,
                    noLabel: true,
                    options: [
                        { label: '是', value: 1 },
                        { label: '否', value: 0 }
                    ],
                    span: 3
                },

                {
                    label: 'sku数量：',
                    name: 'skuAmount',
                    type: 'price',
                    integer: 'number',
                    default: true,
                    span: 7
                },
                {
                    label: '总数量：',
                    name: 'totalAmount',
                    type: 'price',
                    integer: 'number',
                    default: true,
                    span: 7
                },
                {
                    label: '物流属性（多选）',
                    name: 'logistics',
                    type: 'select',
                    multi: true,
                    default: false,
                    noLabel: true,
                    options: this.$store.state.daily.logisticTypeList,
                    span: 3
                },
                {
                    label: '拣货人员',
                    name: 'pickerId',
                    type: 'select',
                    default: false,
                    noLabel: true,
                    options: this.$store.state.daily.personnel.pickingList,
                    span: 3
                },
                {
                    label: '打包人员',
                    name: 'packagerId',
                    type: 'select',
                    default: false,
                    noLabel: true,
                    options: this.$store.state.daily.personnel.packingList,
                    span: 3
                },
                {
                    label: '包裹单是否异常完结',
                    name: 'unusualComplerte',
                    type: 'select',
                    default: true,
                    noLabel: true,
                    options: [
                        { label: '是', value: 1 },
                        { label: '否', value: 0 }
                    ],
                    span: 3
                },
                {
                    label: '自定义sku',
                    name: 'customSku',
                    noLabel: true,
                    default: false,
                    span: 3
                },
                {
                    label: '包裹单号',
                    name: 'packageNumber',
                    noLabel: true,
                    default: false,
                    span: 3
                },
                {
                    label: 'ASIN',
                    name: 'asin',
                    noLabel: true,
                    default: false,
                    span: 3
                },
                {
                    label: '店铺sku',
                    name: 'storeSku',
                    noLabel: true,
                    default: false,
                    span: 3
                },
                {
                    label: '客户名称',
                    name: 'customerName',
                    noLabel: true,
                    default: false,
                    span: 3
                }
            ];
        },
        isSidebar() {
            return this.$route.name == 'orderDeliveryPlan' ? true : false;
        }
    },
    methods: {
        ...mapActions([
            'getPersonnel',
            'getLogisticTlist',
            'getWarehouseList',
            'getLogisticTlist',
            'getLogisticTypeList',
            'getStoreAllList',
            'getPackageList'
        ]),
        tableBtn(type, row) {
            switch (type) {
                case 1: //查看详情
                    this.lookdetails(row);
                    break;
                case 2: //操作日志
                    this.log(row.wmPackageId);
                    break;
                case 3: //备注
                    break;
                case 4: //打印面单
                    break;
                case 5: //打印拣货清单
                    this.pickingPrint(row.wmPackageId);
                    break;
                case 6: //打印发货清单
                    this.print('发货清单', 'shippinglist', row.wmPackageId);
                    break;
                case 7: //合并包裹提示
                    this.merge(row.wmPackageId);
                    break;
                default:
                    break;
            }
        },
        clickBtn(val) {
            switch (val) {
                case '打印拣货清单':
                    if (!this.wmPackageIds.length) {
                        return this.$message.warning('请选择需要打印的包裹');
                    }
                    this.print('拣货清单', 'pickinglist', this.wmPackageIds);
                    break;
                case '打印发货清单':
                    if (!this.wmPackageIds.length) {
                        return this.$message.warning('请选择需要打印的包裹');
                    }
                    this.print('发货清单', 'shippinglist', this.wmPackageIds);
                    break;
                case '打印面单':
                    this.samePrint('面单', 3);
                    return;
                case '打印发票':
                    this.samePrint('发票', 4);
                    return;
                case '报关资料打印':
                    this.samePrint('报关资料', 5);
                    return;
                case '打印超重标签':
                    this.print('超重标签', 'overweightOrFragile', '超重');
                    break;
                case '打印易碎标签':
                    this.print('易碎标签', 'overweightOrFragile', '易碎');
                    break;
                case '打印箱子条码':
                    this.$refs.page.$dialog({
                        title: '打印箱子条码',
                        visible: true,
                        width: '480px',
                        confirmButtonText: '立即打印',
                        component: () => import('./print/checkedPrint.vue')
                    });
                    break;
                default:
                    break;
            }
        },
        samePrint(text, printType) {
            if (!this.wmPackageIds.length) {
                return this.$message.warning(`请选择需要打印的${text}`);
            }
            const { href } = this.$router.resolve({
                name: 'faceSheetPrint',
                query: {
                    printType,
                    wmPackageIds: this.wmPackageIds,
                    isReplace: true
                }
            });
            window.open(href, '_blank');
        },
        print(title, type, wmPackageId) {
            const { href } = this.$router.resolve({
                name: 'oDprint',
                query: {
                    title,
                    wmPackageId,
                    type
                }
            });
            window.open(href, '_blank');
        },
        //单个打印拣货清单
        pickingPrint(wmPackageId) {
            this.print('拣货清单', 'pickinglist', wmPackageId);
        },
        //合并包裹
        mergeParcel(wmPackageIds, type) {
            this.$api['warehouse/packageMerge']({
                wmPackageIds,
                type
            }).then(res => {
                this.coincident(res.msg);
            });
        },
        //合并提示
        merge(wmPackageId) {
            this.$api['warehouse/packageQueryMergeInfo']({ wmPackageId }).then(
                res => {
                    this.$confirm(res.msg, '提示', {
                        confirmButtonText: '不合并不在提醒',
                        cancelButtonText: '合 并',
                        type: 'warning',
                        center: true
                    })
                        .then(() => {
                            this.mergeParcel(Array.of(wmPackageId), 1);
                        })
                        .catch(() => {
                            this.mergeParcel(Array.of(wmPackageId), 0);
                        });
                }
            );
        },

        search(val) {
            let obj = this.curSearchInfo;
            let p = {};
            for (let k in obj) {
                if (
                    obj[k] == undefined ||
                    obj[k] === '' ||
                    obj[k] == null ||
                    (Array.isArray(obj[k]) && !obj[k].length)
                ) {
                    continue;
                } else {
                    p[k] = obj[k];
                }
            }
            let result = {};
            //处理时间
            if ('time' in p && 'timeInfo' in p && p.time.length) {
                result['timeInfo'] = [
                    {
                        type: p.timeInfo,
                        start: p.time[0],
                        end: p.time[1]
                    }
                ];
            }
            //处理区间
            if ('skuAmountStart' in p && 'skuAmountEnd' in p) {
                result['skuAmountStart'] = p.skuAmountStart;
                result['skuAmountEnd'] = p.skuAmountEnd;
            }
            if ('totalAmountStart' in p && 'totalAmountEnd' in p) {
                result['totalAmountStart'] = p.totalAmountStart;
                result['totalAmountEnd'] = p.totalAmountEnd;
            }
            //处理店铺
            if ('storeIds' in p && p.storeIds.length) {
                result['storeIds'] = [p.storeIds[p.storeIds.length - 1]];
            }
            //合并
            for (let key in p) {
                if (key == 'storeIds') continue;
                if (key == 'skuAmountStart') continue;
                if (key == 'skuAmountEnd') continue;
                if (key == 'totalAmountStart') continue;
                if (key == 'totalAmountEnd') continue;
                if (key == 'time') continue;
                if (key == 'timeInfo') continue;
                result[key] = p[key];
            }
            this.outerSearch = { ...result };
            this.$refs.page.clearSelection();
            this.$children[0].searchInfo = result;
            this.$refs.page.getList('search');
        },

        //侧边栏点击
        sidebarClick(data, node) {
            let obj = {
                searchKey: data.key,
                searchValue: data.value
            };
            console.log(obj);
            this.$refs.page.clearSelection();
            this.$children[0].searchInfo = obj;
            this.$refs.page.getList('search');
        },

        //侧边栏
        loadData() {
            return this.$api['warehouse/packageStatistics']().then(res => {
                return res.statisticsInfo;
            });
        },

        //查看包裹明细
        lookdetails(row) {
            this.$refs.page.$dialog({
                title: '查看包裹明细-' + row.packageNumber,
                visible: true,
                width: '1200px',
                component: () => import('./lookdetails'),
                display: false,
                fnName: 'getProductInfo',
                params: row.wmPackageId
            });
        },

        //操作日志
        log(wmPackageId) {
            this.$refs.page.$dialog({
                title: '操作日志',
                visible: true,
                component: () => import('../Inventory/log'),
                display: false,
                fnName: 'getLogList',
                params: {
                    url: 'warehouse/packageLogList',
                    id: wmPackageId,
                    idName: 'wmPackageId',
                    columns: [
                        {
                            value: 'createTime',
                            label: '操作时间',
                            width: '150px'
                        },
                        {
                            value: 'operatorName',
                            label: '操作人员',
                            width: '100px'
                        },
                        { value: 'msg', label: '具体操作' }
                    ]
                }
            });
        },

        // 导入模板
        importTracking(file) {
            this.$api['warehouse/importTrackingNumber']({
                file
            }).then(res => {
                this.coincident(res.msg);
            });
        },
        //修改运输方式
        changeTransport(transportId) {
            this.$api['warehouse/packageModifyTransport']({
                wmPackageIds: this.wmPackageIds,
                transportId
            }).then(res => {
                this.coincident(res.msg);
            });
        },

        //查看拣货人员
        lookPicking(wmPackageId, type) {
            this.$refs.page.$dialog({
                title: '查看拣货人员',
                visible: true,
                width: '980px',
                display: false,
                component: () => import('./lookPicking'),
                fnName: 'getdetailList',
                params: {
                    wmPackageId,
                    type
                }
            });
        },

        //修改打包人員
        changePackUser(packagerId) {
            this.$api['warehouse/packageModifyPackager']({
                packagerId,
                wmPackageIds: this.wmPackageIds
            }).then(res => {
                this.coincident(res.msg);
            });
        },

        //查看sku数量
        skuimg(wmPackageId) {
            this.$refs.page.$dialog({
                title: 'SKU图片',
                visible: true,
                width: '680px',
                display: false,
                component: () => import('./productsImg'),
                fnName: 'getProductList',
                params: wmPackageId
            });
        },

        //设置发货状态 已发货 撤销已发货
        setDeliverGoodsStatus(url, title) {
            this.$confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$api['warehouse/' + url]({
                        wmPackageIds: this.wmPackageIds
                    }).then(res => {
                        this.coincident(res.msg);
                    });
                })
                .catch(() => {});
        },

        selectChange(val) {
            this.wmPackageIds = val.map(i => i.wmPackageId);
            this.statusList = val.map(i => i.status);
        },
        submitForm(val, title) {
            switch (title) {
                case '设置负责人':
                    this.changePackUser(val);
                    break;
                case '修改运输方式':
                    this.changeTransport(val);
                    break;
                case '导入追踪号':
                    this.importTracking(val);
                    break;
                default:
                    break;
            }
        }
    },
    created() {
        //获取人员
        this.getPersonnel();
        //获取运输方式
        this.getLogisticTlist();
        //仓库列表
        this.getWarehouseList();
        //运输方式
        this.getLogisticTlist();
        //物流属性
        this.getLogisticTypeList(8);
        //来源店铺
        this.getStoreAllList();
        //获取包裹单状态
        this.getPackageList();
    }
};
</script>
<style lang="scss" scoped>
.customsearch {
    width: 100%;
    margin: 0;
}
.tips {
    color: red;
}
</style>