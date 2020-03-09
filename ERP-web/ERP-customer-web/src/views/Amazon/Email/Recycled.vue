<template>
  <div class="index-wrap">
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
        <el-row>
          <el-button type="primary" size="small" @click="handleWrite">写信</el-button>
          <el-button type="primary" size="small" @click="handleRevert">恢复</el-button>
          <el-button type="primary" size="small" @click="handleClear">清空回收站</el-button>
        </el-row>
      </section>
      <section slot="table">
        <yt-table
          reserveSelection="emailBaseId"
          :columns="tableColumns"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
          ref="table"
        >
          <el-table-column label="邮件状态" width="70" slot="left">
            <template slot-scope="scope">
              <span v-if="!scope.row.readStatus" class="normal-table-icon">
                <i class="iconfont">&#xe6f0;</i>
              </span>
              <span v-else class="normal-table-icon">
                <i class="iconfont">&#xe617;</i>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110">
            <template slot-scope="scope">
              <el-tooltip content="查看" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-search"
                  @click="handleSetView(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="新窗口打开" offset="1" placement="bottom" effect="light">
                <el-button class="normal-table-icon" size="mini">
                  <router-link
                    :to="{path: '/viewEmail', query: {emailBaseId: scope.row.emailBaseId,emailType:4}}"
                    target="_blank"
                  >
                    <i class="el-icon-document"></i>
                  </router-link>
                </el-button>
              </el-tooltip>
              <el-tooltip content="加入智能邮箱黑名单" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-news"
                  @click="handleBlackAdd(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="标题" width="120" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span style="display:inline-block;width:86px;" class="ellipsis-abbreviation">{{ scope.row.subject }}</span>
              <span v-if="scope.row.starFlag" class="normal-table-icon">
                <i class="el-icon-star-off"></i>
              </span>
            </template>
          </el-table-column>
        </yt-table>
      </section>
    </universal-layout>
    <menu-select
      :loadData="loadData"
      nodeKey="label"
      :defaultProps="{
        children: 'children',
        label: 'label',
        count: 'count',
        value: 'value'
      }"
      @nodeclick="nodeclick"
    ></menu-select>
    <!-- 写邮件dialog -->
    <yt-dialog :options="writeOptions">
      <el-row class="dialog-wrap">
        <div v-if="writeFlag">
          <write
            @searchModule="searchModule"
            @handleNodeClick="handleNodeClick"
            @sendFlag="sendFlag"
            :emailType="1"
            :key="indexKey"
          ></write>
        </div>
      </el-row>
    </yt-dialog>
    <div>
      <email-view
        :visible="viewVisible"
        @sendFlag="viewSendFlag"
        :form="viewForm"
        :email-type="4"
        :ids="emailAllBaseIds"
        :isShow="false"
      ></email-view>
    </div>
  </div>
</template>

<script>
import Write from './comment/Write'
import { mapActions, mapState } from 'vuex'
import MenuSelect from './comment/MenuSelect'
import EmailView from './comment/EmailView/index'
import { CONST_PORT_CONFIG } from 'Config'
const { loginRedirect } = CONST_PORT_CONFIG

