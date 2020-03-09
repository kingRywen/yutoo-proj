<template>
    <div class="box" v-if="$route.name === 'taskRelateSourceDetails'">
        <y-template :screen-info-show="false">
            <!-- <div slot="ScreenBack" class="screen-back">
                <div>筛选条件</div>
                <div class="back" @click="backPage"><i class="el-icon-back"></i>返回</div>
            </div> -->
            
            <el-table
                slot="table"
                :data="list"
                v-loading="listLoading"
                :key='tableKey'
                style="width: 100%"
                border
                stripe
                @sort-change="handleSortChange"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                    prop="category"
                    label="类目"
                    min-width="120">
                    <template slot-scope="scope">
                        <a style="margin-left: 10px ;color:#0084ff;" :href='scope.row.categoryUrl' target='_blink'>{{ scope.row.category }}</a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="productCnt"
                    label="产品数"
                    :sortable="'custom'"
                    min-width="80">
                </el-table-column>
                <el-table-column
                label="操作"
                width="55">
                    <template slot-scope="scope">
                        <!-- <el-tooltip effect="light" content="查看详情" placement="top-start"> -->
                            <el-button v-if="scope.row.taskId!==null" type="text" size="mini" icon="el-icon-search" @click="viewDetails(scope.row)"></el-button>
                        <!-- </el-tooltip> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination  slot="pagination" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </y-template>

        
        

    </div>
    <router-view v-else></router-view>
</template>
<script>
const _ =require('lodash')
const dayjs =require('dayjs')
import echarts from 'echarts'
// import {checkWords} from "../KeyLexicon/utils";
import YTemplate from '../Common/y-template/index'
import Navigation from '../Common/y-template/navigation'
export default {
    components:{
      YTemplate,
      Navigation
    },
    data(){
        return{
            tableKey: 0,
            list: null,
            total: null,
            listLoading: false,
            sortProp:null,
            listQuery:{
                pageSize: 10,
                pageNumber: 1,
                taskId:null,
                sort:0,
                field:null,
            },
            multipleSelection:[]
            
        }
    },
    created() {
        let query =this.$route.query
        
        this.listQuery.taskId = parseInt(query.taskId)

        // this.listQuery.startTime = query.startTime
        // this.listQuery.endTime = query.endTime
        this.getList()
    },
    methods: {
        distribute(btn){
            switch(btn){
                case '确认搜索':
                    this.getList()
                break;
                case '重置搜索':
                    this.resetListQueryForm()
                break;
            }
        },
        
      getList() {
        this.listLoading = true
        if (this.sortProp) {
            let sortPropArr = this.sortProp.split(' ')
            if (sortPropArr.length === 2) {
                this.listQuery.field = sortPropArr[0]
                if (sortPropArr[1] === 'desc') {
                    this.listQuery.sort = 0
                } else {
                    this.listQuery.sort = 1
                }
            } else {
                this.listQuery.field = null
                this.listQuery.sort = 0
            }
        } else {
            this.listQuery.field = null
            this.listQuery.sort = 0
        }
        this.$api["taskRelateSourceDetails"](this.listQuery).then(res => {
             let { rows, total } = res;
             this.list =rows;
             console.log(this.list);
            this.total = total;
            setTimeout(() => {
                this.listLoading = false
            }, 500)
        }).catch(() => {
            this.listLoading = false
        })
      },
       handleFilter(){
          this.listQuery.pageNumber = 1
          this.getList()
      },
    handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
    },
    handleCurrentChange(val) {
        this.listQuery.pageNumber = val
        this.getList()
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    handleSortChange({ column, prop, order }) {
        if (!prop) {
            this.sortProp = null
            this.handleFilter()
            return
        }
        console.log(column, prop, order)
        const sortOrder = `${prop.replace(/[A-Z]{1}/g, function(str) {
            return '_' + str.toLowerCase()
        })} ${order === 'ascending' ? 'asc' : 'desc'}`
        this.sortProp = sortOrder
        this.handleFilter()
    },
    resetListQueryForm() {
        this.listQuery.daterange =[]
        this.$refs.listQueryForm.resetFields();
    },
    backPage(){
        this.$router.push({
            path: '/taskRelateSource/',
        })
    },
    viewDetails(row){
        if(row.taskId===null){
            this.$message.warning('taskId为空');
            return
        }
        this.$router.push({
            name: 'RelateSourceRelateList',
            query: {
                taskId:row.taskId,
                category:row.category,
                name: this.$route.query.name
                // siteId__:this.siteId,
            }
        })
    },
        routerGo(num){
            this.$router.go(num)
        }
    }
    
}
</script>

<style lang="less" scoped>
    .box{
       .template-box{
            /deep/.screen-info{
                padding: 0;
                border: none;
            }
        }
    }
</style>
