<template>
  <div class="drafts">
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
        <el-button type="primary" size="small" class="search-submit" @click="handleModified">写信</el-button>
        <el-button type="primary" size="small" class="search-submit" @click="handleUpdate">审核</el-button>
        <el-button type="primary" size="small" class="search-submit" @click="handleCommit">发送</el-button>
        <el-button type="primary" size="small" class="search-submit" @click="handleDelete">删除</el-button>
      </section>
      <section slot="table">
        <yt-table
          reserveSelection="emailBaseId"
          :columns="columnsData"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
          ref="table"
        >
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
              <el-tooltip content="审核" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-search"
                  @click="handleUpdate(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.auditStatus === 3"
                content="查看原因"
                offset="1"
                placement="bottom"
                effect="light"
              >
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-view"
                  @click="handleReason(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </yt-table>
      </section>
    </universal-layout>
    <yt-dialog :options="options" :events="dialogEvents">
      <div v-if="isWrite">
        <write
          @searchModule="searchModule"
          @handleNodeClick="handleNodeClick"
          @sendFlag="sendEmail"
          :emailType="1"
          :writeForm="writeForm"
          :key="indexKey"
          :isEdit="isEdit"
        ></write>
      </div>
      <div v-else>
        <el-form ref="form" label-width="80px">
          <el-form-item label="审核：">
            <el-radio-group v-model="audit.auditStatus">
              <el-radio label="审核通过"></el-radio>
              <el-radio label="审核不通过"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原因：">
            <el-input type="textarea" style="width:360px" v-model="audit.reason"></el-input>
          </el-form-item>
          <el-form-item class="saveBtn mar10" label-width="0px">
            <el-button size="small" type="primary" @click="handleAudit">确认审核</el-button>
            <el-button size="small" type="primary" @click="handleAuditCancle">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </yt-dialog>
    <yt-dialog :options="reasonOptions">
      <el-form ref="form" label-width="80px">
        <!-- <el-form-item label="审核：">
          <el-radio-group>
            <el-radio disabled label="审核不通过"></el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="原因：">
          <el-input type="textarea" disabled style="width:360px" v-model="reason"></el-input>
        </el-form-item>
        <!-- <el-form-item class="saveBtn mar10" label-width="0px">
          <el-button size="small" type="primary" @click="handleAudit">确认审核</el-button>
          <el-button size="small" type="primary" @click="handleAuditCancle">取消</el-button>
        </el-form-item>-->
      </el-form>
    </yt-dialog>
  </div>
</template>

