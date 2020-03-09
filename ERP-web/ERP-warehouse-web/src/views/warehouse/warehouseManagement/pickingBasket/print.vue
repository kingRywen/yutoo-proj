<template>
    <div class="pbPrint">
        <template v-for="(item,index) in list">
            <div class="pbPrint-warp" :key="index">
                <h3>{{whatPrint?item.basketModel:item.seatModel}}</h3>
                <VueBarcode ref="bar" :value="whatPrint?item.basketCode:item.seatCode" :options="barOptions" tag="img"/>
                <p>{{whatPrint?item.basketCode:item.seatCode}}</p>
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
            barOptions: { displayValue: false, height: 58, margin: 5 },
            list: []
        };
    },
    methods: {
        getInfo(wmPickingBasketIds) {
            let key = this.whatPrint
                ? 'wmPickingBasketIds'
                : 'wmPickingBasketSeatIds';

            this.$api['warehouse/' + this.$route.query.type]({
                [key]: wmPickingBasketIds
            }).then(res => {
                console.log(res);
                this.list = res.rows;
                setTimeout(() => {
                    this.$nextTick(() => {
                        window.print();
                    });
                });
            });
        }
    },
    computed: {
        //false 为拣货篮位置管理  true为拣货篮
        whatPrint() {
            if (this.$route.query.type == 'WmPickingBasketSeatPrint') {
                return false;
            } else {
                return true;
            }
        }
    },
    mounted() {
        let arr = [];
        //检货蓝打印
        if (this.whatPrint) {
            if (Array.isArray(this.$route.query.wmPickingBasketIds)) {
                arr = this.$route.query.wmPickingBasketIds;
            } else {
                arr = Array.of(this.$route.query.wmPickingBasketIds);
            }
            //检货蓝位置打印
        } else {
            if (Array.isArray(this.$route.query.wmPickingBasketSeatIds)) {
                arr = this.$route.query.wmPickingBasketSeatIds;
            } else {
                arr = Array.of(this.$route.query.wmPickingBasketSeatIds);
            }
        }
        this.getInfo(arr);
    }
};
</script>
<style lang="scss" scope>
table {
    page-break-after: always;
}
.pbPrint {
    padding: 20px;
    margin: 0 auto;
    width: 740px;
    background: #fff;
    height: 100%;
    box-sizing: border-box;
    .pbPrint-warp {
        padding: 15px 0;
        border-bottom: 1px dashed #ccc;
        text-align: center;
        &:first-child {
            border-top: 1px dashed #ccc;
        }
        h3 {
            font-size: 72px;
            margin: 0;
        }
        p {
            font-size: 28px;
            margin: 0;
        }
    }
}
</style>