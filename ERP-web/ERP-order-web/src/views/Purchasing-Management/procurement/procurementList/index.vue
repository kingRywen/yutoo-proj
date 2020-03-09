<template lang="html">
    <!-- 采购管理列表 -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tabs purchaseListWarp">
        <el-tab-pane label="待采购产品列表" name="first">
            <awaitProcurementList ref="awaitProcurementList" v-if="activeName=='first'"/>
        </el-tab-pane>
        <el-tab-pane label="采购清单列表" name="second">
            <detailedList ref="detailedList"  v-if="activeName=='second'"/>
        </el-tab-pane>
        <el-tab-pane label="采购订单管理" name="third" >
            <orderformList ref="orderformList" v-if="activeName=='third'"/>
        </el-tab-pane>
        <el-tab-pane label="销单管理" name="fourth" >
            <eliminateList ref="eliminateList" v-if="activeName=='fourth'"/>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
/* eslint-disable */
import awaitProcurementList from './awaitProcurementList/awaitProcurementList';
import detailedList from './detailedList/detailedList';
import orderformList from './orderformList/orderformList';
import eliminateList from './eliminateList/eliminateList';

export default {
    data() {
        return {
            name: '',
            activeName: localStorage.getItem('procurement_type_name')
                ? localStorage.getItem('procurement_type_name')
                : 'first'
        };
    },
    methods: {
        handleClick(tab, event) {
            this.$nextTick(() => {
                localStorage.setItem('procurement_type_name', tab.name);
                this.activeName = tab.name;
                this.getList(tab.name);
            });
        },
        getList(val) {
            switch (val) {
                case 'first':
                    break;
                case 'second':
                    this.$router.push({
                        path:
                            '/purchasingManagement/procurement/procurementList'
                    });
                    break;
                case 'third':
                    this.$router.push({
                        path:
                            '/purchasingManagement/procurement/procurementList'
                    });
                    break;
                case 'fourth':
                    this.$router.push({
                        path:
                            '/purchasingManagement/procurement/procurementList'
                    });
                    break;
            }
        }
    },
    destroyed() {
        localStorage.removeItem('procurement_type_name');
    },
    components: {
        awaitProcurementList,
        detailedList,
        orderformList,
        eliminateList
    }
};
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
.purchaseListWarp {
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-tabs__content {
        flex: 1;
        overflow-y: auto;
        .el-tab-pane {
            height: 100%;
            display: flex;
            flex-direction: column;
            .UniversalLayout {
                flex: 1;
                padding: 15px;
            }
        }
    }
}
</style>
