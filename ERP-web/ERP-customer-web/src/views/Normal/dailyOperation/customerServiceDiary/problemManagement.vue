<template>
  <!-- 原因，问题管理 -->
  <div>
    <universal-layout
      class="problemManagement"
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :btnList="btnList"
    >
      <template slot="search">
        <search :searchList="searchList" @search="search"></search>
      </template>
      <template slot="table">
        <yt-table :data="list" :columns="columns" :border="true" :selection="false">
          <el-table-column label="操作" align="center" slot="right">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row.customerIssueId)">编辑</el-button>
              <el-button type="text" @click="del(scope.row.customerIssueId)">删除</el-button>
            </template>
          </el-table-column>
        </yt-table>
      </template>
    </universal-layout>
    <!--  -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="480px" :append-to-body="true">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
        <el-form-item
          label="名称："
          prop="name"
          :rules="[
            { required: true, message: '不能为空', trigger: 'blur' }           
            ]"
        >
          <el-input v-model.trim="ruleForm.name"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submit('ruleForm',title)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            pageNo: 1,
            pageSize: 10,
            total: 0,
            dialogVisible: false,
            title: '',
            ruleForm: {
                name: ''
            },
            searchList: [
                {
                    label: '关键词：',
                    type: 'input',
                    value: 'name'
                }
            ],
            btnList: [
                {
                    name: '添加',
                    fn: () => {
                        this.dialogVisible = true
                        this.title = '添加'
                        this.$nextTick(() => {
                            this.$refs.ruleForm.resetFields()
                        })
                    }
                }
            ],
            list: [],
            columns: [
                { label: '名称', value: 'name' },
                { label: '添加人员', value: 'creatorName' },
                { label: '添加时间', value: 'createTime' }
            ],
            customerIssueIds: [],
            customerIssueId: '',
            searchInfo: {}
        }
    },
    methods: {
        submit(formName, title) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (title == '添加') {
                        this.save('issueSave', { name: this.ruleForm.name })
                    } else {
                        this.save('issueUpdate', {
                            name: this.ruleForm.name,
                            customerIssueId: this.customerIssueId
                        })
                    }
                } else {
                    return false
                }
            })
        },
        save(url, params) {
            this.$api['order/' + url](params).then(res => {
                this.$message.success(res.msg)
                this.getList()
                this.dialogVisible = false
            })
        },
        edit(customerIssueId) {
            this.customerIssueId = customerIssueId
            this.$api['order/issueInfo']({ customerIssueId }).then(res => {
                this.ruleForm.name = res.rows.name
                this.dialogVisible = true
                this.title = '编辑'
            })
        },
        del(customerIssueId) {
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$api['order/issueRemove']({
                        customerIssueIds: Array.of(customerIssueId)
                    }).then(res => {
                        this.$message.success(res.msg)
                        this.getList()
                    })
                })
                .catch(() => {})
        },
        search(val) {
            this.searchInfo = val
            this.getList('search')
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList('search')
        },
        handleCurrentChange(val) {
            this.pageNo = val
            this.getList('search')
        },
        getList(val) {
            let params = {
                sortOrder: 'asc',
                pageSize: this.pageSize,
                pageNumber: this.pageNo
            }
            if (val === 'search') {
                const name = this.searchInfo.name
                if (name) params = Object.assign({}, params, { name })
            }
            this.$api['order/issueList'](params).then(res => {
                let { pageNo, pageSize, total, rows } = res
                this.pageNo = pageNo
                this.pageSize = pageSize
                this.total = total
                this.list = rows
                this.$emit('change', this.list)
            })
        }
    },
    mounted() {
        this.getList()
    }
}
</script>
<style lang="scss">
.problemManagement {
    position: inherit;
    padding: 0;
}
</style>