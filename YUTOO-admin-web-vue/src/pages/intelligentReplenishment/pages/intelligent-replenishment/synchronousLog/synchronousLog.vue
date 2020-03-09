<template lang="html">
    <div class="">
        <IRLayout>
            <template slot="header">
                 <div class="title" @click="$router.go(-1)"><i class="el-icon-arrow-left"></i>同步日志</div>
            </template>
            <template slot="select">
                <el-form :model="ruleForm" label-width="100px" :inline="true">
                    <el-form-item label="同步时间：">
                        <el-date-picker  v-model="ruleForm.time"  type="daterange" size="small" clearable
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="同步人员：">
                        <el-select v-model.number="ruleForm.userId" size="small" clearable>
                            <el-option :label="item.userName" :value="item.userId" :key="" v-for="item in userList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSeek()" icon="el-icon-search">搜 索</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <el-button type="primary" size="small" icon="el-icon-search">批量下载</el-button>
            <template slot="table">
                <el-table :data="recordList" style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column  type="selection"  width="55" align="center" />
                    <el-table-column  prop="endSynTime"  label="操作时间" align="center" ></el-table-column>
                    <el-table-column  prop="platformName"  label="平台"  align="center" ></el-table-column>
                    <el-table-column  prop="siteName"  label="站点" align="center" ></el-table-column>
                    <el-table-column  prop="storeName"  label="店铺"  align="center" ></el-table-column>
                    <el-table-column  prop="synTypeName"  label="处理类型"  align="center" ></el-table-column>
                    <el-table-column  label="状态"  align="center" >
                        <template slot-scope="scope">
                            <p> <span :style="scope.row.synStatusName=='处理中'?'color:rgb(245, 108, 108);':''">{{ scope.row.synStatusName }}</span> <span v-if="scope.row.synStatusName!='处理中'">- 同步数量{{ scope.row.synCount }}</span> </p>
                            <p v-if="scope.row.synStatusName!='处理中'">成功{{(scope.row.synCount) - (scope.row.synFailureCount)}} - 失败{{scope.row.synFailureCount}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="userName"  label="同步人员"  align="center" ></el-table-column>
                    <el-table-column  label="下载处理报告" align="center" >
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.reportPath!=null" type="text" @click="download(scope.row.reportPath)">下 载</el-button>
                        </template>
                    </el-table-column>
                  </el-table>
            </template>
            <template slot="footer">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
            </template>
        </IRLayout>
    </div>
</template>

<script>
import {fetchData} from "@/common/common";
import apis from "@/apis";
export default {
    data() {
        return {
            recordList:[],
            userList:[],
            ruleForm: {
                userId: null,
                time: []
            },
            total: null,
            currentPage: null,
            pageSize: null,

        };
    },
    mounted(){
        this.getList()
        this.getUserList()
    },
    methods: {
        //下载
        download(url){
            window.location.href = url;
        },
        //搜索
        onSeek(){
            let params = {
                "pageSize": 20,
                "pageNumber": 1
            }
            if(this.ruleForm.time !=null && this.ruleForm.time.length){
                params['startTime'] = this.ruleForm.time[0]
                params['endTime'] = this.ruleForm.time[1]
            }
            if(this.ruleForm.userId){
                params = {...params,userId:this.ruleForm.userId}
            }
            this.getList(params)
        },
        //获取列表数据
        getList(params={"pageSize": 20,"pageNumber": 1}){
            fetchData({
                ...apis.REPLENISHSYNRECORD_LIST,
                data:params
            }).then(res=>{
                if(res.data.code==500){
                    this.$message.error(res.data.msg)
                    return
                }
                this.recordList = res.data.rows
                this.total = res.data.total
                this.currentPage = res.data.pageNo
                this.pageSize = res.data.pageSize
            })
        },
        //获取用户列表
        getUserList(){
            fetchData({
                ...apis.MERCHANT_USER_LIST,
                data:{
                    pageNumber:1,
                    pageSize:1000
                }
            }).then(res=>{
                if(res.data.code==0){
                    this.userList= res.data.rows.rows
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleSelectionChange(val) {
            console.log(val)
        },
        handleSizeChange(val) {
            let params = {
                "pageSize": val,
                "pageNumber": this.currentPage
            }
            if(this.ruleForm.time !=null && this.ruleForm.time.length){
                params['startTime'] = this.ruleForm.time[0]
                params['endTime'] = this.ruleForm.time[1]
            }
            if(this.ruleForm.userId){
                params = {...params,userId:this.ruleForm.userId}
            }
            this.getList(params)
        },
        handleCurrentChange(val) {
            let params = {
                "pageSize": this.pageSize,
                "pageNumber": val
            }
            if(this.ruleForm.time !=null && this.ruleForm.time.length){
                params['startTime'] = this.ruleForm.time[0]
                params['endTime'] = this.ruleForm.time[1]
            }
            if(this.ruleForm.userId){
                params = {...params,userId:this.ruleForm.userId}
            }
            this.getList(params)
        }
    },
}
</script>

<style lang="css">
</style>
