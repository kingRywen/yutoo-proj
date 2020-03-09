<template>
  <div class="feedback-manage">
    <universal-layout
      :isAmazon="true"
      :total="total"
      :pageSize="pageSize"
      :pageNo="pageNumber"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <section slot="search">
        <search ref="search" :searchList="searchList" @search="handleSearch"></search>
      </section>
      <section slot="allbtn">
        <el-button type="primary" size="small" class="search-btn" @click="handleBatch">批量处理</el-button>
        <el-button type="primary" size="small" class="search-btn" @click="handleGetOrder">批量提取系统订单号</el-button>
        <el-button type="primary" size="small" class="search-btn" @click="handleConditionOut">当前条件导出</el-button>
      </section>
      <section slot="table">
        <yt-table
          reserveSelection="serviceAmazonFeedbackId"
          :columns="tableColumns"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
          ref="table"
        >
          <el-table-column label="操作" width="110" align="center">
            <template slot-scope="scope">
              <el-tooltip content="处理" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-search"
                  @click="handleBatch(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="联系买家" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-phone"
                  @click="handleConncat(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="差评原因" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-news"
                  @click="handleReason(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </yt-table>
      </section>
    </universal-layout>
    <yt-dialog :options="options">
      <div class="dialog-wrap">
        <el-form class="search-top-form">
          <el-form-item size="small" class="martop" label-width="50px">
            <el-select placeholder class="marleft10" v-model="handleState">
              <el-option label="待处理" :value="2"></el-option>
              <el-option label="处理完成" :value="3"></el-option>
              <el-option label="已过期" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-row class="saveBtn" style="margin-top:20px;">
            <el-button size="small" type="primary" @click="signSubmit">确认</el-button>
            <el-button size="small" type="primary" @click="signCancel">取消</el-button>
          </el-row>
        </el-form>
      </div>
    </yt-dialog>
    <yt-dialog :options="orderNumOptions" :copy-text="copyText">
      <el-row>
        <el-table :data="orderData" highlight-current-row style="width: 100%">
          <el-table-column show-overflow-tooltip property="subject" label="数据" width="220" class="subject-cell"></el-table-column>
          <el-table-column property="orderNumPlatform" label="系统订单号"></el-table-column>
        </el-table>
        <el-row class="saveBtn" style="margin-top:60px;">
          <el-button size="small" type="primary" @click="orderNumOptions.visible = false">关闭</el-button>
        </el-row>
      </el-row>
    </yt-dialog>
    <yt-dialog :options="negativeOptions">
      <el-form class="search-top-form negative">
        <el-form-item size="small" label-width="90px" label="差评原因:">
          <el-select style="width:260px" v-model="reason.feedbackReasonId">
            <el-option label="未收到货物" :value="1"></el-option>
            <el-option label="描述不符" :value="2"></el-option>
            <el-option label="质量问题" :value="3"></el-option>
            <el-option label="发货错误" :value="4"></el-option>
            <el-option label="关税问题" :value="5"></el-option>
            <el-option label="运输途中损坏" :value="6"></el-option>
            <el-option label="运输时间过长" :value="7"></el-option>
            <el-option label="客户个人原因" :value="8"></el-option>
            <el-option label="停产缺货" :value="9"></el-option>
            <el-option label="延迟发货" :value="10"></el-option>
            <el-option label="无理由" :value="11"></el-option>
            <el-option label="其他" :value="12"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="90px">
          <el-checkbox :true-label="1" :false-label="0" v-model="reason.isRetransmissionFlag">是否重新发单</el-checkbox>
        </el-form-item>
        <el-form-item label="原因:" label-width="90px">
          <el-input type="textarea" style="width:260px" v-model="reason.remark"></el-input>
        </el-form-item>
        <el-row class="saveBtn" style="margin-top:60px;">
          <el-button size="small" type="primary" @click="negativeSubmit">确认</el-button>
          <el-button size="small" type="primary" @click="negativeOptions.visible=false">取消</el-button>
        </el-row>
      </el-form>
    </yt-dialog>
    <yt-dialog :options="connectOtions">
      <connect-buyer :key="indexKey" :saveFlag="false" :emailType="2" @sendFlag="connectOtions.visible=false"></connect-buyer>
    </yt-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { downloadFile } from 'Utils/tools.js'
