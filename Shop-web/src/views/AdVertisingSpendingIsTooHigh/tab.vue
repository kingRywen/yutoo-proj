<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="广告产品异常" name="first">
                <first/>
            </el-tab-pane>
            <el-tab-pane label="广告花费占比过高" name="second" :lazy='true'>
                <second />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import second from "./index"
import first from "../shopsMonitor/allQuestionFile/adProductAbnormal/index"
export default {
    components:{
        first,
        second,
    },
    data() {
        return {
            activeName:"first"
        };
    },
    methods: {

    },
    created() {
        if ( this.$route.query.type) {

            switch (this.$route.query.type) {
                case 1 :
                   this.activeName='first' ;
                break;
                case 2 :
                   this.activeName='second' ;
                break;
                default:
                break;
            }
        }       
    },
};
</script>

<style scoped lang="less">

</style>