export default {
  inject: ['getList', 'extendObj', 'platformId'],
  data() {
    return {
      indexKey: null,
      pageNo: 1,
      pageSize: 10,
      total: 10,
      searchList: [
        {
          value: 'type',
          type: 'select',
          placeholder: '搜索类型',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: 1,
              label: '客户邮箱'
            },
            {
              value: 2,
              label: '客户id'
            },
            {
              value: 3,
              label: '客户姓名'
            },
            {
              value: 4,
              label: '系统订单号'
            },
            {
              value: 5,
              label: '平台订单号'
            },
            {
              value: 6,
              label: '国家'
            },
            {
              value: 7,
              label: '邮件标题 '
            },
            {
              value: 8,
              label: '邮件内容'
            },
            {
              value: 9,
              label: 'sku'
            },
            {
              value: 10,
              label: '店铺sku'
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
        },
        {
          value: 'storeIds',
          type: 'multiple',
          placeholder: '来源店铺(多选)',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          label: '收取时间：',
          value: 'receiveTime',
          type: 'time',
          size: 'small'
        },
        {
          value: 'serviceIds',
          type: 'multiple',
          placeholder: '操作客服人员(多选)',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          value: 'starFlag',
          type: 'select',
          placeholder: '特殊状态',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: '1',
              label: '标记'
            },
            {
              value: '0',
              label: '未标记'
            }
          ]
        },
        {
          value: 'readStatus',
          type: 'select',
          placeholder: '读取状态',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: '1',
              label: '已读'
            },
            {
              value: '0',
              label: '未读'
            }
          ]
        },
        {
          value: 'replyType',
          type: 'select',
          placeholder: '回复状态',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: '1',
              label: '未回复'
            },
            {
              value: '2',
              label: '已回复'
            },
            {
              value: '3',
              label: '不需要回复'
            }
          ]
        }
      ],
      writeFlag: false,
      writeData: {
        selectOrder: '',
        input: '',
        orderId: '',
        serviceId: '',
        theme: '',
        clientId: '',
        itemId: '',
        email: ''
      },
      btnArr: ['所有', '24小时内回复', '24小时前回复', '已回复', '所有未回复'],
      activeShow: 0,
      tableColumns: [
        {
          label: '客户',
          value: 'customerName'
        },
        {
          label: '邮箱',
          value: 'customerEmailBox'
        },
        {
          label: '订单号',
          value: 'orderNumSystem',
          render: (h, scope) => {
            let num = scope.row.orderNumSystem || '-'
            return (
              <div
                onClick={() => {
                  this.getDetail(num)
                }}
                style="color:#108ee9;cursor:pointer"
              >
                {num}
              </div>
            )
          }
        },
        {
          label: '订单来源店铺',
          value: 'storeName'
        },
        {
          label: '收取时间',
          value: 'receiveTime'
        },
        {
          label: '回复时间',
          value: 'replyTime'
        },
        {
          label: '客服人员',
          value: 'serviceName'
        }
      ],
      tableData: [],
      writeOptions: {
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
      dialogFlag: '标记',
      listParams: {
        emailType: 4,
        platformId: this.platformId,
        quickPick: null,
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      selectData: [],
      emailBaseIds: [],
      viewVisible: false,
      viewForm: {},
      emailAllBaseIds: []
    }
  },
  created() {
    let vm = this
    vm.getPlatformStoreList()
    vm.getservice()
    vm.getList().then(data => {
      vm.emailAllBaseIds = data.rows.map(item => {
        return item.emailBaseId
      })
    })
  },
  mounted() {},
  computed: {
    ...mapState('product', ['platformStoreList']),
    ...mapState('email', ['serviceList'])
  },
  watch: {
    platformStoreList(val) {
      let vm = this
      vm.searchList[2].children = val
    },
    serviceList(val) {
      let vm = this
      vm.searchList[4].children = val
    }
  },
  methods: {
    ...mapActions('product', ['getPlatformStoreList']),
    ...mapActions('email', ['getservice']),
    async getDetail(val) {
      if (!val || val == '-') {
        return
      }
      let orderServiceId = null
      let deliveryStatus = null
      let platformId = null
      let orderType = null
      await this.$api['order/getOrderIdByNumber']({
        orderNumber: val
      }).then(data => {
        orderServiceId = data.orderId
      })
      await this.$api['order/orderInfo']({
        orderId: orderServiceId
      }).then(data => {
        let info = data.rows.essentialInfo
        deliveryStatus = info.deliveryStatus
        platformId = info.platformId
        orderType = info.orderType
        let a = document.createElement('a')
        a.href =
          loginRedirect +
          `erp-order/#/salesManagement/associatedSettings/allOrderLists/lookOver?deliveryStatus=${deliveryStatus}&orderServiceId=${orderServiceId}&platformId=${platformId}&orderType=${orderType}`
        a.target = '_blank'
        a.click()
        a = null
      })
    },
    loadData() {
      let vm = this
      return vm.$api['email/classificationList']({
        classifyType: 1,
        flag: 1,
        emailType: 4,
        platformId: vm.platformId
      }).then(data => {
        if (!data || !data.rows) {
          return []
        }
        let val = JSON.parse(JSON.stringify(data.rows))
        let obj = {
          label: val.classifyName,
          count: val.num,
          value: val.emailClassificationId
        }
        obj.children = vm.getClassification(val.childs)
        return [obj]
      })
    },
    getClassification(data) {
      let vm = this
      let result = []
      data.map(item => {
        let obj = {
          label: item.classifyName,
          count: item.num,
          value: item.emailClassificationId
        }
        if (item.childs && item.childs.length) {
          obj.children = vm.getClassification(item.childs)
        }
        result.push(obj)
      })
      return result
    },
    nodeclick(data) {
      this.listParams.emailClassificationId = data.value
    },
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
    handleSelectionChange(val) {
      let vm = this
      vm.selectData = val.map(item => {
        return item.emailBaseId
      })
    },
    handleSearch(data) {
      let vm = this
      let obj = JSON.parse(JSON.stringify(data))
      if (obj.receiveTime && obj.receiveTime.length) {
        obj.receiveTimeStart = obj.receiveTime[0]
        obj.receiveTimeEnd = obj.receiveTime[1]
        delete obj.receiveTime
      }
      vm.extendObj(true, obj)
      vm.getList()
    },
    handleWrite() {
      this.writeFlag = true
      this.indexKey = Math.random()
      this.writeOptions.visible = true
      this.writeOptions.title = '写邮件'
    },
    handleRevert() {
      let vm = this
      let emailBaseIds = vm.selectData
      if (!emailBaseIds.length) {
        this.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择邮件</strong>`
        })
        return
      }
      vm.$confirm('此操作将恢复该邮件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/recycleRevert']({
            emailBaseIds
          })
            .then(() => {
              vm.getList()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消恢复'
          })
        })
    },
    handleClear() {
      let vm = this
      vm.$confirm('此操作将清空回收站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/recycleEmpty']({
            platformId: vm.platformId
          })
            .then(() => {
              vm.getList()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清空'
          })
        })
    },
    handleDetail() {
      this.$router.push('/viewEmail')
    },
    handleSetView(index, row) {
      let vm = this
      let params = {
        emailBaseId: row.emailBaseId,
        emailType: 4
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
    handleBlackAdd(index, row) {
      let vm = this
      let params = {}
      vm.$confirm('此操作将加入营销邮件黑名单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          params = {
            emailBaseId: row.emailBaseId
          }
          vm.$api['email/emailListAdd'](params)
            .then(() => {})
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          vm.$message({
            type: 'info',
            message: '已取消加入黑名单'
          })
        })
    },
    // 写邮件事件
    searchModule(val) {
      console.log(val)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    sendFlag() {
      this.writeFlag = false
      this.writeOptions.visible = false
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
    MenuSelect,
    EmailView
  }
}
</script>

<style lang="scss">
.normal-table-icon {
  a:link,
  a:visited {
    color: #606266;
  }
  a:hover {
    color: #0e80d2;
  }
}
.index-wrap {
  .allbtn {
    display: block;
  }
  .ellipsis-abbreviation {
    padding-right: 0;
  }
  .search-top-form {
    .client-input {
      width: 120px;
    }
    .searh-type-btn {
      width: 98px;
    }
    .normal-width {
      width: 150px;
    }
    .start-time {
      margin-right: 0;
    }
    .el-form-item--small.el-form-item,
    .el-form-item {
      margin-bottom: 4px;
    }
    .el-form-item__content {
      line-height: 33px;
    }
  }
  .dropdown-btn {
    margin: 0 6px;
  }
  .filtrate {
    padding: 10px 10px 10px 0px;
    height: 32px;
    line-height: 32px;
    button {
      padding: 9px 15px;
      font-size: 12px;
      border-radius: 3px;
      border: none;
      transition: 0.1s;
      font-weight: 500;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      -webkit-appearance: none;
      text-align: center;
      background: #fff;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      color: #409eff;
    }
    .active {
      border: 1px solid #409eff;
      background: #409eff;
      color: #fff;
    }
  }
  .left-btn-sign {
    span {
      color: #a2cffc;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      padding: 11px 0;
      padding-right: 30px;
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
  .state-icon {
    font-size: 24px;
  }
  .dialog-wrap {
    border-top: 1px solid #bbb;
    padding-top: 10px;
    .el-form-item__label {
      padding-right: 0;
    }
    .normal-input {
      width: 500px;
    }

    .email-left {
      height: 606px;
      border: 1px solid rgb(226, 226, 226);
      .select-modules {
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        font-weight: bold;
        font-size: 16px;
        background: rgb(231, 231, 231);
      }
      .search-input {
        input {
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        }
      }
      .search-btn {
        padding: 5px 14px;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        i {
          font-size: 20px;
        }
      }
    }
    .view-wrap {
      .view-email {
        width: 99.8%;
        height: 500px;
        border: 1px solid rgb(240, 240, 240);
        margin-top: -11px;
        .email-information {
          height: 120px;
          background: rgb(240, 240, 240);
          .martop20 {
            padding-top: 20px;
          }
          .title {
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
