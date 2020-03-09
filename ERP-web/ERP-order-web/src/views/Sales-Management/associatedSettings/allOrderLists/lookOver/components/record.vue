<template lang="html">
    <!-- 订单日志 -->
    <div class="lookOver-record">
        <el-button class="push" size="mini" round  type="primary" plain icon="el-icon-edit" @click="addRecord">添加订单日志</el-button>
        <yt-table :data="list" :columns="columns" :border="true" :selection="false"></yt-table>
        <el-pagination
            style="text-align: right;margin-top: 10px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10,20,30,50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
export default {
    data(){
        return {
            currentPage:1,
            total:0,
            pageSize:10,
            columns:[
                {value: "createTime", label: "操作时间"},
                {value: "typeFlag", label: "类型"},
                {value: "operatorName", label: "操作人员"},
                {value: "content", label: "操作内容"},
            ],
            list:[]
        }
    },
     methods: {
        addRecord(){
            let self = this
            this.$prompt('请输入日志内容', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S/,
                inputErrorMessage: '内容不能为空'
            }).then(({ value }) => {
                this.$api['order/orderLogSave']({
                    content:value,
                    orderId:self.$route.query.orderServiceId
                }).then(res=>{
                    self.$message.success(res.msg)
                    self.getList()
                }).catch(err=>{
                    self.$message.error(err.msg)
                })

            }).catch(() => {
                return false
            });
        },
        handleSizeChange(val) {
            this.pageSize =val
            this.getList()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        getList(){
            this.$api['order/orderLogList']({
                "sortOrder":"asc",
                "pageSize":this.pageSize,
                "pageNumber":this.currentPage,
                "orderId":this.$route.query.orderServiceId
            }).then(res=>{
                this.list = res.rows;
                this.currentPage = res.pageNo
                this.pageSize = res.pageSize
                this.total = res.total
            }).catch(err=>{
                this.$message.error(err.msg)
            })
        }
     },

}
</script>

<style lang="scss" scoped>
    .lookOver-record{
        margin-bottom: 50px;
    }
    .push{
        margin-bottom: 10px;
    }
</style>
