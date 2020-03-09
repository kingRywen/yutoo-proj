<template>
  <div class="reviews-manage">
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
          reserveSelection="serviceAmazonReviewId"
          :columns="tableColumns"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column label="操作" width="80">
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
          <el-row class="saveBtn" style="margin-top:60px;">
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
    <yt-dialog :options="connectOtions">
      <connect-buyer
        :concat="false"
        :key="indexKey"
        :saveFlag="false"
        :emailType="2"
        :writeForm="writeForm"
        @sendFlag="connectOtions.visible=false"
      ></connect-buyer>
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
    let vm = this
    return {
      writeForm: {},
      reason: {
        remark: '',
        serviceAmazonReviewId: '',
        isRetransmissionFlag: 0
      },
      orderData: [],
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
          label: '买家ID',
          value: 'cneeMemberId',
          width: '70px'
        },
        {
          value: 'productImg',
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
          label: '店铺SKU',
          value: 'storeSku',
          width: '180px'
        },
        {
          label: 'ASIN',
          value: 'asin',
          width: '100px',
          render(h, scope) {
            let _data = scope.row.asin || '-'
            return (
              <div
                onClick={() => {
                  vm.getDetail(_data)
                }}
                style="color:#108ee9;cursor:pointer"
              >
                {_data}
              </div>
            )
          }
        },
        {
          label: '来源店铺',
          value: 'storeName'
        },
        {
          label: '平台订单号',
          value: 'orderNumber',
          width: '140px'
        },
        {
          label: '评价时间',
          value: 'evaluateTime',
          width: '140px'
        },
        {
          label: '同步时间',
          value: 'createTime',
          width: '140px'
        },
        {
          label: '评价星级',
          value: 'evaluateLevel',
          width: '120px',
          render(h, scope) {
            let num = Number(scope.row.evaluateLevel)
            return <el-rate value={num} disabled />
          }
        },
        {
          label: '评价内容',
          value: 'evaluateContent',
          width: '200'
        },
        {
          label: '销售人员',
          value: 'salesmanName',
          width: '70'
        },
        {
          label: '客服人员',
          value: 'serviceName',
          width: '70'
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
      serviceAmazonReviewIds: [],
      selectData: [],
      indexKey: null,
      serviceAmazonReviewId: null
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
    getDetail(val) {
      if (val) {
        if (!val || val == '-') {
          return
        }
      }
      let a = document.createElement('a')
      let evt = document.createEvent('MouseEvents')
      evt.initEvent('click', true, true)

      a.href = `https://www.amazon.com/dp/${val}`
      a.target = '_blank'
      a.dispatchEvent(evt)
      a = null
    },
    handleSearch(data) {
      this.searchData = data
      this.getList('search')
    },
    handleConncat(index, row) {
      this.writeForm = {}
      this.storeId = row.storeId
      this.indexKey = Math.random()
      this.serviceAmazonReviewId = Number(row.serviceAmazonReviewId)
      if (row.orderInfo) {
        this.writeForm.customerEmailBox = row.orderInfo.cneeEmail || ''
        this.writeForm.customerName = row.orderInfo.customerName || ''
      }
      this.writeForm.orderNumPlatform = row.orderNumber
      this.connectOtions.visible = true
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
        vm.serviceAmazonReviewIds = [row.serviceAmazonReviewId]
      } else {
        vm.serviceAmazonReviewIds = vm.selectData.map(
          item => item.serviceAmazonReviewId
        )
      }
      if (!vm.serviceAmazonReviewIds.length) {
        this.$message.error('请选择操作数据')
        return
      }
      this.options.visible = true
    },
    handleGetOrder() {
      let vm = this
      let serviceAmazonReviewIds = vm.selectData.map(
        item => item.serviceAmazonReviewId
      )
      if (!serviceAmazonReviewIds.length) {
        vm.$message({
          type: 'error',
          message: '请选择需要操作的数据'
        })
        return
      }
      vm.orderNumOptions.visible = true
      let params = {
        serviceAmazonReviewIds
      }
      vm.$api['email/reviewBatchExtract'](params)
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
      vm.$api['email/reviewExport'](params)
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
        serviceAmazonReviewIds: vm.serviceAmazonReviewIds,
        handleState: vm.handleState
      }
      vm.$api['email/reviewSetHandle'](params)
        .then(() => {
          vm.options.visible = false
          vm.getList('search')
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
      console.log(params)

      this.$api['email/reviewList'](params)
        .then(data => {
          let { rows } = data
          this.total = data.total
          this.tableData = rows
          this.pageSize = data.pageSize
          this.pageNumber = data.pageNo
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
.reviews-manage {
  .negative {
    .el-form-item {
      margin-bottom: 5px;
    }
  }
  .el-rate__icon {
    margin-right: 0;
    font-size: 16px;
    margin-top: 17px;
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