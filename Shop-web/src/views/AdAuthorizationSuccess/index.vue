<template>
    <div>
        <div class='big-div'>
            <p>{{text}}</p> 
            <p><el-button type='text' @click='$router.replace("/dash")' style=' font-size: 18px;'>返回店铺优化系统</el-button></p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            text:''
        };
    },
    methods: {

    },
    created() {
        this.text = this.$route.query.msg
    },
};
</script>

<style scoped lang="less">
.big-div{
    width: 100%;
    height: 200px;
    font-size: 24px;
    text-align: center;
    margin: 240px auto ;
}
</style>
