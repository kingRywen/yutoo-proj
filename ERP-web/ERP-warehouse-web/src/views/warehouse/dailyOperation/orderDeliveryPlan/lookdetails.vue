<template>
    <!-- 包裹明细查看详情 -->
    <div class="details">
        <el-tabs tab-position="left" type="border-card" style="flex: 1;" v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="产品信息" name="first">
                <div class="list-warp">
                    <el-row class="list-info">
                        <el-col :span="4" class="item">包裹单号</el-col>
                        <el-col :span="4" class="item">{{orderInfo.packageNumber}}</el-col>
                        <el-col :span="4" class="item">运输方式</el-col>
                        <el-col :span="4" class="item">{{orderInfo.transportName}}</el-col>
                        <el-col :span="4" class="item">追踪号</el-col>
                        <el-col :span="4" class="item">
                            <a href="http://www.kuaidi100.com/" target="_blank" class="alink">{{orderInfo.trackingNumber}}</a>
                        </el-col>
                    </el-row>
                    <el-row class="list-info">
                        <el-col :span="4" class="item">订单数量</el-col>
                        <el-col :span="4" class="item">{{orderInfo.orderAmount}}</el-col>
                        <el-col :span="4" class="item">包裹重量</el-col>
                        <el-col :span="4" class="item">{{orderInfo.totalWeight || '-'}}</el-col>
                        <el-col :span="4" class="item"></el-col>
                        <el-col :span="4" class="item"></el-col>
                    </el-row>
                    <el-row class="list-info">
                        <el-col :span="4" class="item">总运费</el-col>
                        <el-col :span="4" class="item">{{orderInfo.totalFreight || '-'}}</el-col>
                        <el-col :span="4" class="item">装箱数量</el-col>
                        <el-col :span="4" class="item">
                            <span v-if="orderInfo.boxAmount==0">{{orderInfo.boxAmount}}</span>
                            <div v-else @click="lookBox" class="alink">{{orderInfo.boxAmount}}</div>
                        </el-col>
                        <el-col :span="4" class="item"></el-col>
                        <el-col :span="4" class="item"></el-col>
                    </el-row>
                </div>
                <template v-for="(item,index) in orderList">
                    <div class="goods-warp" :key="index">
                        <ul>
                            <li>
                                <span>订单号：</span>
                                {{item.orderNumber}}
                            </li>
                            <li>
                                <span>订单来源平台：</span>
                                {{item.platformName}}
                            </li>
                            <li>
                                <span>订单来源店铺：</span>
                                {{item.storeName}}
                            </li>
                        </ul>
                        <yt-table :data="item.orderProductInfo" :columns="columns" :border="true" :selection="false"></yt-table>
                    </div>
                </template>
                <el-button style="margin-top:20px;" v-if="orderList.length==0" icon="el-icon-warning" type="text">该包裹无订单信息</el-button>
            </el-tab-pane>
            <el-tab-pane label="物流信息" name="second">
                <ul class="logistics-info">
                    <li>
                        <strong>收货人</strong>
                        <span>{{logisticsInfo.customerName || hint}}</span>
                    </li>
                    <li>
                        <strong>EMAIL</strong>
                        <span>{{logisticsInfo.customerEmail || hint}}</span>
                    </li>
                    <li>
                        <strong>地址</strong>
                        <span>{{logisticsInfo.customerAddress || hint}}</span>
                    </li>
                    <li>
                        <strong>省市国家</strong>
                        <span>{{logisticsInfo.customerNationName || hint}}</span>
                    </li>
                    <li>
                        <strong>邮编</strong>
                        <span>{{logisticsInfo.customerPostcode || hint}}</span>
                    </li>
                    <li>
                        <strong>电话</strong>
                        <span>{{logisticsInfo.customerTelephone || hint}}</span>
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="申报信息" name="third">
                <canvasinfo :options="options"/>
            </el-tab-pane>
        </el-tabs>
        <!--  -->
        <el-dialog title="查看装箱" :visible.sync="visible" width="980px" :append-to-body="true">
            <div class="orderbox">
                <search :searchList="searchConfig" @search="search"/>

                <template v-for="(item,index) in boxList">
                    <div class="goods-warp" :key="index">
                        <ul>
                            <li>
                                <span>箱子名称：</span>
                                {{item.name}}
                            </li>
                            <li>
                                <span>箱子重量：</span>
                                {{item.weight}}
                            </li>
                        </ul>
                        <yt-table :data="item.products" :columns="boxColumns" :border="true" :selection="false"></yt-table>
                    </div>
                </template>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import canvasinfo from './canvasinfo';
