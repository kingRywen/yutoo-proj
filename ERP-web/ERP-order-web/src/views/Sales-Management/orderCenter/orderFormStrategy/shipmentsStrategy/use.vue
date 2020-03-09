<template>
  <universal-layout
    @handleSizeChange="handleSizeChange"
    @handleCurrentChange="handleCurrentChange"
    :btnList="btnList"
    @clickBtn="clickBtn"
    :pageNo="page.pageNumber"
    :pageSize="page.pageSize"
    :total="page.total"
  >
    <template slot="search">
      <search :searchList="searchList" @search="handleSearch" ref="search"></search>
    </template>
    <template slot="table">
      <yt-table :data="tableList" :columns="columns" :border="true">
        <!-- <el-table-column label="操作" align="center" slot="right">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click="copy(scope.row)">复制添加</el-button>
            <el-button type="text" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>-->
      </yt-table>
    </template>
  </universal-layout>
</template>

<script>
/* eslint-disable */
import storage from 'Utils/saver'
export default {
  created() {
    this.getData()
    this.getDeliveryGetStrategyList()
  },
  data() {
    let vm = this
    return {
      page: {
        total: 0,
        pageSize: 10,
        pageNumber: 1
      },
      searchParams: {},
      params: {
        pageSize: 10,
        sortOrder: 'asc',
        pageNumber: 1
      },
      searchList: [
        {
          label: '订单操作策略',
          value: 'orderStrategyDeliveryId',
          type: 'select',
          style: {
            width: '100px'
          },
          children: [{ label: '加载中', value: 0 }]
        },
        {
          label: '操作时间',
          value: 'time',
          type: 'time'
        },
        {
          label: '系统订单号',
          value: 'orderNumber',
          type: 'input'
        },
        {
          label: '平台订单号',
          value: 'platformNumber',
          type: 'input'
        }
      ],
      btnList: [
        {
          name: '查看订单发货列表',
          value: '1',
          fn() {
            storage.set('session', 'strategyTabName', 'fifth')
            vm.$router.push({ name: 'orderFormStrategy' })
          }
        }
      ],
      tableList: [],
      columns: [
        {
          value: 'strategyName',
          label: '订单号',
          render(h, scope) {
            let {
              orderNumSystem,
              country,
              orderId,
              deliveryStatus,
              platformId,
              orderType
            } = scope.row
            if (orderType == 3 || orderType == 4 || orderType == 5) {
              orderType = 3
            }
            return (
              <div>
                <p>
                  <el-button
                    type="text"
                    onClick={() => {
                      vm.$router.push({
                        path:
                          '/salesManagement/associatedSettings/allOrderLists/lookOver',
                        query: {
                          deliveryStatus,
                          orderServiceId: orderId,
                          platformId,
                          orderType
                        }
                      })
                    }}
                  >
                    {orderNumSystem}
                  </el-button>
                </p>
                <p>{country}</p>
              </div>
            )
          }
        },
        {
          value: 'orderWeight',
          label: '订单产品总重量'
        },
        {
          value: 'orderAmount',
          label: '订单金额'
        },
        {
          value: 'transportPlan',
          label: '运输计划'
        },
        {
          value: 'beforeTransportType',
          label: '之前运输方式',
          render(h, scope) {
            let { beforeTransportType, beforeFreight } = scope.row
            return (
              <div>
                <p>{beforeTransportType}</p>
                <p>{beforeFreight}</p>
              </div>
            )
          }
        },
        {
          value: 'convertTransportType',
          label: '转换运输方式',
          render(h, scope) {
            let { convertFreight, convertTransportType } = scope.row
            // convertTransportType = ['1', '2']
            // convertFreight = ['g', 'h']
            return (
              <div>
                {convertTransportType.length
                  ? convertTransportType.map((type, index) => (
                      <div>
                        <p>
                          {type} ( {convertFreight[index] || '-'} )
                        </p>
                      </div>
                    ))
                  : '-'}
              </div>
            )
          }
        },
        {
          value: 'convertWarehouse',
          label: '转换仓库',
          render(h, scope) {
            let { convertWarehouse } = scope.row
            return (
              <div>
                {convertWarehouse.length
                  ? convertWarehouse.map(el => <p>{el}</p>)
                  : '-'}
              </div>
            )
          }
        },
        {
          value: 'convertTime',
          label: '转换时间'
        },
        {
          value: 'economizeFreight',
          label: '运费省了'
        }
      ]
    }
  },
  methods: {
    getData(params = {}) {
      params = this.$.dealObjectValue({
        ...this.params,
        ...this.searchParams,
        ...params
      })
      this.$api['order/strategyDeliveryUseStrategy']({ ...params })
        .then(data => {
          this.tableList = data.rows
          this.page.total = data.total
          this.page.pageNumber = data.pageNo
          this.page.pageSize = data.pageSize
        })
        .catch(err => {})
    },

    getDeliveryGetStrategyList() {
      let vm = this
      this.$api['order/strategyDeliveryGetStrategyName']({})
        .then(data => {
          let list = JSON.parse(JSON.stringify(vm.searchList[0]))
          list.children = data.rows.map(el => ({
            label: el.strategyName,
            value: el.orderStrategyDeliveryId
          }))
          vm.searchList.splice(0, 1, list)
          // this.searchList[0] = list
        })
        .catch(err => {})
    },
    handleSearch(val) {
      let { time = [], ...params } = val
      let [startTime, endTime] = time || []
      this.searchParams = { startTime, endTime, ...params }
      this.getData()
    },
    handleCurrentChange(val) {
      this.getData({ pageNumber: val })
    },
    handleSizeChange(val) {
      this.getData({ pageSize: val })
    },
    clickBtn() {}
  }
}
</script>

<style>
</style>
