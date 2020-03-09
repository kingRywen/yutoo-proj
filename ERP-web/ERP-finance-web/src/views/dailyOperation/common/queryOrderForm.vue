<template lang="html">
    <div
        class="queryInfoBox"
        v-loading="loading"
        element-loading-text="正在加载...">
        <yt-table :data="listA" :columns="columnsA" :border="true" :selection="false"/>
        <yt-table :data="listB" :columns="columnsB" :border="true" :selection="false"/>

        <yt-table :data="listC" :columns="columnsC" :border="true" :selection="false" style="margin-top:25px;">
            <el-table-column label="操作" width="100" align="center" slot="right" fixed="right">
                <template slot-scope="scope">                    
                    <el-tooltip class="item" effect="dark" content="历史采购价" placement="bottom">
                        <i class="iconfont icon-caigoujiage iconBtn" @click="queryhistoryPrice(0,scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="历史下单价" placement="bottom">
                        <i class="el-icon-sold-out iconBtn" @click="queryhistoryPrice(1,scope.row)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </yt-table>

        <!--  -->
        <el-dialog :title="historyDialogInfo.title" :visible.sync="historyDialogInfo.visible" width="1200px"  center :append-to-body="true">

            <historyRecord ref="historyRecord"/>

            <span slot="footer" class="dialog-footer">
              <el-button @click="historyDialogInfo.visible = false">取 消</el-button>
              <el-button type="primary" @click="historyDialogInfo.visible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!--  -->



    </div>
</template>

<script>
/* eslint-disable */
import historyRecord from './historyRecord';
export default {
    data() {
        return {
            form: {},
            listA: [],
            columnsA: [
                { value: 'purchaseNumber', label: '采购清单号' },
                { value: 'estimatePrice', label: '下单总额' },
                { value: 'freightAmount', label: '运费总额' },
                { value: 'toatlDiscount', label: '优惠总额' },
                { value: 'procurementPlatformNumber', label: '采购平台订单号' },
                { value: 'alipayTradeNumber', label: '交易号' },
                { value: 'invoiceFlagName', label: '是否开发票' },
                { value: 'settlementTime', label: '结算时间' },
                { value: 'advanceTime', label: '预计付款时间', width: '180px' }
            ],
            listB: [],
            columnsB: [
                { value: 'purchaseTypeName', label: '采购类型' },
                { value: 'accountPeriod', label: '账期' },
                { value: 'paymentAccount', label: '付款账号' },
                { value: 'expectedArrivalTime', label: '预计到货时间' },
                { value: 'payThePaymentFlagName', label: '是否到付运费' },
                { value: 'orderStateName', label: '下单状态' },
                { value: 'examineRemark', label: '审核备注' },
                { value: 'lowerSingleRemark', label: '下单备注' },
                { value: 'trackNumber', label: '追踪号' }
            ],
            listC: [],
            columnsC: [
                {
                    value: 'productImg',
                    label: '图片',
                    width: 100,
                    img: true,
                    style: {
                        width: 60,
                        height: 60
                    },
                    bulkyHeight: 180
                },
                { value: 'productSku', label: '自定义SKU', width: '140px' },
                {
                    value: 'rebateTaxFlag',
                    label: '订单是否退税',
                    width: '100px'
                },

                { value: 'productBarCode', label: '条形码' },
                { value: 'productTypeName', label: '产品类型' },
                { value: 'packState', label: '打包状态' },
                { value: 'productName', label: '产品名称' },
                { value: 'productStateName', label: '产品状态' },
                {
                    label: '属性',
                    prop: {
                        key: 'propertyName',
                        value: 'propertyValue'
                    },
                    children: 'variantPropertys'
                },
                { value: 'supplierName', label: '供应商' },
                { value: 'availableStock', label: '可用库存' },
                { value: 'requirement', label: '总需求量' },
                { value: 'lowerSingleQuantity', label: '总下单量' },
                { value: 'supplierPrice', label: '供应商报价', width: '100px' },
                { value: 'productSingleAmount', label: '下单单价' },
                { value: 'singleFreight', label: '单个运费' }
            ],
            loading: false,
            historyDialogInfo: {
                title: '',
                visible: false
            }
        };
    },
    methods: {
        //历史价格
        queryhistoryPrice(type, item) {
            this.historyDialogInfo.visible = true;
            let self = this;
            this.$nextTick(() => {
                if (type) {
                    self.historyDialogInfo.title = `历史下单记录-${item.productSku}`;
                    self.$refs.historyRecord.getHistoryInfo(
                        type,
                        item.productId
                    );
                } else {
                    self.historyDialogInfo.title = `历史采购记录-${item.productSku}`;
                    self.$refs.historyRecord.getHistoryInfo(
                        type,
                        item.productId,
                        item.purchaseId
                    );
                }
            });
        },

        getListData(lowerSingleNumber) {
            this.loading = true;
            console.log(lowerSingleNumber);
            this.$api['procurement/lowerSingleRecord']({
                lowerSingleNumber
            })
                .then(res => {
                    this.loading = false;
                    this.listA = res.rows.list1;
                    this.listB = res.rows.list2;
                    this.listC = res.rows.products;
                })
                .catch(err => {
                    this.loading = false;
                });
        }
    },
    components: {
        historyRecord
    }
};
</script>

<style lang="scss">
.queryInfoBox {
    padding-bottom: 50px;
    max-height: 600px;
    overflow-y: auto;
}
</style>
