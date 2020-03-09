<template>
    <!-- 拣货清单 -->
    <div class="inPrint">
        <template v-for="(item,index) in list">
            <div class="pickinglist-warp" :key="index">
                <div class="title-text">{{item.inventoryType}}</div>
                <div class="title-info">
                    <div class="title-warp">
                        <div class="time">{{item.createTime}}</div>
                        <div style="margin-left:20px;">{{item.warehouseName}}</div>
                    </div>
                    <div class="code">
                        <VueBarcode ref="bar" :value="item.batchNumber" :options="barOptions" tag="img"/>
                    </div>
                </div>
                <el-table :data="item.locations" border show-summary :summary-method="getSummaries" style="width: 100%">
                    <el-table-column type="index" label="编号" align="center" width="100"></el-table-column>
                    <el-table-column prop="area" label="区域" align="center"></el-table-column>
                    <el-table-column prop="wmLocationName" label="库位" align="center"></el-table-column>
                </el-table>
            </div>
        </template>
    </div>
</template>

<script>
import VueBarcode from '@chenfengyuan/vue-barcode';
export default {
    components: {
        VueBarcode
    },
    data() {
        return {
            barOptions: { displayValue: false, height: 23, margin: 5 },
            list: []
        };
    },
    methods: {
        getInfo(wmInventoryPlanIds) {
            this.$api['warehouse/wmInventoryPlanPrint']({
                wmInventoryPlanIds
            }).then(res => {
                this.list = res.rows;
                this.$nextTick(() => {
                    setTimeout(() => {
                        window.print();
                    });
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
                if (index === 1) {
                    sums[index] = data.length;
                    return;
                }
                if (index === 2) {
                    sums[index] = data.length;
                    return;
                }
            });
            return sums;
        }
    },
    created() {
        document.title = this.$route.query.title;
        let p = [];
        if (Array.isArray(this.$route.query.wmInventoryPlanIds)) {
            p = this.$route.query.wmInventoryPlanIds;
        } else {
            p = Array.of(this.$route.query.wmInventoryPlanIds);
        }
        this.getInfo(p);
    }
};
</script>

<style lang="scss" scope>
@import '@/assets/css/print.scss';
table {
    margin-bottom: 0 !important;
    border-bottom: 0px solid #ebeef5 !important;
}
.inPrint {
    padding: 20px;
    margin: 0 auto;
    width: 740px;
    background: #fff;
    height: 100%;
    box-sizing: border-box;

    .pickinglist-warp {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px dashed #ccc;
        &:last-child {
            border: none;
        }
        .title-text {
            font-size: 14px;
            font-weight: 700;
            padding-left: 10px;
        }
    }
    .title-info {
        margin-bottom: 10px;
        border-bottom: 1px solid #666;
        display: flex;
        justify-content: space-between;
    }
    .title-warp {
        display: flex;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
    }
}
</style>


