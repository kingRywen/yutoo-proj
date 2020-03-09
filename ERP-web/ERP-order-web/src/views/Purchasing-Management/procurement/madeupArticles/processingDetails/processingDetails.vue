<template>
  <!-- 加工明细列表 -->
  <div>
    <universal-layout
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :btnList="btnList"
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
    >
      <template slot="search">
        <el-form :inline="true" :model="form" :rules="rules" ref="form" size="small">
          <el-form-item>
            <el-select v-model="form.machiningId" placeholder="加工人员" clearable>
              <el-option
                :label="item.nickName"
                :value="item.userId"
                v-for="item in allHandleUser.procurement"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.warehousingState" placeholder="入库情况" clearable>
              <el-option label="已入库" value="1"></el-option>
              <el-option label="未入库" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="加工时间" prop="time">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="form.time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入成品SKU" v-model.trim="form.productSku" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" icon="el-icon-search" size="small">搜 索</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot="btnRight">
        <!-- <el-button type="info" size="small" slot="right">自定义列表</el-button> -->
      </template>
      <template slot="table">
        <yt-table :data="tableList" :columns="columns" :border="true" reserveSelection="productId" ref="table">
          <!-- <el-table-column label="操作" width="100" align="center" slot="right">
                    <template slot-scope="scope">
                        <el-button type="text">查看订单详情</el-button>
                        <el-button type="text">打印合同</el-button>
                        <el-button type="text">查看理由</el-button>
                    </template>
          </el-table-column>-->
        </yt-table>
      </template>
    </universal-layout>
    <!--  -->
    <el-dialog :title="queryOrderFormTitle" :visible.sync="queryOrderFormVisible" width="1200px" center>
      <queryOrderForm ref="queryOrderForm"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import queryOrderForm from '../../procurementList/orderformList/components/queryOrderForm'
export default {
  data() {
    return {
      queryOrderFormTitle: '',
      queryOrderFormVisible: false,
      btnList: [
        {
          name: '当前条件导出',
          fn: () => {
            this.rules.time[0].required = true
            this.$refs.form.validate(valid => {
              if (valid) {
                let obj = {
                  machiningId: this.form.machiningId,
                  warehousingState: this.form.warehousingState,
                  productSku: this.form.productSku,
                  startTime: this.form.time[0],
                  endTime: this.form.time[1]
                }
                let params = {}
                for (let k in obj) {
                  if (obj[k]) params[k] = obj[k]
                }
                this.$api['procurement/conversionMachiningExport'](params)
                  .then(res => {
                    window.location.href = res.path
                  })
                  .catch(err => {
                    this.$message.error(err.msg)
                  })
              } else {
                return false
              }
            })
          }
        }
      ],
      tableList: [],
      columns: [
        {
          value: 'purchaseFinishedWorksheetId',
          label: 'ID'
        },
        {
          value: 'lowerSingleNumber',
          label: '采购订单号',
          render: (h, scope) => {
            return (
              <el-button
                type="text"
                onClick={this.queryOrderFormInfo.bind(
                  this,
                  scope.row.lowerSingleNumber,
                  scope.row.purchaseNumber
                )}
              >
                {scope.row.purchaseNumber}
              </el-button>
            )
          }
        },
        {
          value: 'worksheetStateName',
          label: '状态'
        },
        {
          value: 'productName',
          label: '成品信息'
        },
        {
          value: 'productImg',
          label: '产品图片',
          img: true,
          style: {
            width: 60,
            height: 60
          },
          bulkyHeight: 180
        },
        {
          value: 'productNameZh',
          label: '产品中文名'
        },
        {
          value: 'machiningQuantity',
          label: '加工数量'
        },
        {
          value: 'warehousesQuantity',
          label: '入库数量'
        },
        {
          value: 'machiningName',
          label: '加工人员'
        },
        {
          value: 'machiningTime',
          label: '加工时间'
        },
        {
          value: 'remark',
          label: '耗材备注'
        }
      ],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      form: {
        machiningId: '',
        warehousingState: '',
        time: [],
        productSku: ''
      },
      rules: {
        time: [
          {
            required: false,
            message: '请选择时间',
            trigger: 'change'
          }
        ]
      },
      searchInfo: {}
    }
  },
  methods: {
    queryOrderFormInfo(lowerSingleNumber, purchaseNumber) {
      this.queryOrderFormVisible = true
      this.queryOrderFormTitle = `订单详情 - ${purchaseNumber}`
      this.$nextTick(() => {
        this.$refs.queryOrderForm.getListData(lowerSingleNumber)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList('search')
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList('search')
    },
    //搜索
    search() {
      this.rules.time[0].required = false
      this.$refs.table.clearSelection()
      this.pageNo = 1
      this.getList('search')
    },
    //获取列表数据
    getList(val = 'table') {
      let self = this
      val === 1 ? (self.pageNo = 1) : self.pageNo
      let params = {
        sortOrder: 'asc',
        pageSize: self.pageSize,
        pageNumber: self.pageNo
      }
      if (val == 'search') {
        let data = { ...this.form }
        let obj = {}
        for (let key in data) {
          if (key == 'time') {
            if (
              data[key] != null &&
              data[key] instanceof Array &&
              data[key].length
            ) {
              obj['startTime'] = data[key][0]
              obj['endTime'] = data[key][1]
            }
            continue
          }

          if (data[key]) obj[key] = data[key]
        }
        params = Object.assign({}, params, obj)
      }
      self.$api['procurement/conversionMachiningList'](params).then(res => {
        self.tableList = res.rows
        self.pageNo = res.pageNo
        self.pageSize = res.pageSize
        self.total = res.total
      })
    },
    gethandleUserlist() {
      if (Object.keys(this.$store.state.common.handleUser).length) {
        console.log(1)
      } else {
        this.getHandleUser()
      }
    },
    ...mapActions('common', ['getSupplierList', 'getHandleUser'])
  },
  computed: {
    ...mapGetters('common', ['allHandleUser'])
  },
  mounted() {},
  components: {
    queryOrderForm
  }
}
</script>

<style lang="scss">
</style>
