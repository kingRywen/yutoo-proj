<template>
  <div>
    <main-layout
      :outerParams="storeInfo"
      :searchFields="searchFields"
      :columns="columns"
      @searchTrueData="val => searchData = val"
      @requestSuccess="_ => isMount = true"
      edit-width="160px"
      showFilter
      :sortType="1"
      tbRightFixed="right"
      :right-edit-btns="editBtns"
      :edit-btns="edits"
      :topBatchBtn="topBatchBtn"
      :treeTable="true"
      :checkStrictly="false"
      :treeTableOtions="treeTableOtions"
      :tableRowClassName="tableRowClassName"
      @left-batch-change="handleLeftBatchChange"
      url="fba/FbaReplenishProductList"
      ref="layout"
    ></main-layout>
    <!-- <el-button class="anay" type="text" icon="el-icon-cpu"></el-button> -->

    <el-dropdown v-if="isMount" class="anay" @command="handleCommand">
      <span class="el-dropdown-link">
        <!-- <i class="iconfont">&#xe60e;</i> -->
        <el-button type="text" style="padding: 0" icon="iconfont icongongju"></el-button>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">生命周期管理</el-dropdown-item>
        <el-dropdown-item command="b">运输方式</el-dropdown-item>
        <el-dropdown-item command="c">补货记录</el-dropdown-item>
        <el-dropdown-item command="d">发货计划</el-dropdown-item>
        <el-dropdown-item command="e">设置滞销预警天数</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import { timeField, getSearchNumField } from 'Utils/table-render.js'
