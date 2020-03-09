<template>
  <!-- 礼品发策略 -->
  <universal-layout
    @handleSizeChange="handleSizeChange"
    @handleCurrentChange="handleCurrentChange"
    :btnList="btnList"
    :pageNo="this.params.pageNo"
    :pageSize="this.params.pageSize"
    :total="this.params.total"
    @clickBtn="clickBtn"
  >
    <template slot="search">
      <search :searchList="searchList" @search="handleSearch" ref="search"></search>
    </template>
    <template slot="table">
      <yt-table :data="tableList" :columns="columns" :border="true">
        <el-table-column label="操作" align="center" slot="right">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click="copy(scope.row)">复制添加</el-button>
            <el-button type="text" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </yt-table>
      <yt-dialog :options="selectProOpts" :events="selectProEvents">
        <div class="flex" v-for="(time, index) in timeData" :key="index">
          <span>每日</span>
          <el-select v-model="time.time" size="mini" style="margin:0 10px">
            <el-option v-for="n in hours" :key="n" :value="n" :label="n">{{n}}</el-option>
          </el-select>
          <span>执行</span>

          <el-button icon="el-icon-plus" circle class="btn" @click="timeData.splice(index+1, 0, {time: undefined})"></el-button>
          <el-button icon="el-icon-minus" circle class="btn" v-if="index !== 0" @click="timeData.splice(index, 1)"></el-button>
        </div>
      </yt-dialog>
    </template>
  </universal-layout>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    let vm = this
    let hours = []
    for (let index = 0; index < 24; index++) {
      if (index === 23) {
        hours.push('00:00')
        hours.push('00:30')
      } else {
        hours.push(index + 1 + ':00')
        hours.push(index + 1 + ':30')
      }
    }
    return {
      timeData: [{ time: undefined }],
      // 运行时间设置
      selectProEvents: {
        close() {
          // 关闭时的回调
        },
        handleOkClick() {
          // 确认事件
          return vm.$api['order/orderStrategyTaskSave']({
            times: vm.timeData
          })
            .then(data => {
              vm.selectProOpts.visible = false
            })
            .catch(err => {})
        }
      },
      hours: hours,
      selectProOpts: {
        visible: false,
        title: '运行时间设置',
        width: '400px',
        okBtnText: '确认',
        appendToBody: true
      },

      searchParams: {},
      params: {
        pageSize: 10,
        total: null,
        sortOrder: 'asc',
        pageNumber: 1
      },
      searchList: [
        {
          placeholder: '计划名称',
          value: 'strategyName',
          type: 'input'
        },
        {
          label: '激活状态',
          value: 'state',
          type: 'select',
          style: {
            width: '100px'
          },
          children: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        },
        {
          label: '添加时间',
          value: 'time',
          type: 'time'
        }
      ],
      btnList: [
        {
          name: '添 加',
          value: '1',
          fn() {
            vm.$router.push({ name: 'shipmentsStrategyAdd' })
          }
        },
        {
          name: '查看应用策略订单',
          value: '1',
          fn() {
            vm.$router.push({ name: 'useStrategy' })
          }
        },
        {
          name: '发货策略运行时间设置',
          value: '1',
          fn() {
            vm.selectProOpts.visible = true
            vm.$api['order/orderStrategyTaskList']()
              .then(data => {
                if (data.rows.length) {
                  vm.timeData = data.rows
                }
                // vm.timeData = data.rows.length ? data.rows : [{ time: undefined }]
              })
              .catch(err => {})
          }
        }
      ],
      tableList: [],
      columns: [
        {
          value: 'strategyName',
          label: '计划名称'
        },
        {
          value: 'startTime',
          label: '计划开始时间'
        },
        {
          value: 'endTime',
          label: '计划结束时间'
        },
        {
          value: 'state',
          label: '状态',
          render(h, scope) {
            return scope.row.state === 1 ? (
              <i
                style={{ color: '#67C23A', fontSize: '24px' }}
                class="el-icon-check"
              />
            ) : (
              <i
                style={{ color: '#F56C6C', fontSize: '24px' }}
                class="el-icon-close"
              />
            )
          }
        },
        {
          value: 'priority',
          label: '优先级'
        },
        {
          value: 'createTime',
          label: '添加时间'
        }
      ]
    }
  },
  methods: {
    copy(row) {
      this.$confirm('是否复制添加这条策略', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/salesManagement/orderCenter/orderFormStrategy/add',
            query: {
              orderStrategyDeliveryId: row.orderStrategyDeliveryId,
              copy: true
            }
          })
        })
        .catch(() => {})
    },
    edit(row) {
      this.$router.push({
        path: '/salesManagement/orderCenter/orderFormStrategy/add',
        query: { orderStrategyDeliveryId: row.orderStrategyDeliveryId }
      })
    },
    del(row) {
      this.$confirm('是否删除策略？', '警告', {
        type: 'danger'
      })
        .then(() => {
          this.$api['order/strategyDeliveryRemove']({
            orderStrategyDeliveryIds: [row.orderStrategyDeliveryId]
          })
            .then(data => {
              this.getList()
            })
            .catch(err => {})
        })
        .catch(() => {})
    },
    handleSearch(searchParams) {
      this.params.pageNumber = 1
      this.getList(searchParams)
    },
    getInitList() {
      this.$refs.search.reset()
    },
    getList(searchParams = {}) {
      let { time, state, strategyName } = searchParams
      let [startTime, endTime] = time || []
      let params = {
        ...this.params,
        state,
        strategyName,
        startTime,
        endTime
      }
      params = this.$.dealObjectValue(params)
      this.$api['order/strategyDeliveryList'](params)
        .then(data => {
          this.tableList = data.rows
          this.params.pageSize = data.pageSize
          this.params.pageNo = data.pageNo
          this.params.total = data.total
        })
        .catch(err => {})
    },
    handleSizeChange(val) {
      console.log(val)
      this.params.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.params.pageNumber = val
      this.getList()
    },
    //
    clickBtn(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  line-height: 28px;
  margin-bottom: 10px;
  .btn {
    margin-left: 10px;
    padding: 8px;
  }
}
</style>
