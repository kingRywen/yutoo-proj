<template lang="html">
    <!--1 为历史下单记录 0 位历史采购记录-->
    <div
        class="historyRecord"
         v-loading="loading"
         element-loading-text="正在加载...">
        <search :searchList="searchList" @search="search"/>
        <div class="productInfo">
            <div class="left">
                <div class="img">
                    <img :src="info.productImg" alt="产品图片" width="auto" height="100%">
                </div>
                <ul>
                    <li class="bright">{{ info.storeSku }}</li>
                    <li>{{info.titleEn}}</li>
                    <li class="bright">{{info.nameZh}}</li>
                    <li class="status bright">{{info.productStateName}}</li>
                </ul>
            </div>
            <div class="right" v-if="!type">
                <span>当前库存：<strong> {{info.current.currentStock || 0}} </strong></span>
                <span>可用库存(结余)：<strong>{{info.current.availableStock || 0}}</strong></span>
                <span>暂时锁定：<strong> {{info.current.finalBalance || 0}} </strong></span>
                <span>采购中：<strong> {{info.current.purchasing || 0}} </strong></span>
            </div>
        </div>
        <yt-table :data="list" :columns=" type ? type ===2 ? columns : columnsA : columns " :border="true" :selection="false"/>
        <el-pagination
            style="text-align: right;margin-top:10px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>



    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            searchList: [
                {
                    label: '采购时间',
                    value: 'time',
                    type: 'time'
                },
                {
                    label: '供应商',
                    value: 'supplierId',
                    type: 'select',
                    children: this.$store.state.common.supplierList,
                    props: {
                        label: 'supplierName',
                        value: 'supplierId'
                    }
                }
            ],
            list: [],
            columns: [
                { value: 'generateTime', label: '采购时间', width: '140px' },
                {
                    // value: 'warehouseName',
                    label: '供应商采购仓库',
                    width: '140px',
                    multi: ['supplierName', 'warehouseName']
                },
                { value: 'purchaseNumber', label: '采购单号' },
                { value: 'purchasersName', label: '采购人员' },

                { value: 'purchaseStateName', label: '采购状态' },
                { value: 'purchaseTypeName', label: '采购类型' },
                { value: 'requirement', label: '需求' },
                { value: 'lowerSingleQuantity', label: '下单' },

                { value: 'pinQuantity', label: '销单' },
                { value: 'productSingleAmount', label: '采购价格' },
                { value: 'singleFreight', label: '单个运费' },
                { value: 'warehousesQuantity', label: '入库' },

                {
                    value: 'expectedArrivalTime',
                    label: '预计到货时间',
                    width: '150px'
                },
                { value: 'pinTime', label: '最后销单时间', width: '140px' },
                {
                    value: 'warehousingTime',
                    label: '最后入库时间',
                    width: '140px'
                },
                { value: 'purchaseRemark', label: '采购备注' }
            ],
            columnsA: [
                { value: 'lowerSingleTime', label: '下单时间', width: '140px' },
                { value: 'contactName', label: '供应商' },
                { value: 'productSingleAmount', label: '下单价格' },
                { value: 'freightAmount', label: '采购运费' },
                { value: 'singleQuantity', label: '批发数量' },

                { value: 'birthOrderPrice', label: '批发价格' },
                { value: 'purchaseTime', label: '采购天数' },
                { value: 'lowerSingleRemark', label: '备注' },
                { value: 'purchaseAccountName', label: '报价人员' },
                { value: 'contactQq', label: '供应商QQ' },

                { value: 'contactPhone', label: '供应商电话' }
            ],
            type: null,
            productId: null,
            purchaseId: null,
            info: {
                storeSku: null,
                titleEn: null,
                nameZh: null,
                productStateName: null,
                productImg: null,
                current: {
                    availableStock: '',
                    currentStock: '',
                    finalBalance: '',
                    purchasing: ''
                }
            },
            loading: false
        };
    },
    methods: {
        ...mapActions('common', ['getSupplierList']),
        handleSizeChange(val) {
            this.pageSize = val;
            let params = {};

            if (this.searchInfo.supplierId) {
                params['supplierId'] = this.searchInfo.supplierId;
            }
            if (
                this.searchInfo.time != null &&
                this.searchInfo.time instanceof Array &&
                this.searchInfo.time.length
            ) {
                params['startTime'] = this.searchInfo.time[0];
                params['endTime'] = this.searchInfo.time[1];
            }
            this.getHistoryInfo(
                this.type,
                this.productId,
                this.purchaseId,
                params
            );
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            let params = {};

            if (this.searchInfo.supplierId) {
                params['supplierId'] = this.searchInfo.supplierId;
            }
            if (
                this.searchInfo.time != null &&
                this.searchInfo.time instanceof Array &&
                this.searchInfo.time.length
            ) {
                params['startTime'] = this.searchInfo.time[0];
                params['endTime'] = this.searchInfo.time[1];
            }

            this.getHistoryInfo(
                this.type,
                this.productId,
                this.purchaseId,
                params
            );
        },
        search(val) {
            this.searchInfo = val;
            this.currentPage = 1;
            let params = {};
            if (val.supplierId) {
                params['supplierId'] = val.supplierId;
            }
            if (
                val.time != null &&
                val.time instanceof Array &&
                val.time.length
            ) {
                params['startTime'] = val.time[0];
                params['endTime'] = val.time[1];
            }
            this.getHistoryInfo(
                this.type,
                this.productId,
                this.purchaseId,
                params
            );
        },
        getHistoryInfo(type, productId, purchaseId, searchInfo = {}) {
            //type 1为采购历史下单记录 0位历史采购记录 2为订单历史采购记录
            this.type = type;
            this.productId = productId;
            this.purchaseId = purchaseId;

            let params = {
                sortOrder: 'asc',
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            };
            let url = '';
            if (type == 1) {
                params['productId'] = productId;
                url = 'procurement/historyPrice';
            } else if (type == 0) {
                params['productId'] = productId;
                params['purchaseId'] = purchaseId;
                url = 'procurement/historyRecord';
            } else if (type == 2) {
                params['orderProductId'] = productId;
                url = 'order/productGetPurchaseing';
            }
            if (Object.keys(searchInfo).length) {
                params = Object.assign({}, params, searchInfo);
            }
            this.loading = true;
            this.$api[url](params)
                .then(res => {
                    this.pageSize = res.pageSize;
                    this.currentPage = res.pageNo;
                    this.total = res.total;

                    this.loading = false;

                    this.info.storeSku = res.rows.storeSku;
                    this.info.titleEn = res.rows.titleEn;
                    this.info.nameZh = res.rows.nameZh;
                    this.info.productStateName = res.rows.productStateName;
                    this.info.productImg = res.rows.productImg;
                    if (type) {
                        this.list = res.rows.lowerSingles || res.rows.purchases;
                    } else {
                        this.list = res.rows.purchases;
                        this.info.current.availableStock =
                            res.rows.availableStock;
                        this.info.current.currentStock = res.rows.currentStock;
                        this.info.current.finalBalance = res.rows.finalBalance;
                        this.info.current.purchasing = res.rows.purchasing;
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.list = [];
                    this.info = {};
                    this.$message.error(err.msg);
                });
        }
    },
    components: {},
    mounted() {
        this.getSupplierList();
    }
};
</script>

<style lang="scss" scoped>
.textSize {
    font-size: 14px;
}
.bright {
    font-size: 14px;
    font-weight: 600;
}
.status {
    color: #0628f6;
}
.historyRecord {
    min-height: 500px;
    max-height: 600px;
    overflow-y: auto;
    .productInfo {
        display: flex;
        justify-content: space-between;
        margin: 30px 0;
        .left {
            display: flex;
            width: 45%;
            .img {
                width: 120px;
                height: 90px;
                overflow: hidden;
                text-align: center;
                border: 1px solid #ccc;
                img {
                    // display: block;
                    transition: all 0.6s;
                    &:hover {
                        transform: scale(1.4);
                    }
                }
            }
            ul {
                padding-left: 20px;
                li {
                    padding-bottom: 12px;
                    @extend .textSize;
                    &:last-child {
                        padding: 0;
                    }
                }
            }
        }
        .right {
            flex: 1;
            span {
                margin-left: 20px;
                @extend .textSize;
                strong {
                    @extend .bright;
                }
            }
        }
    }
}
</style>
