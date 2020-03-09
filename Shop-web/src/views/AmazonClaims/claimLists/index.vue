<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label='亚马逊丢件库存,未赔偿' name="first" :lazy='true'>
                <Lose  v-if=' activeName==="first" ' />
            </el-tab-pane>
            <el-tab-pane  label='亚马逊损坏库存,未赔偿'  name="second" :lazy='true'>
                <Damage v-if=' activeName==="second" ' />
            </el-tab-pane>
            <el-tab-pane  label='客户退款未退回库存,未赔偿'  name="three" :lazy='true'>
                <DidNotReturn v-if=' activeName==="three" ' />
            </el-tab-pane>
             <el-tab-pane  label='费用不对'  name="four" :lazy='true'>
                <CostIsWrong v-if=' activeName==="four" ' />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Lose from "./lost/index";
import Damage from "./damage/index";
import DidNotReturn from "./didNotReturn/index";
import CostIsWrong from "./CostIsWrong/index";
export default {
    components:{
        Lose,
        Damage,
        DidNotReturn,
        CostIsWrong
    },
    data() {
        return {
            activeName:"first",
        };
    },
    methods: {

    },
    created() {
        if(this.$route.query.type){
            let type = this.$route.query.type 
            switch (type) {
                case 1:
                    this.activeName = 'first';
                break;  
                case 2:
                    this.activeName = 'second';
                break;
                case 3:
                    this.activeName = 'three';
                break;
                default:
                   this.activeName = 'four';  
            }
        }
    },
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
