<template lang="html">
    <section class="record">
        <!-- <h3 class="title"><span class="back" @click='back()'><i class="el-icon-d-arrow-left"/>返回</span>导入记录</h3> -->
        <div class="select">
            <el-form :inline="true" :model="selectForm" class="demo-form-inline selectform" size='medium'>
                <el-form-item label="导入时间：">
                    <el-date-picker
                      v-model="selectForm.time"
                      value-format="yyyy-MM-dd"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="导入人员：">
                      <el-input v-model.trim="selectForm.merchantName" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmitSelect">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-button class="downloadBtn" type="primary" @click="downloadAll()" size='medium'>下载</el-button>
        <div v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading">
            <el-table
                :data="recordList" style="width: 100%;margin-top:15px;" @selection-change="handleSelect" border>
                <el-table-column type="selection" width="55" align='center'/>
                <el-table-column prop="createTime" label="导入时间" width="260" align='center'/>
                <el-table-column prop="state" label="上传状态" align='center'>
                    <template slot-scope="scope">
                        <p>
                            <span>上传完成    提交总数量：{{scope.row.submitCount}}</span>
                        </p>
                        <p>
                            <span>成功 {{scope.row.successCount}}</span>
                            <span>失败 {{scope.row.failureCount}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="导入人员" width="180" align='center'/>
                <el-table-column label="下载处理报告" width="180" align='center'>
                    <template slot-scope="scope">
                        <el-button type="text" @click='download(scope.row)'>下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
              class="pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
        </div>
    </section>
</template>

<script>
import { getData } from "common/http";
export default {
    data() {
        return {
            total:null,
            currentPage:null,
            pageSize:null,
            loading:true,
            selectForm: {
                time:[],
                merchantName: '',
            },
            recordList:[], //记录table
            downloadArr:[], //选中下载的
        }
    },
    mounted(){
        const params = {
            "sortOrder":"asc",
            "pageSize":10,
            "pageNumber":1,
            "recordType":1
        }
        this.getImportRecord(params)
    },
    methods: {
        handleSizeChange(val) {
            this.loading = true;
            // console.log(`每页 ${val} 条`);
            let params = {
                "sortOrder":"asc",
                "pageSize":val,
                "pageNumber":this.currentPage,
                "recordType":1
            }
            if(this.selectForm.merchantName){
                params = {...params,merchantName:this.selectForm.merchantName}
            }
            if(this.selectForm.time !=null && this.selectForm.time.length){
                params = {...params,startDate:this.selectForm.time[0],endDate:this.selectForm.time[1]}
            }
            this.getImportRecord(params)
        },
        handleCurrentChange(val) {
            this.loading = true;
            // console.log(`当前页: ${val}`);
            let params = {
                "sortOrder":"asc",
                "pageSize":this.pageSize,
                "pageNumber":val,
                "recordType":1
            }
            if(this.selectForm.merchantName){
                params = {...params,merchantName:this.selectForm.merchantName}
            }
            if(this.selectForm.time !=null && this.selectForm.time.length){
                params = {...params,startDate:this.selectForm.time[0],endDate:this.selectForm.time[1]}
            }
            this.getImportRecord(params)
        },
        //获取导入记录数据
        getImportRecord(params){
            getData('GlobalUploadRecord/list',params).then(res=>{
                this.loading = false;
                if(res.data.code==500){
                    this.$message.error(res.data.msg);
                    return
                }
                this.recordList = res.data.rows;
                this.total = res.data.total
                this.currentPage = res.data.pageNo
                this.pageSize = res.data.pageSize
            })
        },
        //搜索
        onSubmitSelect() {
            this.loading = true;
            let params = {
                "sortOrder":"asc",
                "pageSize":10,
                "pageNumber":1,
                "recordType":1
            }
            if(this.selectForm.merchantName){
                params = {...params,merchantName:this.selectForm.merchantName}
            }
            if(this.selectForm.time !=null && this.selectForm.time.length){
                params = {...params,startDate:this.selectForm.time[0],endDate:this.selectForm.time[1]}
            }
            this.getImportRecord(params)
        },
        //勾选的
        handleSelect(val) {
            this.downloadArr = val.map(item=>item.uploadRecordId)
        },
        // 下载all
        downloadAll() {
            if(this.downloadArr.length){
                getData('GlobalUploadRecord/batchDownload',{ids:this.downloadArr}).then(res=>{
                    if(res.data.code==0){
                        window.location.href = res.data.path
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            }else{
                this.$message({
                    message: '选择你要下载的',
                    type: 'warning'
                });
            }
        },
        // 当个下载
        download(obj) {
            getData('GlobalUploadRecord/download',{globalUploadRecordId:obj.uploadRecordId}).then(res=>{
                if(res.data.code==0){
                    window.location.href = res.data.path
                }else{
                    this.$message.error(res.data.msg || '下载失败');
                }
            })
        },
    }

}
</script>

<style lang="scss">
.record{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 35px;
    overflow-y: auto;
    padding: 10px;
}

.select {
    background-color: rgba(242, 242, 242, 1);
    border-radius: 5px;
    position: relative;
    .selectform {
        padding: 12px;
        .el-form-item {
            margin-bottom: 0;
        }
    }
}
.downloadBtn {
    margin-top: 15px;
    width: 83px;
}
.pagination{
    text-align: center;
    margin: 20px 0;
}
</style>
