/*
 * @Author: rywen 
 * @Date: 2020-03-02 15:42:31 
 * @Last Modified by: rywen
 * @Last Modified time: 2020-04-08 15:10:11
 */
<template>
  <main-layout
    :key="key"
    :outerParams="{...storeInfo, siteId: $store.state.selling.curSiteId}"
    :searchFields="searchFields"
    :columns="columns"
    :url="apiName"
    ref="layout"
    :btnFn="btnFn"
    :bigData="false"
    reserveSelection="asin"
    :checkStrictly="false"
    :object-merge="true"
    editWidth="230px"
    :edit-btns="edits"
    :right-edit-btns="editBtns"
    @searchTrueData="val => searchData = val"
    :btnTip="true"
    tbRightFixed="right"
    :treeTable="treeTable"
    :treeTableOtions="treeTableOtions"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
  >
    <div slot="btnTip">
      1、从跟卖源加入可跟卖库的产品的基础数据会按“数据更新频率-基础数据”的频率定时更新；
      <br />2、跟卖库的跟卖数据更新，并不会同时更新可跟卖库的跟卖数据，包含：源/目标站点的最低售价、最高售价、跟卖卖家数、跟卖数量、发货方式；
      <br />3、没有填写库存阀值的产品不能跟卖。
    </div>
  </main-layout>
