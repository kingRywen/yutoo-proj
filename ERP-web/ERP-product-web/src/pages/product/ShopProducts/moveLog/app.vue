<template>
    <div class="box">
        <div class="log-query">
            <el-form :inline="true" :model="listQuery" class="demo-form-inline">
                <el-form-item label="挪动时间:">
                    <el-date-picker
                    v-model="queryTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['12:00:00']"
                    size="small">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="挪动人员:">
                    <el-input v-model="listQuery.operator" size="small" clearable ></el-input>
                </el-form-item>
                <el-form-item label="商品SKU:">
                    <el-input v-model="listQuery.sku" clearable size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="挪动状态:">
                    <el-select v-model="listQuery.status" placeholder="活动区域" size="small" clearable>
                        <el-option label="挪动中" value="1"></el-option>
                        <el-option label="成功" value="2"></el-option>
                        <el-option label="失败" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="handleFilter">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="log-table">
            <el-table
                :data="list"
                :key='tableKey'
                v-loading="listLoading"
                style="width: 100%"
                height="650"
                :header-cell-style="{background:'#f5f7fa'}">
                <el-table-column
                    prop="createTime"
                    label="操作时间"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="platform"
                    label="平台"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="site"
                    label="站点">
                </el-table-column>
                <el-table-column
                    prop="store"
                    label="店铺">
                </el-table-column>
                <el-table-column
                    prop="moveVariant"
                    label="挪动变体">
                </el-table-column>
                <el-table-column
                    prop="targetParent"
                    label="目标母体">
                </el-table-column>
                <el-table-column
                    prop="statusDesc"
                    label="状态">
                </el-table-column>
                <el-table-column
                    prop="operator"
                    label="挪动人员">
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import {
  fetchData,
  showToast
} from "common/common";
import apis, {
    STORE_PRODUCT_MOVE_LOG} from "apis";
export default {
    data(){
        return{
            tableKey: 0,
            list: null,
            total: null,
            listLoading: false,
            queryTime:[],
            listQuery:{
                pageSize: 10,
                pageNumber: 1,
                sortOrder: 'asc',
                startTime:null,
                endTime:null,
                operator:null,
                sku:null,
                status:null
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
       getList() {
           this.listLoading = true
           this.listQuery.startTime = this.queryTime && this.queryTime[0]
           this.listQuery.endTime = this.queryTime && this.queryTime[1]
           fetchData({ 
                ...STORE_PRODUCT_MOVE_LOG, 
                data: this.listQuery
            }).then(res => {
                let {code,rows,msg} =res.data
                if(code===0){
                    this.list = rows.rows
                    this.total = rows.total
                }else{
                    showToast('error', msg|| '服务器请求异常，请联系管理员')
                }
                setTimeout(() => {
                    this.listLoading = false
                }, 1.5 * 1000)
            }).catch(err=>{
                console.log(err)
            })
       },
        handleFilter() {
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
        }
    }
}
</script>
<style lang="less" scoped>
    .box{
        padding: 20px;
        /deep/ .el-range-separator{
                width: 25px;
            }
        .query{
            /deep/ .el-date-editor--daterange{
                width: 280px;
            }
        }
        /deep/ .pagination-container{
           padding-top: 10px;
           padding-bottom: 10px;
           display: flex;
           justify-content: flex-end;
        }
    }
</style>
