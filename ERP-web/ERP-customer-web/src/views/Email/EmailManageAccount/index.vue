<template>
  <div class="email-manage-account">
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
          :columns="tableColumns"
          :data="tableData"
          reserveSelection="emailAccountId"
          @handleSelectionChange="handleSelectionChange"
          ref="table"
        >
          <el-table-column label="操作" width="100">
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
          <template slot="right">
            <el-table-column label="邮件发送服务" width="100px">
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
    <div class="dialog-wrap">
      <yt-dialog :options="options" :events="events" :key="indexKey">
        <div v-if="isAddFlag">
          <el-form ref="dialogForm" :model="dialogForm" label-width="120px">
            <el-form-item size="small" label="店铺:" prop="storeId" :rules="[{ required: true, message: '请选择店铺',  }]">
              <el-select v-model="dialogForm.storeId" placeholder="来源渠道" class="w260">
                <el-option v-for="item in storeIdList" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              size="small"
              label="接收邮件协议:"
              prop="protocol"
              :rules="[{ required: true, message: '请选择邮件协议',  }]"
            >
              <el-select v-model="dialogForm.protocol" placeholder="来源渠道" class="w260">
                <el-option v-for="item in protocolList" :label="item" :value="item" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              size="small"
              prop="account"
              label="邮箱"
              class
              :rules="[
              { required: true, message: '请输入邮箱地址',  },
              { type: 'email', message: '请输入正确的邮箱地址',  }
            ]"
            >
              <el-input v-model="dialogForm.account" class="w260"></el-input>
            </el-form-item>
            <el-form-item
              size="small"
              label="密码(授权码):"
              prop="authCode"
              :rules="[{ required: true, message: '请输入授权码',  }]"
            >
              <el-input type="password" class="w260" v-model="dialogForm.authCode"></el-input>
            </el-form-item>
            <el-form-item
              size="small"
              label="默认客服:"
              prop="serviceId"
              :rules="[{ required: true, message: '请选择默认客服',  }]"
            >
              <el-select v-model="dialogForm.serviceId" placeholder class="w260">
                <el-option v-for="item in serviceList" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" prop="nickName" label="用户名:" :rules="strRule">
              <el-input v-model="dialogForm.nickName" class="w260"></el-input>
            </el-form-item>
            <el-form-item size="small" label="账户签名:" prop="signature" :rules="[{ required: true, message: '请输入账户签名' }]">
              <el-input class="w260" type="textarea" v-model="dialogForm.signature"></el-input>
            </el-form-item>
            <el-form-item
              size="small"
              label="邮件收发服务:"
              prop="activateFlag"
              :rules="[{ required: true, message: '请选择邮件发送服务 ',  }]"
            >
              <el-radio-group v-model="dialogForm.activateFlag">
                <el-radio :label="1" border>开启</el-radio>
                <el-radio :label="0" border>关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="saveBtn" label-width="0px">
              <el-button size="small" type="primary" :loading="loading" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </yt-dialog>
      <log ref="log"></log>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Log from '../Comment/Log'
