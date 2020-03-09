<template>
    <div>
         <!-- 店铺深度分析根据需求自定义的返回按钮 -->
        <ElButton
          @click.stop="customHandleBack.fn"
          type="text"
          icon="el-icon-back"
          style="position:absolute;right:22px;top:5px;"
        >返回</ElButton>
        <!-- 完 -->
        <el-tabs v-model="activeName" type="card" @tab-click='tabClick'>
            <el-tab-pane label="产品列表" name="first" :lazy='true'>
                <product-list  :bigCategorys='bigCategorys' @skipDataAnalysis='skipDataAnalysis' v-if='isShow' @customHandleBack='customHandleBackBtn' />
            </el-tab-pane>
            <el-tab-pane label="数据统计分析" name="second" :lazy='true'>
                <data-analysis @activeName='sendActiveName'/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import productList from './productList/index'; //产品列表
import dataAnalysis from './dataAnalysis/index';//数据统计分析
export default {
    data() {
        return {
            activeName:"first",

            bigCategorys:null,//数据统计分析传过来的数据

            isShow:true,

            timer:null,

            customHandleBack:{
                isShow:true,
                fn:null
            },
        };
    },
    methods: {

        //接收数据统计分析触发的事件,要转到产品列表页面
            sendActiveName(name){
                let parasms=name;
                parasms.skipFormDataAnalysis=true,//是否是从数据分析跳转过来的
                this.isShow=false;
                this.timer=setTimeout(()=>{
                    this.isShow=true;
                    this.activeName='first';
                    this.bigCategorys=parasms;
                })
            },
        //接受子组件自定义返回
            customHandleBackBtn(fn){
                this.customHandleBack.fn=fn;
            },
        //接受产品列表触发的事件
            skipDataAnalysis(){
                this.activeName='second'
            },
        //tab栏点击
            tabClick(){
                if(this.activeName==='first'){
                    let parasms=null;
                    this.isShow=false;
                    this.timer=setTimeout(()=>{
                        this.isShow=true;
                        this.bigCategorys=parasms;
                    });
                }
            }
    },
    created() {

    },
    watch:{
        activeName(){
            if(  this.activeName==='second' ){
                const fn =()=>{
                    const matched = this.$route.matched
                    const len = matched.length
                    const backRoute = matched[len - 2]
                    this.$router.push({
                        name: backRoute.name,
                        query: backRoute.query,
                        params: backRoute.params
                    })
                };
                this.customHandleBack.fn=fn;
            }
        }
    },
    components:{
        productList,
        dataAnalysis,
    },
    beforeDestory(){
        this.timer=null
    }
};
</script>

<style scoped lang="less">
.el-tabs {
  box-shadow: 0 0 0 0;
  /deep/.el-tabs__content {
    padding: 15px 0 0 0;
  }
}
</style>
