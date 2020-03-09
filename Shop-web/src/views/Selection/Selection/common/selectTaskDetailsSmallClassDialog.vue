<template>
    <div>
        <!-- 小类列表 -->
        <div v-loading='loading'>
            <el-table
                :data="tableData"
                style="width: 100%"
                border
            >
                <el-table-column
                    prop="date"
                    label="类目"
                    width="550">
                    <template slot-scope="scope">
                     <a :href="scope.row.bsrCategoryUrl" target='_blink' style='color:#108ee9'>{{scope.row.bsrCategory}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="rank"
                    label="排名"
                    width="100">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            tableData:[],
            loading:false,
        };
    },
    methods: {
          //添加任务提交
    _submit() {
      
    },
    _initData() {
      //console.log(213132);
      
    },
    },
    created() {
        this.loading=true;
        this.$api['taskSelectionListSmallBsr']({
            sellerId:this.params.sellerId,
            siteId:this.params.siteId,
            taskId:this.params.taskId,
            parentAsin:this.params.parentAsin,
        })
        .then(data => {
            if(data.code===0){
                console.log(data.data);
                this.loading=false;
                this.tableData=data.data;
            }
        }).catch(() => {
             this.loading=false;
        })
    },
};
</script>

<style scoped lang="less">

</style>
