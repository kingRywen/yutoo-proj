<template lang="html">
    <!-- 采购详情- -->
    <div class="detailsOfProcurement">
        <h3 class="title">查看详情 - {{purchaseNumber}}</h3>

        <el-tabs type="border-card" class="detailsOfProcurementTabs"
             v-loading="loading"
             element-loading-text="正在加载...">
            <el-tab-pane label="采购清单信息">
                <procurementInfo
                    :listA="listA"
                    :listB="listB"
                    :purchaseId="$route.params.purchaseId"
                    :state="state" 
                    :update='getOrderInfo'/>
            </el-tab-pane>
            <el-tab-pane label="历史下单记录">
                <historicalOrder :data='orderList'/>
            </el-tab-pane>
            <el-tab-pane label="历史销单记录">
                <historicalSalesList :data='salesList'/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import procurementInfo from './components/procurementInfo';

import historicalOrder from './components/historicalOrder';
import historicalSalesList from './components/historicalSalesList';

export default {
    props: {
        outsideUpdate: Function
    },
    data() {
        return {
            orderList: [], //下单记录
            salesList: [], //销单记录
            listA: [],
            listB: [],
            loading: false,
            state: null
        };
    },
    methods: {
        getOrderInfo() {
            this.loading = true;
            this.$api['procurement/detail']({
                purchaseId: +this.$route.query.purchaseId
            })
                .then(res => {
                    this.orderList = res.rows.lowerSingleRecord;
                    this.salesList = res.rows.pinOrderRecord;

                    this.listA = res.rows.list;
                    let arr = res.rows.products;
                    arr.map(item => {
                        item['purchaseNumber'] = res.rows.purchaseNumber;
                    });
                    this.listB = arr;
                    this.state = res.rows.endFlagName;
                    this.loading = false;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                    this.loading = false;
                });
        }
    },
    mounted() {
        this.getOrderInfo();
    },
    computed: {
        purchaseNumber() {
            return this.$route.query.purchaseNumber;
        }
    },
    components: {
        procurementInfo,
        historicalOrder,
        historicalSalesList
    }
};
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
.detailsOfProcurement {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    // padding-bottom: 15px;
    .title {
        height: 40px;
        background: #f2f2f2;
        line-height: 40px;
        margin-bottom: 15px;
        border-radius: 4px;
        text-indent: 18px;
        font-weight: 600;
        font-size: 16px;
        color: #009aff;
    }
    .detailsOfProcurementTabs {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
}
</style>
