<template lang="html">
    <div class="operation_btn">
        <el-button type="primary" @click="onPushRule" size="medium">添加</el-button>
        <el-button type="primary" @click="delAll" size="medium">批量删除</el-button>
    </div>
</template>

<script>
export default {
    props:{
        isSelect:Array,
        default:function() {
            return []
        }
    },
    methods:{
        onPushRule(){
            this.$emit('addSkuRules',true)
        },
        delAll(){
           this.$emit("handleAllDel",this.isSelect)
        }
    }

}
</script>

<style lang="scss">
    .operation_btn {
        margin:10px 0 15px 0;
    }

</style>
