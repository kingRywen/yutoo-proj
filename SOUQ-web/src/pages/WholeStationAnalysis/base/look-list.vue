<template lang="html">
        <ul class="lookList">
            <template v-for="item in dataList">
                <li>
                    <div>{{item.productCnt | toThousands}} {{tag}}</div>
                    <div>{{item.productCntRate}}</div>
                    <div>
                        <el-button type="success" icon="el-icon-menu" size="small" class="btnlist">
                            <router-link :to="{ path:item.params.url,  query:item.params }">{{item.listName}}</router-link>
                        </el-button>
                    </div>
                </li>
            </template>
        </ul>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    filters:{
        toThousands(num){
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        }
    },
    props:{
        dataList:{
            type:Array,
            default:function (){
                return []
            }
        },
        tag:{
            type:String,
            default:""
        }
    }


}
</script>

<style lang="scss" >
    .lookList{
        flex: 1;
        margin-top: 22px;
        li{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin-bottom: 26px;
            &>div{
                font-size: 20px;
                color:#333;
                line-height: 34px;
                &:last-child{
                    line-height: 0;
                }
                .btnlist{
                    background: #1faeae;
                    border: none;
                }
            }
        }
    }
</style>
