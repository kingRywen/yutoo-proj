<template>
    <div class="codePrint" v-loading="loading" element-loading-text="数据加载中...">
        <ul :class="type?'flex':''">
            <li v-for="item in list">
                <div>
                    <VueBarcode :value="item" :options="options" tag="img"/>
                    <div class="codeText">{{item}}</div>
                </div>
            </li>
        </ul>
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
            list: [],
            loading: true,
            options: {
                width: 1,
                height: 85,
                displayValue: false
                // fontOptions: 'bold',
                // fontSize: 16
            }
        };
    },
    computed: {
        type() {
            return this.$route.query.type == 0 ? false : true;
        },
        amount() {
            return Number(this.$route.query.amount);
        }
    },

    methods: {
        getCodeInfo() {
            this.$api['warehouse/wmPackageBoxCode']({
                amount: this.amount
            }).then(res => {
                this.list = res.rows;
                this.loading = false;
                setTimeout(() => {
                    window.print();
                }, 500);
            });
        }
    },
    mounted() {
        this.getCodeInfo();
    }
};
</script>
<style lang="scss">
.codePrint {
    width: 740px;
    margin: 0 auto;
    padding: 20px;
    background: #fff;
    box-sizing: border-box;
    .flex {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .codeText {
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        font-family: unset;
    }
    li {
        display: flex;
        margin-bottom: 10px;
    }
}
</style>
