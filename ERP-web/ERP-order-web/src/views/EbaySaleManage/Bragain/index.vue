<template>
  <div class="bragain">
    <yt-page
      url="order/bargainingList"
      reserveSelection="ebayBargainingId"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="selectChange"
      ref="page"
    >
      <template slot="table">
        <el-table-column label="操作" align="center" width="90px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top" :open-delay="500">
              <i class="el-icon-search iconBtn" @click="handleCheck(scope.row)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="操作日志" placement="top" :open-delay="500">
              <i class="el-icon-document iconBtn" @click="handleOperatorLog(scope.row)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="处理" placement="top" :open-delay="500">
              <i class="iconfont2 iconBtn" @click="handleBargain(scope.row)">&#xe638;</i>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </yt-page>
    <log-info :params="logParams"></log-info>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    let vm = this
    return {
      logParams: {
        url: '',
        info: {},
        visible: true
      },
      searchData(val) {
        if (val.time && val.time.length) {
          val.startTime = val.time[0]
          val.endTime = val.time[1]
          delete val.time
        }
        if (val.storeId && Array.isArray(val.storeId)) {
          if (val.storeId.length) {
            val.storeId = val.storeId[val.storeId.length-1]
          } else {
            val.storeId = null
          }
        }
        return val
      },
      btnConfig: [
        {
          name: '同步议价',
          fn: () => {
            vm.btnConfig[0].turnFlag = true
            vm.$api[`order/bargainingSync`]({})
              .then(() => {
                vm.btnConfig[0].turnFlag = false
              })
              .catch(() => {
                vm.btnConfig[0].turnFlag = false
              })
          },
          turn: true,
          turnFlag: false
        },
        {
          name: '拒绝议价',
          fn: () => {
            if (vm.$editMsg(this.selectData, false)) return
            vm.$refs.page.$dialog({
              title: '拒绝议价',
              width: '540px',
              visible: true,
              component: () => import('./bargain.vue')
            })
          }
        },
        {
          name: '接收议价',
          fn: () => {
            if (vm.$editMsg(this.selectData, false)) return
            vm.$refs.page.$dialog({
              title: '接收议价',
              width: '540px',
              visible: true,
              component: () => import('./bargain.vue')
            })
          }
        }
      ],
      searchConfig: [
        {
          value: 'storeId',
          type: 'cascader',
          placeholder: '订单来源店铺',
          children: []
        },
        {
          value: 'state',
          type: 'select',
          placeholder: '议价状态',
          children: [
            {
              label: '未处理',
              value: 0
            },
            {
              label: '已处理',
              value: 1
            }
          ]
        },
        {
          value: 'creatorId',
          type: 'select',
          placeholder: '客服人员',
          children: []
        },
        {
          value: 'time',
          type: 'time',
          label: '响应截止时间'
        },
        {
          value: 'itemId',
          label: 'item ID',
          type: 'input'
        },
        {
          value: 'productTitle',
          label: '产品标题',
          type: 'input'
        }
      ],
      tableConfig: [
        {
          label: '订单来源店铺',
          value: 'storeName'
        },
        {
          label: '产品图片',
          value: 'productImg',
          img: true,
          style: {
            width: 80,
            height: 80
          }
        },
        {
          label: 'item ID',
          value: 'itemId'
        },
        {
          label: '标题',
          value: 'title'
        },
        {
          label: '价格',
          value: 'price'
        },
        {
          label: '下架时间',
          value: 'endTime',
          width: '150px'
        },
        {
          label: '买家名称',
          value: 'customName'
        },
        {
          label: '买家邮箱',
          value: 'customEmail'
        },
        {
          label: '买家国家',
          value: 'customCountryName'
        },
        {
          label: '议价状态',
          value: 'stateName'
        },
        {
          label: '最新议价过程',
          render(h, scope) {
            let str =
              (scope.row.processList && scope.row.processList.content) || '-'
            return <div>{str}</div>
          }
        }
      ],
      selectData: []
    }
  },
  created() {
    this.getEmailAccountServiceList()
    this.getAllShopList()
  },
  watch: {
    emailAccountServiceList(val) {
      this.searchConfig[2].children = val
    },
    platformShopList(val) {
      this.searchConfig[0].children = val
    }
  },
  computed: {
    ...mapState('common', ['emailAccountServiceList', 'platformShopList'])
  },
  methods: {
    ...mapActions('common', ['getEmailAccountServiceList', 'getAllShopList']),
    selectChange(val) {
      this.selectData = val
    },
    async submitForm(data, title) {
      let vm = this
      switch (title) {
        case '议价详情':
          vm.$refs.page.resetForm()
          break
        case '议价处理':
          vm.bargaining(data, 'handle')
          break
        case '拒绝议价':
          data.bargainingType = 2
          vm.bargaining(data)

          break
        case '接收议价':
          data.bargainingType = 1
          vm.bargaining(data)
          break

        default:
          break
      }
    },
    bargaining(data, type) {
      let vm = this
      let params = data
      if (!type) {
        params.ebayBargainingIds = vm.selectData.map(
          item => item.ebayBargainingId
        )
      }
      vm.$api[`order/bargainingHandle`](params).then(() => {
        vm.$refs.page.closeForm()
      })
    },
    handleCheck(row) {
      console.log(row)
      this.$refs.page.$dialog({
        title: '议价详情',
        width: '540px',
        visible: true,
        component: () => import('./bargainInfo.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              ebayBargainingId: row.ebayBargainingId
            }
          }
        ]
      })
    },
    handleOperatorLog(row) {
      let vm = this
      vm.logParams = {
        url: 'order/bargainingGetOperatorLog',
        info: {
          ebayBargainingId: row.ebayBargainingId
        },
        visible: true
      }
    },
    handleBargain(row) {
      console.log(row)
      this.$refs.page.$dialog({
        title: '议价处理',
        width: '540px',
        visible: true,
        component: () => import('./bargainInfo.vue'),
        childFn: [
          {
            name: 'handleFlagChange',
            params: ''
          },
          {
            name: 'edit',
            params: {
              ebayBargainingId: row.ebayBargainingId
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang='scss'>
.bragain {
  background: #fff;
}
</style>