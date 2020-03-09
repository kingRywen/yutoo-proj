import {
  loginRedirect
} from 'Config';
export const myMixin = {
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableList: [],
      searchInfo: {},
      loading: false,
      dialog: {
        title: '',
        visible: false,
        component: '',
        width: '1000px',
        isShowBtn: true,
        loading: false
      }
    }
  },
  mounted() {
    this.loading = true
  },
  methods: {
    async _getservice() {
      let {
        rows
      } = await this.$api['email/serviceList']({})
      let result = rows.map(i => {
        return {
          label: i.nickName,
          value: i.userId
        }
      })
      return result
    },
    goOrderInfo(orderId, platformId, orderType) {
      //orderType   1-客户订单 2-本地仓备库订单 3-海外仓库订单 4-FBA发货订单(通过Amazon获取) 5-FBA备货订单(通过ERP创建)
      let type = null
      if (orderType == 3 || orderType == 4 || orderType == 5) {
        type = 3
      } else {
        type = orderType
      }
      window.open(
        loginRedirect + `erp-order/#/salesManagement/associatedSettings/allOrderLists/lookOver?deliveryStatus=已发货&orderServiceId=${orderId}&platformId=${platformId}&orderType=${type}`,
        '_blank'
      )
    },
    openDialog({
      title,
      visible,
      component,
      width,
      isShowBtn
    }) {
      this.dialog.title = title
      this.dialog.visible = visible
      this.dialog.component = component
      this.dialog.width = width ? width : '1000px'
      this.dialog.isShowBtn = isShowBtn == undefined ? true : isShowBtn
    },
    search(val) {
      this.$refs.table.clearSelection()
      console.log(this.$refs.table)
      this.searchInfo = val
      this.loading = true
      this.pageNo = 1
      this.getList('search')
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loading = true
      this.getList('search')
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.loading = true
      this.getList('search')
    } /** */ ,
    _prompt(
      tipsText,
      callback, {
        confirmButtonText,
        cancelButtonText,
        inputPattern,
        inputErrorMessage
      } = {}
    ) {
      this.$prompt(tipsText, '提示', {
          confirmButtonText: confirmButtonText ? confirmButtonText : '确定',
          cancelButtonText: cancelButtonText ? cancelButtonText : '取消',
          inputPattern: inputPattern ? inputPattern : /\S/,
          inputErrorMessage: inputErrorMessage ? inputErrorMessage : '不能为空'
        })
        .then(({
          value
        }) => {
          callback && callback(value)
        })
        .catch(() => {
          return false
        })
    },
    /**
     *
     * @param {提示文字} msg
     * @param {回调} callback
     */
    confirmMsg(msg, callback) {
      this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          callback && callback()
        })
        .catch(() => {
          return false
        })
    },
    /**
     *
     * @param {地址} url
     * @param {参数对象} params
     * @param {处理的类型list列表，msg消息} type
     * @param {回调} callback
     */
    http(url, params, type, callback) {
      if (!(typeof url === 'string')) return
      if (!(params.constructor === Object)) return
      if (!type && typeof callback == 'function') {
        type = callback
      }
      this.loading = true
      this.$api[url](params)
        .then(res => {
          if (type == 'list') {
            let {
              rows,
              pageNo,
              pageSize,
              total
            } = res
            this.tableList = rows
            this.total = total
            this.pageSize = pageSize
            this.pageNo = pageNo
            this.loading = false
          } else if (type == 'msg') {
            this.$message.success(res.msg)
            this.getList()
          }
          callback && callback(res)
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.msg)
        })
    }
  }
}

export const auditType = [
  //审核类型：
  {
    label: '发货策略',
    value: '2'
  },
  {
    label: '审核策略',
    value: '1'
  },
  {
    label: '系统判断',
    value: '3'
  }
]

export const problemstate = [
  //所有问题状态
  {
    label: '未审核',
    value: '1'
  },
  {
    label: '审核通过',
    value: '2'
  },
  {
    label: '审核不通过',
    value: '3'
  },
  {
    label: '已生成退货单',
    value: '4'
  },
  {
    label: '已取消',
    value: '5'
  }
]

export const problemTypeList = [
  //问题类型 / 退换货原因
  {
    label: '库房致残',
    value: 1
  },
  {
    label: '无实物少配件',
    value: 2
  },
  {
    label: '没有收到包裹',
    value: 3
  },
  {
    label: '到货商品有残损',
    value: 4
  },
  {
    label: '商品错发',
    value: 5
  },
  {
    label: '客户无理由退换',
    value: 6
  },
  {
    label: '其他',
    value: 7
  }
]

export const returnedgoodsList = [{
    label: '退款不退货',
    value: 1
  },
  {
    label: '退货不退款',
    value: 2
  },
  {
    label: '退款退货',
    value: 3
  },
  {
    label: '换货',
    value: 4
  },
  {
    label: '退款',
    value: 5
  },
  {
    label: '其他',
    value: 6
  }
]
export const refundTypeList = [
  //退款类型
  {
    label: '未发货退款',
    value: 1
  },
  {
    label: '已发货退款',
    value: 2
  },
  {
    label: '部分退款',
    value: 3
  },
  {
    label: '全额退款',
    value: 4
  }
]
export const refundStateList = [
  //退款状态
  {
    label: '待审核',
    value: 1
  },
  {
    label: '未通过',
    value: 2
  },
  {
    label: '退款中',
    value: 3
  },
  {
    label: '退款成功 ',
    value: 4
  },
  {
    label: '退款失败',
    value: 5
  },
  {
    label: '作废',
    value: 6
  }
]

export const solutionList = [
  //解决方案
  {
    label: '退货',
    value: 1
  },
  {
    label: '重寄',
    value: 2
  },
  {
    label: '退款',
    value: 3
  },
  {
    label: '部分退款+保留产品',
    value: 4
  },
  {
    label: '重寄+退款',
    value: 5
  },
  {
    label: '返修后重发',
    value: 6
  },
  {
    label: '缺货更换产品',
    value: 7
  },
  {
    label: '已过期',
    value: 8
  },
  {
    label: '和平解决',
    value: 9
  },
  {
    label: '授权退货',
    value: 10
  }
]