<template>
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-if='$route.name==="rankingResearchIndex"'>
            <el-tab-pane label="自然搜索排名研究" name="first">
                <index />
            </el-tab-pane>
            <el-tab-pane label="排名研究" name="second">
                <tab2 />
            </el-tab-pane>
        </el-tabs>
        <router-view></router-view>
    </div>
</template>

<script>
import index from './index' ;
import tab2 from './tab2/index' ;
export default {
    components:{
        index,
        tab2
    },
    data() {
        return {
            activeName:'first'
        };
    },
    methods: {
        handleClick(){

        },
    },
    created() {

    },
};
</script>

<style scoped lang="scss">

</style>