export default {
    components: {
        canvasinfo
    },
    data() {
        let vm = this;
        return {
            hint: '暂无',
            columns: [
                {
                    value: 'image',
                    label: '图片',
                    img: true,
                    width: 110,
                    style: {
                        width: 50,
                        height: 50
                    }
                },
                { value: 'nameCn', label: '产品名称', width: '150px' },
                { value: 'skuCus', label: '自定义SKU', width: '150px' },
                { value: 'skuStore', label: '店铺SKU', width: '160px' },
                { value: 'asin', label: 'ASIN', width: '100px' },
                {
                    label: '属性',
                    children: 'properties',
                    width: '90px',
                    prop: {
                        key: 'propertyName',
                        value: 'propertyValue'
                    }
                },
                { value: 'amount', label: '数量' },
                { value: 'repertoryUsed', label: '可用库存' },
                { value: 'locationNames', label: '库位' },
                { value: 'repertoryLocked', label: '锁定库存' },
                { value: 'logisticType', label: '物流属性' },
                { value: 'riskType', label: '侵权属性' },
                { value: 'deliverAmount', label: '实发数量' }
            ],
            boxColumns: [
                {
                    value: 'imageBase',
                    label: '图片',
                    img: true,
                    width: 110,
                    style: {
                        width: 50,
                        height: 50
                    }
                },
                { value: 'nameCh', label: '产品名称' },
                { value: 'skuCus', label: '自定义SKU', width: '200px' },
                { value: 'nameEn', label: '产品英文名称', width: '300px' },
                { value: 'amount', label: '数量', width: '100px' },
                { value: 'userName', label: '打包人员' }
            ],
            activeName: 'first',
            wmPackageId: '',
            orderInfo: {},
            orderList: [],
            visible: false,
            logisticsInfo: {},

            searchConfig: [
                {
                    label: 'sku：',
                    value: 'sku',
                    type: 'input'
                },
                {
                    label: '产品名称：',
                    value: 'name',
                    type: 'input'
                },
                {
                    label: '打包人员：',
                    value: 'packagerId',
                    type: 'select',
                    children: vm.$store.state.daily.personnel.packingList
                }
            ],
            boxList: [],
            options: {}
        };
    },
    methods: {
        tabClick(tab, event) {
            if (tab.name == 'second') {
                this.getLogisticsInfo();
            } else if (tab.name == 'third') {
                this.getDeclareInfo();
            }
        },
        search(val) {
            let p = {};
            for (let k in val) {
                if (val[k]) {
                    p[k] = val[k];
                }
            }
            this.getBoxInfo(
                Object.assign({}, p, {
                    wmPackageId: this.wmPackageId
                })
            );
        },
        lookBox() {
            this.visible = true;
            this.getBoxInfo({
                wmPackageId: this.wmPackageId
            });
        },
        getProductInfo(wmPackageId) {
            this.wmPackageId = wmPackageId;
            this.$api['warehouse/packageProductInfo']({ wmPackageId }).then(
                res => {
                    this.orderInfo = { ...res.rows };
                    this.orderList = res.rows.orderInfo;
                }
            );
        },
        getLogisticsInfo() {
            this.$api['warehouse/packageLogisticsInfo']({
                wmPackageId: this.wmPackageId
            }).then(res => {
                this.logisticsInfo = { ...res.rows };
            });
        },
        getDeclareInfo() {
            this.$api['warehouse/packageDeclareInfo']({
                wmPackageId: this.wmPackageId
            }).then(res => {
                this.options = res.rows[0].modelInfo;
            });
        },
        getBoxInfo(params) {
            this.$api['warehouse/packageBoxInfo'](params).then(res => {
                this.boxList = [...res.rows];
            });
        }
    }
};
</script>

<style lang="scss" scope>
.details {
    height: 580px;
    overflow-y: auto;
    display: flex;
    .el-tabs__content {
        height: 100% !important;
        overflow-y: auto !important;
        & > div {
            padding-bottom: 30px;
        }
    }
}
.list-warp {
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .list-info {
        border-bottom: 1px solid #ebeef5;
        &:last-child {
            border-bottom: none;
        }
        .item {
            height: 35px;
            line-height: 35px;
            text-indent: 10px;
            border-right: 1px solid #ebeef5;
            &:last-child {
                border-right: none;
            }
            &:nth-child(odd) {
                background: #efefef94;
                text-align: center;
            }
            &:nth-child(even) {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}
.goods-warp {
    margin: 20px 0;
    ul {
        height: 45px;
        line-height: 45px;
        border: 1px solid #ebeef5;
        border-bottom: none;
        display: flex;
        li {
            text-indent: 10px;
            min-width: 180px;
            flex: 1;
            span {
                font-weight: 600;
            }
        }
    }
}
.logistics-info {
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    li {
        height: 45px;
        line-height: 45px;
        text-indent: 10px;
        border-bottom: 1px solid #ebeef5;
        display: flex;
        &:last-child {
            border-bottom: none;
        }
        strong {
            width: 200px;
            text-align: center;
            border-right: 1px solid #ebeef5;
            background: #efefef94;
            font-weight: 600;
        }
        &:hover {
            background: #f0f9eb;
        }
    }
}
.alink {
    color: #30cc7b;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.orderbox {
    height: 560px;
    overflow-y: auto;
    .el-form {
        margin: 0 auto;
    }
}
</style>