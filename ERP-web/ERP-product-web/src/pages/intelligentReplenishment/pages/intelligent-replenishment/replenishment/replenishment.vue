<template lang="html">
    <section class="replenishment">
        <IRLayout>
             <!-- header -->
             <template slot="header">
                <div class="title" @click="back"> <i class="el-icon-arrow-left"></i> 补货明细</div>
                <div class="header-btn">
                    <el-button type="primary" size="small" @click="allDownload">批量下载</el-button>
                    <el-button type="primary" size="small" @click="allCancel">批量取消补货</el-button>
                    <el-button type="primary" size="small" @click="allReceive">批量签收</el-button>
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
      <el-select size="small" v-model="selectInfo.detailedStatus" clearable>
        <el-option v-for="item in detailedStatusObj" :label="item.label" :value="item.value"/>
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
    :data="batchList"
    tooltip-effect="dark"
    style="width: 100%"
    v-loading="loading"
    element-loading-text="拼命加载中"
    @selection-change="onUserSelectList"
  >
    <el-table-column type="selection" width="55" align="center"/>
    <el-table-column prop="batchNumber" label="批次号" align="center" :formatter="_formatter"/>
    <el-table-column prop="storeName" label="店铺" align="center" :formatter="_formatter"/>
    <el-table-column prop="transportTypeName" label="运输方式" align="center" width="100" :formatter="_formatter"/>
    <el-table-column prop="createTime" label="确认时间" align="center" :formatter="_formatter"/>

    <!-- <el-table-column prop="stockingDays" label="备货时间" align="center" :formatter="_formatter" /> -->
    <el-table-column label="备货时间" width="120" align="center">
      <template slot-scope="scope">{{ scope.row.stockingDays | _formatData }}天</template>
    </el-table-column>
    <el-table-column prop="userName" label="操作人员" align="center" width="80" :formatter="_formatter"/>
    <el-table-column label="状态" width="120" align="center">
      <template slot-scope="scope">
        <span
          v-if="scope.row.detailedTypeString === '未处理'"
          style="color: #f56c6c"
        >{{ scope.row.detailedTypeString | _formatData }}</span>
        <span v-else style="color: #56bb25">{{ scope.row.detailedTypeString | _formatData }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="shippingStatusString" label="发货状态" align="center" :formatter="_formatter"/>
    <el-table-column label="操作" width="220" align="center">
      <template slot-scope="scope">
        <el-button type="text" @click="download(scope.row.replenishDetailedId)">下载</el-button>
        <el-button type="text" v-if="scope.row.transportType === -1" @click="set(scope.row)">设置运输方式</el-button>
        <el-button
          v-if="scope.row.detailedStatus==2 && scope.row.shippingStatus !== 4"
          type="text"
          @click="cancel(scope.row.replenishDetailedId)"
        >取消补货</el-button>
        <el-button
          type="text"
          v-if="scope.row.detailedStatus !== -1 && scope.row.shippingStatus !== 4"
          @click="handleReceive(scope.row.batchNumber)"
        >签收完成</el-button>
        <el-button type="text" @click="receiveDownload(scope.row.replenishDetailedId)">签收情况下载</el-button>
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
        <el-dialog
      width="50%"
      title="设置运输方式"
      :visible.sync="setVisible"
      append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="选择运输方式">
          <el-select v-model="form.batchNumber" placeholder="请选择运输方式" clearable style="width:100%">
            <el-option v-for="item in lists" :label="item.label" :value="item.value">
              <span style="width:140px;display:inline-block">{{item.freightType}}</span>
              <span style="width:140px;display:inline-block">【保底可售天数：{{item.insuredDays}}】</span>
              <span style="width:140px;display:inline-block">【备货所需天数：{{item.stockDays}}】</span>
              <span style="width:140px;display:inline-block">【运输天数：{{item.transportDays}}】</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货时间">
          <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="form.confirmTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="最快到货时间">
          <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="form.fastestArrival" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveTransport">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
      loading: true,
      batchList: [],
      userSelectList: [],
      setVisible: false,
      form: {},
      lists: [],

      currentPage: 1,
      pageSize: 10,
      total: null,
      detailedStatusObj: [
        { label: '未处理', value: 1 },
        { label: '已处理', value: 2 },
        { label: '已取消', value: -1 }
      ],

      selectInfo: {
        batchNumber: '',
        detailedStatus: null,
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
    //搜索
    select() {
      const params = Object.assign(
        {},
        {
          pageNumber: 1,
          pageSize: 10
        },
        this.selectInfo
      )

      this.getTableList(params)
    },
    //取消
    cancel(id) {
      this.$confirm('是否确定取消补货?', '提示', {
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
    allReceive() {
      if (this.userSelectList.length) {
        this.$confirm('是否确定签收?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const arr = this.userSelectList.map(item => item.batchNumber)
          this.receives(arr)
        })
      } else {
        this.$message({
          message: '请先勾选您要签收的批次',
          type: 'warning',
          center: true
        })
      }
    },

    receiveDownload(replenishDetailedId) {
      fetchData({
        ...apis.REPLENISH_DETAILED_DOWNLOAD_FBA_RECEIVING,
        data: {
          replenishDetailedId
        }
      }).then(res => {
        if (res.data.code == 0) {
          // res.data.path && downloadFile(res.data.path)
          // showToast('success', res.data.msg)
          window.location.href = res.data.path
        } else {
          showToast('error', res.data.msg)
        }
      })
    },

    receives(batchNumbers) {
      fetchData({
        ...apis.REPLENISH_DETAILED_SET_SHIPPING_STATUS,
        data: {
          batchNumbers
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
    sendCancel(arr) {
      fetchData({
        ...apis.REPLENISHDETAILED_CANCELREPLENISHMENT,
        data: {
          replenishDetailedIds: arr
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

    //批量取消补货
    allCancel() {
      if (this.userSelectList.length) {
        this.$confirm('是否确定取消?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const arr = this.userSelectList.map(item => item.replenishDetailedId)
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
    download(id) {
      this.sendDownload(Array.of(id))
    },
    // 设置运输方式
    set(row) {
      this.setVisible = true
      this.form = {}
      this.currentFormulaId = row.batchNumber
    },
    sendDownload(arr) {
      fetchData({
        ...apis.REPLENISHDETAILED_DOWNLOAD,
        data: {
          replenishDetailedIds: arr
        }
      }).then(res => {
        if (res.data.code == 0) {
          console.log(res)
          const url = res.data.path
          window.location.href = url
        } else {
          showToast('error', res.data.msg)
        }
      })
    },
    //批量下载
    allDownload() {
      if (this.userSelectList.length) {
        let arr = this.userSelectList.map(item => item.replenishDetailedId)
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
        ...apis.REPLENISHMENT_LIST,
        data: params
      }).then(res => {
        if (res.data.code == 500) {
          showToast('error', res.data.msg)
          return
        }
        this.batchList = res.data.rows
        this.loading = false

        this.currentPage = res.data.pageNo
        this.pageSize = res.data.pageSize
        this.total = res.data.total
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
</style>
