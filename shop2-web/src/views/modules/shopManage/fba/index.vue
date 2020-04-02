<template>
  <div>
    <main-layout
      :outerParams="storeInfo"
      :searchFields="searchFields"
      :columns="columns"
      @searchTrueData="val => searchData = val"
      @requestSuccess="handleRequestSuccess"
      edit-width="160px"
      showFilter
      :scroll="true"
      :spanMethod="spanMethod"
      :sortType="1"
      :fixedMinusOne="true"
      :big-data="true"
      reserveSelection="asin"
      tbRightFixed="right"
      :right-edit-btns="editBtns"
      :edit-btns="edits"
      :topBatchBtn="topBatchBtn"
      :treeTable="true"
      :checkStrictly="false"
      :treeTableOtions="treeTableOtions"
      :customSortFunc="customSortFunc"
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
        <el-dropdown-item command="f">FBA管理</el-dropdown-item>
        <el-dropdown-item command="c">补货记录</el-dropdown-item>
        <el-dropdown-item command="d">发货计划</el-dropdown-item>
        <el-dropdown-item command="a">生命周期管理</el-dropdown-item>
        <el-dropdown-item command="b">运输方式</el-dropdown-item>
        <el-dropdown-item command="e">设置滞销预警天数</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import { timeField, getSearchNumField } from 'Utils/table-render.js'
