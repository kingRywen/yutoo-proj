
<template>
  <main-layout
    :key="key"
    :outerParams="{...storeInfo, siteId: curSiteId}"
    :searchFields="searchFields"
    :columns="columns"
    :url="apiName"
    ref="layout"
    :checkStrictly="false"
    :object-merge="true"
    reserveSelection="asin"
    editWidth="200px"
    @searchTrueData="val => searchData = val"
    :edit-btns="edits"
    :right-edit-btns="rightEditBtns"
    :btnTip="true"
    tbRightFixed="right"
    :treeTable="treeTable"
    :treeTableOtions="treeTableOtions"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
  >
    <div slot="btnTip">
      1、这里仅展示自己店铺的跟卖数据；
      <br />2、“数据更新频率-跟卖数据”定时器只会更新“跟卖库”的跟卖数据（不含基础数），并更新“源更新时间”和“目标更新数据”。
    </div>
  </main-layout>
</template>
<script>
import selectMixin from '../../selectMixin'
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
    let vm = this
    return {
      searchData: {
        displayType: true
      },
      key: '1111',
      // apiName: 'ss/sellingLibAllProductList',
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
            label: '修改跟卖策略'
          },
          {
            label: '同步发货方式'
          },
          {
            label: '删除'
          }
        ]
      },
      rightEditBtns: [
        {
          name: '编辑跟卖设置',
          perm: 'add',
          fn: () => {
            this.editSell()
          }
        }
      ],
      edits: [
        {
          name: '修改跟卖策略',
          perm: 'add',
          fn: scope => {
            this.editStrage([scope.row])
          }
        },
        {
          name: '删除',
          perm: 'add',
          fn: scope => {
            this.del([scope.row])
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
            // vm.apiName = data.displayType
            //   ? 'ss/sellingLibAllProductList'
            //   : 'ss/sellingLibChildProductList'
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
          label: '是否跨站',
          labelWidth: 80,
          hidden: true,
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
        sellerId: {
          hidden: true,
          label: '店铺名称',
          labelWidth: 80,
          widget: 'select',
          options: () => this.getStoreList()
        },

        firstStatus: {
          width: 140,
          labelWidth: 82,
          label: '抓取状态',
          hidden: true,
          widget: 'select',
          options: this.$const['SS/firstStatus']
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
      },
      columns: [
        {
          label: '序号',
          fixed: 'left',
          expand: true,
          width: 50,
          type: 'index'
        },
        {
          label: 'ASIN',
          numField: 'skuCnt',
          fixed: 'left',
          value: 'asin',
          url: true,
          expand: true,
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
            return this.$api[`ss/sellingLibGetChildProductList`](params).then(
              data => data.data
            )
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
          width: 70,
          value: 'site',
          // eslint-disable-next-line no-unused-vars
          render: h => {
            return <span>{this.curSiteName}</span>
          }
        },
        {
          label: '源站点',
          width: 70,
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
          label: '库存',
          value: 'localStockQty'
        },
        {
          label: '跟卖店铺',
          width: 100,
          headerTooltip: '仅自己店铺',
          value: 'sellerCnt',
          url: true,
          isClick: scope => {
            return (
              (scope.row._level !== 1 &&
                scope.row.sellerCnt !== 0 &&
                scope.row.sellerCnt != null) ||
              !this.searchData.displayType
            )
          },
          btnClick: scope => {
            this.$_dialog({
              size: 'medium',
              title: '跟卖店铺列表',
              params: { asin: scope.row.asin },
              cancelBtnText: '关闭',
              component: () => import('./storeList.vue')
            })
          }
        },
        {
          label: '跟卖数量',
          headerTooltip: '仅自己店铺',
          width: 100,
          sortable: 'custom',
          value: 'sellingCnt',
          url: true,
          isClick: scope => {
            return (
              (scope.row._level !== 1 &&
                scope.row.sellingCnt !== 0 &&
                scope.row.sellingCnt != null) ||
              !this.searchData.displayType
            )
          },
          btnClick: scope => {
            this.$_dialog({
              size: 'medium',
              title: '跟卖列表',
              params: {
                siteId: this.curSiteId,
                platformId: this.storeInfo.platformId,
                type: 'lib',
                parentAsin: scope.row.parentAsin,
                asin: scope.row.asin
              },
              cancelBtnText: '关闭',
              component: () =>
                import('Views/modules/ss/vallib/Index/dialogs/sellList.vue')
            })
          }
        },
        {
          label: '抓取状态',
          width: 80,
          value: 'firstStatus',
          _enum: this.cfuns.arrayToObj(this.$const['SS/firstStatus'])
        },
        {
          label: '抓取请求时间',
          width: 150,

          value: 'firstRequestTime'
        },
        // {
        //   label: '源更新时间',
        //   headerTooltip: '仅更新跟卖数据',
        //   width: 150,

        //   value: 'srcUpdateTime'
        // },

        {
          label: '跟卖更新时间',
          width: 150,
          value: 'updateTime'
        },
        {
          label: '跟卖创建时间',
          width: 150,
          value: 'createTime'
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
    apiName(searchData) {
      return searchData.displayType
        ? 'ss/sellingLibAllProductList'
        : 'ss/sellingLibChildProductList'
    },
    getStoreList(info) {
      const asin = this.$refs.layout.searchData.searchText
      let params = { ...this.storeInfo, asin, ...info }
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
        case '修改跟卖策略':
          sel = this.selectC(sel)
          if (!sel) {
            return
          }
          this.editStrage(sel)
          break
        case '删除':
          asins = this.selectB(sel)
          if (!asins) {
            return
          }
          this.del(sel, asins)
          break
        case '同步发货方式':
          asins = this.selectB(sel)
          if (!asins) {
            return
          }
          this.sync(sel, asins)
          break

        default:
          break
      }
    },
    sync(sel, asins) {
      // if (sel.find(e => e._level == 1) && sel.find(e => e._level == 2)) {
      //   this.$message.warning('只能全部选择父产品或者全部选择子产品')
      //   return
      // }
      this.showTips({ msg: '此操作将同步跟卖发货方式, 是否继续?' }, () => {
        return this.$api[`ss/sellingSyncFbpFlag`]({
          ...this.storeInfo,
          asins: asins || sel.map(e => e.asin || e.parentAsin),
          type:
            sel[0]._level == 1 && this.$refs.layout.searchData.displayType
              ? 1
              : 0
        })
      })
    },
    editSell() {
      this.$_dialog({
        size: 'medium',
        title: '编辑跟卖设置',
        params: {
          siteId: this.curSiteId
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./editSell.vue')
      })
    },
    editStrage(sel) {
      this.cleanData(sel)
      this.$_dialog({
        size: 'medium',
        title: '修改跟卖策略',
        params: {
          sel: JSON.parse(JSON.stringify(sel)),
          curSiteId: this.curSiteId,
          getStoreList: this.getStoreList.bind(this)
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () =>
          import('Views/modules/ss/vallib/Index/dialogs/sellWith.vue')
      })
    },
    del(sel, asins) {
      // if (sel.find(e => e._level == 1) && sel.find(e => e._level == 2)) {
      //   this.$message.warning('只能全部选择父产品或者全部选择子产品')
      //   return
      // }
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`ss/sellingRemoveLib`]({
          ...this.storeInfo,
          asins: asins || sel.map(e => e.asin || e.parentAsin),
          type:
            sel[0]._level == 1 && this.$refs.layout.searchData.displayType
              ? 1
              : 0
        })
      })
    }
  },
  watch: {
    'searchData.displayType': {
      immediate: true,
      handler(val) {
        this.columns[1].expand = val
      }
    }
  }
}
</script>