import { downloadFile } from 'Utils'
import mixin from './mixin'
// import { downloadFile } from 'Utils'
export default {
  mixins: [mixin],
  data() {
    return {
      isMount: false,
      searchData: {},
      treeTableOtions: {
        childs: 'children',
        expandFunc: row => {
          return row.variationType == 1
        }
      },
      topBatchBtn: {
        loading: false,
        title: '产品',
        options: [
          {
            label: '补货'
          },
          {
            label: '设置生命周期'
          },
          {
            label: '恢复生命周期'
          },
          {
            label: '修改价格'
          },
          {
            label: '设置滞销预警天数'
          },
          {
            label: '创建FBA发货计划'
          },
          {
            label: '删除'
          }
        ]
      },
      searchFields: {
        keyword: {
          placeholder: 'ASIN、SKU、FNSKU'
        },
        sale: getSearchNumField.call(this, '销量范围', 'sale', '80px'),
        lifeCircle: {
          widget: 'select',
          labelWidth: '110px',
          hidden: true,
          options: this.$const['FBA/lifecircles'],
          label: '产品生命周期'
        },
        storeId: {
          widget: 'select',
          options: [],
          hidden: true,
          labelWidth: '55px',
          label: '店铺'
        },
        lifeCycleMustFlag: {
          widget: 'select',
          hidden: true,
          options: this.$const['OTHER/yesno'],
          labelWidth: '165px',
          label: '是否手动更改生命周期'
        },

        unsalableInventory: getSearchNumField.call(
          this,
          '滞销库存范围',
          'unsalableInventory',
          '110px'
        ),
        availableSaleDays: getSearchNumField.call(
          this,
          '可售天数范围',
          'availableSaleDays',
          '110px'
        ),
        salesAvg: getSearchNumField.call(
          this,
          '日均销量范围',
          'salesAvg',
          '110px'
        ),
        fbaAllInventory: getSearchNumField.call(
          this,
          '总库存范围',
          'fbaAllInventory',
          '96px'
        ),
        replenishRemainingDays: getSearchNumField.call(
          this,
          '备货剩余天数范围',
          'replenishRemainingDays',
          '136px'
        ),
        nowReplenish: getSearchNumField.call(
          this,
          '备货中数量范围',
          'nowReplenish',
          '120px'
        ),
        lackWarningDays: getSearchNumField.call(
          this,
          '缺货预警范围',
          'lackWarningDays',
          '110px'
        ),
        orderTime: timeField('订单时间范围', 'orderTime', '110px')
      },
      columns: [
        {
          label: 'SKU',
          value: 'sellerSku',
          numField: 'childsCount',
          fixed: 'left',
          noTooltip: true,
          minWidth: 180,
          expand: true,
          async: true,
          asyncFunc: row => {
            let params = {
              ...this.searchData,
              parentSellerSku: row.sellerSku,
              parentAsin: row.asin
            }
            return this.$api[`fba/fbaReplenishProductListVariation`](
              params
            ).then(data => data.rows)
          }
        },
        {
          label: 'ASIN',
          value: 'asin',
          minWidth: 140
        },
        {
          label: 'FNSKU',
          width: 130,
          value: 'fnsku'
        },
        {
          label: '主图',
          width: 65,
          value: 'img',
          img: true,
          link: row => {
            return this.storeUrls.asinUrl + row['asin']
          },
          title: 'title'
        },
        {
          label: '店铺',
          noTooltip: true,
          width: 150,
          value: 'storeId'
        },
        {
          label: '价格',
          value: 'price'
        },
        {
          label: '运输方式',
          width: 200,
          value: 'transportName',
          headerTooltip: '默认展示最紧急的，可以切换运输方式查看需要补货的产品',
          renderHeader: this.renderTrans.bind(this)
        },
        {
          label: '缺货数量',
          sortable: 'custom',
          value: 'allLackCount'
        },
        {
          label: '待补数量',
          minWidth: 100,
          headerTooltip: '还需要补货的数量',
          sortable: 'custom',
          value: 'waitReplenishCount'
        },
        {
          label: '在补数量',
          minWidth: 100,
          headerTooltip: '确认并导出补货的数量，点击查看具体批次号',
          sortable: 'custom',
          value: 'qtyNowReplenish',
          render: this.renderRestTable.bind(this)
        },
        {
          label: '剩余备货天数',
          minWidth: 120,
          headerTooltip:
            '只展示1个备货剩余时间最少的，鼠标移入可以展示所有批次的剩余时间',
          sortable: 'custom',
          value: 'lastSendDays',
          render: this.renderRestTable.bind(this)
        },
        {
          label: '保底天数',
          sortable: 'custom',
          value: 'daysInsured'
        },
        {
          label: '运输天数',
          sortable: 'custom',
          value: 'daysShipping'
        },
        {
          label: '备货天数',
          sortable: 'custom',
          value: 'daysStock'
        },
        {
          label: '本地库存',
          sortable: 'custom',
          value: 'qtyLocalInventory'
        },
        {
          label: '总库存',
          sortable: 'custom',
          value: 'qtyAll'
        },
        {
          sortable: 'custom',
          label: 'FBA总库存',
          value: 'qtyAllFbaInventory',
          minWidth: 90
        },
        {
          label: '可售库存',
          sortable: 'custom',
          value: 'qtyAvailableSale'
        },
        {
          label: '待接收',
          sortable: 'custom',
          headerTooltip: '还未到FBA仓库的产品数量',
          value: 'qtySendWaitReceive'
        },
        {
          sortable: 'custom',
          label: '待入库',
          headerTooltip: '已到达FBA仓库还未入库的产品数量',
          value: 'qtyReceiveWaitIn'
        },
        {
          label: '转运库存',
          minWidth: 100,
          sortable: 'custom',
          headerTooltip:
            '转运库存包含【FBA仓库间调货库存】与【FBA正在处理中库存】，已剔除掉FBA订单等待发货的库存',
          value: 'qtyReserved'
        },
        {
          label: '不可售库存量',
          minWidth: 110,
          sortable: 'custom',
          value: 'nonSalableInventory'
        },
        { sortable: 'custom', label: '当日销量', value: 'salesDay' },
        {
          label: '日均销量',
          sortable: 'custom',
          value: 'salesAvg',
          render: this.renderAva.bind(this)
        },
        {
          label: '可售天数',
          sortable: 'custom',
          minWidth: 100,
          headerTooltip: '可售天数=（可售库存+待入库）/ 平均销量',
          value: 'availableSaleDays'
        },
        {
          sortable: 'custom',
          minWidth: 110,
          label: '已配送订单数',
          value: 'orderQtyShipping'
        },

        // {
        //   label: 'Pending订单数',
        //   minWidth: 120,
        //   sortable: 'custom',
        //   value: 'invokeNum'
        // },
        {
          label: '取消订单数',
          minWidth: 100,
          sortable: 'custom',
          value: 'orderQtyCancell'
        },
        {
          sortable: 'custom',
          label: '退款订单数',
          minWidth: 100,
          value: 'orderQtyReturn'
        },
        {
          label: '退款率',
          sortable: 'custom',
          value: 'returnRate'
        },
        {
          label: '滞销预警天数',
          minWidth: 110,
          sortable: 'custom',
          value: 'unsalableWarningDays'
        },
        {
          label: '滞销库存',
          sortable: 'custom',
          value: 'unsalableInventory'
        },
        {
          label: '生命周期',
          value: 'lifeCycle'
        },
        {
          label: '固定补货天数',
          minWidth: 110,
          sortable: 'custom',
          value: 'daysFixed'
        }
      ],
      edits: [
        {
          name: '补货',
          perm: 'addTask',
          fn: scope => {
            this.rep({
              data: [
                { storeId: scope.row.storeId, sellerSku: scope.row.sellerSku }
              ]
            })
          }
        },
        {
          name: '设置生命周期',
          perm: 'addTask',
          fn: scope => {
            this.setLifeCycle(
              '设置生命周期',
              [{ storeId: scope.row.storeId, sellerSku: scope.row.sellerSku }],
              scope.row.lifeCycle
            )
          }
        },
        {
          name: '恢复生命周期',
          perm: 'addTask',
          fn: scope => {
            this.reLife([
              { storeId: scope.row.storeId, sellerSku: scope.row.sellerSku }
            ])
          }
        }
      ],
      editBtns: [
        {
          name: '添加',
          perm: 'add',
          // showLoading: true
          fn: () => {
            this.addPro()
          }
        },
        {
          name: '导入',
          perm: 'add',
          icon: 'el-icon-upload2',
          type: 'dropdown',
          btns: [
            {
              name: '导入本地库存',
              perm: 'add',
              fn: () => {
                this.impLocalIvt()
              }
            }
          ]
        },
        {
          name: '导出',
          showLoading: true,
          perm: 'add',
          type: 'plain',
          icon: 'el-icon-download',
          fn: () => {
            return this._export()
          }
        }
      ]
    }
  },

  created() {
    this.$store.dispatch('storeInfo/getStoreList').then(data => {
      this.searchFields.storeId.options = data
    })
  },

  methods: {
    tableRowClassName(row) {
      if (!this.selectTran.label) {
        return ''
      }
      // console.log(row)
      if (row.row.transportType !== this.selectTran.label) {
        return '__none'
      }
    },

    renderRestTable(h, scope) {
      const columns = [
          { label: '批次号', value: 'batchNumber' },
          { label: '补货时间', value: 'replenishTime', width: 150 },
          { label: '数量', value: 'count' },
          { label: '备货剩余天数', value: 'replenishRemainingDays', width: 120 }
        ],
        tableData = [{}]
      return (
        <el-popover
          open-delay={300}
          trigger="hover"
          onShow={() => {
            if (!scope.row.__hasList) {
              const { storeId, sellerSku } = scope.row
              let params = {
                storeId,
                sellerSku
              }
              this.$set(scope.row, '__loading', true)
              this.$api[`fba/FbaReplenishProductNowReplenishList`](params).then(
                data => {
                  this.$set(scope.row, '__loading', false)
                  this.$set(scope.row, '__list', data.row)
                  this.$set(scope.row, '__hasList', true)
                }
              )
            }
          }}
          placement="right"
        >
          <yt-table
            vLoading={scope.row.__loading}
            selection={false}
            columns={columns}
            data={tableData}
          ></yt-table>
          <el-button slot="reference" type="text">
            {32}
          </el-button>
        </el-popover>
      )
    },
    handleLeftBatchChange(val, sel) {
      let datas = sel.map(el => ({
        storeId: el.storeId,
        sellerSku: el.sellerSku
      }))
      switch (val[0]) {
        case '补货':
          this.rep({ data: datas })
          break
        case '设置生命周期':
          this.setLifeCycle(val[0], datas)
          break
        case '恢复生命周期':
          this.reLife(datas)
          break
        case '修改价格':
          this.modify(
            val[0],
            sel.map(el => ({
              sellerSku: el.sellerSku,
              storeId: el.storeId,
              price: el.price
            })),
            1
          )
          break
        case '设置滞销预警天数':
          this.modify(
            val[0],
            sel.map(el => ({
              sellerSku: el.sellerSku,
              storeId: el.storeId,
              warningDays: undefined
            })),
            2
          )
          break
        case '创建FBA发货计划':
          // FIXME:后面再做
          break
        case '删除':
          this.showTips({ msg: '此操作将删除产品, 是否继续?' }, () => {
            return this.$api[`fba/FbaReplenishProductDelete`]({
              data: datas
            })
          })
          break
        case '导出':
          this._export()
          break

        default:
          break
      }
    },
    reLife(datas) {
      this.showTips({ msg: '此操作将恢复生命周期, 是否继续?' }, () => {
        return this.$api[`fba/FbaReplenishProductSetLifeCycle`]({
          data: datas.map(el => ({
            ...el,
            lifeCycle: -1
          }))
        })
      })
    },
    _export() {
      this.topBatchBtn.loading = true
      return this.$api[`fba/FbaReplenishProductExportList`](this.searchData)
        .then(data => {
          this.topBatchBtn.loading = false
          downloadFile(data, 'FBA产品列表.xlsx')
        })
        .catch(() => {
          this.topBatchBtn.loading = false
        })
    },
    impLocalIvt() {
      this.$_dialog({
        fullscreen: false,
        size: 'large',
        title: '导入本地库存',
        params: {
          data: (this.$refs.layout.selection.length
            ? this.$refs.layout.selection
            : this.$refs.layout.dataList
          ).map(e => ({ storeId: e.storeId, sellerSku: e.sellerSku }))
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/impLocalIvt')
      })
    },
    modify(title, data, type) {
      this.$_dialog({
        size: 'medium',
        title,
        params: { data, type },
        cancelBtnText: '取消',
        okBtnText: '保存',
        component: () => import('./dialogs/modifyPrice.vue')
      })
    },

    addPro() {
      this.$_dialog({
        size: 'medium',
        title: '添加产品',
        params: {},
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/addPro.vue')
      })
    },

    setLifeCycle(title, data, lifeCircle) {
      this.$_dialog({
        size: 'medium',
        title,
        params: {
          data,
          lifeCircle
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/setLifeCycle.vue')
      })
    },

    rep({ data }) {
      this.$router.push({
        path: '/shopManage/fba/rep',
        query: {
          data: data.map(e => e.storeId + '_-_' + e.sellerSku),
          transportId: this.selectTran.value
        }
      })
    },

    handleCommand(command) {
      switch (command) {
        case 'a':
          // 生命周期管理
          this.$router.push({
            path: '/shopManage/fba/lifecycle'
          })
          break
        case 'b':
          // 运输方式
          this.$router.push({
            path: '/shopManage/fba/shipping'
          })
          break
        case 'c':
          // 补货记录
          this.$router.push({
            path: '/shopManage/fba/reprecord'
          })
          break
        case 'd':
          // 发货计划
          this.$router.push({
            path: '/shopManage/fba/plan'
          })
          break

        case 'e':
          // 设置滞销预警天数
          this.$_dialog({
            size: 'medium',
            title: '设置滞销预警',
            params: {},
            cancelBtnText: '取消',
            okBtnText: '确认',
            component: () => import('./dialogs/warning.vue')
          })
          break

        default:
          break
      }
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