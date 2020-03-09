<template>
    <div>
        <el-radio-group v-model="radio1" @change='change' class="mb10">
            <el-radio-button label="问题父产品"></el-radio-button>
            <el-radio-button label="问题子产品"></el-radio-button>
            <el-radio-button label="评分问题"></el-radio-button>
        </el-radio-group>
        <component :is="componentId"></component>
    </div>
</template>
<script>
import proPar from "./problemParentProcuct";
import proChild from "./problemChildProduct";
import proGrade from "./gradeProblem";
export default {
    data() {
        return {
            radio1:"问题父产品",
            componentId:proPar
        };
    },
    methods: {
        change(v){
            //console.log(v);
            if(v==='问题父产品'){
                this.componentId=proPar ;
            }else if(v==='问题子产品'){
                 this.componentId=proChild ;
            }else{
                 this.componentId=proGrade ;
            }
        }
    },
    created() {

    },
};
</script>

<style scoped lang="less">

</style>
