<template lang="html">
    <div class="print">
        <div class="printBtnBox">
            <el-button plain @click="print">打印</el-button>
        </div>
        <div class="content">
            <div id="text">
                hello
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods:{
        print(){
            //1.获取需要打印的内容
            var newstr = document.getElementById('text').innerHTML
            //保存当前页面的HTML
            var oldstr = document.body.innerHTML;
            //把当前页面替换为打印内容HTML
            document.body.innerHTML = newstr;
            //打印
            window.print();
            //还原页面
            document.body.innerHTML = oldstr;
        }
    },
    mounted(){
        document.title = this.$route.query.title

        console.log(this.$route)
    }
}
</script>

<style lang="scss">
    .print{
        width: 70%;
        margin: 0 auto;
        .printBtnBox{
            margin: 20px 0;
        }
    }

</style>