<script>
import Write from './comment/Write'
import { mapActions, mapState } from 'vuex'
export default {
  inject: ['getList', 'extendObj', 'deleteList', 'platformId'],
  data() {
    return {
      reason: '123',
      isEdit: false,
      pageNo: 1,
      pageSize: 10,
      total: 10,
      audit: {
        auditStatus: 1
      },
      searchList: [
        {
          value: 'storeIds',
          type: 'multiple',
          placeholder: '来源渠道(多选)',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          label: '添加时间',
          value: 'createTime',
          type: 'time',
          size: 'small'
        },
        {
          value: 'templateType',
          type: 'select',
          placeholder: '邮件发送类型',
          size: 'small',
          style: {
            width: '120px'
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
          value: 'auditStatus',
          type: 'select',
          placeholder: '审核状态',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: 1,
              label: '未审核'
            },
            {
              value: 2,
              label: '审核通过'
            },
            {
              value: 3,
              label: '不通过'
            }
          ]
        },
        {
          value: 'type',
          type: 'select',
          placeholder: '筛选类型',
          size: 'small',
          style: {
            width: '120px'
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
            width: '170px'
          }
        }
      ],
      searchForm: {
        platformIds: '',
        timeStart: '',
        timeEnd: ''
      },
      columnsData: [
        {
          label: '来源渠道',
          value: 'storeName',
          width: '120'
        },
        {
          label: '邮件发送类型',
          value: 'templateType',
          width: '100',
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
          label: '收件人姓名',
          value: 'customerName',
          width: '100'
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
          label: '状态',
          render(h, scope) {
            if (scope.row.auditStatus == 0) {
              return <div>草稿箱待编辑</div>
            } else if (scope.row.auditStatus == 1) {
              return <div>草稿箱待审核</div>
            } else if (scope.row.auditStatus == 2) {
              return <div>审核通过</div>
            } else if (scope.row.auditStatus == 3) {
              return <div>审核失败</div>
            }
          }
        },
        {
          label: '添加时间',
          value: 'createTime'
        }
      ],
      tableData: [],
      reasonOptions: {
        visible: false,
        title: '查看原因',
        width: '560px',
        top: '30vh'
      },
      options: {
        visible: false,
        title: '编辑邮件',
        width: '560px',
        // width: '1330px',
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
      isWrite: true,

      writeForm: {
        selectOrder: '',
        input: '',
        orderId: '',
        serviceId: '',
        theme: '',
        clientId: '',
        itemId: '',
        email: ''
      },
      listParams: {
        emailType: 2,
        platformId: this.platformId,
        quickPick: null,
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      dialogEvents: {
        close: () => {}
      },
      emailBaseIds: [],
      indexKey: null
    }
  },
  created() {
    let vm = this
    vm.getList().then(() => {})
    vm.getPlatformStoreList(2)
  },
  computed: {
    ...mapState('product', ['platformStoreList'])
  },
  watch: {
    // 'audit.auditStatus'(val) {
    //   console.log(val)
    // },
    platformStoreList(val) {
      let vm = this
      vm.searchList[0].children = val
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
      if (obj.createTime && obj.createTime.length) {
        obj.createTimeStart = obj.createTime[0]
        obj.createTimeEnd = obj.createTime[1]
        delete obj.createTime
      }
      vm.extendObj(true, obj)
      vm.getList()
    },
    handleSelectionChange(val) {
      let vm = this
      vm.emailBaseIds = val.map(item => {
        return item.emailBaseId
      })
    },
    handleModified() {
      this.options.visible = true
      this.indexKey = Math.random()
      this.options.title = '写邮件'
      this.options.width = '1330px'
      this.writeForm = {}
      this.isWrite = true
      this.isEdit = false
    },
    handleReason(index, row) {
      this.reasonOptions.visible = true
      this.reason = row.reason
    },
    handleUpdate(index, row) {
      if (row) {
        this.emailBaseIds = [row.emailBaseId]
      }
      if (!this.emailBaseIds.length) {
        this.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择邮件</strong>`
        })
        return
      }
      this.audit = {}
      this.isWrite = false
      this.options.visible = true
      this.options.width = '560px'
      this.options.title = '审核'
    },
    handleCommit() {
      let vm = this
      let emailBaseIds = vm.emailBaseIds
      if (!emailBaseIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择邮件</strong>`
        })
        return
      }
      vm.$api['email/outboxBatchCommit']({
        emailBaseIds
      })
        .then(data => {
          vm.$message({
            dangerouslyUseHTMLString: true,
            type: 'warning',
            message: `<strong>发送成功${
              data.successNum
            }条</strong>，<strong>失败${data.failNum}条</strong>
            <br/><strong>${data.errMsg}</strong>`
          })
          vm.getList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDelete() {
      let vm = this
      let emailBaseIds = vm.emailBaseIds
      if (!emailBaseIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择邮件</strong>`
        })
        return
      }
      vm.deleteList({
        emailBaseIds,
        emailType: 2
      })
    },
    handleEdit(index, row) {
      let vm = this
      vm.indexKey = Math.random()
      vm.isWrite = true
      let params = {
        emailBaseId: row.emailBaseId,
        emailType: 2
      }
      vm.$api['email/baseGet'](params)
        .then(data => {
          if (!data || !data.rows) {
            return
          }
          vm.isEdit = true
          vm.writeForm = data.rows
          vm.options.title = '编辑邮件'
          vm.options.width = '1330px'
          vm.options.visible = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 发送邮件事件
    searchModule(val) {
      console.log(val)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    sendEmail(data) {
      let vm = this
      if (!data) {
        return
      }
      vm.options.visible = false
      vm.extendObj(true)
      vm.getList()
    },
    handleAudit() {
      let vm = this
      let emailBaseIds = vm.emailBaseIds
      let auditStatus = vm.audit.auditStatus
      let reason = vm.audit.reason
      if (auditStatus === '审核通过') {
        auditStatus = 1
      } else {
        auditStatus = 0
      }
      vm.$api['email/outboxAuditUpdate']({
        emailBaseIds,
        auditStatus,
        reason
      })
        .then(data => {
          vm.options.visible = false
          vm.emailBaseIds = []
          vm.$message({
            dangerouslyUseHTMLString: true,
            type: 'warning',
            message: `<strong>成功审核${
              data.successNum
            }条</strong>，<strong>失败${data.failNum}条</strong>
            <br/><strong>${data.errMsg}</strong>`
          })
          vm.getList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleAuditCancle() {
      this.options.visible = false
    }
  },
  components: {
    Write
  }
}
</script>

<style lang="scss">
.drafts {
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
    .el-form-item__content {
      line-height: 33px;
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
