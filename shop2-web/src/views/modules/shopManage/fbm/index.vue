<template>
  <div>
    <main-layout
      :outerParams="storeInfo"
      :searchFields="searchFields"
      :columns="columns"
      @searchTrueData="val => searchData = val"
      @requestSuccess="_ => isMount = true"
      edit-width="160px"
      :tableRowClassName="tableRowClassName"
      :sortType="1"
      :cellStyle="cellStyle"
      tbRightFixed="right"
      reserveSelection="amazonOrderId"
      :right-edit-btns="editBtns"
      :edit-btns="edits"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="fbm/fbm-orderOrderPage"
      tip="每日6点和16点更新数据"
      ref="layout"
    ></main-layout>
    <!-- <el-dropdown v-if="isMount" class="anay" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-button type="text" style="padding: 0" icon="iconfont icongongju"></el-button>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">发货期限</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>-->
  </div>
</template>
<script>
import { downloadFile } from 'Utils'
import { timeField, getSearchNumField } from 'Utils/table-render.js'
export default {
  data() {
    const nums = this.$storage.get('local', 'fbm_sync') || 0
    const options = [
      { label: 'USPS', value: 'USPS' },
      { label: 'UPS', value: 'UPS' },
      { label: 'UPSMI', value: 'UPSMI' },
      { label: 'FedEx', value: 'FedEx' },
      { label: 'DHL', value: 'DHL' },
      { label: 'Fastway', value: 'Fastway' },
      { label: 'GLS', value: 'GLS' },
      { label: 'GO!', value: 'GO!' },
      {
        label: 'Hermes Logistik Gruppe',
        value: 'Hermes Logistik Gruppe'
      },
      { label: 'Royal Mail', value: 'Royal Mail' },
      { label: 'Parcelforce', value: 'Parcelforce' },
      { label: 'City Link', value: 'City Link' },
      { label: 'TNT', value: 'TNT' },
      { label: 'Target', value: 'Target' },
      { label: 'SagawaExpress', value: 'SagawaExpress' },
      { label: 'NipponExpress', value: 'NipponExpress' },
      { label: 'YamatoTransport', value: 'YamatoTransport' },
      { label: 'DHL Global Mail', value: 'DHL Global Mail' },
      { label: 'UPS Mail Innovations', value: 'UPS Mail Innovations' },
      { label: 'FedEx SmartPost', value: 'FedEx SmartPost' },
      { label: 'OSM', value: 'OSM' },
      { label: 'OnTrac', value: 'OnTrac' },
      { label: 'Streamlite', value: 'Streamlite' },
      { label: 'Newgistics', value: 'Newgistics' },
      { label: 'Canada Post', value: 'Canada Post' },
      { label: 'Blue Package', value: 'Blue Package' },
      { label: 'Chronopost', value: 'Chronopost' },
      { label: 'Deutsche Post', value: 'Deutsche Post' },
      { label: 'DPD', value: 'DPD' },
      { label: 'La Poste', value: 'La Poste' },
      { label: 'Parcelnet', value: 'Parcelnet' },
      { label: 'Poste Italiane', value: 'Poste Italiane' },
      { label: 'SDA', value: 'SDA' },
      { label: 'Smartmail', value: 'Smartmail' },
      { label: 'FEDEX_JP', value: 'FEDEX_JP' },
      { label: 'JP_EXPRESS', value: 'JP_EXPRESS' },
      { label: 'NITTSU', value: 'NITTSU' },
      { label: 'SAGAWA', value: 'SAGAWA' },
      { label: 'YAMATO', value: 'YAMATO' },
      { label: 'BlueDart', value: 'BlueDart' },
      { label: 'AFL/Fedex', value: 'AFL/Fedex' },
      { label: 'Aramex', value: 'Aramex' },
      { label: 'India Post', value: 'India Post' },
      { label: 'Professional', value: 'Professional' },
      { label: 'DTDC', value: 'DTDC' },
      { label: 'Overnite Express', value: 'Overnite Express' },
      { label: 'First Flight', value: 'First Flight' },
      { label: 'Delhivery', value: 'Delhivery' },
      { label: 'Lasership', value: 'Lasership' },
      { label: 'Yodel', value: 'Yodel' },
      { label: 'Other', value: 'Other' },
      { label: 'Amazon Shipping', value: 'Amazon Shipping' },
      { label: 'Seur', value: 'Seur' },
      { label: 'Correos', value: 'Correos' },
      { label: 'MRW', value: 'MRW' },
      { label: 'Endopack', value: 'Endopack' },
      { label: 'Chrono Express', value: 'Chrono Express' },
      { label: 'Nacex', value: 'Nacex' },
      { label: 'Otro', value: 'Otro' },
      { label: 'Correios', value: 'Correios' },
      { label: 'Toll Global Express', value: 'Toll Global Express' },
      { label: 'China Post', value: 'China Post' },
      { label: 'AUSSIE_POST', value: 'AUSSIE_POST' },
      { label: 'EUB', value: 'EUB' },
      { label: 'Australia Post', value: 'Australia Post' },
      { label: 'Yun Express', value: 'Yun Express' },
      { label: '4PX', value: '4PX' },
      { label: 'YANWEN', value: 'YANWEN' },
      { label: 'SF Express', value: 'SF Express' }
    ]
    return {
      nums,
      isMount: false,
      searchData: {},
      searchFields: {
        storeId: {
          widget: 'select',
          options: [],
          labelWidth: '55px',
          label: '店铺'
        },
        purchaseDate: timeField(
          '下单时间',
          'purchaseDate',
          '80px',
          'daterange',
          true,
          true
        ),
        fbmOrderStatus: {
          placeholder: '发货状态',
          widget: 'select',
          options: [
            {
              label: '已发货',
              value: 'Shipped'
            },
            {
              label: '未发货',
              value: 'Unshipped'
            },
            {
              label: '已取消',
              value: 'Canceled'
            }
          ]
        },

        amazonOrderId: {
          placeholder: '订单号',
          labelWidth: '65px'
        },
        shipMethod: {
          placeholder: '运输方式',
          options: [
            {
              label: 'Standard',
              value: 'Standard'
            },
            {
              label: 'Express',
              value: 'Express'
            }
          ],
          widget: 'select'
        },
        shipCarrier: {
          placeholder: '运输方',
          options,
          widget: 'select'
        },

        amount: getSearchNumField.call(
          this,
          '订单金额',
          'amount',
          '85px',
          true,
          2
        ),
        adjAmouts: getSearchNumField.call(
          this,
          '退款金额',
          'adjAmouts',
          '85px',
          true,
          2
        )
      },
      columns: [
        {
          label: '订单号',
          noTooltip: true,
          value: 'amazonOrderId',
          width: 170
        },
        {
          label: '下单时间',
          width: 170,
          value: 'purchaseDate',
          sortable: 'custom'
        },
        {
          label: '店铺',
          noTooltip: true,
          value: 'storeId',
          render: (h, scope) => {
            const opts = this.searchFields.storeId.options
            if (!opts) {
              return <span>-</span>
            } else {
              return (
                <span>
                  {opts.find(e => e.value === scope.row.storeId).label}
                </span>
              )
            }
          }
        },
        {
          label: '剩余发货时间',
          value: 'remainDays',
          sortable: 'custom',
          width: 140,
          render(h, scope) {
            const { remainDays, fbmOrderStatus } = scope.row
            if (fbmOrderStatus == 'Shipped') {
              return <span>-</span>
            }
            return <span>{remainDays}</span>
          }
        },
        {
          label: '订购产品',
          value: 'numberItems',
          url: true,
          btnClick: scope => {
            this.viewInfo(scope)
          }
        },
        {
          label: '订单金额',
          value: 'amount',
          width: 130,
          money: true,
          currency: row => {
            return row.currencyCode
          }
        },
        {
          label: '退款金额',
          width: 130,
          value: 'adjAmouts',
          money: true,
          currency: row => {
            return row.currencyCode
          }
        },
        {
          label: '发货状态',
          width: 100,
          value: 'fbmOrderStatus'
          // _enum: ['未发货', '已发货']
        },
        {
          label: '运单号',
          width: 160,
          noTooltip: true,
          render(h, scope) {
            const { trackingNumbers, shipping } = scope.row
            if (shipping == 1) {
              return (
                <div class="info">
                  <i class="el-icon-loading" />
                  <span class="info">{trackingNumbers || '-'}</span>
                </div>
              )
            }
            return <span>{trackingNumbers || '-'}</span>
          },
          value: 'trackingNumbers'
        },
        {
          label: '运输方式',
          value: 'shipMethods'
        },
        {
          label: '运输方',
          value: 'shipCarriers',
          _enum: this.cfuns.arrayToObj(options)
        }
      ],
      editBtns: [
        {
          perm: 'add',
          icon: 'el-icon-refresh-right',
          name: '同步订单',
          type: 'plain',
          showLoading: true,
          fn: () => {
            return this.sync()
          }
        },
        {
          perm: 'add',
          type: 'plain',
          icon: 'iconfont icondaochu',
          name: '导出',
          showLoading: true,
          fn: () => {
            return this._export()
          }
        },
        {
          icon: 'iconfont icondaoru',
          perm: 'add',
          // showLoading: true,
          type: 'plain',
          name: '导入',
          fn: () => {
            return this._import()
          }
        }
      ],
      edits: [
        {
          name: '修改运单号',
          perm: 'addTask',
          fn: scope => {
            this.deliver([scope.row], true)
          }
        },
        {
          name: '设为已发货',
          perm: 'addTask',
          fn: scope => {
            this.updateSendStatus([scope.row], 1)
          }
        },
        {
          name: '详细信息',
          perm: 'addTask',
          fn: scope => {
            this.viewInfo(scope, '详细信息')
          }
        },
        {
          name: '退款',
          perm: 'addTask',
          fn: scope => {
            this.refund(scope.row)
          }
        }
      ],
      topBatchBtn: {
        loading: false,
        title: '订单',
        options: [
          {
            label: '发货'
          },
          {
            label: '修改运单号'
          },
          {
            label: '设为已发货'
          },
          {
            label: '设为未发货'
          }
          // {
          //   label: '退款'
          // },
          // {
          //   label: '导出'
          // }
        ]
      }
    }
  },
  created() {
    this.$store.dispatch('storeInfo/getStoreList').then(data => {
      this.searchFields.storeId.options = data
    })
    this._timer = setInterval(() => {
      if (this.$refs.layout) {
        this.$refs.layout.getList({}, false, false)
      }
    }, 10 * 1000)
  },
  beforeDestroy() {
    clearInterval(this._timer)
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.shipping == 1) {
        return '_info'
      }
      // return 'font-size:24px'
    },
    cellStyle({ row, column }) {
      if (
        row.danger &&
        row.fbmOrderStatus == 'Unshipped' &&
        column.label == '剩余发货时间'
      ) {
        return {
          fontWeight: 'bolder',
          color: 'red'
        }
      }
    },
    viewInfo(scope, title) {
      // this.$_dialog({
      //   size: 'medium',
      //   title: '收件信息',
      //   params: { row: scope.row },
      //   cancelBtnText: '取消',
      //   okBtnText: '确认',
      //   component: () => import('./dialogs/viewInfo.vue')
      // })
      const { amazonOrderId } = scope.row
      this.$_dialog({
        size: 'medium',
        title: title || '产品列表',
        params: {
          queries: {
            amazonOrderId
          },
          row: scope.row
        },
        cancelBtnText: '关闭',
        // okBtnText: '确认',
        component: () => import('./dialogs/proList.vue')
      })
    },
    handleCommand(command) {
      switch (command) {
        case 'a':
          this.$_dialog({
            size: 'medium',
            title: '设置发货期限',
            params: {},
            cancelBtnText: '取消',
            okBtnText: '确认',
            component: () => import('./dialogs/deadline.vue')
          })
          break

        default:
          break
      }
    },
    handleLeftBatchChange(val, sel) {
      switch (val[0]) {
        case '发货':
          this.deliver(sel)
          break
        case '修改运单号':
          this.deliver(sel, true)
          break
        case '设为已发货':
          this.updateSendStatus(sel, 1)
          break
        case '设为未发货':
          this.updateSendStatus(sel, 0)
          break
        // case '退款':
        //   this.refund(sel)
        //   break
        case '导出':
          this._export(this.searchData)
          break

        default:
          break
      }
    },
    exportEbo() {
      return this.$api[`fbm/fbm-orderOrderLogistics-template-ebo`]({
        ...this.searchData,
        pageSize: 10000
      }).then(data => {
        downloadFile(data)
      })
    },
    sync() {
      if (this.nums >= 10) {
        this.$message.error('今天的同步次数已用完，请明天再试')
        return Promise.resolve()
      }
      const params = { d: true }
      this.$storage.set('local', 'fbm_sync', ++this.nums)
      return this.$api[`fbm/fbm-orderOrderSyn`](params).catch(() => {
        this.editBtns[0].showLoading = false
      })
    },
    _import() {
      this.$_dialog({
        size: 'medium',
        title: '选择店铺',
        params: {
          // options: this.$store.state.storeInfo.curStoreList,
          // fn: storeId => {
          //   this._openDialog({
          //     size: 'medium',
          //     fullscreen: false,
          //     title: '导入运单号和运输方式',
          //     params: { storeId },
          //     cancelBtnText: '取消',
          //     okBtnText: '确认',
          //     component: () => import('./dialogs/importDe.vue')
          //   })
          // }
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/selectImport.vue')
      })
    },
    _export(data) {
      if (this.$refs.layout.selection.length) {
        data = {
          amazonOrderIdList: this.$refs.layout.selection.map(
            e => e.amazonOrderId
          ),
          ...this.searchData
        }
      } else {
        data = this.searchData
      }
      Object.assign(data, {
        pageSize: 50000,
        pageNumber: 1
      })
      data && (this.topBatchBtn.loading = true)
      return this.$api[`fbm/fbm-orderOrderExport`](data)
        .then(data => {
          data && (this.topBatchBtn.loading = false)
          downloadFile(data)
          return Promise.resolve()
        })
        .catch(() => {
          data && (this.topBatchBtn.loading = false)
        })
    },
    refund(data) {
      // data = data.map(e => ({
      //   amazonOrderId: e.amazonOrderId,
      //   actionType: 'Refund',
      //   orderItemId: e.orderItemId,
      //   currency: e.currencyCode,
      //   itemPriceAdj: undefined,
      //   shippingPriceAdj: undefined,
      //   amount: e.amount
      // }))
      this.$_dialog({
        size: 'medium',
        title: '退款',
        params: { data },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/refund.vue')
      })
    },
    updateSendStatus(data, status) {
      data = data.map(e => ({
        amazonOrderId: e.amazonOrderId,
        fbmOrderStatus: status ? 'Shipped' : 'Unshipped'
      }))
      this.showTips(
        { msg: `此操作将修改为${status ? '已' : '未'}发货, 是否继续?` },
        () => {
          return this.$api[`fbm/fbm-orderOrderEdit`]({ orders: data })
        }
      )
    },
    deliver(orderNumbers, edit) {
      let obj = {}
      orderNumbers.forEach(el => {
        obj[el] = true
      })
      if (Object.keys(obj).length > 1) {
        return this.$message.warning('只能选择同一店铺的产品进行操作')
      }
      const ways = this.searchFields.shipMethod.options
      this.$_dialog({
        size: 'medium',
        title: edit ? '修改运单号' : '发货',
        params: {
          edit,
          orderNumbers,
          ways
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/deliver.vue')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.anay {
  position: absolute;
  right: 23px;
  top: -20px;
  /deep/ i {
    font-size: 24px;
  }
}
</style>