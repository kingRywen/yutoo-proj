<template>
    <div v-loading='loading'>
        <!-- 查看订单详情 -->
        <div class='item'>
            <div class='left'>预警时间</div>
            <div class='right'>{{warnTime}}</div>
        </div>
        <div class='item'>
            <div class='left'>申请时间</div>
            <div class='right'>{{applyTime}}</div>
        </div>
        <div class='item'>
            <div class='left'>回复时间</div>
            <div class='right'>{{replyTime}}</div>
        </div>
        <div class='item'>
            <div class='left'>订单编号</div>
            <div class='right'>{{orderId}}</div>
        </div>
        <div class='item'>
            <div class='left'>订单金额</div>
            <div class='right'>{{orderTotal}}</div>
        </div>
        <div class='item-img'>
            <div class='left'> 订单商品 <span></span></div>
            <div class='right'>
                <div class='right-in' v-for="item in orderDetails" :key="item.id">
                    <el-badge :value="item.number" type="primary">
                        <div>
                            <a :href='item.productUrl' target="_blink"><img v-lazy="item.imageUrl" alt="" class='loadingImg'></a>
                            <p>{{item.asin}}</p>
                        </div>
                    </el-badge>
                </div>
            </div>
        </div>
        <div class='item-img'>
            <div class='left'> 未赔偿商品 <span></span></div>
            <div class='right'>
                <div class='right-in' v-for="item in taskClaimAsins" :key="item.id">
                    <el-badge :value="item.quantityDifference" type="primary">
                        <div>
                            <a :href="item.productUrl" target="_blink"><img v-lazy="item.imageUrl" class='loadingImg' alt=""></a>
                            <p>{{item.asin}}</p>
                        </div>
                    </el-badge>
                </div>
            </div>
        </div>
        <div class='item'>
            <div class='left'>未赔偿金额</div>
            <div class='right'>{{orderDifference}}</div>
        </div>
        <div class='item'>
            <div class='left'>买家邮箱</div>
            <div class='right'>{{order.buyerEmail}}</div>
        </div>
        <div class='item' style='border-bottom:1px solid #e5e5e5;'>
            <div class='left'>买家配送地址 <span></span></div>
            <div class='right'>
                <p>{{order.buyerName}}</p>
                <p>{{order.addrCountry}}</p>
                <p>{{order.addrState}}</p>
                <p>{{order.addrCity}}</p>
                <p>{{order.addrStreet}}</p>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            loading:true,

            warnTime:"",//预警时间
            applyTime:"",//申请时间
            replyTime:"",//回复时间
            orderId:"",//订单编号
            orderTotal:"",//订单金额
            orderDetails:[],//订单商品
            taskClaimAsins:[],//未赔偿商品
            orderDifference:"",//未赔偿金额
            order:{
                buyerEmail:"66",//买家邮箱
                buyerName:"66",//买家名称
                addrCountry:"66",//两位数国家/地区代码
                addrState:"66",//州
                addrCity:"66",//城市
                addrStreet:"66",//街道
            }
        };
    },
    methods: {
        getData(){
            this.$api['taskClaimRefundOrderDetails']({
                taskId:this.params.taskId
            })
            .then(data => {
                //console.log(data);
                if(data.code===0){
                    this.loading=false;

                    let res=data.data;
                    this.warnTime=res.warnTime;
                    this.applyTime=res.applyTime;
                    this.replyTime=res.replyTime;
                    this.orderId=res.orderId;
                    this.orderTotal=res.orderTotal;
                    this.orderDetails=res.orderDetails;
                    this.taskClaimAsins=res.taskClaimAsins;
                    this.orderDifference=res.orderDifference;
                    this.order=res.order;
                }
            }).catch(() => {
                 this.loading=false;
            })
        }
    },
    created() {
        this.getData()
    },
};
</script>

<style scoped lang="less">
.item{
    display:flex;
    border:1px solid #e5e5e5;
    border-bottom:none;
    text-align: center;
    line-height:30px;
    .left{
        width:30%;
        background-color: #f5f5f5;
        display: inline-block;
        border-right:1px solid #e5e5e5;
        span{
             display: inline-block;
             height: 100%;
             width: 0;
             vertical-align: middle;
        }
    }
    .right{
         width:70%;
         text-align: left;
         padding-left: 10px;
         p{
             padding: 0;
             margin: 0;
             //margin-left: 8px;
         }
    }
}
.item-img{
    display:flex;
    border:1px solid #e5e5e5;
    border-bottom:none;
    text-align: center;
    min-height:100px;
    .left{
        width:30%;
        background-color: #f5f5f5;
        border-right:1px solid #e5e5e5;
        display: inline-block;
        span{
            display: inline-block;
            height: 100%;
            width: 0;
            vertical-align: middle; 
        }
    }
    .right{
         width:70%;
         display: flex;
         justify-content: space-around;
         flex-wrap: wrap;
        .right-in{
            width: 140px;
            margin-top: 10px;
            margin-bottom: 10px;
            //border:1px solid #e5e5e5;
            img{
                display: block;
                //border:1px solid #e5e5e5;
                width: 100px;
                height: auto;
                margin:0 auto;
            }
        }
    }
}
</style>
