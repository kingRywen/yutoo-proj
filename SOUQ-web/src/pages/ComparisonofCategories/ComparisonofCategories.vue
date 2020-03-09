<template lang="html">
    <div class="CategoryContrast">
        <!--  -->
        <div class="category_warp">
            <!--  -->
            <div class="category_select">
                <el-cascader class="cascader_item"></el-cascader>
                <el-cascader class="cascader_item"></el-cascader>
                <el-cascader class="cascader_item"></el-cascader>
                <el-cascader class="cascader_item"></el-cascader>
                <el-cascader class="cascader_item"></el-cascader>
            </div>
            <!--  -->
            <div class="category_info">
                <el-tabs type="border-card" style="height:100%;">
                    <el-tab-pane label="产品数">用户管理</el-tab-pane>
                    <el-tab-pane label="新增评价数">配置管理</el-tab-pane>
                    <el-tab-pane label="店铺数">角色管理</el-tab-pane>
                    <el-tab-pane label="总评价数">定时任务补偿</el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!--  -->
        <div class="category_list">
            <hq-table :data="tableList" :loading='tableLoading'></hq-table>
        </div>
    </div>
</template>

<script>
import HqTable from './HqTable'
export default {
    data() {
        return {
            tableList:[],
            tableLoading:true
        }
    },
    methods:{
        //获取类目对比数据列表
        getCategoryContrast(params={categoryList:[ "Alexa Skills:Lifestyle","Alexa Skills"]}) {
            this.$axios.post('/categoryAnalysis/listToCompareByCate',params).then(res=>{
                if(res.data.code==0){
                    let data = res.data.data;
                    const length = data.length
                    if(length<5){
                        const numObj = 5 - length;
                        for(let i=0;i<numObj;i++){
                            data.push({})
                        }
                    }
                    this.tableList = data;
                    this.tableLoading = false;
                }else{
                    this.$message.error(res.data.msg);
                }

            })
        }
    },
    mounted(){
        this.getCategoryContrast()
    },
    components:{
        HqTable
    }
}
</script>

<style lang="scss">
    .category_warp{
        display: flex;
        flex-direction: row;
    }
    .category_select{
        width: 296px;
        margin-right: 25px;
        display: flex;
        flex-direction:column;
        justify-content:space-between;
        .cascader_item{
            width: 100%;
            height: 50px;
            position: relative;
            &:after{
                content: "";
                position: absolute;
                top:1px;left:1px;
                display: inline-block;
                width: 5px;
                height: 48px;
                background: #ff851b;
                border-top-left-radius:3px;
                border-bottom-left-radius:3px;
            }
            .el-input,.el-input__inner{
                height: 50px!important;
                .el-input__icon{
                    font-size: 18px;
                    color:#30cc7b;
                }
            }
        }
    }
    .category_info{
        flex:1;
        height: 397px;
        .el-tabs--border-card{
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
    }
    .category_list{
        min-height: 360px;
        margin-top: 25px;
        // background: #ccc;

    }

</style>
