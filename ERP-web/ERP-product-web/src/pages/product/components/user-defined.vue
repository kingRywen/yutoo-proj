<template lang="html">
    <el-popover placement="bottom" width="250" trigger="click">
        <el-checkbox-group v-model="_checkList" class="list">
            <el-checkbox :label="item" v-for="(item,index) in data">{{item}}</el-checkbox>
        </el-checkbox-group>
        <el-button type="info" plain size="medium" class="affirm" @click="onAffirm">确认应用</el-button>
        <el-button slot="reference"  size="medium">
            <slot></slot>
        </el-button>
    </el-popover>
</template>

<!--
    data为必传 =>数组
    checkList为选中的 =>数组
    selectCheck 传入的函数.用于子组件数据改变时触发父亲方法更新数据
    @handle-affirm 确认应用时触发
 -->

<script>
export default {
    props:{
        data:{
            type:Array,
            default:()=>[],
            required: true
        },
        checkList:{
            type:Array,
            default:()=>[],
        },
        selectCheck:Function
    },
    computed:{
        _checkList:{
            get(){
                return this.checkList
            },
            set(val){
               this.selectCheck(val)
            }
        }
    },
    methods:{
        onAffirm(){
            this.$emit("handle-affirm",this.checkList)
        },

    }
}
</script>

<style lang="scss" scoped>
    .list{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 10px;
        .el-checkbox{
            margin: 0 10px 15px 0!important;
            flex: 1;
        }
    }
    .affirm{
        width: 100%;
    }
</style>
