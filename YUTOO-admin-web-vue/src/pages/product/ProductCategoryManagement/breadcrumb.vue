<template lang="html">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">

        <el-breadcrumb-item v-for="item in data" :to="{path:item.url}">{{item.title}}</el-breadcrumb-item>

    </el-breadcrumb>
</template>

<script>
export default {
    props:{
        data:{
            type:Array,
            default:()=>[]
        }
    },
    data(){
        return {

        }
    },
    methods:{

    }
}
</script>

<style lang="scss">
    .nav{
        padding: 10px 0 12px 5px;
        font-size: 13px;
        background: #ececec;
    }
</style>
