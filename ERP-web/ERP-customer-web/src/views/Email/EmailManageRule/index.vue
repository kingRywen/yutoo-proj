<template>
  <div class="email-manage-rule">
    <universal-layout
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <header slot="search">
        <div class="grid-content">
          <search :searchList="searchList" @search="handleSearch"></search>
        </div>
      </header>
      <section class="grid-content search-wrap" slot="allbtn">
        <el-button type="primary" size="mini" class="search-submit" @click="handleAdd">添加</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handCopy">复制添加</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleSeting">设置客服</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleDelete">删除</el-button>
      </section>
      <section slot="table">
        <yt-table
          :columns="tableColumns"
          reserveSelection="emailRuleId"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
          ref="table"
        >
          <template>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-tooltip content="编辑" offset="1" placement="bottom" effect="light">
                  <el-button
                    class="normal-table-icon"
                    size="mini"
                    icon="el-icon-edit-outline"
                    @click="handleEdit(scope.$index, scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="查看日志" offset="1" placement="bottom" effect="light">
                  <el-button
                    class="normal-table-icon"
                    size="mini"
                    icon="el-icon-document"
                    @click="handleRecord(scope.$index, scope.row)"
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
    <add-rule
      :isEdit="isEdit"
      @formSubmit="formSubmit"
      :isEditTitle="isEditTitle"
      :ruleForm="ruleForm"
      :visible="visible"
    ></add-rule>
    <!-- 设置客服 -->
    <yt-dialog :options="serviceOptions" :key="keyId">
      <div class="dialog-wrap">
        <el-form size="small" ref="serviceForm" label-width="86px">
          <el-form-item label="客服人员：">
            <el-select placeholder="请选择客服" style="width: 100%" v-model="servicer">
              <el-option v-for="item in serviceList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="saveBtn mar10" label-width="0px">
            <el-button size="small" type="primary" @click="handleServiceSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </yt-dialog>
    <!-- 查看日志 -->
    <log ref="log"></log>
  </div>
</template>

