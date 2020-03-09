<template>
    <div class="print" v-loading="loading" element-loading-text="数据加载中..." element-loading-spinner="el-icon-loading">
        <component :is="printType" class="print-content" :isLoading="isLoading"></component>

        <!-- <div class="btn">
            <el-button plain @click="$router.go(-1)">取消</el-button>
            <el-button type="primary" @click="print">打印</el-button>
        </div>-->
    </div>
</template>

<script>
import pickinglist from './pickinglist';
import shippinglist from './shippinglist';
import overweightOrFragile from './overweightOrFragile';

export default {
    components: {
        pickinglist,
        shippinglist,
        overweightOrFragile
    },
    data() {
        return {
            printType: '',
            loading: true
        };
    },
    methods: {
        isLoading() {
            setTimeout(() => {
                this.loading = false;
                this.$nextTick(() => {
                    window.print();
                });
            }, 500);
        }
    },
    created() {
        document.title = this.$route.query.title;
        this.printType = this.$route.query.type;
    }
};
</script>
<style lang="scss" scope>
@import '@/assets/css/print.scss';
table {
    margin-bottom: 0 !important;
    border-bottom: 0px solid #ebeef5 !important;
}
img {
    display: inline-block !important;
}
.print {
    // display: flex;
    // flex-direction: column;
    padding: 20px;
    margin: 0 auto;
    width: 740px;
    background: #fff;
    height: 100%;
    box-sizing: border-box;
    .print-content {
        flex: 1;
    }
    .btn {
        text-align: center;
        height: 38px;
    }
}
</style>
