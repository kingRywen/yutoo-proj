
<template lang="html">
    <div class="columnTable">
       <h3 v-if="title">{{title}}</h3>
       <ul>
           <template v-if="Array.isArray(data)">
                <li v-for="item in data" class="item" :class="title ? '':'first'">
                   <p>{{item.label}}</p>
                   <p>{{ item.value || '-' }}</p>
                </li>
           </template>
           <template v-else>
                <li v-for="item in columns" class="item" :class="title ? '':'first'">
                   <p>{{item.label}}</p>
                   <p>{{ data[item.value] || '-'}}</p>
                </li>
           </template>
       </ul>
    </div>
</template>

<script>

export default {
    props:{
        data:{
            type:[Array,Object],
            required: true,
        },
        title:{
            type:String,
            default:''
        },
        columns:{
            type:Array,
            default:()=>[]
        }

    },
    computed:{

    }


}
</script>

<style lang="scss" scoped>
    .columnTable{
        border: 1px solid #ccc;
        font-size: 14px;
        h3{
            height: 46px;
            line-height: 46px;
            text-align: center;
            background: #f2f2f2;
            font-size: 14px;
        }
        ul{
            .item{
                border-top: 1px solid #ccc;
                display: flex;
                flex-direction: row;
                line-height: 30px;
                height: 30px;
                p{
                    flex:1;
                    text-align: center;
                    &:first-child {
                        border-right:1px solid #ccc;
                        background: #f2f2f2;
                    }
                }
            }
            .first{
                &:first-child{
                    border-top: 0;
                }
            }
        }
    }
</style>
