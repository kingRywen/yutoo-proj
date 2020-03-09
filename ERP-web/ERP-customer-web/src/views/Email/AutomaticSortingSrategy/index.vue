<template>
  <div class="automatic-sorting-srategy">
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
        <el-button type="primary" size="mini" class="search-submit" @click="handleCopy">复制添加</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleSetTime">设置时间</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleDelete">删除</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleSetDefaultTmpl">默认回复模板</el-button>
      </section>
      <section slot="table">
        <yt-table
          :columns="tableColumns"
          reserveSelection="emailReplyPolicyId"
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
            <el-table-column label="状态" width="100px">
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
    <auto-stragegy @formSubmit="handleSubmit" :visible="visible" :default-type.sync="defaultType" :forms="dialogData"></auto-stragegy>
    <log ref="log"></log>
    <yt-dialog :options="setTimeOptions">
      <el-form>
        <el-form-item label="设置时间">
          <el-date-picker
            v-model="effectiveTime"
            type="datetimerange"
            value-format="yyyy-MM-dd hh:mm:ss"
            align="right"
            size="small"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="saveBtn mar10">
          <el-button type="primary" @click="setTimeForm">设置时间</el-button>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
</template>

<script>
import AutoStragegy from './AutoStragegy'
import Log from '../Comment/Log'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      defaultType: false,
      visible: false,
      effectiveTime: [],
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        }
      },
      pageNo: 1,
      pageSize: 10,
      total: 10,
      searchList: [
        {
          value: 'storeIds',
          type: 'multiple',
          placeholder: '订单来源',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          value: 'policyName',
          type: 'input',
          placeholder: '策略名称',
          size: 'small',
          style: {
            width: '260px'
          }
        },
        {
          label: '有效期：',
          value: 'createTime',
          type: 'time',
          size: 'small'
        },
        {
          value: 'activateFlag',
          type: 'select',
          placeholder: '激活状态',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: 1,
              label: '激活'
            },
            {
              value: 0,
              label: '不激活'
            }
          ]
        },
        {
          value: 'creatorId',
          type: 'select',
          placeholder: '添加人',
          size: 'small',
          style: {
            width: '120px'
          },
          children: []
        }
      ],
      msg: 'hello',
      searchForm: {
        value: ''
      },
      tableColumns: [
        {
          value: 'policyName',
          label: '策略名称'
        },
        {
          value: 'applyNum',
          label: '应用邮件数'
        },
        {
          value: 'effectiveTimeStart',
          label: '开始时间'
        },
        {
          value: 'effectiveTimeEnd',
          label: '结束时间'
        },
        {
          value: 'modifyTime',
          label: '更新时间'
        },
        {
          value: 'creatorName',
          label: '添加人'
        },
        {
          value: 'editorName',
          label: '更新人'
        }
      ],
      tableData: [],
      setTimeOptions: {
        visible: false,
        title: '设置时间',
        width: '500px',
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
      logOptions: {
        visible: true,
        title: '添加',
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
      dialogData: {},
      listParams: {
        storeIds: [],
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      selectData: [],
      dialogEvents: {
        open: () => {},
        handleOkClick: () => {}
      }
    }
  },
  created() {
    let vm = this
    vm.getStoreId(0)
    vm.getservice()
    vm.getList()
  },
  mounted() {},
  computed: {
    ...mapState('product', ['storeIdList']),
    ...mapState('email', ['serviceList'])
  },
  watch: {
    storeIdList(val) {
      this.searchList[0].children = val
    },
    serviceList(val) {
      this.searchList[4].children = val
    }
  },
  methods: {
    ...mapActions('product', ['getStoreId']),
    ...mapActions('email', ['getservice']),
    handleCurrentChange(val) {
      this.extendObj({ pageNo: val })
      this.getList()
    },
    handleSizeChange(val) {
      this.extendObj({ pageSize: val })
      this.getList()
    },
    handleSearch(data) {
      if (data.createTime && data.createTime.toString()) {
        data.effectiveTimeStart = data.createTime[0]
        data.effectiveTimeEnd = data.createTime[1]
        delete data.createTime
      } else {
        delete data.effectiveTimeStart
        delete data.effectiveTimeEnd
      }

      this.extendObj(true, data)
      this.getList()
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    handleEdit(index, row) {
      let vm = this
      vm.dialogData = {}
      let emailReplyPolicyId = row.emailReplyPolicyId
      vm.$api['email/replyGet']({
        emailReplyPolicyId
      }).then(data => {
        if (!data && !data.rows) {
          return
        }
        vm.visible = true
        vm.dialogData = data.rows
      })
    },
    handleFlagChange(index, row) {
      let vm = this
      vm.$api['email/replyGet']({
        emailReplyPolicyId: row.emailReplyPolicyId
      }).then(data => {
        let _data = data.rows
        _data.activateFlag = _data.activateFlag ? 0 : 1
        vm.$api['email/replySave'](_data)
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
    handleRecord(index, row) {
      let vm = this
      let emailReplyPolicyId = row.emailReplyPolicyId
      vm.$nextTick(() => {
        vm.$refs.log.getlogOption('email/replyLogPage', {
          emailReplyPolicyId
        })
      })
    },
    handleSubmit() {
      let vm = this
      vm.visible = false
      vm.extendObj(true)
      vm.getList()
    },
    handleAdd() {
      this.dialogData = {}
      this.visible = true
    },
    handleCopy() {
      let vm = this
      let emailReplyPolicyIds = vm.selectData.map(data => {
        return data.emailReplyPolicyId
      })
      if (!emailReplyPolicyIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择要复制的数据</strong>`
        })
        return
      }
      vm.$api['email/replyDataGet']({
        emailReplyPolicyId: emailReplyPolicyIds[emailReplyPolicyIds.length - 1]
      })
        .then(data => {
          if (!data || !data.rows) {
            return
          }
          vm.visible = true
          vm.dialogData = data.rows
          vm.dialogData.emailReplyPolicyId = null
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSetTime() {
      let vm = this
      if (this.$editMsg(vm.selectData, false)) {
        return
      }
      vm.setTimeOptions.visible = true
    },
    setTimeForm() {
      let vm = this
      let emailReplyPolicyIds = vm.selectData.map(data => {
        return data.emailReplyPolicyId
      })
      if (!vm.effectiveTime.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择要设置的时间</strong>`
        })
        return
      }
      let params = {
        effectiveTimeStart: vm.effectiveTime[0],
        effectiveTimeEnd: vm.effectiveTime[1],
        emailReplyPolicyIds
      }
      vm.$api['email/replyTimeSet'](params)
        .then(data => {
          vm.$message({
            dangerouslyUseHTMLString: true,
            type: 'warning',
            message: `<strong>成功设置${
              data.successNum
            }条数据</strong>，<strong>失败${data.failNum}条数据</strong>
            <br/><strong>${data.errMsg}</strong>`
          })
          vm.setTimeOptions.visible = false
          vm.getList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDelete() {
      let vm = this
      let emailReplyPolicyIds = vm.selectData.map(data => {
        return data.emailReplyPolicyId
      })
      vm.deleteList({
        emailReplyPolicyIds: emailReplyPolicyIds
      })
    },
    handleSetDefaultTmpl() {
      // 获取默认模板
      this.$api[`email/emailReplyPolicyDefaultGet`]({})
        .then(data => {
          this.defaultType = true
          this.visible = true
          this.dialogData = { content: data.content }
        })
        .catch(() => {})
    },
    deleteList(params = {}) {
      let vm = this
      vm.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/replyRemove'](params).then(data => {
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
      return vm.$api['email/replyPage'](vm.extendObj(vm.listParams))
        .catch(err => {
          console.log(err)
        })
        .then(data => {
          if (!data) {
            return
          }
          vm.pageNo = data.pageNo
          vm.pageSize = data.pageSize
          vm.total = data.total
          vm.tableData = data.rows
          console.log('获取成功')
          return data
        })
    },
    extendObj(...obj) {
      let listParams = this.listParams
      if (typeof obj[0] === 'boolean') {
        obj.shift()
        listParams = {
          storeIds: [],
          sortOrder: 'asc',
          pageSize: 10,
          pageNumber: 1
        }
      }
      this.listParams = Object.assign(listParams, ...obj)
      if (
        this.listParams.createTime &&
        this.listParams.createTime.length == 2
      ) {
        this.listParams.timeStart = this.listParams.createTime[0]
        this.listParams.timeEnd = this.listParams.createTime[1]
      }
      return this.listParams
    }
  },
  components: {
    AutoStragegy,
    Log
  }
}
</script>

<style lang='scss'>
.automatic-sorting-srategy {
  .search-top-form {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__content {
      line-height: 33px;
    }
  }
}
</style>