<script>
import AddRule from '../Comment/AddRule/index'
import Log from '../Comment/Log'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      visible: false,
      isEditTitle: '添加',
      servicer: '',
      serviceFlag: true,
      ruleForm: {},
      keyIndex: null,
      keyId: null,
      rules: 'rules',
      pageNo: 1,
      pageSize: 10,
      total: 0,
      searchList: [
        {
          value: 'emailAccountIds',
          type: 'multiple',
          placeholder: '对应账号(多选)',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          value: 'serviceIds',
          type: 'multiple',
          placeholder: '客服人员(多选)',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          type: 'treeBtn',
          text: '邮件分类',
          showCheckbox: true,
          style: {
            width: '170px'
          }
        },
        {
          value: 'activateFlag',
          type: 'select',
          placeholder: '规则状态',
          size: 'small',
          style: {
            width: '170px'
          },
          children: [
            {
              value: 1,
              label: '激活'
            },
            {
              value: 0,
              label: '未激活'
            }
          ]
        },
        {
          value: 'ruleName',
          type: 'input',
          placeholder: '请输入规则名',
          size: 'small',
          style: {
            width: '260px'
          }
        }
      ],
      tableColumns: [
        {
          value: 'emailAccountName',
          label: '对应账号'
        },
        {
          value: 'ruleName',
          label: '规则名'
        },
        {
          value: 'applyNum',
          label: '应用数量',
          width: '80px'
        },
        {
          value: 'serviceName',
          label: '客服人员'
        },
        {
          value: 'emailClassificationName',
          label: '邮件分类'
        },
        {
          value: 'createTime',
          label: '添加时间'
        }
      ],
      tableData: [],
      isDetail: false,
      isEdit: true,

      logOptions: {
        visible: false,
        title: '操作日志',
        width: '1350px',
        fullscreen: false,
        top: '20vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      serviceOptions: {
        visible: false,
        title: '设置客服',
        width: '400px',
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
      detailData: [],
      detailColumns: [
        {
          value: 'storeName1',
          label: '操作类型'
        },
        {
          value: 'storeName2',
          label: '操作时间'
        },
        {
          value: 'storeName3',
          label: '操作人员'
        },
        {
          value: 'storeName4',
          label: '下单号'
        },
        {
          value: 'storeName5',
          label: '销单号'
        },
        {
          value: 'storeName6',
          label: '备注',
          width: '360'
        }
      ],
      emailRuleIds: [],
      listParams: {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      selectData: [],
      logOpt: {
        url: 'email/ruleLogPage',
        id: {
          emailRuleId: 1
        }
      }
    }
  },
  created() {
    // 来源渠道获取
    let vm = this
    vm.getservice()
    vm.getEmailAccountList()
    // 表单分页获取
    vm.getList()
  },
  mounted() {},
  watch: {
    emailAccountList(val) {
      this.searchList[0].children = val
    },
    serviceList(val) {
      this.searchList[1].children = val
    }
  },
  computed: {
    ...mapState('email', ['orderList', 'serviceList', 'emailAccountList'])
  },
  methods: {
    ...mapActions('email', ['getservice', 'getEmailAccountList']),
    handleCurrentChange(val) {
      this.extendObj({ pageNumber: val })
      this.getList()
    },
    handleSizeChange(val) {
      this.extendObj({ pageSize: val })
      this.getList()
    },
    handleSearch(data) {
      this.extendObj(true, data)
      this.getList()
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    handleDelete() {
      let vm = this
      if (!vm.selectData.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择数据</strong>`
        })
        return
      }
      let emailRuleIds = vm.selectData.map(data => {
        return data.emailRuleId
      })
      vm.deleteList({
        emailRuleIds
      })
    },
    handleAdd() {
      this.visible = true
      this.isEditTitle = '添加'
      this.isEdit = false
      this.ruleForm = {}
    },

    handleEdit(index, row) {
      let vm = this
      vm.ruleForm = {}
      vm.isEdit = true
      vm.$api['email/emailRuleGet']({
        emailRuleId: row.emailRuleId
      })
        .then(data => {
          if (!data) return
          let val = data.rows
          vm.visible = true
          vm.isEditTitle = '编辑'
          if (val.paymentTimeStart && val.paymentTimeEnd) {
            val.paymentTime = []
            val.paymentTime[0] = val.paymentTimeStart
            val.paymentTime[1] = val.paymentTimeEnd
          }
          vm.ruleForm = val
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleFlagChange(index, row) {
      let vm = this
      vm.$api['email/emailRuleGet']({
        emailRuleId: row.emailRuleId
      }).then(data => {
        let _data = data.rows
        _data.activateFlag = _data.activateFlag ? 0 : 1
        vm.$api['email/emailRuleSave'](_data)
          .then(() => {
            vm.$message.success('操作成功')
            vm.extendObj(true)
            vm.getList()
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    handCopy() {
      let vm = this
      if (!vm.selectData.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择数据</strong>`
        })
        return
      }
      let emailRuleData = vm.selectData[0]
      let emailRuleId = emailRuleData.emailRuleId

      vm.ruleForm = {}
      vm.isEdit = true
      vm.$api['email/emailRuleDataGet']({
        emailRuleId
      })
        .then(data => {
          if (!data) return
          vm.visible = true
          let val = data.rows
          if (val.paymentTimeStart && val.paymentTimeEnd) {
            val.paymentTime = []
            val.paymentTime[0] = val.paymentTimeStart
            val.paymentTime[1] = val.paymentTimeEnd
          }
          vm.ruleForm = val
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSeting() {
      let vm = this
      if (this.$editMsg(vm.selectData, false)) {
        return
      }
      vm.serviceOptions.visible = true
      vm.keyId = Math.random()
    },
    handleRecord(index, row) {
      let vm = this
      let emailRuleId = row.emailRuleId
      vm.$nextTick(() => {
        vm.$refs.log.getlogOption('email/ruleLogPage', {
          emailRuleId
        })
      })
    },
    formSubmit() {
      let vm = this
      vm.visible = false
      vm.extendObj(true)
      vm.getList()
    },

    handleServiceSubmit() {
      let vm = this
      if (vm.selectData.length) {
        let emailRuleIds = vm.selectData.map(item => {
          return item.emailRuleId
        })
        vm.$api['email/emailServiceSet']({
          emailRuleIds,
          serviceId: vm.servicer
        })
          .then(data => {
            vm.$message({
              dangerouslyUseHTMLString: true,
              type: 'warning',
              message: `<strong>设置成功${
                data.successNum
              }条</strong>，<strong>失败${data.failNum}条</strong>
              <br/><strong>${data.errMsg}</strong>`
            })
            vm.serviceOptions.visible = false
            vm.getList()
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    deleteList(params) {
      let vm = this
      vm.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/emailRuleRemove'](params).then(data => {
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
      return vm.$api['email/rulePage'](vm.extendObj(vm.listParams))
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
  },
  components: {
    AddRule,
    Log
  }
}
</script>

<style lang="scss">
.email-manage-rule {
  .mar10 {
    margin-top: 30px;
  }
  .must-fill-sign-div {
    @include must-fill-sign;
  }
  .cell.must-fill-sign {
    @include must-fill-sign;
  }
  .el-form-item {
    margin-bottom: 0px;
  }

  .el-form-item__content {
    line-height: 33px;
  }
  .channel-input {
    .el-input {
      width: 160px;
    }
  }
  .filtrate-input {
    padding-left: 18px;
    .el-input {
      width: 130px;
    }
  }
  .warp-input {
    .el-input {
      width: 250px;
    }
  }
  .search-wrap-right {
    padding-left: 18px;
  }
  .dialog-wrap {
    width: 100%;
    // border-top: 1px solid #bbbbbb;
    padding-top: 20px;
    .dialog-form {
      .input-wrap-layout {
        .el-select > .el-input {
          width: 250px !important;
        }
      }
      .checkbox {
        .el-form-item__content {
          vertical-align: bottom;
        }
      }
    }
  }
  .table-top14 {
    margin-top: 10px;
  }
  .filtrate-input-time {
    padding-left: 0 !important;
    input {
      width: 120px;
    }
  }

  .condition-table {
    .input-width {
      .el-input {
        width: 426px;
      }
    }
  }
  .rule-name {
    width: 566px;
  }
}
</style>
