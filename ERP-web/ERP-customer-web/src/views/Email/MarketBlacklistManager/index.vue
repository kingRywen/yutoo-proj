<template>
  <div class="marketing-blacklist-manager">
    <universal-layout
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <section slot="search">
        <search :searchList="searchList" @search="handleSearch"></search>
      </section>
      <section slot="allbtn">
        <el-button type="primary" size="mini" class="search-submit" @click="handleAdd">添加</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleDelete">删除</el-button>
      </section>
      <section slot="table">
        <yt-table
          :columns="Tablecolumns"
          reserveSelection="emailBlackListId"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
          ref="table"
        >
          <template slot="left">
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-tooltip content="编辑" offset="1" placement="bottom" effect="light">
                  <el-button
                    class="normal-table-icon"
                    icon="el-icon-edit-outline"
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="删除" offset="1" placement="bottom" effect="light">
                  <el-button
                    class="normal-table-icon"
                    icon="el-icon-delete"
                    size="mini"
                    @click="handleDelete(scope.$index, scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
        </yt-table>
      </section>
    </universal-layout>
    <yt-dialog :options="options">
      <div class="dialog-wrap">
        <el-form ref="dialogForm" :model="dialogForm" label-width="100px">
          <el-form-item label="买家账号：" class="padding10" prop="customerName" :rules="strRule">
            <el-input v-model="dialogForm.customerName" size="small"></el-input>
          </el-form-item>
          <el-form-item
            label="买家邮箱："
            prop="mailBox"
            :rules="[
              { required: true, message: '请输入邮箱地址',  },
              { type: 'email', message: '请输入正确的邮箱地址',  }
            ]"
          >
            <el-input v-model="dialogForm.mailBox" size="small"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="dialogForm.remark" class="arear-height"></el-input>
          </el-form-item>
          <el-form-item label-width="0px" class="saveBtn">
            <el-button size="small" type="primary" :loading="loading" @click="handleSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </yt-dialog>
  </div>
</template>

<script>
let checkval = function(rule, value, callback) {
  let re = /^[\u4e00-\u9fa5a-z\d]+$/gi //只能输入汉字和英文字母
  if (!re.test(value)) {
    callback(new Error('账号不能包含特殊字符'))
  } else {
    callback()
  }
}
export default {
  data() {
    return {
      loading: false,
      strRule: [
        { required: true, message: '请输入买家账号' },
        { validator: checkval }
      ],
      pageNo: 1,
      pageSize: 10,
      total: 10,
      searchList: [
        {
          value: 'type',
          type: 'select',
          placeholder: '请选择',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: 1,
              label: '买家邮箱'
            },
            {
              value: 2,
              label: '买家账号'
            }
          ]
        },
        {
          value: 'searchValue',
          type: 'input',
          placeholder: '',
          size: 'small',
          style: {
            width: '250px'
          }
        }
      ],
      listParams: {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      dialogForm: {},
      Tablecolumns: [
        {
          value: 'customerName',
          label: '买家账号'
        },
        {
          value: 'mailBox',
          label: '买家邮箱'
        },
        {
          value: 'operatorName',
          label: '操作人'
        },
        {
          value: 'createTime',
          label: '操作时间'
        },
        {
          value: 'remark',
          label: '备注'
        }
      ],
      tableData: [],
      options: {
        visible: false,
        title: '添加黑名单',
        width: '450px',
        fullscreen: false,
        top: '30vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      selectData: []
    }
  },
  created() {
    let vm = this
    vm.getList()
  },
  methods: {
    handleCurrentChange(val) {
      let vm = this
      vm.extendObj({ pageNumber: val })
      vm.getList()
    },
    handleSizeChange(val) {
      let vm = this
      vm.extendObj({ pageSize: val })
      vm.getList()
    },
    handleSearch(data) {
      let vm = this
      vm.extendObj(true, data)
      vm.getList()
    },
    handleSelectionChange(val) {
      let vm = this
      vm.selectData = val
    },
    handleDelete(index, row) {
      let vm = this
      let emailBlackListIds = []
      if (row) {
        emailBlackListIds = [row.emailBlackListId]
      } else {
        emailBlackListIds = vm.selectData.map(item => {
          return item.emailBlackListId
        })
      }
      vm.deleteList({
        emailBlackListIds
      })
    },
    handleAdd() {
      this.options.visible = true
      this.dialogForm = {}
    },
    handleEdit(index, row) {
      this.options.visible = true
      this.dialogForm = row
    },
    handleSubmit() {
      let vm = this
      vm.loading = true
      vm.$refs.dialogForm.validate(valid => {
        if (valid) {
          vm.$api['email/blackSave'](this.dialogForm)
            .then(() => {
              this.options.visible = false
              vm.loading = false
              vm.extendObj(true)
              vm.getList()
            })
            .catch(() => {
              vm.loading = false
            })
        }
      })
    },
    deleteList(params = {}) {
      let vm = this
      if (!params.emailBlackListIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择要删除的黑名单</strong>`
        })
        return
      }
      vm.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/blackRemove'](params).then(data => {
            vm.$message({
              dangerouslyUseHTMLString: true,
              type: 'warning',
              message: `<strong>成功删除${
                data.successNum
              }数据</strong>，<strong>失败${data.failNum}数据</strong>
              <br/><strong>${data.errMsg}</strong>`
            })
            vm.getList()
            vm.$refs.table.clearSelection()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getList() {
      let vm = this
      return vm.$api['email/blackPage'](vm.extendObj(vm.listParams))
        .catch(err => {
          console.log(err)
        })
        .then(data => {
          if (data) {
            vm.pageNo = data.pageNo
            vm.pageSize = data.pageSize
            vm.total = data.total
            vm.tableData = data.rows
          }
          return data
        })
    },
    extendObj(...obj) {
      let listParams = this.listParams
      if (typeof obj[0] === 'boolean') {
        obj.shift()
        listParams.pageNumber = 1
        listParams.pageSize = 10
      }
      return (this.listParams = Object.assign(listParams, ...obj))
    }
  }
}
</script>

<style lang="scss">
.marketing-blacklist-manager {
  .el-form-item__content {
    line-height: 33px;
  }
  .dialog-wrap {
    border-top: 1px solid #bbb;
    .padding10 {
      padding: 10px 0 0 0;
    }
    .arear-height {
      textarea {
        height: 115px;
      }
    }
  }
  .el-dialog__footer {
    padding: 0;
  }
  .saveBtn {
    margin-top: 14px;
  }
}
</style>
