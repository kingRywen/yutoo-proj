<template>
    <div :id="id" style="height: 320px;"></div>
</template>
<script>
import echarts from 'echarts'
export default {
    props: ['id','option'],// 设置id 可同一页面多次引用
    data(){
        return{
            chart:null
        }
    },
    mounted(){
        this.initChart()
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    watch:{
        option(newP, oldP){
            this.chart.clear()
            this.setOption(newP)
        }
    },
    methods:{
        initChart(){
            let dom = document.getElementById(this.id);
            // this.chart = echarts.init(dom,'dark');
            this.chart = echarts.init(dom);
            this.setOption(this.option)
        },
        setOption(option){
            if(option===null){
                this.chart.setOption({
                // backgroundColor:'#F2F6FC',
                title: {
                left: "center", // 水平居中
                top:"center",  // 垂直居中
                text: "暂无数据",
                textStyle:{
                        color:'#909399',
                        fontStyle:'normal',
                        fontWeight:"normal",
                        fontSize:14
                    }
                }
                })  
            }else{
                if (option && typeof option === "object") {
                    this.chart.setOption(option, true);
                }
            }
        }
    }
    
}
</script>

<style lang="less" scoped>

</style>


