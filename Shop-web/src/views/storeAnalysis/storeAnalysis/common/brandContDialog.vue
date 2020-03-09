<template>
    <div>
        <!-- 品牌数弹框 -->
           <el-table
                :data="tableData"
                style="width: 100%"
                border
            >
                <el-table-column
                    prop="name"
                    label="品牌"
                    >
                </el-table-column>
            </el-table>
            <div style='height:20px;'></div>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            tableData:[],
        };
    },
    methods: {

    },
    created() {
        let tableData=this.params.data;
        //console.log(this.tableData);
        tableData.forEach(i=>{
            this.tableData.push({
                name:i
            })
        });
    },
};
</script>

<style scoped lang="less">

</style>
