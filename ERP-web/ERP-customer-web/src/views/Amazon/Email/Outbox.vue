<template>
  <div class="outbox-wrap">
    <universal-layout
      :isAmazon="true"
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
        <el-button type="primary" size="small" class="search-submit" @click="handleWrite">写信</el-button>
        <el-button type="primary" size="small" class="search-submit" @click="handleSendAgain">选中邮件重新发送</el-button>
        <el-button type="primary" size="small" class="search-submit" @click="handleSetSuccess">选中邮件设置成功发送，无需发送</el-button>
        <el-button type="primary" size="small" class="search-submit" @click="handleSendCancel">取消发送</el-button>
        <el-button type="primary" size="small" class="search-submit" @click="handleDelete">删除</el-button>
      </section>
      <section slot="table">
        <yt-table
          reserveSelection="emailBaseId"
          :columns="tableColumns"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
          ref="table"
        >
          <el-table-column label="操作" width="110">
            <template slot-scope="scope">
              <el-tooltip content="重新发送" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-refresh"
                  @click="handleSendAgain(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="设置成功发送" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-setting"
                  @click="handleSetSuccess(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="查看" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-search"
                  @click="handleSetView(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="转发" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-share"
                  @click="handleTurn(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </yt-table>
      </section>
    </universal-layout>
    <yt-dialog :options="options" :key="indexKey">
      <write
        @searchModule="searchModule"
        @handleNodeClick="handleNodeClick"
        @sendFlag="sendFlag"
        :writeForm="writeForm"
        :emailType="1"
      ></write>
    </yt-dialog>
    <div>
      <email-view
        :visible="viewVisible"
        @sendFlag="viewSendFlag"
        :form="viewForm"
        :email-type="3"
        :ids="emailAllBaseIds"
        :isShow="false"
      ></email-view>
    </div>
  </div>
</template>