import { downloadCsv,downloadFile } from 'Utils'
import mixin from './mixin'
import dropdownMixin from './dropdown-mixin'
import { mapActions, mapMutations } from 'vuex'
export default {
  mixins: [mixin, dropdownMixin],
  data() {
    let asyncFunc = (row, p) => {
      let params = {
        ...this.searchData,
        ...this.$refs.layout.sortData,
        ...p,
        parentSellerSku: row.sellerSku,
        parentAsin: row.asin
      }
      return this.$api[`fba/fbaReplenishProductListVariation`](params).then(
        data => data.rows
      )
    }
    return {
      asyncFunc,
      searchData: {},
      treeTableOtions: {
        childs: 'childs',
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
        storeId: {
          widget: 'select',
          options: [],
          // hidden: true,
          labelWidth: '55px',
          label: '店铺'
        },
        sale: getSearchNumField.call(this, '销量范围', 'sale', '80px'),
        lifeCircle: {
          widget: 'select',
          labelWidth: '110px',
          hidden: true,
          options: this.$const['FBA/lifecircles'],
          label: '产品生命周期'
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
          numField: 'childCount',
          fixed: 'left',
          noTooltip: true,
          
          width: 340,
          expand: true,
          async: true,
          asyncFunc
        },
        {
          label: 'ASIN',
          value: 'asin',
          width: 140
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
          value: 'storeName'
        },
        {
          label: '价格',
          width: 120,
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
          width: 120,
          sortable: 'custom',
          value: 'allLackCount'
        },
        {
          label: '待补数量',
          width: 120,
          
          headerTooltip: '还需要补货的数量',
          sortable: 'custom',
          value: 'waitReplenishCount'
        },
        {
          label: '在补数量',
          
          width: 120,
          headerTooltip: '确认并导出补货的数量，点击查看具体批次号',
          sortable: 'custom',
          value: 'qtyNowReplenish',
          render: this.renderRestTable('qtyNowReplenish')
        },
        {
          label: '剩余备货天数',
          
          width: 140,
          headerTooltip:
            '只展示1个备货剩余时间最少的，鼠标移入可以展示所有批次的剩余时间',
          sortable: 'custom',
          value: 'lastSendDays',
          render: this.renderRestTable('lastSendDays')
        },
        {
          label: '保底天数',
          width: 110,
          sortable: 'custom',
          value: 'daysInsured'
        },
        {
          label: '运输天数',
          width: 110,
          sortable: 'custom',
          value: 'daysShipping'
        },
        {
          label: '备货天数',
          width: 110,
          sortable: 'custom',
          value: 'daysStock'
        },
        {
          label: '本地库存',
          width: 110,
          sortable: 'custom',
          value: 'qtyLocalInventory'
        },
        {
          label: '总库存',
          width: 110,
          sortable: 'custom',
          value: 'qtyAll'
        },
        {
          sortable: 'custom',
          width: 110,
          label: 'FBA总库存',
          value: 'qtyAllFbaInventory',
          
        },
        {
          label: '可售库存',
          sortable: 'custom',
          width: 110,
          value: 'qtyAvailableSale'
        },
        {
          label: '待接收',
          sortable: 'custom',
          width: 110,
          headerTooltip: '还未到FBA仓库的产品数量',
          value: 'qtySendWaitReceive'
        },
        {
          sortable: 'custom',
          label: '待入库',
          width: 120,
          headerTooltip: '已到达FBA仓库还未入库的产品数量',
          value: 'qtyReceiveWaitIn'
        },
        {
          label: '转运库存',
          width: 120,
          
          sortable: 'custom',
          headerTooltip:
            '转运库存包含【FBA仓库间调货库存】与【FBA正在处理中库存】，已剔除掉FBA订单等待发货的库存',
          value: 'qtyReserved'
        },
        {
          label: '不可售库存',
          
          sortable: 'custom',
          width: 120,
          value: 'nonSalableInventory'
        },
        {
          sortable: 'custom',
          label: '昨日销量',
          width: 110,
          value: 'salesDay',
          render: this.renderSalesDay.bind(this)
        },
        {
          label: '日均销量',
          sortable: 'custom',
          value: 'salesAvg',
          width: 110,
          render: this.renderAva.bind(this)
        },
        {
          label: '可售天数',
          sortable: 'custom',
          // minWidth: 100,
          width: 110,
          headerTooltip: '可售天数=（可售库存+待入库）/ 平均销量',
          value: 'availableSaleDays'
        },
        {
          sortable: 'custom',
          
          width: 140,
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
          width: 110,
          // minWidth: 100,
          sortable: 'custom',
          value: 'orderQtyCancell'
        },
        {
          sortable: 'custom',
          label: '退款订单数',
          // minWidth: 100,
          width: 110,
          value: 'orderQtyReturn'
        },
        {
          label: '退款率',
          width: 110,

          sortable: 'custom',
          value: 'returnRate',
          render(h, scope) {
            const { returnRate } = scope.row
            return <span>{returnRate != null ? returnRate + '%' : '-'}</span>
          }
        },
        {
          label: '滞销预警天数',
          
          width: 110,
          sortable: 'custom',
          value: 'unsalableWarningDays'
        },
        {
          label: '滞销库存',
          sortable: 'custom',
          width: 110,
          value: 'unsalableInventory'
        },
        {
          label: '生命周期',
          value: 'lifeCycle',
          width: 110,
          _enum: this.cfuns.arrayToObj(this.$const['FBA/lifecircles'])
        },
        {
          label: '固定补货天数',
          
          width: 110,
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
              ],
              transportId: scope.row.transportId
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
              scope.row.lifeCycle,
              [scope.row]
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
          icon: 'iconfont icondaoru',
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
          icon: 'iconfont icondaochu',
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
    ...mapActions('fba', ['clearCacheProj']),
    ...mapMutations('fba', ['setSelectedPro']),
    tableRowClassName(row) {
      if (!this.selectTran.label) {
        return ''
      }
      // console.log(row)
      if (row.row.transportType !== this.selectTran.label) {
        return '__none'
      }
    },

    renderRestTable(str) {
      return (h, scope) => {
        const columns = [
          { label: '批次号', value: 'batchNumber', width: 150 },
          { label: '补货时间', value: 'replenishTime', width: 150 },
          { label: '数量', value: 'count' },
          {
            label: '备货剩余天数',
            value: 'replenishRemainingDays',
            render(h, scope) {
              const { replenishRemainingDays } = scope.row
              if (replenishRemainingDays < 0) {
                return (
                  <span class="danger">
                    已延期{Math.abs(replenishRemainingDays)}天
                  </span>
                )
              }
              return <span>{replenishRemainingDays}天</span>
            },
            width: 120
          }
        ]
        if (!scope.row[str]) {
          return <span>-</span>
        }
        // tableData = [{}]
        return (
          <el-popover
            open-delay={300}
            trigger="hover"
            onShow={() => {
              if (!scope.row.__hasList) {
                const { storeId, sellerSku, asin } = scope.row
                let params = {
                  storeId,
                  sellerSku,
                  asin
                }
                this.$set(scope.row, '__loading', true)

                this.$api[`fba/FbaReplenishProductNowReplenishList`](
                  params
                ).then(data => {
                  this.$set(scope.row, '__loading', false)
                  this.$set(scope.row, '__list', data.row)
                  this.$set(scope.row, '__hasList', true)
                })
              }
            }}
            placement="right"
          >
            <yt-table
              vLoading={scope.row.__loading}
              selection={false}
              columns={columns}
              data={scope.row.__list}
            ></yt-table>
            <el-button slot="reference" type="text">
              {scope.row[str]}
            </el-button>
          </el-popover>
        )
      }
    },
    customSortFunc(params) {
      let tableList = this.$refs.layout.tableList
      let expands = tableList.filter(
        e => !!e._expanded && e.childs && e.childs.length
      )
      if (expands.length) {
        // 子元素排序
        Promise.all(expands.map(e => this.asyncFunc(e, params))).then(res => {
          res.forEach((e, index) => {
            expands[index].childs = e
          })
        })
      } else {
        // 主排序
        this.$refs.layout.getList(params)
      }
    },
    handleLeftBatchChange(val, sel) {
      let datas = sel.map(el => ({
        storeId: el.storeId,
        sellerSku: el.sellerSku
      }))
      switch (val[0]) {
        case '补货':
          this.rep({
            data: datas,
            transportId: this.selectTran.value,
            transportLabel: this.selectTran.label
          })
          break
        case '设置生命周期':
          this.setLifeCycle(
            val[0],
            datas,
            sel.length == 1 ? sel[0].lifeCircle : null,
            sel
          )
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
            1,
            sel
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
            2,
            sel
          )
          break
        case '创建FBA发货计划':
          this.createProj(sel)
          break
        case '删除':
          this.showTips({ msg: '此操作将删除产品, 是否继续?' }, () => {
            this.$api[`fba/FbaReplenishProductDelete`]({
              data: datas
            }).then(() => {
              this.$refs.layout.tableList = this.$refs.layout.tableList.filter(
                el => {
                  return !sel.find(e => e.sellerSku == el.sellerSku)
                }
              )
              this.$refs.layout.tableList.forEach(e => {
                if (e.childs) {
                  e.childs = e.childs.filter(c => sel.indexOf(c) == -1)
                }
              })
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
    spanMethod(params) {
      // console.log(params)

      if (
        (params.fixed == 'right' && !params.column.label) ||
        params.column.label == 'left'
      ) {
        if (params.$rowIndex == 0) {
          return { rowspan: 100, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
    },
    async createProj(sel) {
      let hasParent = false
      if (
        sel.filter(el => {
          if (el.variationType == 1) {
            hasParent = true
          }
          return el.storeId === sel[0].storeId
        }).length !== sel.length
      ) {
        return this.$message.warning('只能选择同一店铺下的产品创建')
      }
      if (hasParent) {
        return this.$message.warning('请选择子产品或独立产品')
      }

      await this.clearCacheProj()
      this.setSelectedPro(sel)
      this.$router.push({
        path: '/shopManage/fba/warehouse/create',
        query: {
          storeId: sel[0].storeId,
          storeName: sel[0].storeName
        }
      })
    },
    reLife(datas) {
      this.showTips({ msg: '此操作将恢复生命周期, 是否继续?' }, () => {
        this.$api[`fba/FbaReplenishProductSetLifeCycle`]({
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
          downloadCsv(data)
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
          data: this.$refs.layout.selection.length
            ? this.$refs.layout.selection
            : null
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/impLocalIvt')
      })
    },
    modify(title, data, type, sel) {
      this.$_dialog({
        size: 'medium',
        title,
        // noShowLoading: type == 1,
        params: {
          data,
          type,
          fn: table => {
            sel.map(el => {
              let cur = table.find(e => e.sellerSku == el.sellerSku)
              el[type == 1 ? 'price' : 'unsalableWarningDays'] =
                cur[type == 1 ? 'price' : 'warningDays']
            })
          }
        },
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

    setLifeCycle(title, data, lifeCircle, sel) {
      this.$_dialog({
        size: 'medium',
        title,
        params: {
          data,
          lifeCircle,
          fn: ({ lifeCycle, lifeCycleString }) => {
            sel.map(e => {
              e.lifeCycle = lifeCycle
              e.lifeCycleString = lifeCycleString
            })
          }
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/setLifeCycle.vue')
      })
    },

    rep({ data }) {
      if (!this.selectTran.value) {
        this._openDialog({
          fullscreen: false,
          size: 'medium',
          title: '选择运输方式',
          params: {
            options: this.transportList,
            data
          },
          okBtnText: '确认',
          cancelBtnText: '取消',
          component: () => import('./dialogs/selectTran.vue')
        })
      } else {
        this.$router.push({
          path: '/shopManage/fba/rep',
          query: {
            data: data.map(e => e.storeId + '_-_' + e.sellerSku),
            transportId: this.selectTran.value,
            transportLabel: this.selectTran.transportLabel
          }
        })
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