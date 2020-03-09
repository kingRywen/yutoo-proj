<template>
<!-- 编辑产品原价 -->
    <div v-loading='loading'>
        <div class='top'>
            <span>SKU</span>
            <span>原价</span>
        </div>
        <div class='row' v-for='item in data' :key='item.id'>
            <div>{{item.sku}}</div>
            <div>
              <span>$ </span> <el-input v-model.trim="item.priceOld" placeholder="请输入值" style='display:inline-block;width:230px;margin-left:20px;' size='mini'></el-input>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            data:[],
            loading:true,
        };
    },
    methods: {
        _initData(){
            this.loading=true;
            let {sellerId,siteId}=this.sellerData;

            this.$api['priceSeoManualListProductPrice']({
                sellerId,
                siteId,
                ids:this.params.productId
            })
            .then(data => {
                this.data=data.data;
                this.loading=false;
                //console.log(data);
            }).catch(() => {
                 this.loading=false;
            })
        },
        _submit(){
             let {sellerId,siteId}=this.sellerData;
             return this.$api['priceSeoManualUpdateProductPrice']({
                 sellerId,
                 siteId,
                 list:this.data
             })
        }
    },
    created() {

    },
};
</script>

<style scoped lang="less">
.top{
    line-height: 40px;
    background-color: #f9f9f9;
    border:1px solid #dcdcdc;
    span{
        display: inline-block;
        text-align: center;
        &:first-child{
            width: 300px;
            border-right: 1px solid #dcdcdc;
        };
        &:last-child{
            width: 300px;
        };
    }
}
.row{
    line-height: 40px;
    border:1px solid #dcdcdc;
    div{
        display: inline-block;
        text-align: center;
        &:first-child{
            width: 300px;
            border-right: 1px solid #dcdcdc;
        };
        &:last-child{
            width: 300px;
        };
    }
}
</style>
