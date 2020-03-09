<template>
<!-- 导单日志 -->
<universal-layout
    @handleSizeChange="handleSizeChange"
    @handleCurrentChange="handleCurrentChange"
    :btnList="btnList"
    :pageNo="pageNo"
    :pageSize="pageSize"
    :total="total">
    <template slot="search">
        <search :searchList="searchList" @search='search'></search>
    </template>
    <template slot="table">
        <el-table :data="tableList"  border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="导入时间" prop="importTime" width="200" align="center"/>
            <el-table-column label="上传状态"  align="center">
                <template slot-scope="scope">
                    <p> {{ scope.row.status }} </p>
                    <p>
                        <span>{{ `全部：${scope.row.allQuantity}` }}</span>
                        <span>{{ `成功：${scope.row.successQuantity}` }}</span>
                        <span>{{ `失败：${scope.row.failQuantity}` }}</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="导入人员" prop="importName" width="180" align="center"/>
            <el-table-column label="下载处理报告" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="singleDownload(scope.row.orderImportId)">下载</el-button>
                </template>
            </el-table-column>
        </el-table>



    </template>
</universal-layout>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
export default {
    data() {
        return {
            searchList: [{
                    label: "导入时间",
                    value: "time",
                    type: "time"
                },
                {
                    label: "导入人员",
                    value: "operatorId",
                    type: "select",
                    children:[],
                    props:{
                        value:'userId',
                        label:'nickName'
                    }
                }
            ],
            btnList: [{
                name: "批量下载",
                fn:()=>{
                    if(this.orderImportIds.length){
                        this.download(this.orderImportIds)
                    }else{
                        this.$message.warning('请选择需要批量下载的数据')
                    }
                }
            }],
            tableList: [],
            pageNo:1,
            pageSize:10,
            total:0,
            orderImportIds:[],
        };
    },
    methods: {
        download(orderImportIds){
            this.$api['order/importDownload']({orderImportIds}).then(res=>{
                window.location.href = res.path
            }).catch(err=>{
                this.$message.error(err.msg)
            })
        },
        singleDownload(orderImportId){
            this.download(Array.of(orderImportId))
        },
        handleSelectionChange(val){
            this.orderImportIds = val.map(item=>item.orderImportId)
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList('search')
        },
        handleCurrentChange(val) {
            this.pageNo = val
            this.getList('search')
        },
        search(val){
           this.searchInfo = val
           this.getList('search')
        },
        getList(val){
            let params = {
                "sortOrder":"asc",
                "pageSize":this.pageSize,
                "pageNumber":this.pageNo,
            }
            if(val=='search'){
                let data = {...this.searchInfo}
                let obj = {}
                for(let key in data){
                    if(key=='time' && data[key]!=null && data[key] instanceof Array && data[key].length){
                        obj['startTime'] = data[key][0]
                        obj['endTime'] = data[key][1]
                        continue
                    }
                    if(data[key])obj[key] = data[key]
                }
                params = Object.assign({},params,obj)
            }
            this.$api['order/orderImportList'](params).then(res=>{
                this.tableList = res.rows
            }).catch(err=>{
                this.$message.error(err.msg)
            })
        },
        getUser(){
            this.getHandleUser().then(()=>{
                this.searchList[1].children = this.allHandleUser.operator
            })
        },
        ...mapActions('common',[
            'getHandleUser'
        ])
    },
    computed:{
        ...mapGetters('common',[
            'allHandleUser'
        ])
    }
};
</script>

<style lang="scss">
</style>
