<template>
  <div class="email-market-seting">
    <universal-layout
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <header slot="search">
        <search :searchList="searchList" @search="handleSearch"></search>
      </header>
      <section slot="allbtn">
        <el-button type="primary" size="mini" class="search-submit" @click="handleAdd">添加</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleDelete">删除</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleCopy">复制添加</el-button>
      </section>
      <section slot="table">
        <yt-table
          :columns="talbeColumns"
          reserveSelection="emailMarketPolicyId"
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
          <template slot="right">
            <el-table-column label="状态" width="80px">
              <template slot-scope="scope">
                <i
                  class="normal-table-icon"
                  :class="scope.row.activateFlag?'el-icon-check':'el-icon-close'"
                  @click="handleFlagChange(scope.$index, scope.row)"
                ></i>
              </template>
            </el-table-column>
          </template>
        </yt-table>
      </section>
    </universal-layout>
    <!-- 添加规则 -->
    <add-strategy @formSubmit="formSubmit" :forms="form" :visible="visible" :isEdit="isEdit"></add-strategy>
  </div>
</template>

<script>
import CopyBtn from '../Comment/CopyBtn'
import { mapActions, mapState } from 'vuex'
import AddStrategy from './AddStrategy'
export default {
  data() {
    return {
      visible: false,
      pageNo: 1,
      pageSize: 10,
      total: 10,
      searchList: [
        {
          value: 'platformIds',
          type: 'multiple',
          placeholder: '平台(多选)',
          size: 'small',
          style: {
            width: '250px'
          },
          children: [
            {
              value: 'payTime',
              label: '支付时间'
            },
            {
              value: 'emailSendTime',
              label: '邮件发送时间'
            }
          ]
        },
        {
          value: 'accounts',
          type: 'multiple',
          placeholder: '对应账号(多选)',
          size: 'small',
          style: {
            width: '250px'
          },
          children: [
            {
              value: 'cn',
              label: 'cn'
            },
            {
              value: 'eg',
              label: 'eg'
            }
          ]
        },
        {
          value: 'templateType',
          type: 'select',
          placeholder: '模板类型',
          size: 'small',
          style: {
            width: '250px'
          },
          children: [
            {
              value: '1',
              label: '索取好评'
            },
            {
              value: '2',
              label: '产品推广'
            },
            {
              value: '3',
              label: '延迟发货'
            }
          ]
        },
        {
          label: '策略名称：',
          value: 'name',
          type: 'input',
          placeholder: '',
          size: 'small',
          style: {
            width: '250px'
          }
        }
      ],
      dialogForm: {
        select: '',
        select1: '',
        select2: '',
        resource: '',
        type: [],
        resource1: ''
      },
      talbeColumns: [
        {
          value: 'name',
          label: '策略名称'
        },
        {
          value: 'accountName',
          label: '对应账号'
        },
        {
          value: 'subject',
          label: '邮件主题',
          width: '260'
        },
        {
          value: 'applyCount',
          label: '应用数量',
          width: '80'
        },
        {
          label: '模板类型',
          render(h, scope) {
            let text = ''
            if (scope.row.templateType == 1) {
              text = '索取好评'
            } else if (scope.row.templateType == 2) {
              text = '产品推广'
            } else if (scope.row.templateType == 3) {
              text = '延迟发货'
            }
            return <div>{text}</div>
          }
        },
        {
          value: 'createTime',
          label: '添加时间'
        },
        {
          value: 'creatorName',
          label: '添加人'
        }
      ],
      tableData: [],
      isModuleShow: true,
      form: {},
      listParams: {
        sortOrder: 'asc',
        pageNumber: 1,
        pageSize: 10
      },
      emailMarketPolicyIds: [],
      isEdit: false
    }
  },
  created() {
    let vm = this
    vm.getPlatformList()
    vm.getEmailAccountList()
    vm.getList()
  },
  computed: {
    ...mapState('product', ['platformList']),
    ...mapState('email', ['emailAccountList'])
  },
  watch: {
    platformList(val) {
      this.searchList[0].children = val
    },
    emailAccountList(val) {
      this.searchList[1].children = val
    }
  },
  methods: {
    ...mapActions('product', ['getPlatformList']),
    ...mapActions('email', ['getEmailAccountList']),
    handleCurrentChange(val) {
      this.extendObj({
        pageNumber: val
      })
      this.getList()
    },
    handleSizeChange(val) {
      this.extendObj({
        pageSize: val
      })
      this.getList()
    },
    handleSearch(data) {
      let vm = this
      vm.extendObj(true, data)
      vm.getList()
    },
    handleEdit(index, row, edit = true) {
      let vm = this
      vm.isEdit = edit
      if (!edit) {
        row._copy = true
      }
      let emailMarketPolicyId = row.emailMarketPolicyId
      vm.$api['email/marketPolicyInfo']({
        emailMarketPolicyId
      }).then(data => {
        if (!data || !data.rows) {
          return
        }
        vm.form = data.rows
        vm.visible = true
      })
    },
    handleCopy() {
      let vm = this
      vm.isEdit = false
      if (!vm.emailMarketPolicyIds.length) {
        vm.$message.error('请选择要操作的数据')
        return
      }
      let emailMarketPolicyId = vm.emailMarketPolicyIds[0]
      vm.$api['email/marketPolicyInfo']({
        emailMarketPolicyId
      }).then(data => {
        if (!data || !data.rows) {
          return
        }
        vm.form = JSON.parse(JSON.stringify(data.rows))
        delete vm.form.emailMarketPolicyId
        vm.visible = true
      })
    },
    handleFlagChange(index, row) {
      let vm = this
      let emailMarketPolicyId = row.emailMarketPolicyId
      vm.$api['email/marketPolicyInfo']({
        emailMarketPolicyId
      }).then(data => {
        let { rows: _data } = data
        _data.activateFlag = Number(_data.activateFlag) ? '0' : '1'
        vm.$api['email/marketPolicyUpdate'](_data)
          .then(() => {
            vm.extendObj(true)
            vm.getList()
          })
          .catch(() => {})
      })
    },
    handleSelectionChange(val) {
      this.emailMarketPolicyIds = val.map(el => {
        return el.emailMarketPolicyId
      })
    },
    handleDelete(index, row) {
      let vm = this
      let emailMarketPolicyIds = []
      if (row) {
        emailMarketPolicyIds = [row.emailMarketPolicyId]
      } else {
        emailMarketPolicyIds = [...vm.emailMarketPolicyIds]
      }
      vm.deleteList({
        emailMarketPolicyIds
      })
    },
    // handleCopy() {
    //   let vm = this
    //   if (!vm.emailMarketPolicyIds.length) {
    //     vm.$message({
    //       dangerouslyUseHTMLString: true,
    //       type: 'error',
    //       message: `<strong>请选择需要复制的数据</strong>`
    //     })
    //     return
    //   }
    //   let emailMarketPolicyId = vm.emailMarketPolicyIds[0]
    //   this.handleEdit(null, { emailMarketPolicyId }, false)

    // },
    handleAdd() {
      this.isEdit = false
      this.visible = true
      this.form = {}
    },
    formSubmit() {
      let vm = this
      vm.extendObj(true)
      vm.getList()
      vm.visible = false
    },
    deleteList(params = {}) {
      let vm = this
      if (!params.emailMarketPolicyIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择要删除的数据</strong>`
        })
        return
      }
      vm.$confirm('此操作将永久删除该策略, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/marketPolicyRemove'](params).then(() => {
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
      return vm.$api['email/marketPolicyList'](vm.extendObj(vm.listParams))
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
          console.log('获取成功')
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
  },
  components: {
    CopyBtn,
    AddStrategy
  }
}
</script>

<style lang="scss">
.email-market-seting {
  .search-top-form {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__content {
      line-height: 33px;
    }
    .wrap-input {
      margin-left: 20px;
      .el-form-item__label {
        width: 76px !important;
      }
      .el-input {
        width: 260px;
      }
    }
  }
  .dialog-wrap {
    border-top: 1px solid #bbb;
    .marginTop8 {
      margin-top: 8px;
    }
    .el-form-item__label {
      text-align: left;
    }
    .normal-input {
      width: 260px;
    }
    .el-form-item--small.el-form-item,
    .el-form-item {
      margin-bottom: 0px;
    }
    .subject {
      width: 430px;
    }
    .hide-label {
      width: 576px;
      display: inline-block;
      padding-left: 10px;
    }
    .time-select {
      padding: 0 10px;
    }
    .special-sign {
      color: red;
    }
    .partition {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: left;
      background: #f1f1f1;
      margin: 8px 0;
      .email-left {
        width: 95%;
        display: block;
        float: left;
      }
      .email-right {
        float: left;
        display: block;
        width: 40px;
        button {
          padding: 0;
          height: 40px;
          width: 40px;
          background: #f1f1f1;
          border: 0;
          .el-icon-caret-bottom {
            font-size: 30px;
          }
        }
      }
    }
    .select-btn {
      display: flex;
      justify-content: center;
      .el-button {
        margin-top: 8px;
      }
    }
    .select-module {
      height: 500px;
      border: 1px solid rgb(231, 231, 231);
    }
    .edit-wrap {
      width: 100%;
      height: 400px;
      background: #f1f1f1;
    }
    .padding8 {
      padding: 0 8px;
    }
    .paddingL8 {
      padding-left: 8px;
    }
    .paddingR8 {
      padding-right: 8px;
    }
    .check-wrap {
      & > div {
        height: 36px;
      }
    }
  }
}
</style>
