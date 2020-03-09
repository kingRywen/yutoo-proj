<template>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="finance-refunds">
        <el-tab-pane label="借款管理" name="loan">
            <loan v-if="activeName=='loan'"/>
        </el-tab-pane>
        <el-tab-pane label="还款管理" name="repayment">
            <repayment v-if="activeName=='repayment'"/>
        </el-tab-pane>
        <el-tab-pane label="冲账管理" name="rush">
            <rush v-if="activeName=='rush'"/>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import loan from './loan/index';
import repayment from './repayment/index';
import rush from './rush/index';
export default {
    components: {
        loan,
        repayment,
        rush
    },
    data() {
        return {
            activeName: 'loan'
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>
<style lang="scss">
.appMain > div {
    padding: 0 !important;
}
.finance-refunds {
    .UniversalLayout {
        position: unset;
        padding: 0 16px 16px;
    }
}
</style>

