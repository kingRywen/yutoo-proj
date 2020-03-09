<template>
  <div class="sales-activity-manage">
    <yt-page
      url="order/salesPromotionList"
      reserveSelection="ebaySalesPromotionId"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="val => selectData=val"
      ref="page"
    >
      <template slot="table">
        <el-table-column label="操作" align="center" width="90px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :open-delay="500">
              <i class="el-icon-edit iconBtn" @click="handleEdit(scope.$index,scope.row)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="操作日志" placement="top" :open-delay="500">
              <i class="el-icon-document iconBtn" @click="handleOperatorLog(scope.$index,scope.row)"/>
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
        val = JSON.parse(JSON.stringify(val))
        if (vm.$.dataType(val.time) === 'Array' && val.time.length) {
          val.startTime = val.time[0]
          val.endTime = val.time[1]
          delete val.time
        }
        if (val.storeId && Array.isArray(val.storeId)) {
          if (val.storeId.length) {
            val.storeId = val.storeId[val.storeId.length - 1]
          } else {
            val.storeId = null
          }
        }
        console.log(val)
        return val
      },
      selectData: [],
      btnConfig: [
        {
          name: '添加促销活动',
          fn: () => {
            vm.$refs.page.$dialog({
              title: '添加促销活动',
              width: '660px',
              visible: true,
              component: () => import('./addSalesActivity.vue')
            })
          }
        },
        {
          name: '删除',
          fn: () => {
            if (vm.$editMsg(vm.selectData, false)) {
              return
            }
            vm.$api[`order/salesPromotionRemove`]({
              ebaySalesPromotionIds: vm.selectData.map(
                item => item.ebaySalesPromotionId
              )
            }).then(() => {
              vm.$refs.page.getList('search')
              vm.$refs.page.clearSelection()
            })
          }
        }
      ],
      searchConfig: [
        {
          value: 'storeId',
          placeholder: '订单来源店铺',
          type: 'cascader',
          children: []
        },
        {
          label: '促销起止时间',
          value: 'time',
          type: 'time'
        },
        {
          label: '促销状态',
          value: 'state',
          type: 'select',
          children: [
            {
              label: '未开始',
              value: 1
            },
            {
              label: '促销中',
              value: 2
            },
            {
              label: '已结束',
              value: 3
            }
          ]
        },
        {
          label: '活动名称',
          value: 'name',
          type: 'input'
        }
      ],
      tableConfig: [
        {
          label: '活动名称',
          value: 'name'
        },
        {
          label: '订单来源店铺',
          value: 'storeName'
        },
        {
          label: '促销状态',
          value: 'stateName'
        },
        {
          label: '开始时间',
          value: 'startTime',
          width: '150px'
        },
        {
          label: '结束时间',
          value: 'endTime',
          width: '150px'
        },
        {
          label: '活动备注',
          value: 'remark'
        }
      ]
    }
  },
  mounted() {
    // this.$refs.page.$dialog({
    //   title: '添加促销活动',
    //   width: '660px',
    //   visible: true,
    //   component: () => import('./addSalesActivity.vue')
    // })
  },
  created() {
    this.getAllShopList()
  },
  watch: {
    ebayStoreList(val) {
      this.searchConfig[0].children = val
    }
  },
  computed: {
    ...mapState('common', ['ebayStoreList'])
  },
  methods: {
    ...mapActions('common', ['getAllShopList']),
    handleEdit(index, row) {
      let vm = this
      vm.$refs.page.$dialog({
        title: '编辑促销活动',
        width: '660px',
        visible: true,
        component: () => import('./addSalesActivity.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              ebaySalesPromotionId: row.ebaySalesPromotionId
            }
          }
        ]
      })
    },
    handleOperatorLog(index, row) {
      let ebaySalesPromotionId = row.ebaySalesPromotionId
      this.logParams = {
        url: 'order/salesPromotionGetOperatorLog',
        info: {
          ebaySalesPromotionId
        },
        visible: true
      }
    },
    async submitForm(data, title) {
      let vm = this
      console.log(title)
      switch (title) {
        case '添加促销活动':
          vm.$api[`order/salesPromotionSave`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        case '编辑促销活动':
          vm.$api[`order/salesPromotionUpdate`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang='scss'>
.sales-activity-manage {
  background: #fff;
}
</style>