import ConnectBuyer from '../Email/comment/Write'
export default {
  provide: {
    platformId: 1
  },
  data() {
    return {
      reason: {
        remark: '',
        feedbackReasonId: '',
        isRetransmissionFlag: 0
      },
      orderData: [],
      negativeOptions: {
        visible: false,
        title: '差评原因',
        width: '400px'
      },
      connectOtions: {
        visible: false,
        title: '联系买家',
        width: '1330px'
      },
      copyText: undefined,
      handleState: '',
      total: 10,
      pageSize: 10,
      pageNumber: 1,
      tableColumns: [
        {
          value: 'imgPath',
          label: '产品图片',
          img: true,
          style: {
            width: 36,
            height: 36
          },
          bulkyHeight: 36,
          width: '70px'
        },
        {
          label: '支付日期',
          value: 'paymentTime',
          width: '140'
        },
        {
          label: '发货日期',
          value: 'deliveryTime',
          width: '140'
        },
        {
          label: '评价时间',
          value: 'evaluateTime',
          width: '140'
        },
        {
          label: '同步时间',
          value: 'createTime',
          width: '140'
        },
        {
          label: '当前评价',
          value: 'evaluateLevel',
          render(h, scope) {
            let num = Number(scope.row.evaluateLevel)
            return <el-rate value={num} disabled />
          },
          width: '120'
        },
        {
          label: '买家评论',
          value: 'evaluateContent'
        },
        {
          label: '负责客服',
          value: 'serviceName',
          width: '70'
        },
        {
          label: '订单号',
          value: 'orderNumber',
          width: '150'
        },
        {
          label: '来源店铺',
          value: 'storeName',
          width: '140'
        },
        {
          label: '处理状态',
          value: 'handleStateName',
          width: '70'
        }
      ],
      tableData: [],
      searchList: [
        {
          value: 'sourceChannels',
          type: 'multiple',
          placeholder: '来源渠道(多选)',
          size: 'small',
          style: {
            width: '180px'
          },
          children: []
        },
        {
          value: 'salesType',
          type: 'select',
          placeholder: '销售类型',
          size: 'small',
          style: {
            width: '180px'
          },
          children: [
            {
              label: '跟卖',
              value: 1
            },
            {
              label: '自主上架',
              value: 2
            },
            {
              label: 'asin上架',
              value: 3
            }
          ]
        },
        {
          value: 'salesmanId',
          type: 'select',
          placeholder: '销售人员',
          size: 'small',
          style: {
            width: '180px'
          },
          children: []
        },
        {
          value: 'serviceId',
          type: 'select',
          placeholder: '客服人员',
          size: 'small',
          style: {
            width: '180px'
          },
          children: []
        },
        {
          value: 'evaluateLevel',
          type: 'select',
          placeholder: '差评',
          size: 'small',
          style: {
            width: '180px'
          },
          children: [
            {
              label: '差评',
              value: 1
            },
            {
              label: '中评',
              value: 2
            },
            {
              label: '好评',
              value: 3
            }
          ]
        },
        {
          value: 'handleState',
          type: 'select',
          placeholder: '处理状态',
          size: 'small',
          style: {
            width: '180px'
          },
          children: [
            {
              label: '未处理',
              value: 1
            },
            {
              label: '待处理',
              value: 2
            },
            {
              label: '处理完成',
              value: 3
            },
            {
              label: '已过期',
              value: 4
            }
          ]
        },
        {
          value: 'orderAssociationFlag',
          type: 'select',
          placeholder: '是否关联到订单',
          size: 'small',
          style: {
            width: '180px'
          },
          children: [
            {
              label: '否',
              value: 0
            },
            {
              label: '是',
              value: 1
            }
          ]
        },
        {
          value: 'selectType',
          type: 'select',
          placeholder: 'ASIN',
          size: 'small',
          style: {
            width: '180px'
          },
          children: [
            {
              label: 'ASIN',
              value: 'asin'
            },
            {
              label: 'SKU',
              value: 'sku'
            }
          ]
        },
        {
          value: 'searchValue',
          type: 'input',
          size: 'small',
          style: {
            width: '150px'
          }
        },
        {
          value: 'timeType',
          type: 'select',
          placeholder: '同步时间',
          size: 'small',
          style: {
            width: '180px'
          },
          children: [
            {
              label: '同步时间',
              value: 'createTime'
            },
            {
              label: '评价时间',
              value: 'evaluateTime'
            }
          ]
        },
        {
          value: 'time',
          type: 'time',
          size: 'small'
        }
      ],
      options: {
        visible: false,
        title: '批量处理',
        width: '360px'
      },
      orderNumOptions: {
        visible: false,
        title: '批量提取订单号',
        width: '600px'
      },
      searchData: {},
      serviceAmazonFeedbackIds: [],
      selectData: [],
      indexKey: null,
      feedbackReasonId: null,
      serviceAmazonFeedbackId: null
    }
  },
  created() {
    this.getPlatformStoreList()
    this.getSalemanList()
    this.getservice()
    this.getList()
  },
  computed: {
    ...mapState('order', ['salemanList']),
    ...mapState('email', ['serviceList']),
    ...mapState('product', ['platformStoreList'])
  },
  watch: {
    platformStoreList(val) {
      this.searchList[0].children = val
    },
    salemanList(val) {
      this.searchList[2].children = val
    },
    serviceList(val) {
      this.searchList[3].children = val
    }
  },
  methods: {
    ...mapActions('product', ['getPlatformStoreList']),
    ...mapActions('email', ['getservice']),
    ...mapActions('order', ['getSalemanList']),
    handleSearch(data) {
      this.searchData = data
      this.getList('search')
    },
    handleDeal() {},
    handleConncat(index, row) {
      this.storeId = row.storeId
      this.indexKey = Math.random()
      this.serviceAmazonFeedbackId = Number(row.serviceAmazonFeedbackId)
      this.connectOtions.visible = true
    },
    async handleReason(index, row) {
      let vm = this
      vm.reason = { remark: '', feedbackReasonId: '', isRetransmissionFlag: 0 }
      vm.reason.serviceAmazonFeedbackId = row.serviceAmazonFeedbackId || ''
      vm.reason.remark = row.remark || ''
      vm.reason.isRetransmissionFlag = Number(row.isRetransmissionFlag) || 0
      vm.reason.feedbackReasonId = Number(row.feedbackReasonId) || ''

      await vm.$api['email/feedbackGetReason']().then(data => {
        console.log(data)
      })
      vm.negativeOptions.visible = true
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getList('search', true)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList('search')
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    handleBatch(index, row) {
      let vm = this
      if (row) {
        vm.serviceAmazonFeedbackIds = [row.serviceAmazonFeedbackId]
      } else {
        vm.serviceAmazonFeedbackIds = vm.selectData.map(
          item => item.serviceAmazonFeedbackId
        )
      }
      if (!vm.serviceAmazonFeedbackIds.length) {
        this.$message.error('请选择操作数据')
        return
      }
      this.options.visible = true
    },
    handleGetOrder() {
      let vm = this
      let serviceAmazonFeedbackIds = vm.selectData.map(
        item => item.serviceAmazonFeedbackId
      )
      if (!serviceAmazonFeedbackIds.length) {
        vm.$message({
          type: 'error',
          message: '请选择需要操作的数据'
        })
        return
      }
      vm.orderNumOptions.visible = true
      let params = {
        serviceAmazonFeedbackIds
      }
      vm.$api['email/feedbackBatchExtract'](params)
        .then(data => {
          if (!data && !data.rows) {
            return
          }
          vm.orderData = data.rows.map(item => {
            return {
              orderNumPlatform: item
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleConditionOut() {
      let vm = this
      let params = JSON.parse(JSON.stringify(vm.$refs.search.search()))

      if (params.selectType) {
        params[params.selectType] = params.searchValue
      }
      delete params.selectType
      delete params.searchValue
      if (params.timeType == 'createTime') {
        if (params.time && params.time.length) {
          params.createTimeStart = params.time[0]
          params.createTimeEnd = params.time[1]
        }
      }
      if (params.timeType == 'evaluateTime') {
        if (params.time && params.time.length) {
          params.evaluateTimeStart = params.time[0]
          params.evaluateTimeEnd = params.time[1]
        }
      }
      if (!params.sourceChannels.length) {
        delete params.sourceChannels
      }
      delete params.timeType
      delete params.time
      console.log(params)
      vm.$api['email/feedbackExport'](params)
        .then(data => {
          let { path } = data
          downloadFile(path)
        })
        .catch(err => {
          console.log(err)
        })
    },
    signCancel() {
      this.options.visible = false
    },
    signSubmit() {
      let vm = this
      let params = {
        serviceAmazonFeedbackIds: vm.serviceAmazonFeedbackIds,
        handleState: vm.handleState
      }
      vm.$api['email/feedbackSetHandle'](params)
        .then(data => {
          console.log(data)
          vm.options.visible = false
          vm.getList('search')
        })
        .catch(err => {
          console.log(err)
        })
    },
    negativeSubmit() {
      let vm = this
      vm.negativeOptions.visible = false
      vm.$api['email/feedbackSetReason'](vm.reason)
        .then(data => {
          console.log(data)
          vm.getList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getList(type, sizeChange) {
      if (type && !sizeChange) {
        this.pageNumber = 1
      }
      let params = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        sortOrder: 'asc'
      }
      if (type) {
        let searchData = JSON.parse(JSON.stringify(this.searchData))
        if (searchData.selectType) {
          searchData[searchData.selectType] = searchData.searchValue
        }
        delete searchData.selectType
        delete searchData.searchValue
        if (searchData.timeType == 'createTime') {
          if (searchData.time && searchData.time.length) {
            searchData.createTimeStart = searchData.time[0]
            searchData.createTimeEnd = searchData.time[1]
          }
        }
        if (searchData.timeType == 'evaluateTime') {
          if (searchData.time && searchData.time.length) {
            searchData.evaluateTimeStart = searchData.time[0]
            searchData.evaluateTimeEnd = searchData.time[1]
          }
        }
        delete searchData.timeType
        delete searchData.time
        params = Object.assign({}, params, searchData)
      }
      this.$api['email/feedbackList'](params)
        .then(data => {
          let { rows } = data
          this.total = data.total
          this.tableData = rows
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  components: {
    ConnectBuyer
  }
}
</script>

<style lang="scss">
.feedback-manage {
  .negative {
    .el-form-item {
      margin-bottom: 5px;
    }
  }
  .el-rate__icon {
    margin-right: 0;
    font-size: 16px;
    margin-top: 16px;
  }
  .dialog-wrap {
    border-top: 1px solid #bbb;
    .saveBtn {
      button {
        width: 120px;
      }
    }
  }
  .table {
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
}
</style>
