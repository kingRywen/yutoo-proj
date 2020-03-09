/*
 * @Author: rywen 
 * @Date: 2020-03-02 15:42:31 
 * @Last Modified by: rywen
 * @Last Modified time: 2020-03-09 12:16:59
 */
<template>
  <main-layout
    :key="key"
    :outerParams="{...storeInfo, siteId: $store.state.selling.curSiteId}"
    :searchFields="searchFields"
    :columns="columns"
    :url="apiName"
    ref="layout"
    :object-merge="true"
    editWidth="200px"
    :edit-btns="edits"
    :btnTip="true"
    tbRightFixed="right"
    :treeTable="treeTable"
    :treeTableOtions="treeTableOtions"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
  >
    <div slot="btnTip">
      1、从跟卖源加入可跟卖库的产品的基础数据会按“数据更新频率-基础数据”的频率定时更新；
      <br />2、跟卖库的跟卖数据更新，并不会同时更新可跟卖库的跟卖数据，包含：源/目标站点的最低售价、最高售价、跟卖卖家数、跟卖数量、发货方式。
    </div>
  </main-layout>
</template>
<script>
export default {
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
    let vm = this
    return {
      key: '1111',
      apiName: 'ss/sellingMaybeAllProductList',
      treeTable: true,
      treeTableOtions: {
        childs: 'childList',
        expandFunc: row => {
          return row.childList && row.childList.length
        }
      },
      topBatchBtn: {
        title: '项',
        options: [
          {
            label: '加入分组'
          },
          {
            label: '加入跨站点可跟卖库'
          },
          {
            label: '重新抓取源数据'
          },
          {
            label: '重新校验'
          },
          {
            label: '修改成本价'
          },
          {
            label: '修改库存'
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
          name: '修改成本价',
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
          change: data => {
            vm.apiName = data.displayType
              ? 'ss/sellingMaybeAllProductList'
              : 'ss/sellingMaybeChildProductList'
            vm.columns[1].expand = data.displayType
          },
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
        srcSaleFlag: {
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
        },

        sellingSellerIds: {
          hidden: true,
          label: '已上架店铺',
          labelWidth: 96,
          widget: 'select',
          multi: true,
          options: () => this.getStoreList(true)
        },
        noSellingSellerIds: {
          hidden: true,
          label: '未上架店铺',
          labelWidth: 96,
          multi: true,
          widget: 'select',
          options: () => this.getStoreList(false)
        }
      },
      columns: [
        {
          label: '序号',
          fixed: 'left',
          expand: true,
          width: 80,
          type: 'index'
        },
        {
          label: 'ASIN',
          fixed: 'left',
          value: 'asin',
          url: true,
          expand: true,
          btnClick: scope => {
            window.open(this.storeUrls.asinUrl + scope.row['asin'])
          },
          width: 140
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
          width: 140,
          value: 'parentAsin'
        },
        {
          label: '主图',
          value: 'imageUrl',
          img: true,
          link: row => {
            return this.storeUrls.asinUrl + row['asin']
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
          label: '评价数',
          width: 80,
          sortable: 'custom',
          value: 'reviewCnt'
        },
        {
          label: '评分',
          width: 80,
          sortable: 'custom',
          value: 'starCnt'
        },
        {
          label: '最低售价',
          width: 80,
          sortable: 'custom',
          value: 'minPrice'
        },
        {
          label: '最高售价',
          width: 80,
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
            return !!scope.row.childList
          },
          url: true,
          btnClick: scope => {
            this.$_dialog({
              size: 'medium',
              title: '跟卖源跟卖列表',
              params: {
                siteId: this.curSiteId,
                srcSiteId: scope.row.srcSiteId,
                asin: scope.row.asin
              },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./dialogs/sellList.vue')
            })
          }
        },
        {
          label: '发货方式',
          width: 100,
          value: 'fbpFlag',
          _enum: this.cfuns.arrayToObj(this.$const['OTHER/fbpFlag'])
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
          label: '成本价(美元)',
          width: 100,
          value: 'cost'
        },
        {
          label: '库存',
          width: 80,
          value: 'localStockQty'
        },
        {
          label: '校验状态',
          width: 80,
          value: 'checkStatus',
          _enum: this.cfuns.arrayToObj(this.$const['SS/checkStatus'])
        },
        {
          label: '跨站运费',
          width: 80,
          sortable: 'custom',
          value: 'targetFare'
        },
        {
          label: '目标最低售价',
          width: 110,
          sortable: 'custom',
          value: 'targetMinPrice'
        },
        {
          label: '目标最高售价',
          width: 110,
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
          btnClick: scope => {
            const { asin, srcSiteId } = scope.row
            this.$_dialog({
              size: 'medium',
              title: '跟卖列表',
              params: {
                asin,
                srcSiteId
              },
              cancelBtnText: '取消',
              okBtnText: '确认',
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
  methods: {
    getStoreList(sellingFlag) {
      const asin = this.$refs.layout.searchData.searchText
      let params = { ...this.storeInfo, sellingFlag, asin }
      return this.$api[`ss/sellingMySellerList`](params).then(data =>
        data.data.map(e => ({ label: e.sellerAlias, value: e.sellerId }))
      )
    },
    getGroups() {
      if (!this._groups) {
        return this.$api[`ss/sellingGroupList`]({
          pageSize: 1,
          pageNumber: 10000,
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
      switch (val[0]) {
        case '加入分组':
          break
        case '加入跨站点可跟卖库':
          this.addToSite(sel)
          break
        case '重新抓取源数据':
          this.reCrawl(sel)
          break
        case '重新校验':
          this.reCheck(sel)
          break
        case '修改成本价':
          this.editCost(sel)
          break
        case '修改库存':
          this.editStorage(sel)
          break
        case '跟卖':
          this.sellWith(sel)
          break
        case '删除':
          this.del(sel)
          break

        default:
          break
      }
    },
    addGroup(sel) {
      const parentAsins = sel.map(e => e.parentAsin || e.asin)
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
    addToSite(sel) {
      if (sel.find(e => e._level == 1) && sel.find(e => e._level == 2)) {
        this.$message.warning('只能全部选择父产品或者全部选择子产品')
        return
      }
      const parentAsins = sel.map(e => e.parentAsin || e.asin)
      this.$_dialog({
        size: 'medium',
        title: '加入跨站点可跟卖库',
        params: {
          srcSiteId: this.$store.state.selling.curSiteId,
          asins: parentAsins,
          type: sel[0]._level == 1 ? 1 : 0
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/addLib.vue')
      })
    },
    del(sel) {
      this.commonReq(sel, 'sellingRemoveTarget', '删除数据')
    },
    sellWith(sel) {
      this.$_dialog({
        size: 'medium',
        title: '跟卖',
        params: {
          curSiteId: this.curSiteId,
          getStoreList: this.getStoreList.bind(this),
          sel
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/sellWith.vue')
      })
    },
    editStorage(sel) {
      this.$_dialog({
        size: 'medium',
        title: '修改库存',
        params: { sel },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/editStorage.vue')
      })
    },
    editCost(sel) {
      this.$_dialog({
        size: 'medium',
        title: '修改成本价',
        params: { sel },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/editCost.vue')
      })
    },
    reCrawl(sel) {
      this.commonReq(sel, 'sellingReCrawlSrc', '重新抓取源数据')
    },
    reCheck(sel) {
      this.commonReq(sel, 'sellingCheck', '重新校验数据')
    },
    commonReq(sel, api, name) {
      if (sel.find(e => e._level == 1) && sel.find(e => e._level == 2)) {
        this.$message.warning('只能全部选择父产品或者全部选择子产品')
        return
      }
      this.showTips({ msg: `此操作将${name}, 是否继续?` }, () => {
        let params = {
          ...this.storeInfo,
          asins: sel.map(e => e.asin || e.parentAsin),
          type: sel[0]._level == 1 ? 1 : 0
        }
        return this.$api[`ss/${api}`](params)
      })
    }
  }
}
</script>