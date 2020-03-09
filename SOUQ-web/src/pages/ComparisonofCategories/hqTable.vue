<template lang="html">
    <table class="hq-table" v-loading="loading" element-loading-text="数据加载中">
        <tr class="hq-tr" >
            <template v-for="item in menuArr">
                <th>{{item}}</th>
            </template>
        </tr>
        <template v-for="item in data">
            <tr class="hq-tr">
                <td>{{item.category | isexist }}</td>
                <td>{{item.productCnt | isexist }}</td>
                <td>{{item.newReviewCnt | isexist }}</td>
                <td>{{item.sellerCnt | isexist }}</td>
                <td>{{item.reviewCnt | isexist }}</td>
            </tr>
        </template>
    </table>
</template>

<script>
export default {
    filters:{
        isexist(val){
            if(val!=undefined || val!=null){
                return (val || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            }else{
               return "-"
            }
        }
    },
    props: {
        data:{
            type:Array,
            default:function (){
                return []
            }
        },
        loading:{
            type:Boolean,
            default:true,
        },
        menuArr:{
             type:Array,
             default:function (){
                 return ['对比类目','产品数','新增评价数','店铺数','总评价数']
             }
        }
    },
}
</script>

<style lang="scss" scoped>
    table{
    	border: 1px solid #dcdfe6;
        border-radius: 4px;
    }
    .hq-table{
        // width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        .hq-tr{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex:1;
            text-align: center;
            border-left:1px solid #dcdfe6;
            &:first-child{
               background-color: #f5f7fa;
               border: none;
            }
            th,td{
                padding: 26px 0;
                border-bottom: 1px solid #dcdfe6;
                font-family: 'Arial Normal', 'Arial';
                font-weight: 400;
                font-style: normal;
                font-size: 15px;
                color: #333333;
            }


        }
    }
</style>
