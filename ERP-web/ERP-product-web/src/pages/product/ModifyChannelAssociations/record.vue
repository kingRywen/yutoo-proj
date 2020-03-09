<template lang="html">
    <div class="record">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>相关设置</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/amend'}">批量修改渠道关联</el-breadcrumb-item>
            <el-breadcrumb-item>查看导入日志</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="padding:10px;background: #fff;">
            <el-form :inline="true"  class="form-select">
                <el-form-item label="导入时间：">
                    <el-date-picker
                        v-model="selectInfo.time"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        size="small">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="导入人员：">
                      <el-input size="small" v-model.trim="selectInfo.name"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="select" size="small">搜 索</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" style="margin-top:15px;" size="small" @click="alldownload">批量下载</el-button>

            <el-button type="primary" style="margin-top:15px;" size="small" @click="$router.back(-1)">返回渠道关联</el-button>

            <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :data="tableData" tooltip-effect="dark" style="margin-top:15px;width: 100%"
                height="600"
                 @selection-change="handleSelectionChange" border>
                <el-table-column  type="selection" width="55" align="center"/>
                <el-table-column  prop="createTime" label="导入时间"  align="center"/>
                <el-table-column  label="上传状态"   align="center">
                    <template slot-scope="scope">
                        <p>上传完成    提交总数量：{{scope.row.submitCount}}</p>
                        <p>成功：{{scope.row.successCount}}   失败：{{scope.row.failureCount}}</p>
                    </template>
                </el-table-column>
                <el-table-column  prop="recordTypeDesc" label="类型"   align="center"/>
                <el-table-column  prop="nickName" label="导入人员" align="center"/>
                <el-table-column  label="下载处理报告"  align="center">
                    <template slot-scope="scope">
    <el-button type="text" @click="singleDownload(scope.row.uploadRecordId)" v-if="scope.row.recordPath">下载</el-button>
</template>
                </el-table-column>
            </el-table>
            <el-pagination  @size-change="handleSizeChange"  @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 30, 40,50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              class= "pagination">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { BASE_URL } from 'common/config';

import { getData } from 'common/http';
export default {
    data() {
        return {
            loading: true,
            selectInfo: {
                time: [],
                name: ''
            },
            selectList: [],
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0
        };
    },
    mounted() {
        let params = {
            pageNumber: 1,
            pageSize: 10,
            // recordType: [6, 11, 12, 14], //this.$route.query.type,
            sortOrder: 'asc'
        };
        this.getTheRecord(params);
    },
    methods: {
        //获取下载记录列表
        getTheRecord(params) {
            getData('GlobalUploadRecord/list', params).then(res => {
                this.loading = false;
                if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                    return;
                }
                this.tableData = res.data.rows;
                this.currentPage = res.data.pageNo;
                this.pageSize = res.data.pageSize;
                this.total = res.data.total;
            });
        },
        //下载
        download(url, params) {
            getData(url, params).then(res => {
                if (res.data.code == 0) {
                    window.location.href = res.data.path;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //批量下载
        alldownload() {
            if (this.selectList.length) {
                this.download('GlobalUploadRecord/batchDownload', {
                    ids: this.selectList
                });
            } else {
                this.$message({
                    message: '批量下载请先选择你要下载的记录',
                    type: 'warning'
                });
            }
        },
        //单个下载
        singleDownload(globalUploadRecordId) {
            this.download('GlobalUploadRecord/download', {
                globalUploadRecordId
            });
        },
        reacquire(pageNumber = 1, pageSize = 10) {
            let params = {
                pageNumber,
                pageSize,
                recordType: 1, // [6,14,15,16],
                sortOrder: 'asc'
            };
            if (this.selectInfo.name) {
                params = { ...params, merchantName: this.selectInfo.name };
            }
            if (this.selectInfo.time != null && this.selectInfo.time.length) {
                params = {
                    ...params,
                    startDate: this.selectInfo.time[0],
                    endDate: this.selectInfo.time[1]
                };
            }
            this.getTheRecord(params);
        },
        //搜索
        select() {
            this.loading = true;
            this.reacquire();
        },
        //勾选
        handleSelectionChange(val) {
            this.selectList = val.map(item => item.uploadRecordId);
        },
        //分页
        handleSizeChange(val) {
            this.loading = true;
            this.reacquire(this.currentPage, val);
        },
        handleCurrentChange(val) {
            this.loading = true;
            this.reacquire(val, this.pageSize);
        }
    }
};
</script>

<style lang="scss">
@import '../../../assets/style/style-scss/layout.scss';
.record {
    height: 100%;
}
.form-select {
    height: 60px;
    padding: 10px 0 0 15px;
    background: rgb(242, 242, 242);
    border-radius: 5px;
}
.pagination {
    text-align: right;
    margin-top: 20px;
}
.el-table th {
    background-color: #f3f3f3;
}
</style>
