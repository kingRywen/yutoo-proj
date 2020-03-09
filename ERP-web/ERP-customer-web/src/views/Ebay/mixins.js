import { mapActions, mapState } from 'vuex'
import { downloadFile } from 'Utils/tools.js'
import { CONST_PORT_CONFIG } from 'Config'
// eslint-disable-next-line
const { loginRedirect } = CONST_PORT_CONFIG
import Vue from 'vue'
const mixins = {
  data() {
    return {
      searchData(val) {
        if (
          val.timeLabel &&
          val.time &&
          Array.isArray(val.time) &&
          val.time.length
        ) {
          val.startTime = val.time[0]
          val.endTime = val.time[1]
          val.timeType = val.timeLabel
        }
        delete val.timeLabel
        delete val.time

        if (val.searchOrigin && val.originValue) {
          val[val.searchOrigin] = val.originValue
        }
        if (val.searchOrigin) {
          delete val.searchOrigin
        }
        if (val.originValue) {
          delete val.originValue
        }
        return val
      }
    }
  },
  created() {
    this.getStoreEbayList()
  },
  watch: {
    storeEbayList(val) {
      if (val) {
        this.searchConfig[0].children = val
      }
    }
  },
  methods: {
    ...mapActions('product', ['getStoreEbayList']),
    synchronous(urlName) {
      let vm = this
      vm.$confirm('是否需要手动同步数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api[`email/${urlName}`]({}).then(() => {
            vm.$refs.page.closeForm()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消手动同步数据'
          })
        })
    },
    exportData(urlName, id) {
      let vm = this
      let params = {}
      if (vm.$editMsg(vm.selectData, false)) {
        return
      }
      params[`${id}s`] = vm.selectData.map(item => item[id])
      vm.$api[`email/${urlName}`](params).then(data => {
        downloadFile(data.path)
        vm.$refs.page.clearSelection()
      })
    },
    pageJump: function() {
      let vm = this
      return function(h, scope) {
        const key = this.value
        const href = this.href
        function click() {
          let a = document.createElement('a')
          a.href = href
          a.target = '_blank'
          a.click()
          a = null
        }
        // eslint-disable-next-line
        let str = ''
        if (vm.dealFlag) {
          str = scope[key] || '-'
        } else {
          str = scope.row[key] || '-'
        }
        return (
          <div
            onClick={() => {
              click()
            }}
            style="color:#108ee9;cursor:pointer"
          >
            {str}
          </div>
        )
      }
    },
    orderJump: function() {
      let vm = this
      return function(h, scope) {
        let key = this.value
        let num = ''
        if (vm.dealFlag) {
          num = scope[key] || '-'
        } else {
          num = scope.row[key] || '-'
        }
        return (
          <div
            onClick={() => {
              vm.getDetail(num)
            }}
            style="color:#108ee9;cursor:pointer"
          >
            {num}
          </div>
        )
      }
    },
    getDetail: async function(val) {
      if (!val || val == '-') {
        return
      }
      let vm = this
      let orderServiceId = null
      let deliveryStatus = null
      let platformId = null
      let orderType = null

      await vm.$api['order/getOrderIdByNumber']({
        orderNumber: val
      }).then(data => {
        orderServiceId = data.orderId
      })
      await vm.$api['order/orderInfo']({
        orderId: orderServiceId
      }).then(data => {
        let info = data.rows.essentialInfo
        deliveryStatus = info.deliveryStatus
        platformId = info.platformId
        orderType = info.orderType
        let a = document.createElement('a')
        let evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, true)
        a.href =
          loginRedirect +
          `/erp-order/#/salesManagement/associatedSettings/allOrderLists/lookOver?deliveryStatus=${deliveryStatus}&orderServiceId=${orderServiceId}&platformId=${platformId}&orderType=${orderType}`
        a.target = '_blank'
        a.dispatchEvent(evt)
        a = null
      })
    }
  },
  computed: {
    ...mapState('product', ['storeEbayList'])
  }
}

// 使用时，对象加个href 直接跳转
mixins.aaaa = function() {
  console.log(this)
}
mixins.pageJump = function(h, scope) {
  const key = this.value
  const href = this.href
  function click() {
    let a = document.createElement('a')
    a.href = href
    a.target = '_blank'
    a.click()
    a = null
  }
  return (
    <div
      onClick={() => {
        click()
      }}
      style="color:#108ee9;cursor:pointer"
    >
      {scope.row[key]}
    </div>
  )
}

// 跳转订单号

mixins.orderJump = function(h, scope) {
  let key = this.value
  console.log(key)
  let num = scope.row[key] || '-'
  return (
    <div
      onClick={() => {
        getDetail(num)
      }}
      style="color:#108ee9;cursor:pointer"
    >
      {num}
    </div>
  )
}
async function getDetail(val) {
  if (!val || val == '-') {
    return
  }
  let orderServiceId = null
  let deliveryStatus = null
  let platformId = null
  let orderType = null
  const vm = new Vue()

  await vm.$api['order/getOrderIdByNumber']({
    orderNumber: val
  }).then(data => {
    orderServiceId = data.orderId
  })
  await vm.$api['order/orderInfo']({
    orderId: orderServiceId
  }).then(data => {
    let info = data.rows.essentialInfo
    deliveryStatus = info.deliveryStatus
    platformId = info.platformId
    orderType = info.orderType
    let a = document.createElement('a')
    let evt = document.createEvent('MouseEvents')
    evt.initEvent('click', true, true)
    a.href =
      loginRedirect +
      `/erp-order/#/salesManagement/associatedSettings/allOrderLists/lookOver?deliveryStatus=${deliveryStatus}&orderServiceId=${orderServiceId}&platformId=${platformId}&orderType=${orderType}`
    a.target = '_blank'
    a.dispatchEvent(evt)
    a = null
  })
}

export default mixins