</template>
<script>
import selectMixin from '../../selectMixin'
import { downloadFile } from 'Utils'
import { mapActions } from 'vuex'
export default {
  mixins: [selectMixin],
  computed: {
    sites() {
      return this.$store.getters['storeInfo/currentPlat'].sites || []
    },
    curSiteName() {
      return this.$store.state.selling.curSite.siteName
    },
    curSiteId() {
      return this.$store.state.selling.curSiteId
    }
  },
  data() {
    return {
      editBtns: [
        {
          name: '导出',
          type: 'plain',
          icon: 'iconfont icondaochu',
          perm: 'add',
          fn: () => {
            this._export()
          }
        },
        {
          name: '导入',
          type: 'dropdown',
          icon: 'iconfont icondaoru',
          perm: 'add',
          btns: [
            {
              name: '导入库存/成本',
              perm: 'add',
              fn: () => {
                this.importInvo()
              }
            },
            {
              name: '导入跟卖',
              perm: 'add',
              fn: () => {
                this.importSell()
              }
            }
          ]
        }
      ],
      searchData: {
        displayType: true
      },
      key: '1111',
      // apiName: 'ss/sellingMaybeAllProductList',
      treeTable: true,
      treeTableOtions: {
        childs: 'childrens',
        expandFunc: row => {
          return row._level == 1
        }
      },
      topBatchBtn: {
        title: '项',
        options: [
          {
            label: '加入分组',
            hidden: false
          },
          {
            label: '加入跨站点可跟卖库'
          },
          {
            label: '重新抓取源数据',
            hidden: false
          },
          {
            label: '重新校验'
          },
          {
            label: '修改成本'
          },
          {
            label: '修改库存'
          },
          {
            label: '修改库存阀值'
          },
          {
            label: '跟卖'
          },
          {
            label: '删除'
          }
        ]
      },
      edits: [
        {
          name: '加入跨站点可跟卖库',
          perm: 'add',
          fn: scope => {
            this.addToSite([scope.row])
          }
        },
        {
          name: '跟卖',
          perm: 'add',
          fn: scope => {
            this.sellWith([scope.row])
          }
        },
        {
          name: '重新抓取源数据',
          perm: 'add',
          fn: scope => {
            this.reCrawl([scope.row])
          }
        },
        {
          name: '重新校验',
          perm: 'add',
          fn: scope => {
            this.reCheck([scope.row])
          }
        },
        {
          name: '修改成本',
          perm: 'add',
          fn: scope => {
            this.editCost([scope.row])
          }
        },
        {
          name: '修改库存',
          perm: 'add',
          fn: scope => {
            this.editStorage([scope.row])
          }
        },
        {
          name: '修改库存阀值',
          perm: 'add',
          fn: scope => {
            this.editThreshold([scope.row])
          }
        }
      ],
      searchFields: {
        searchText: { labelWidth: 50, label: 'ASIN' },
        displayType: {
          label: '展示方式',
          widget: 'select',
          // labelWidth: 70,
          // width: 100,
          clearable: false,
          defaultVal: true,
          options: [
            {
              label: '父视图',
              value: true
            },
            {
              label: '子视图',
              value: false
            }
          ]
        },
        sameFlag: {
          hidden: true,
          label: '是否跨站',
          labelWidth: 70,
          // width: 100,
          widget: 'select',

          options: [
            {
              label: '同站点',
              value: true
            },
            {
              label: '跨站点',
              value: false
            }
          ]
        },

        checkStatus: {
          hidden: true,
          width: 140,
          labelWidth: 100,
          label: '校验状态',
          widget: 'select',
          options: this.$const['SS/checkStatus'],
          tip: {
            content: '目标站点'
          }
        },
        saleFlag: {
          hidden: true,
          label: '销售状态',
          labelWidth: 100,
          widget: 'select',
          options: [
            {
              label: '在售',
              value: true
            },
            {
              label: '不可售',
              value: false
            }
          ],
          tip: {
            content: '源站点'
          }
        },
        groupId: {
          label: '分组',
          hidden: true,
          labelWidth: '50px',
          widget: 'select',
          options: () => this.getGroups()
        },
        srcSiteId: {
          hidden: true,
          label: '源站点',
          labelWidth: 70,
          widget: 'select',
          bind: {
            label: 'siteName',
            value: 'siteId'
          },
          options: () => Promise.resolve(this.sites)
        }

        // sellingSellerIds: {
        //   hidden: true,
        //   label: '已上架店铺',
        //   labelWidth: 96,
        //   widget: 'select',
        //   multi: true,
        //   options: () => this.getStoreList(true)
        // },
        // noSellingSellerIds: {
        //   hidden: true,
        //   label: '未上架店铺',
        //   labelWidth: 96,
        //   multi: true,
        //   widget: 'select',
        //   options: () => this.getStoreList(false)
        // }
      },
      columns: [
        {
          label: '序号',
          fixed: 'left',
          width: 50,
          type: 'index'
        },
        {
          label: 'ASIN',
          fixed: 'left',
          value: 'asin',
          url: true,
          expand: true,
          numField: 'skuCnt',
          async: true,
          asyncFunc: row => {
            const params = {
              ...this.storeInfo,
              siteId: this.curSiteId,
              ...this.searchData,
              sort: undefined,
              field: undefined,
              displayType: undefined,
              pageSize: undefined,
              pageNumber: undefined,
              parentAsin: row.asin
            }
            return this.$api[`ss/sellingMayBeGetChildProductList`](
              params
            ).then(data => data.data.map(e => ({ ...e, isChild: true })))
          },
          btnClick: scope => {
            window.open(
              this.$store.state.selling.curSite.asinUrl +
                scope.row['asin'] +
                (this.searchData.displayType &&
                scope.row.parentAsin === scope.row.asin
                  ? ''
                  : '?psc=1')
            )
          },
          width: 180
        },
        {
          label: '站点',
          width: 90,
          value: 'site',
          // eslint-disable-next-line no-unused-vars
          render: h => {
            return <span>{this.curSiteName}</span>
          }
        },
        {
          label: '源站点',
          width: 90,
          value: 'srcSiteName'
        },
        {
          label: '父ASIN',
          noDisplay: false,
          width: 140,
          value: 'parentAsin'
        },
        {
          label: '主图',
          value: 'imageUrl',
          img: true,
          link: row => {
            return this.$store.state.selling.curSite.asinUrl + row['asin']
          },
          title: 'title',
          width: 70
        },
        {
          label: '品牌名',
          width: 120,
          value: 'brand'
        },
        {
          label: '销售状态',
          width: 80,
          value: 'saleFlag',
          _enum: {
            true: '在售',
            false: '不可售'
          }
        },
        {
          label: '大类BSR',
          width: 80,
          value: 'bsr'
        },
        {
          label: '新增评价数',
          width: 110,
          headerTooltip: '近30天新增评价数',
          sortable: 'custom',
          value: 'newReviewCnt'
        },
        {
          label: '评价数',
          width: 80,
          noDisplay: false,
          sortable: 'custom',
          value: 'reviewCnt'
        },
        {
          label: '评分',
          noDisplay: false,
          width: 80,
          sortable: 'custom',
          value: 'starCnt'
        },
        {
          label: '最低售价',
          width: 133,
          sortable: 'custom',
          money: true,
          symbol: row => {
            return row.srcSiteId
          },
          value: 'minPrice'
        },
        {
          label: '最高售价',
          width: 133,
          symbol: row => {
            return row.srcSiteId
          },
          money: true,
          sortable: 'custom',
          value: 'maxPrice'
        },
        {
          label: '跟卖卖家数',
          sortable: 'custom',
          width: 100,
          value: 'sellerCnt'
        },
        {
          label: '跟卖数量',
          width: 80,
          sortable: 'custom',
          value: 'sellingCnt',
          isClick: scope => {
            return (
              (scope.row._level !== 1 &&
                scope.row.sellingCnt !== 0 &&
                scope.row.sellingCnt != null) ||
              !this.searchData.displayType
            )
          },
          url: true,
          btnClick: scope => {
            const { asin, srcSiteId } = scope.row
            this.$_dialog({
              size: 'medium',
              title: '跟卖列表',
              params: {
                asin,
                // 站点ID 和配送ID都是源站点
                siteId: srcSiteId,
                deliverySiteId: srcSiteId
              },
              cancelBtnText: '关闭',
              // okBtnText: '确认',
              component: () => import('./dialogs/followList.vue')
            })
          }
        },
        {
          label: 'FBA',
          width: 100,
          value: 'fbpFlag',
          _enum: {
            0: '否',
            '>=1': '是'
          }
        },
        {
          label: 'FBM',
          width: 100,
          value: 'fbpFlag',
          _enum: {
            0: '是',
            1: '否',
            '2': '是'
          }
        },
        {
          label: '抓取方式',
          width: 80,
          value: 'dataType',
          _enum: ['类目', '关键词', '店铺ID', 'ASIN']
        },
        {
          label: '抓取创建时间',
          width: 150,
          value: 'createTime'
        },
        {
          label: '请求更新时间',
          width: 150,
          value: 'requestTime'
        },
        {
          label: '基础数据更新时间',
          width: 150,
          value: 'baseUpdateTime'
        },
        {
          label: '跟卖数据更新时间',
          width: 150,
          value: 'updateTime'
        },
        {
          label: '加入时间',
          width: 150,
          value: 'targetCreateTime'
        },
        {
          label: '采购价(美元)',
          width: 100,
          money: 'us',
          value: 'purchasePrice'
        },
        {
          label: '运费(美元)',
          width: 100,
          money: 'us',
          value: 'fare'
        },
        {
          label: '库存',
          width: 80,
          value: 'localStockQty'
        },
        {
          label: '库存阀值',
          width: 80,
          value: 'stockThreshold'
        },
        {
          label: '校验状态',
          width: 80,
          value: 'checkStatus',
          _enum: this.cfuns.arrayToObj(this.$const['SS/checkStatus'])
        },
        {
          label: '是否跨站配送',
          width: 100,
          value: 'deliveryCrossFlag',
          _enum: {
            true: '是',
            false: '否'
          }
        },
        {
          label: 'FBA跨站运费',
          width: 100,
          sortable: 'custom',
          value: 'fareCrossFba'
        },
        {
          label: '跨站最低售价',
          width: 100,
          sortable: 'custom',
          money: true,
          symbol: row => {
            return row.srcSiteId
          },
          value: 'crossMinPrice'
        },
        {
          label: '跨站最高售价',
          width: 100,
          money: true,
          symbol: row => {
            return row.srcSiteId
          },
          sortable: 'custom',
          value: 'crossMaxPrice'
        },
        {
          label: '跨站跟卖卖家数',
          width: 120,
          sortable: 'custom',

          value: 'crossSellerCnt'
        },
        {
          label: '跨站跟卖数量',
          width: 100,
          sortable: 'custom',
          value: 'crossSellingCnt',
          url: true,
          isClick: scope => {
            return (
              (scope.row._level == 1 &&
                scope.row.crossSellingCnt !== 0 &&
                scope.row.crossSellingCnt != null) ||
              !this.searchData.displayType
            )
          },
          btnClick: scope => {
            const { asin, srcSiteId } = scope.row
            this.$_dialog({
              size: 'medium',
              title: '跨站跟卖列表',
              params: {
                asin,
                // 站点ID为源站点，配送站点为目标站点
                siteId: srcSiteId,
                deliverySiteId: this.curSiteId
              },
              cancelBtnText: '关闭',
              // okBtnText: '确认',
              component: () => import('./dialogs/followList.vue')
            })
          }
        },
        {
          label: '目标最低售价',
          width: 110,
          sortable: 'custom',
          money: true,
          symbol: () => {
            return this.curSiteId
          },
          value: 'targetMinPrice'
        },
        {
          label: '目标最高售价',
          width: 110,
          money: true,
          symbol: () => {
            return this.curSiteId
          },
          sortable: 'custom',
          value: 'targetMaxPrice'
        },
        {
          label: '目标跟卖卖家数',
          width: 120,
          sortable: 'custom',
          value: 'targetSellerCnt'
        },
        {
          label: '目标跟卖数量',
          width: 110,
          sortable: 'custom',
          value: 'targetSellingCnt',
          url: true,
          isClick: scope => {
            return (
              (scope.row._level == 1 &&
                scope.row.targetSellingCnt !== 0 &&
                scope.row.targetSellingCnt != null) ||
              !this.searchData.displayType
            )
          },
          btnClick: scope => {
            const { asin } = scope.row
            this.$_dialog({
              size: 'medium',
              title: '跟卖列表',
              params: {
                asin,
                // 站点ID为目标站点，配送站点为目标站点
                siteId: this.curSiteId,
                deliverySiteId: this.curSiteId
              },
              cancelBtnText: '关闭',
              // okBtnText: '确认',
              component: () => import('./dialogs/followList.vue')
            })
          }
        },
        {
          label: '目标请求更新时间',
          width: 150,
          value: 'targetRequestTime'
        },
        {
          label: '目标数据更新时间',
          width: 150,
          value: 'targetUpdateTime'
        },
        {
          label: '分组',
          width: 150,
          value: 'groupName'
        }
      ]
    }
  },

  watch: {
    'searchData.displayType': {
      immediate: true,
      handler(val) {
        let vm = this
        vm.columns[1].expand = val
        if (val) {
          this.columns[10].noDisplay = false
          this.columns[4].noDisplay = true
          this.columns[11].noDisplay = false
          this.topBatchBtn.options[0].hidden = false
          this.topBatchBtn.options[2].hidden = false
        } else {
          this.columns[10].noDisplay = false
          this.columns[4].noDisplay = false
          this.columns[11].noDisplay = false
          this.topBatchBtn.options[0].hidden = true
          this.topBatchBtn.options[2].hidden = true
        }
        let changed = [
          'fareCrossFba',
          'crossMinPrice',
          'crossMaxPrice',
          'crossSellerCnt',
          'crossSellingCnt',
          'targetMinPrice',
          'targetMaxPrice',
          'targetSellerCnt',
          'targetSellingCnt'
        ]
        this.columns.map(el => {
          if (changed.indexOf(el.value) > -1) {
            el.sortable = val ? false : 'custom'
            // this.$refs.layout && this.$refs.layout.refreshTable()
          }
        })
      }
    }
  },

  methods: {
    ...mapActions('storeInfo', ['getStoreList']),
    importSell() {
      this.$_dialog({
        size: 'medium',
        title: '导入跟卖',
        params: {
          isImport: true,
          sel: [],
          curSiteId: this.curSiteId,
          getStoreList: this.getStoreList
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/sellWith.vue')
      })
    },
    importInvo() {
      this.$_dialog({
        size: 'medium',
        fullscreen: false,
        title: '导入库存/成本',
        params: {
          query: {
            importType: 8
          }
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/importInvo.vue')
      })
    },
    _export() {
      let parentAsins,
        asins,
        sel = this.$refs.layout.selection
      if (sel.length) {
        parentAsins = this.getAsins(this.getParents(sel))
        asins = this.getAsins(this.getChilds(sel))
      }
      this.$api[`ss/sellingMaybeChildProductExport`]({
        ...this.searchData,
        exportType: 1,
        parentAsins,
        asins,
        pageNumber: null,
        pageSize: null
      }).then(data => {
        downloadFile(data)
      })
    },
    apiName(searchData) {
      return searchData.displayType
        ? 'ss/sellingMaybeAllProductList'
        : 'ss/sellingMaybeChildProductList'
    },
    btnFn(row) {
      if (!row.isChild) {
        return [1]
      } else {
        return [2, 3, 4, 5, 6, 7]
      }
    },
    getStoreList({ fareTempFlag }) {
      const asin = this.$refs.layout.searchData.searchText
      let params = { ...this.storeInfo, fareTempFlag, asin }
      return this.$api[`ss/sellingMySellerList`](params).then(data =>
        data.data.map(e => ({ label: e.sellerAlias, value: e.sellerId }))
      )
    },
    getGroups() {
      if (!this._groups) {
        return this.$api[`ss/sellingGroupList`]({
          pageSize: 10000,
          pageNumber: 1,
          platformId: this.storeInfo.platformId
        }).then(data => {
          return (this._groups = data.rows.map(e => ({
            label: e.groupName,
            value: e.groupId
          })))
        })
      }
      return Promise.resolve(this._groups)
    },
    handleLeftBatchChange(val, sel) {
      let asins
      switch (val[0]) {
        case '加入分组':
          asins = this.selectA(sel)
          if (!asins) {
            return
          }
          this.addGroup(sel, asins)
          break
        case '加入跨站点可跟卖库':
          asins = this.selectB(sel)
          if (!asins) {
            return
          }
          this.addToSite(sel, asins)
          break
        case '重新抓取源数据':
          asins = this.selectA(sel)
          if (!asins) {
            return
          }
          this.reCrawl(sel, asins)
          break
        case '重新校验':
          asins = this.selectB(sel)
          if (!asins) {
            return
          }
          this.reCheck(sel, asins)
          break
        case '修改成本':
          asins = this.selectC(sel)
          if (!asins) {
            return
          }
          this.editCost(asins)
          break
        case '修改库存':
          asins = this.selectC(sel)
          if (!asins) {
            return
          }
          this.editStorage(asins)
          break
        case '修改库存阀值':
          asins = this.selectC(sel)
          if (!asins) {
            return
          }
          this.editThreshold(asins)
          break
        case '跟卖':
          asins = this.selectC(sel)
          if (!asins) {
            return
          }
          this.sellWith(asins)
          break
        case '删除':
          asins = this.selectB(sel)
          if (!asins) {
            return
          }
          this.del(sel, asins)
          break

        default:
          break
      }
    },
    addGroup(sel, asins) {
      const parentAsins =
        asins || sel.filter(e => e._level == 1).map(e => e.parentAsin || e.asin)

      this.$_dialog({
        size: 'medium',
        title: '加入分组',
        params: {
          getGroups: this.getGroups.bind(this),
          parentAsins
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/addGroup.vue')
      })
    },
    addToSite(sel, asins) {
      if ([...new Set(sel.map(el => el.srcSiteId))].length > 1) {
        return this.$message.warning('只能操作同一源站点的产品')
      }
      const parentAsins = asins || sel.map(e => e.parentAsin || e.asin)
      this.$_dialog({
        size: 'medium',
        title: '加入跨站点可跟卖库',
        params: {
          srcSiteId: sel[0].srcSiteId,
          curSiteId: this.curSiteId,
          asins: parentAsins,
          type:
            sel[0]._level == 1 && this.$refs.layout.searchData.displayType
              ? 1
              : 0
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/addLib.vue')
      })
    },
    del(sel, asins) {
      this.commonReq(sel, 'sellingRemoveTarget', '删除数据', asins)
    },

    sellWith(sel) {
      this.cleanData(sel)
      this.$_dialog({
        size: 'medium',
        title: '跟卖',
        params: {
          curSiteId: this.curSiteId,
          getStoreList: this.getStoreList.bind(this),
          sel: JSON.parse(JSON.stringify(sel))
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/sellWith.vue')
      })
    },
    editThreshold(sel) {
      this.cleanData(sel)
      this.$_dialog({
        size: 'medium',
        title: '修改库存阀值',
        params: { sel: JSON.parse(JSON.stringify(sel)) },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/editThreshold.vue')
      })
    },
    editStorage(sel) {
      this.cleanData(sel)
      this.$_dialog({
        size: 'medium',
        title: '修改库存',
        params: { sel: JSON.parse(JSON.stringify(sel)) },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/editStorage.vue')
      })
    },
    editCost(sel) {
      this.cleanData(sel)
      this.$_dialog({
        size: 'medium',
        title: '修改成本',
        params: { sel: JSON.parse(JSON.stringify(sel)) },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/editCost.vue')
      })
    },
    justParent(sel) {
      if (sel.find(e => e._level == 1)) {
        this.$message.warning('只能选择父产品')
        return
      }
      return true
    },
    reCrawl(sel, asins) {
      this.commonReq(sel, 'sellingReCrawlSrc', '重新抓取源数据', asins)
    },
    reCheck(sel, asins) {
      this.commonReq(sel, 'sellingCheck', '重新校验数据', asins)
    },
    commonReq(sel, api, name, asins) {
      // if (sel.find(e => e._level == 1) && sel.find(e => e._level == 2)) {
      //   this.$message.warning('只能全部选择父产品或者全部选择子产品')
      //   return
      // }
      this.showTips({ msg: `此操作将${name}, 是否继续?` }, () => {
        let params = {
          ...this.storeInfo,
          siteId: this.curSiteId,
          asins: asins || sel.map(e => e.asin || e.parentAsin),
          type:
            sel[0]._level == 1 && this.$refs.layout.searchData.displayType
              ? 1
              : 0
        }
        return this.$api[`ss/${api}`](params)
      })
    }
  }
}
</script>