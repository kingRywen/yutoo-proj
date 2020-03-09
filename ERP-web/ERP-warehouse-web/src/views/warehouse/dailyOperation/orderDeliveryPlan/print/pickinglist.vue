<template>
    <!-- 拣货清单 -->
    <div class="pickinglist">
        <template v-for="(item,index) in list">
            <div class="pickinglist-warp" :key="index">
                <div class="title-warp">
                    <div class="title-text">拣货单</div>
                    <div class="time">{{item.time}}</div>
                </div>
                <el-table :data="item.productList" border show-summary :summary-method="getSummaries" style="width: 100%">
                    <el-table-column prop="productImg" label="主图" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.productImg" width="50" height="auto">
                        </template>
                    </el-table-column>
                    <el-table-column prop="productSku" label="SKU" align="center"></el-table-column>
                    <el-table-column prop="amount" label="数量" align="center"></el-table-column>
                    <el-table-column prop="location" label="库位" align="center"></el-table-column>
                    <el-table-column prop="nameZh" label="产品名" align="center"></el-table-column>
                    <el-table-column prop="deliveryRemark" label="发货备注" align="center"></el-table-column>
                    <el-table-column prop="giftRemark" label="礼品备注" align="center"></el-table-column>
                </el-table>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        isLoading: Function
    },
    data() {
        return {
            list: []
        };
    },
    methods: {
        getInfo(wmPackageIds) {
            this.$api['warehouse/wmPackagePrint']({
                wmPackageIds,
                printType: 1
            }).then(res => {
                this.list = res.rows;
                this.$nextTick(() => {
                    this.isLoading();
                });
            });
        },
        getSummaries(param) {
            
            const { columns, data } = param;
            
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                if (index === 1 || index === 3) {
                    sums[index] = data.length;
                    return;
                }
                if (index === 2) {
                    let arr = data.map(i => i.amount);
                    sums[index] = arr.reduce((i, v) => i + v);
                    return;
                }
                if (index === 4) {
                    sums[index] = data[0].warehouseName || '-';
                    return;
                }
                if (index === 5) {
                    sums[index] = this.list[0].deliveryRemark || '-'
                    return;
                }
                if (index === 6) {
                    sums[index] = this.list[0].giftRemark || '-'
                    return;
                }
            });
            return sums;
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
.pickinglist {
    .pickinglist-warp {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px dashed #ccc;
        &:last-child {
            border: none;
        }
    }
    .title-warp {
        display: flex;
        height: 40px;
        line-height: 40px;
        margin-bottom: 10px;
        border-bottom: 1px solid #666;
        padding: 0 10px;
        .title-text {
            font-size: 14px;
            font-weight: 700;
        }
        .time {
            margin-left: 25px;
        }
    }
}
</style>