<script>
import Write from './comment/Write'
import EmailView from './comment/EmailView/index'
import { mapActions, mapState } from 'vuex'
export default {
  inject: ['getList', 'extendObj', 'deleteList', 'platformId'],
  data() {
    return {
      indexKey: null,
      pageNo: 1,
      pageSize: 10,
      total: 10,
      searchList: [
        {
          value: 'sendStatus',
          type: 'select',
          placeholder: '发送状态',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: '1',
              label: '发送中'
            },
            {
              value: '2',
              label: '发送成功'
            },
            {
              value: '3',
              label: '发送失败'
            },
            {
              value: '4',
              label: '发送取消'
            }
          ]
        },
        {
          value: 'storeIds',
          type: 'multiple',
          placeholder: '订单来源渠道(多选)',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          label: '发送时间：',
          value: 'replyTime',
          type: 'time',
          size: 'small'
        },
        {
          value: 'templateType',
          type: 'select',
          placeholder: '邮件发送类型',
          size: 'small',
          style: {
            width: '170px'
          },
          children: [
            {
              value: 1,
              label: '索取好评'
            },
            {
              value: 2,
              label: '产品推广'
            },
            {
              value: 3,
              label: '延迟发货'
            }
          ]
        },
        {
          value: 'type',
          type: 'select',
          placeholder: '筛选类型',
          size: 'small',
          style: {
            width: '170px'
          },
          children: [
            {
              value: 1,
              label: '接收邮箱'
            },
            {
              value: 7,
              label: '邮件标题'
            }
          ]
        },
        {
          value: 'searchValue',
          type: 'input',
          placeholder: '',
          size: 'small',
          style: {
            width: '230px'
          }
        }
      ],
      tableColumns: [
        {
          label: '发送状态',
          value: 'sendStatus',
          render(h, scope) {
            if (scope.row.sendStatus === 1) {
              return <div>发送中</div>
            } else if (scope.row.sendStatus === 2) {
              return <div>发送成功</div>
            } else if (scope.row.sendStatus === 3) {
              return <div>发送失败</div>
            } else if (scope.row.sendStatus === 4) {
              return <div>已取消</div>
            }
          }
        },
        {
          label: '来源店铺',
          value: 'storeName'
        },
        {
          label: '邮件发送类型',
          value: 'templateType',
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
          },
          width: '100'
        },
        {
          label: '收件人姓名',
          value: 'customerName'
        },
        {
          label: '收件人邮箱',
          value: 'customerEmailBox'
        },
        {
          label: '邮件主题',
          value: 'subject',
          width: '200'
        },
        {
          label: '添加时间',
          value: 'createTime'
        },
        {
          label: '发送时间',
          value: 'replyTime'
        }
      ],
      tableData: [],
      options: {
        visible: false,
        title: '写邮件',
        width: '1330px',
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
      listParams: {
        emailType: 3,
        platformId: this.platformId,
        quickPick: null,
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      emailBaseIds: [],
      emailAllBaseIds: [],
      writeForm: {},
      viewVisible: false,
      viewForm: {}
    }
  },
  created() {
    let vm = this
    vm.getPlatformStoreList()
    vm.getList().then(data => {
      vm.emailAllBaseIds = data.rows.map(item => {
        return item.emailBaseId
      })
    })
  },
  mounted() {},
  computed: {
    ...mapState('product', ['platformStoreList'])
  },
  watch: {
    platformStoreList(val) {
      let vm = this
      vm.searchList[1].children = val
    }
  },
  methods: {
    ...mapActions('product', ['getPlatformStoreList']),
    handleCurrentChange(val) {
      let vm = this
      vm.extendObj({
        pageNumber: val
      })
      vm.getList()
    },
    handleSizeChange(val) {
      let vm = this
      vm.extendObj({
        pageSize: val
      })
      vm.getList()
    },

    handleSearch(data) {
      let vm = this
      let obj = JSON.parse(JSON.stringify(data))
      if (obj.replyTime && obj.replyTime.length) {
        obj.replyTimeStart = obj.replyTime[0]
        obj.replyTimeEnd = obj.replyTime[1]
        delete obj.replyTime
      } else {
        delete obj.replyTimeStart
        delete obj.replyTimeEnd
      }
      vm.extendObj(true, obj)
      console.log(this.listParams.templateType)

      vm.getList()
    },
    handleSelectionChange(val) {
      let vm = this
      vm.emailBaseIds = val.map(item => {
        return item.emailBaseId
      })
    },
    handleWrite() {
      this.writeForm = {}
      this.indexKey = Math.random()
      this.options.visible = true
    },
    handleSendAgain(index, row) {
      let vm = this
      let params = {
        platformId: vm.platformId
      }
      if (row) {
        params.emailBaseIds = [row['emailBaseId']]
      } else {
        params.emailBaseIds = vm.emailBaseIds
      }
      if (!params.emailBaseIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择邮件</strong>`
        })
        return
      }
      vm.$confirm('是否重新发送?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/outboxSendAgain'](params)
            .then(data => {
              vm.$message({
                dangerouslyUseHTMLString: true,
                type: 'warning',
                message: `<strong>成功发送${
                  data.successNum
                }条邮件</strong>，<strong>失败${data.failNum}条邮件</strong>
                <br/><strong>${data.errMsg}</strong>`
              })
              vm.getList()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          vm.$message({
            type: 'info',
            message: '已取消发送'
          })
        })
    },
    handleSetSuccess(index, row) {
      let vm = this
      let params = {
        platformId: vm.platformId
      }
      if (row) {
        params.emailBaseIds = [row['emailBaseId']]
      } else {
        params.emailBaseIds = vm.emailBaseIds
      }
      if (!params.emailBaseIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择邮件</strong>`
        })
        return
      }
      vm.$confirm('选中邮件设置成功发送, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/outboxSetSuccess'](params)
            .then(data => {
              vm.$message({
                dangerouslyUseHTMLString: true,
                type: 'warning',
                message: `<strong>设置成功发送${
                  data.successNum
                }条邮件</strong>，<strong>失败${data.failNum}条邮件</strong>
                <br/><strong>${data.errMsg}</strong>`
              })
              vm.getList()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          vm.$message({
            type: 'info',
            message: '已取消发送'
          })
        })
    },
    handleSetView(index, row) {
      let vm = this
      let params = {
        emailBaseId: row.emailBaseId,
        emailType: 3
      }
      vm.$api['email/baseGet'](params)
        .then(data => {
          if (!data) {
            return
          }
          vm.viewVisible = true
          vm.viewForm = data.rows
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleTurn(index, row) {
      let vm = this
      vm.indexKey = Math.random()
      vm.$api['email/baseGet']({
        emailBaseId: row.emailBaseId,
        emailType: 3
      }).then(data => {
        if (!data) {
          return
        }
        console.log(data.rows)

        vm.options.visible = true
        vm.options.title = '邮件转发'
        vm.writeForm = data.rows
        vm.writeForm.emailBaseId = null
      })
    },
    handleSendCancel() {
      let vm = this
      let params = {
        emailBaseIds: vm.emailBaseIds,
        platformId: vm.platformId
      }
      if (!params.emailBaseIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择邮件</strong>`
        })
        return
      }
      vm.$confirm('选中邮件取消发送, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/outboxSendCancel'](params)
            .then(data => {
              vm.$message({
                dangerouslyUseHTMLString: true,
                type: 'warning',
                message: `<strong>取消发送${
                  data.successNum
                }条邮件</strong>，<strong>失败${data.failNum}条邮件</strong>
                <br/><strong>${data.errMsg}</strong>`
              })
              vm.getList()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          vm.$message({
            type: 'info',
            message: '已取消该操作'
          })
        })
    },
    handleDelete() {
      let vm = this
      let emailBaseIds = vm.emailBaseIds
      vm.deleteList({
        emailBaseIds,
        emailType: 3
      })
    },
    // 发送邮件事件
    searchModule(val) {
      console.log(val)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    sendEmail() {
      this.options.visible = false
    },
    // 表单操作事件
    sendFlag() {
      this.options.visible = false
      this.getList()
    },
    viewSendFlag(val) {
      if (!val) {
        this.viewVisible = false
        this.getList()
      }
    }
  },
  components: {
    Write,
    EmailView
  }
}
</script>

<style lang="scss">
.outbox-wrap {
  .search-top-form {
    .normal-btn {
      width: 180px;
    }
    .small-btn {
      width: 110px;
    }
    .el-form-item--small.el-form-item,
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .normal-icon {
    border: none;
    padding: 6px 6px;
    margin-left: 6px;
    background: rgba(255, 255, 255, 0);
    i {
      font-size: 16px;
    }
  }
}
</style>
