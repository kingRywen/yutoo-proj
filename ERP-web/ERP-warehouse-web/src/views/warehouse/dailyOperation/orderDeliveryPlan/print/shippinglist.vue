<template>
    <!-- 发货清单 -->
    <div class="shippinglist">
        <template v-for="(item,index) in list">
            <div :key="index" class="shippinglist-warp">
                <div class="title-warp">
                    <div class="left">
                        <div class="title-text">发货清单</div>
                        <div class="time">{{item.time}}</div>
                    </div>
                    <div class="scanCode">
                        <VueBarcode ref="bar" :value="item.packageNumber" :options="barOptions" tag="img"/>
                    </div>
                </div>
                <div class="address">地址：{{item.customerAddress}}</div>
                <el-table :data="item.productList" border style="width: 100%">
                    <el-table-column type="index" label="编号" align="center"></el-table-column>
                    <el-table-column prop="nameZh" label="产品名称" align="center"></el-table-column>
                    <el-table-column label="型号及规格" align="center">
                        <template slot-scope="scope">
                            <div v-for="(j,k) in scope.row.variantProperty" :key="k">{{`${j.propertyName}：${j.propertyValue}`}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="数量" align="center"></el-table-column>
                    <el-table-column prop="price" :label="`单价（${item.currency}）`" align="center"></el-table-column>
                    <el-table-column prop="money" :label="`金额（${item.currency}）`" align="center"></el-table-column>
                </el-table>
            </div>
        </template>
        <div>
            <div>
                <span><b>发货备注：</b></span> {{list[0].deliveryRemark}}
            </div>
            <div>
                <span><b>礼品备注：</b></span>{{list[0].giftRemark}}
            </div>
        </div>
    </div>
</template>

<script>
import VueBarcode from '@chenfengyuan/vue-barcode';
export default {
    components: {
        VueBarcode
    },
    props: {
        isLoading: Function
    },
    data() {
        return {
            barOptions: { displayValue: false, height: 23, margin: 5 },
            list: []
        };
    },
    methods: {
        getInfo(wmPackageIds) {
            this.$api['warehouse/wmPackagePrint']({
                wmPackageIds,
                printType: 2
            }).then(res => {
                this.list = res.rows;
                this.$nextTick(() => {
                    this.isLoading();
                });
            });
        }
    },
    created() {
        let id = this.$route.query.wmPackageId;
        let wmPackageId = null;
        if (Array.isArray(id)) {
            wmPackageId = id;
        } else {
            wmPackageId = Array.of(id);
        }
        this.getInfo(wmPackageId);
    }
};
</script>

<style lang="scss" scope>
.shippinglist {
    .title-warp {
        display: flex;
        justify-content: space-between;
        padding: 0 0 0 10px;
        height: 40px;
        line-height: 40px;
        margin-bottom: 10px;
        border-bottom: 1px solid #666;
        .left {
            display: flex;
        }
        .title-text {
            font-size: 14px;
            font-weight: 700;
        }
        .time {
            margin-left: 25px;
        }
    }
    .address {
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #ccc;
    }
}
.shippinglist-warp {
    margin-bottom: 20px;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 20px;
    &:last-child {
        border: none;
    }
}
</style>


