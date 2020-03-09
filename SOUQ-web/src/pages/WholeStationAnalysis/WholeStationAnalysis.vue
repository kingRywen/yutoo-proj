<template>
    <section class="hello-world">
            <statistics :statisticsLeft_Data="statisticsLeft_Data" :statisticsRight_Data="statisticsRight_Data" :paramsGoods="paramsGoods" :paramsShop="paramsShop"/>
            <sell @sellTime="sellTime" :option = "sellOption" :loading="sellLoadng"/>
            <count @countTime="countTime" :option = "countOption" :loading = "countLoading"/>
            <allCount  @allCountTime="allCountTime" :option = "allCountOption" :loading = "allCountLoading"/>
            <commodityDistribution @commodityDistributionTime="cDistributionTime"  :option = "cOption" :loading = "cLoading" :CareaList="CareaList"/>
            <shopDistribution @sDistributionTime="sDistributionTime" :loading = "sloading" :option= "sOption" :SareaList="SareaList" />
    </section>
</template>
<script type="text/javascript">
    import statistics from './statistics/statistics';
    import sell from './sell/sell';
    import count from './count/count';
    import allCount from './allCount/allCount';
    import commodityDistribution from './commodity-distribution/commodity-distribution';
    import shopDistribution from './shop-distribution/shop-distribution';
    export default {
        components:{
            statistics,
            sell,
            count,
            allCount,
            commodityDistribution,
            shopDistribution
        },
        props:{
             paramsGoods:{
                 type:String,
                 default:""
             },
             paramsShop:{
                 type:String,
                 default:""
             },
            statisticsLeft_Data:{
                type:Object,
                default:function() {
                    return {}
                }
            },
            statisticsRight_Data:{
                type:Object,
                default:function() {
                    return {}
                }
            },
            sellOption:{
                type:Object,
                default:function() {
                    return {}
                }
            },
            sellLoadng:{
                type:Boolean,
                default:true
            },
            countOption:{
                type:Object,
                default:function() {
                    return {}
                }
            },
            countLoading:{
                type:Boolean,
                default:true
            },

            allCountOption:{
                type:Object,
                default:function() {
                    return {}
                }
            },
            allCountLoading:{
                type:Boolean,
                default:true
            },

            cOption:{
                type:Object,
                default:function() {
                    return {}
                }
            },
            CareaList:{
                type:Array,
                default:function() {
                    return []
                }
            },
            cLoading:{
                type:Boolean,
                default:true
            },
            sOption:{
                type:Object,
                default:function() {
                    return {}
                }
            },
            SareaList:{
                type:Array,
                default:function() {
                    return []
                }
            },
            sloading:{
                type:Boolean,
                default:true
            }

        },
        methods:{
            sellTime(val){
                this.$emit('sellTime',val)
            },
            countTime(val){
                this.$emit('countTime',val)
            },
            allCountTime(val){
                this.$emit('allCountTime',val)
            },
            cDistributionTime(val){
                this.$emit('cDistributionTime',val)
            },
            sDistributionTime(val){
                this.$emit('sDistributionTime',val)
            }



        },
        mounted() {

        }
    }
</script>
<style lang="scss">
    ul,li{
        list-style: none;
    }
    .hello-world{
        position: relative;
        .chart{
            margin-bottom: 15px;
        }
    }
</style>
