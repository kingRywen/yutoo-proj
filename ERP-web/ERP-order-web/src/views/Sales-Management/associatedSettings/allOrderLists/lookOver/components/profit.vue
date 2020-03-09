<template lang="html">
    <!-- 订单利润 -->
    <div class="profit">
        <el-row class="update">
            <el-col :span="5" >
                <el-button size="mini" round :loading="loading" type="primary" plain @click='updategetList'>重新计算订单费用</el-button>
                <el-button size="mini" round :loading="loadingPrice" type="primary" plain @click='update'>批量更新采购价</el-button>
            </el-col>
            <el-col :span="12">
                <ul class="numInfo">
                    <li> SKU数：{{info.skuCount}} </li>
                    <li>产品数：{{info.productCount}} </li>
                    <li>体积：{{info.volume}} </li>
                    <li> 重量：{{ info.weight}} </li>
                </ul>
            </el-col>
        </el-row>
        <yt-table :data="list" :columns="columns" :border="true" :selection="false"></yt-table>
        <ul class="ullist">
            <li>总收入:
                RMB:<span>{{ info.rmbPlus }}</span>
                {{info.currencyType}}:<span>{{info.primaryPlus}}</span>
            </li>
            <li>总支出:
                RMB:<span>{{ info.rmbReduce }}</span>
                {{info.currencyType}}:<span>{{info.primaryReduce}}</span>
            </li>
            <li>
                结余利润:
                RMB:<span>{{ info.rmbProfit }}</span>
                {{info.currencyType}}:<span>{{info.primaryProfit}}</span></li>
            <li>销售毛利率:
                <span> {{ info.proportion }}</span>
             </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list:[],
            columns:[
                {
                    value: "currencyName",
                    label: "币种",
                },
                {
                    value: "operatorPrice",
                    label: "操作金额",
                },
                {
                    value: "costTypeName",
                    label: "费用类型",
                },
                {
                    value: "rmbPrice",
                    label: "人民币金额",
                },
                {
                    value: "remark",
                    label: "备注",
                },
                {
                    value: "createTime",
                    label: "操作时间",
                },
            ],
            info:{},
            loading:false,
            loadingPrice:false
        }
    },
    methods:{
        update(){
            this.loadingPrice = true
            setTimeout(()=>{
                 this.$api['order/orderProfitUpdate']({
                     orderId:this.$route.query.orderServiceId
                 }).then(res=>{
                    this.$message.success(res.msg)
                    this.getList()
                    this.loadingPrice = false
                 }).catch(err=>{
                    this.$message.error(err.msg)
                    this.loadingPrice = false
                 })
            },500)
        },
        updategetList(){
            this.loading = true
            setTimeout(()=>{
                this.getList().then(()=>{
                    this.loading = false
                }).catch(()=>{
                    this.loading = false
                })
            },500)
        },
        getList(){
            return this.$api['order/orderProfitList']({
                orderId:this.$route.query.orderServiceId
            }).then(res=>{
                this.list = res.rows.details
                this.info = res.rows
                return true
            }).catch(err=>{
                this.$message.error(err.msg)
                return false
            })
        },
    }


}
</script>

<style lang="scss">
    @import '@/assets/css/common.scss';
    .ullist{
        text-align: right;
        font-size: 15px;
        padding-right: 10px;
        li{
            margin-top: 20px;
            font-size: 16px;
            span{
                color:#009944;
                font-size: 15px;
            }
        }
    }
    .update{
        margin-bottom: 10px;
        .numInfo{
            line-height: 28px;
            font-size: 15px;
            display: flex;
            li{
                margin-right: 20px;
            }
        }
    }
</style>
