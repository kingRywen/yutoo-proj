<template>
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="产品库" name="first">
            <products :p-params="pParams" ref="products"/>
        </el-tab-pane>
        <el-tab-pane label="评价库" name="second">
            <evaluates :p-params="pParams" ref="evaluates" v-on:changePage="changePage"/>
        </el-tab-pane>
        <el-tab-pane label="QA库" name="third">
            <QaLib :p-params="pParams" ref="QaLib" v-on:changePage="changePage"/>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import Products from "./products";
import Evaluates from "./evaluates";
import QaLib from "./QaLib";
export default {
  components: {
    Products,
    QaLib,
    Evaluates
  },
  props: ["pParams"],
  data(){
    return{
      activeName:'first',
    }
  },
  methods: {
    getList() {
      this.$refs[this.activeName === 'first' ? 'products' : 'evaluates'].getList()
    },
    changePage(parentAsin){
      this.activeName ='first'
      this.$refs.products.parentHandleclick(parentAsin);
    },
    handleClick(tab, event) {
      if(tab.name==='first'){
        this.$refs.products.restList();
      }else if(tab.name==='second'){
        this.$refs.evaluates.restList();
      } else  if(tab.name==='third'){
        this.$refs.QaLib.restList();
      }
    }
    
  }
};
</script>
<style lang="less" scoped>
.el-tabs {
  -webkit-box-shadow: 0 0 0 0;
  box-shadow: 0 0 0 0;
  /deep/.el-tabs__content {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

