<template>
  <section class="replenishment">
    <IRLayout>
      <!-- header -->
      <template slot="header">
        <div class="title" @click="back">
          <i class="el-icon-arrow-left"></i> 生产明细
        </div>
        <div class="header-btn">
          <el-button type="primary" size="small" @click="allDownload" :loading="sendLoading">批量下载收货信息</el-button>
          <!-- <el-button type="primary" size="small" @click="allReceive" :loading="deliveryLoading">批量下载分批收货信息</el-button> -->
        </div>
      </template>
      <!-- selsect -->
      <template slot="select">
        <ul>
          <li>运输方式：
            <el-select size="small" v-model="selectInfo.transportType" clearable>
              <el-option v-for="item in transportType" :label="item.label" :value="item.value"/>
            </el-select>
          </li>
          <li>状态：
            <el-select size="small" v-model="selectInfo.deliveryStatus" clearable>
              <el-option v-for="item in deliveryStatusObj" :label="item.label" :value="item.value"/>
            </el-select>
          </li>
          <li>批次号：
            <el-input size="small" v-model="selectInfo.batchNumber"/>
          </li>
          <li>时间：
            <el-date-picker
              v-model="selectInfo.startTime"
              value-format="yyyy-MM-dd"
              type="datetime"
              size="small"
              placeholder="开始时间"
            ></el-date-picker>~
            <el-date-picker
              v-model="selectInfo.endTime"
              value-format="yyyy-MM-dd"
              size="small"
              type="datetime"
              placeholder="结束时间"
            ></el-date-picker>
          </li>
          <li>
            <el-button type="primary" size="small" icon="el-icon-search" @click="select()">搜 索</el-button>
          </li>
        </ul>
      </template>
      <!-- table -->
      <template slot="table" border>
        <el-table
          class="custom-tb"
          :data="batchList"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="loading"
          element-loading-text="拼命加载中"
          @selection-change="onUserSelectList"
        >
          <el-table-column type="selection" width="55" align="center" :selectable="isSlectable"/>
          <el-table-column prop="batchNumber" label="批次号" align="center" min-width="150px" :formatter="_formatter">
            <template slot-scope="scope">
              <div class="flex">
                <div :class="{'flex-sub' : scope.row.replenishPdId == null}">{{scope.row.batchNumber}}</div>
                <div v-if="scope.row.deliveryBatchNumberCount" style="margin-left:6px">
                  <el-tooltip content="查看批次" placement="top" :open-delay="500">
                    <el-badge type="primary" :value="scope.row.deliveryBatchNumberCount" class="item">
                      <el-button
                        :disabled="loading"
                        style="padding:0;margin-right:6px"
                        type="text"
                        :icon="scope.row._open ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
                        @click="handleView(scope)"
                      ></el-button>
                    </el-badge>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="transportTypeName" label="运输方式" align="center" width="100" :formatter="_formatter"/>
          <el-table-column prop="createTime" label="确认时间" min-width="130px" align="center" :formatter="_formatter"/>
          <el-table-column
            prop="startProduceTime"
            label="生产开始日期"
            min-width="130px"
            align="center"
            :formatter="_formatterData"
          />
          <el-table-column
            prop="endProduceTime"
            label="生产结束日期"
            min-width="130px"
            align="center"
            :formatter="_formatterData"
          />
          <el-table-column
            prop="deliveryTime"
            label="交货日期"
            min-width="130px"
            align="center"
            :formatter="_formatterData"
          />
          <el-table-column prop="produceCount" label="生产数量" align="center" :formatter="_formatter"/>
          <el-table-column prop="deliveryCount" label="交货数量" align="center" :formatter="_formatter"/>
          <el-table-column prop="userName" label="操作人员" align="center" :formatter="_formatter"/>
          <el-table-column prop="deliveryStatusString" label="交货状态" align="center" :formatter="_formatter">
            <template slot-scope="scope">
              <div
                :style="{color: scope.row.deliveryStatusString === '未交货' ? 'red': scope.row.deliveryStatusString === '已交货' ? 'green' : null}"
              >{{scope.row.deliveryStatusString}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="download(scope)">下载</el-button>

              <el-button
                v-if="scope.row.deliveryStatus!==3 && scope.row.deliveryStatus!==-1 && scope.row.replenishPdId != null"
                type="text"
                @click="produceComplete(scope.row.replenishPdId)"
              >取消收货</el-button>
              <el-button
                type="text"
                v-if="scope.row.deliveryStatus!==3 && scope.row.deliveryStatus!==-1 && scope.row.replenishPdId != null"
                @click="produceComplete(scope.row.replenishPdId, true)"
              >收货完成</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!--  -->
      <template slot="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 35,50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </template>
    </IRLayout>
  </section>
</template>

<script>
import {
  fetchData,
  showToast,
  handlerCode,
  downloadFile
} from '@/common/common'
import apis from '@/apis'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      isSlectable(row, index) {
        if (row.replenishPdDeliveryId != null) {
          return false
        } else {
          return true
        }
      },
      sendLoading: false,
      deliveryLoading: false,
      loading: true,
      batchList: [],
      userSelectList: [],
      setVisible: false,
      form: {},
      lists: [],

      currentPage: 1,
      pageSize: 10,
      total: null,
      deliveryStatusObj: [
        { label: '未交货', value: 1 },
        { label: '部分交货', value: 2 },
        { label: '已交货', value: 3 },
        { label: '取消', value: -1 }
      ],

      selectInfo: {
        batchNumber: '',
        deliveryStatus: null,
        transportType: null,
        startTime: '',
        endTime: ''
      }
    }
  },
  computed: mapState(['transportType']),
  created() {
    this.getTransportType()
    this.getAllTransport()
  },
  methods: {
    ...mapActions(['getTransportType']),

    // 获取所有发货方式
    getAllTransport() {
      fetchData({
        ...apis.REPLENISHDETAILED_GETALLTRANSPORT_ALL,
        data: {}
      }).then(res => {
        console.log(res)
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        }
        let list = []

        // this.transportType.forEach(el => {
        //   let i = res.data.list.find(i => i.transportFirstId === el.value)
        //   console.log(i)
        //   if (i) {
        //     list.push({ ...el, value: i.id })
        //   }
        // })

        this.lists = res.data.list.map(el => ({
          ...el,
          label: `${el.freightType || '-'} 【保底可售天数：${
            el.insuredDays
          }】【备货所需天数：${el.stockDays}】【运输天数：${
            el.transportDays
          }】`,
          value: el.id
        }))
      })
    },

    back() {
      this.$router.push('/')
    },

    handleView(scope) {
      let { $index } = scope
      let { batchNumber, _open } = scope.row
      if (!_open) {
        // 如果没有打开状态
        this.loading = true
        fetchData({
          ...apis.REPLENISH_PD_DELIVERY_LIST,
          data: { batchNumber }
        }).then(res => {
          this.loading = false
          let { code, msg, list } = res.data
          if (code !== 0) {
            showToast('error', msg)
            return
          }
          this.batchList.splice($index + 1, 0, ...list)
          scope.row._len = list.length
          scope.row._open = true
        })
      } else {
        this.batchList.splice($index + 1, scope.row._len)
        scope.row._open = false
      }
    },
    //搜索
    select() {
      let params = Object.assign(
        {},
        {
          pageNumber: 1,
          pageSize: 10
        },
        this.selectInfo
      )

      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const element = params[key]
          if (element == null || element === '') {
            delete params[key]
          }
        }
      }

      this.getTableList(params)
    },
    //取消
    cancel(id) {
      this.$confirm('是否确定取消生产?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const arr = Array.of(id)
        this.sendCancel(arr)
      })
    },
    handleReceive(batchNumber) {
      this.$confirm('是否确定签收?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.receives([batchNumber])
      })
    },

    // 下载分批收货信息
    allReceive() {
      const arr = this.userSelectList.map(item => item.replenishPdDeliveryId)
      if (arr.length) {
        this.sendDownload(arr, 'deliver')
      } else {
        this.$message({
          message: '请先勾选您要签收的批次',
          type: 'warning',
          center: true
        })
      }
    },

    produceComplete(replenishPdId, isDone) {
      this.$confirm(isDone ? '是否完成收货?' : '是否取消收货?', '警告', {
        type: 'warning'
      })
        .then(() => {
          fetchData({
            ...apis.REPLENISH_PD_COMPLETED,
            data: {
              replenishPdId,
              deliveryStatus: isDone ? 3 : -1
            }
          }).then(res => {
            if (res.data.code == 0) {
              showToast('success', res.data.msg)
              this.getCurrentTableList()
            } else {
              showToast('error', res.data.msg)
            }
          })
        })
        .catch(() => {})
    },

    sendCancel(arr) {
      fetchData({
        ...apis.REPLENISH_PD_COMPLETED,
        data: {
          replenishPdIds: arr
        }
      }).then(res => {
        if (res.data.code == 0) {
          showToast('success', res.data.msg)
          this.getCurrentTableList()
        } else {
          showToast('error', res.data.msg)
        }
      })
    },

    saveTransport() {
      const { batchNumber, confirmTime, fastestArrival } = this.form
      fetchData({
        ...apis.REPLENISHPRODUCT_SETTRANSPORT,
        data: {
          formulaId: batchNumber,
          batchNumber: this.currentFormulaId,
          confirmTime: confirmTime + ' 00:00:00',
          fastestArrival: fastestArrival + ' 00:00:00'
        }
      }).then(res => {
        handlerCode(res, () => {
          this.setVisible = false
          this.handleSizeChange(10)
        })
      })
    },

    //批量取消生产
    allCancel() {
      if (this.userSelectList.length) {
        this.$confirm('是否确定取消?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const arr = this.userSelectList.map(item => item.replenishPdId)
          this.sendCancel(arr)
        })
      } else {
        this.$message({
          message: '请先勾选您要取消的批次',
          type: 'warning',
          center: true
        })
      }
    },
    //下载
    download(scope) {
      let type, id
      if (scope.row.replenishPdId != null) {
        id = scope.row.replenishPdId
      } else {
        type = 'deliver'
        id = scope.row.replenishPdDeliveryId
      }
      this.sendDownload(Array.of(id), type)
    },
    // 设置运输方式
    set(row) {
      this.setVisible = true
      this.form = {}
      this.currentFormulaId = row.batchNumber
    },
    sendDownload(arr, type = 'pd') {
      let api =
        type === 'pd'
          ? apis.REPLENISH_PD_DOWLOAD_PRODUCE_INFOS
          : apis.REPLENISH_PD_DELIVERY_DOWNLOAD_BATCH
      let data = {}
      if (type === 'pd') {
        data = {
          replenishPdIds: arr
        }
      } else {
        data = {
          replenishPdDeliveryIds: arr
        }
      }

      this.sendLoading = true
      fetchData({
        ...api,
        data
      }).then(res => {
        this.sendLoading = false
        if (res.data.code == 0) {
          console.log(res)
          const url = res.data.path
          window.location.href = url
        } else {
          showToast('error', res.data.msg)
        }
      })
    },
    //批量下载生产收货信息
    allDownload() {
      let arr = this.userSelectList.map(item => item.replenishPdId)
      if (arr.length) {
        this.sendDownload(arr)
      } else {
        this.$message({
          message: '请先勾选您要下载的批次',
          type: 'warning',
          center: true
        })
      }
    },
    //选中的列表数据
    onUserSelectList(val) {
      this.userSelectList = val
      console.log(this.userSelectList)
    },
    //分页
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      const params = {
        pageNumber: 1,
        pageSize: val
      }
      this.getTableList(params)
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      const params = {
        pageNumber: val,
        pageSize: this.pageSize
      }
      this.getTableList(params)
    },
    getCurrentTableList() {
      return this.getTableList({
        ...this.selectInfo,
        pageSize: this.pageSize,
        pageNumber: this.currentPage
      })
    },
    //获取列表数据
    getTableList(data = { pageNumber: '1', pageSize: 10 }) {
      let params = {}
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key]
          if (element != null && element !== '') {
            params[key] = element
          }
        }
      }
      fetchData({
        ...apis.REPLENISH_PD_LIST,
        data: params
      }).then(res => {
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        }
        let { rows, pageSize, pageNo, total } = res.data.page
        this.batchList = rows
        this.loading = false

        this.currentPage = pageNo
        this.pageSize = pageSize
        this.total = total
      })
    }
  },
  mounted() {
    this.getTableList()
  }
}
</script>

<style lang="scss" scoped>
.header-btn {
  margin-right: 20px;
}
.select {
  ul {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    li {
      margin-right: 30px;
      .el-input,
      .el-select {
        width: 136px;
      }
    }
  }
}
.flex {
  display: flex;
  .flex-sub {
    // margin-left: 20px;
    text-indent: 20px;
  }
}
</style>
<style lang="scss">
.custom-tb {
  .cell {
    overflow: initial;
  }
}
</style>
