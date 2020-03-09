<template lang="html">
    <div>
        <!-- 客服日志 -->
        <yt-table :data="list" :columns="columns" :border="true" :selection="false">
            <el-table-column label="序号" type="index" width="100" align="center" slot="left"></el-table-column>
            <el-table-column label="操作" width="180" align="center" slot="right">
                <template slot-scope="scope">
                    <el-button type="text" @click="look(scope.row.orderServiceId)">查看</el-button>
                    <el-button type="text" @click="del(scope.row.orderServiceId)">删除</el-button>
                </template>
            </el-table-column>
        </yt-table>
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
        <!--  -->
        <el-dialog  title="查看客服日志"  :visible.sync="lookDialog.visible"  width="881px"  center>
            <div class="content">
                <customerServiceDiary ref="customerServiceDiary"/>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="lookDialog.visible = false">取 消</el-button>
              <el-button type="primary" @click="lookDialog.visible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import customerServiceDiary from './customerServiceDiary'
export default {
    data() {
        return {
            columns: [
                { value: 'customerIssueName', label: '问题原因' },
                { value: 'creatorName', label: '添加人员' },
                { value: 'createTime', label: '添加时间' },
                { value: 'stateName', label: '状态' }
            ],
            currentPage: 1,
            total: 0,
            pageSize: 10,
            list: [],
            lookDialog: {
                visible: false
            }
        }
    },
    methods: {
        look(orderServiceId) {
            this.lookDialog.visible = true
            this.$nextTick(() => {
                this.$refs.customerServiceDiary.getInfo(orderServiceId)
            })
        },
        del(orderServiceId) {
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$api['order/serviceRemove']({
                        orderServiceIds: Array.of(orderServiceId)
                    })
                        .then(res => {
                            this.$message.success(res.msg)
                            this.getList()
                        })
                        .catch(err => {
                            this.$message.error(err.msg)
                        })
                })
                .catch(() => {})
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        getList() {
            let params = {
                sortOrder: 'asc',
                pageSize: this.pageSize,
                pageNumber: this.currentPage,
                orderId: this.$route.query.orderServiceId
            }
            this.$api['order/serviceList'](params)
                .then(res => {
                    this.list = res.rows
                    this.currentPage = res.pageNo
                    this.total = res.total
                    this.pageSize = res.pageSize
                })
                .catch(err => {
                    this.$message.error(err.msg)
                })
        }
    },
    components: {
        customerServiceDiary
    }
}
</script>

<style lang="css">
</style>
