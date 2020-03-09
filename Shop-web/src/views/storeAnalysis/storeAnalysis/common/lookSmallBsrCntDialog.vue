<template>
    <div>
        <!--查看小类列表 -->
        <div v-loading='loading'>
            <el-table
                :data="tableData"
                style="width: 100%"
                border
                @sort-change='sortChange'
            >
                <el-table-column
                    prop="date"
                    label="类目"
                    width="600">
                    <template slot-scope="scope">
                     <a :href="scope.row.bsrCategoryUrl" target='_blink' style='color:#108ee9'>{{scope.row.bsrCategory}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="rank"
                    sortable
                    label="排名"
                    width="150">
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
          background
          v-if="total"
          :total="total"
          :current-page="listQuery.pageNumber"
          :page-size="listQuery.pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        <div style='height:20px;'></div>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            loading:false,
            tableData:[],
            listQuery:{
                parentAsin:'',
                taskId:'',
                pageSize:10,
                pageNumber:1,
                field:'rank',
                sort:"",
            },
            total:0,
        };
    },
    methods: {
        //获取数据
        getList(){
            this.loading=true;
            this.$api['taskShopAnalysisListToBsrCategoryByAsin'](this.listQuery)
            .then(data => {
                //console.log(data);
        
                this.tableData=data.rows;
                this.total=data.total;
                this.loading=false;
            }).catch(() => {
                this.loading=false;
            })
        },
        //排序改变
        sortChange(column, prop, order){
            //console.log(column.order);
            if(column.order==='ascending'){
                this.listQuery.sort=1;
            }else{
                this.listQuery.sort=0;
            };
            this.getList();
           
        },
        //分页器当前页改变
        handleCurrentChange(v){
            this.listQuery.pageNumber=v;
            this.getList();
        },
        //分页器每页总数改变
        handleSizeChange(v){
            this.listQuery.pageSize=v;
            this.getList();
        }
    },
    created() {
        this.listQuery.parentAsin=this.params.parentAsin;
        this.listQuery.taskId=this.params.taskId;
        this.getList()
    },
};
</script>

<style scoped lang="less">

</style>