let checkval = function(rule, value, callback) {
  let re = /^[\u4e00-\u9fa5a-z0-9]+$/gi //只能输入汉字和英文字母
  if (!re.test(value)) {
    callback(new Error('用户名不能包含特殊字符'))
  } else {
    callback()
  }
}
export default {
  data() {
    return {
      loading: false,
      indexKey: null,
      tableColumnsLog: [
        {
          label: '操作时间',
          value: 'createTime'
        },
        {
          label: '操作者',
          value: 'operatorName'
        },
        {
          label: '操作内容',
          value: 'bussinessName'
        }
      ],
      tableDataLog: [],
      searchListLog: [
        {
          label: '操作时间:',
          value: 'time',
          type: 'time',
          size: 'small'
        },
        {
          value: 'account',
          label: '操作内容:',
          type: 'input',
          placeholder: '',
          size: 'small',
          style: {
            width: '250px'
          }
        }
      ],
      isAddFlag: true,
      strRule: [
        { required: true, message: '请输入用户名' },
        { validator: checkval }
      ],
      boolFlag: {},
      dialogForm: {
        emailAccountId: '',
        storeId: '',
        protocol: '',
        account: '',
        authCode: '',
        serviceId: '',
        nickName: '',
        signature: '',
        activateFlag: ''
      },
      pageNo: 1,
      pageSize: 10,
      total: 10,
      searchList: [
        {
          value: 'storeIds',
          type: 'multiple',
          placeholder: '店铺(可多选)',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          value: 'account',
          label: '邮箱:',
          type: 'input',
          placeholder: '',
          size: 'small',
          style: {
            width: '250px'
          }
        },
        {
          value: 'serviceId',
          type: 'select',
          placeholder: '选择客服',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          label: '时间',
          value: 'time',
          type: 'time',
          size: 'small'
        }
      ],
      tableColumns: [
        {
          label: '店铺',
          value: 'storeName'
        },
        {
          label: '接收邮件协议',
          value: 'protocol'
        },
        {
          label: '邮箱账号',
          value: 'account'
        },
        {
          label: '用户名',
          value: 'nickName'
        },
        {
          label: '发送数量',
          value: 'sendNum'
        },
        {
          label: '收取数量',
          value: 'receiveNum'
        },
        {
          label: '添加时间',
          value: 'createTime'
        },
        {
          label: '默认客服',
          value: 'serviceName'
        }
      ],
      tableData: [],
      selectData: [],
      options: {
        visible: false,
        title: '添加',
        width: '430px',
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
      events: {
        open: () => {},
        close: () => {}
      },
      listParams: {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      }
    }
  },
  created() {
    let vm = this
    vm.getProtocol()
    vm.getStoreId()
    vm.getservice()
    vm.getList()
  },
  computed: {
    ...mapState('email', ['protocolList', 'serviceList']),
    ...mapState('product', ['storeIdList'])
  },
  watch: {
    storeIdList(val) {
      let vm = this
      vm.searchList[0].children = val
    },
    serviceList(val) {
      let vm = this
      vm.searchList[2].children = val
    }
  },

  mounted() {},
  methods: {
    ...mapActions('email', ['getProtocol', 'getservice']),
    ...mapActions('product', ['getStoreId']),
    handleCurrentChange(val) {
      this.extendObj({ pageNumber: val })
      this.getList()
    },
    handleSizeChange(val) {
      this.extendObj({ pageSize: val })
      this.getList()
    },
    handleSearch(data) {
      let obj = JSON.parse(JSON.stringify(data))
      if (Array.isArray(obj.time) && obj.time.length) {
        obj.timeStart = obj.time[0]
        obj.timeEnd = obj.time[1]
        delete obj.time
      } else {
        delete obj.timeStart
        delete obj.timeEnd
      }
      this.extendObj(true, obj)
      this.getList()
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    handleDelete() {
      let vm = this
      let emailAccountIds = vm.selectData.map(data => {
        return data.emailAccountId
      })
      vm.deleteList({
        emailAccountIds: emailAccountIds
      })
    },

    handleAdd() {
      this.indexKey = Math.random()
      this.isAddFlag = true
      this.dialogForm = {}
      this.options.title = '添加'
      this.options.width = '430px'
      this.options.visible = true
    },
    handleEdit(index, row) {
      let vm = this
      vm.indexKey = Math.random()
      vm.isAddFlag = true
      vm.options.title = '添加'
      vm.options.width = '430px'
      let emailAccountId = row.emailAccountId
      vm.options.visible = true
      vm.$api['email/accountGet']({
        emailAccountId
      })
        .then(data => {
          vm.dialogForm = data.rows
          // vm.dialogForm.authCode = ''
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleFlagChange(index, row) {
      let vm = this
      vm.$api['email/accountGet']({
        emailAccountId: row.emailAccountId
      }).then(data => {
        let _data = data.rows
        _data.activateFlag = _data.activateFlag ? 0 : 1
        vm.$api['email/emailSave'](_data)
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
      let emailAccountId = row.emailAccountId
      vm.$nextTick(() => {
        vm.$refs.log.getlogOption('email/accountLogPage', {
          emailAccountId
        })
      })
    },

    onSubmit() {
      let vm = this
      vm.loading = true
      vm.$refs.dialogForm.validate(valid => {
        if (valid) {
          vm.$api['email/emailSave'](vm.dialogForm)
            .then(() => {
              vm.loading = false
              vm.options.visible = false
              vm.extendObj(true)
              vm.getList()
            })
            .catch(() => {
              vm.loading = false
            })
        } else {
          vm.loading = false
        }
      })
    },
    deleteList(params) {
      let vm = this
      vm.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/deleteAccount'](params).then(data => {
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
    getLogList(params = {}) {
      let vm = this
      return vm.$api['email/accountLogPage'](params)
        .then(data => {
          if (!data) {
            return
          }
          vm.tableDataLog = data.rows
          return data
        })
        .catch(err => {
          console.log(err)
        })
    },
    getList() {
      let vm = this
      return vm.$api['email/accountPage'](vm.extendObj(vm.listParams))
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
      let vm = this
      if (typeof obj[0] === 'boolean') {
        obj.shift()
        vm.listParams = {
          sortOrder: 'asc',
          pageSize: 10,
          pageNumber: 1
        }
      }
      vm.listParams = Object.assign(vm.listParams, ...obj)
      return vm.listParams
    }
  },
  components: {
    Log
  }
}
</script>

<style lang="scss">
.email-manage-account {
  .dialog-wrap {
    .w260 {
      width: 260px;
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 18px;
    }
  }
  .normal-width {
    width: 260px;
  }
}
</style>
