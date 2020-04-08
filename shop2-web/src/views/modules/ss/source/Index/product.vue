<template>
  <div>
    <main-layout
      :key="key"
      :outerParams="{...storeInfo, siteId: $store.state.selling.curSiteId}"
      :searchFields="searchFields"
      :columns="columns"
      :url="apiName"
      :bigData="true"
      @searchTrueData="val => searchData = val"
      ref="layout"
      :object-merge="true"
      :checkStrictly="false"
      :btnFn="btnFn"
      editWidth="200px"
      reserveSelection="asin"
      :right-edit-btns="editBtns"
      :edit-btns="edits"
      tbRightFixed="right"
      :searchFunc="searchFunc"
      :treeTable="treeTable"
      :treeTableOtions="treeTableOtions"
      :topBatchBtn="topBatchBtn"
      :btnTip="true"
      @left-batch-change="handleLeftBatchChange"
    >
      <div slot="btnTip">
        1、父产品从跟卖源加入到可跟卖库之后，数据保持原样
        <br />2、加入可跟卖库的产品的基础数据会按“数据更新频率-基础数据”频率更新，但是跟卖数据不会自动更新
      </div>
    </main-layout>
  </div>
</template>
<script>
import { getSearchNumField, renderCate } from 'Utils/table-render'
import selectMixin from '../../selectMixin'
export default {
  mixins: [selectMixin],
  data() {
    let vm = this
    function setChange(data) {
      if (data.displayType) {
        vm.topBatchBtn.options[1].hidden = false
        vm.columns[2].noDisplay = true
        vm.columns[1].noDisplay = false
        vm.columns[10].noDisplay = false
        vm.columns[9].noDisplay = false
      } else {
        vm.topBatchBtn.options[1].hidden = true
        vm.columns[2].noDisplay = false
        vm.columns[1].noDisplay = false
        vm.columns[10].noDisplay = false
        vm.columns[9].noDisplay = false
      }
      vm.columns[1].expand = data.displayType
    }

    let columns = [
      {
        label: '序号',
        type: 'index',
        fixed: 'left',
        width: 50
      },
      {
        label: 'ASIN',
        fixed: 'left',
        numField: 'skuCnt',
        value: 'asin',
        url: true,
        noDisplay: false,
        expand: true,
        async: true,
        asyncFunc: row => {
          const params = {
            ...this.storeInfo,
            siteId: this.curSiteId,
            srcSiteId: this.curSiteId,
            ...this.searchData,
            sort: undefined,
            field: undefined,
            displayType: undefined,
            pageSize: undefined,
            pageNumber: undefined,
            parentAsin: row.asin
          }
          return this.$api[`ss/sellingSrcGetChildProductList`](params).then(
            data => data.data.map(e => ({ ...e, _isChild: true }))
            // _isChild
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
        label: '父ASIN',
        noDisplay: true,
        value: 'parentAsin',
        width: 120
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
        width: 130,
        noTooltip: true,
        value: 'brand'
      },
      {
        label: '底层类目',
        width: 330,
        // noTooltip: true,
        value: 'category',
        render(h, scope) {
          return renderCate(h, scope)
        }
      },
      {
        label: '销售状态',
        width: 90,
        value: 'saleFlag',
        _enum: {
          true: '在售',
          false: '不可售'
        }
      },
      {
        label: '大类BSR',
        width: 90,
        value: 'bsr'
      },
      {
        label: '新增评价数',
        width: 90,
        headerTooltip: '近30天新增评价数',
        sortable: 'custom',
        value: 'newReviewCnt'
      },
      {
        label: '评价数',
        noDisplay: false,
        width: 90,
        sortable: 'custom',
        value: 'reviewCnt'
      },
      {
        label: '评分',
        width: 90,
        noDisplay: false,
        sortable: 'custom',
        value: 'starCnt'
      },
      {
        label: '最低售价',
        width: 90,
        sortable: 'custom',
        value: 'minPrice'
      },
      {
        label: '最高售价',
        width: 90,
        sortable: 'custom',
        value: 'maxPrice'
      },
      {
        label: '跟卖卖家数',
        width: 90,
        sortable: 'custom',
        // width: 100,
        value: 'sellerCnt'
      },
      {
        label: '跟卖数量',
        width: 90,
        sortable: 'custom',
        value: 'sellingCnt',
        isClick: scope => {
          return (
            scope.row._level !== 1 &&
            scope.row.sellingCnt !== 0 &&
            scope.row.sellingCnt != null
          )
        },
        url: true,
        btnClick: scope => {
          // const { srcSiteId } = scope.row
          this.$_dialog({
            size: 'medium',
            title: '跟卖源跟卖列表',
            params: {
              // 站点ID 和配送ID都是源站点
              siteId: this.curSiteId,
              deliverySiteId: this.curSiteId,
              asin: scope.row.asin,
              parentAsin: scope.row.parentAsin
            },
            cancelBtnText: '关闭',
            component: () =>
              import('Views/modules/ss/vallib/Index/dialogs/sellList.vue')
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
        width: 90,
        value: 'dataType',
        _enum: ['类目', '关键词', '店铺ID', 'ASIN']
      },
      {
        label: '抓取状态',
        value: 'status',
        width: 90,
        _enum: this.cfuns.arrayToObj(this.$const['PRODUCTANALYSIS/status'])
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
        label: '是否关注',
        width: 110,
        value: 'attentionFlag',
        _enum: {
          true: '是',
          false: '否'
        }
      }
    ]

    return {
      key: '1111',
      searchData: {
        displayType: true
      },
      // apiName: 'ss/sellingSrcAllProductList',
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
            label: '加入可跟卖库'
          },
          {
            label: '重新抓取源数据',
            hidden: false
          },
          {
            label: '关注'
          },
          {
            label: '取消关注'
          },
          {
            label: '删除'
          }
        ]
      },
      editBtns: [
        {
          name: '添加任务',
          perm: 'add',
          fn: () => {
            this.$_dialog({
              size: 'medium',
              title: '添加跟卖源任务',
              params: { siteId: this.$store.state.selling.curSiteId },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./dialogs/addTask.vue')
            })
          }
        }
      ],
      edits: [
        {
          name: '加入可跟卖库',
          perm: 'add',
          fn: scope => {
            this.addToLib([scope.row.asin], scope.row._level == 1 ? 1 : 0)
          }
        },
        {
          name: '重新抓取源数据',
          perm: 'add',
          fn: scope => {
            this.recrwal([scope.row.asin], scope.row._level == 1 ? 1 : 0)
          }
        },
        {
          name: '关注',
          perm: 'add',
          fn: scope => {
            this.atx([scope.row.asin], scope.row._level == 1 ? 1 : 0, true)
          }
        },
        {
          name: '取消关注',
          perm: 'add',
          fn: scope => {
            this.atx([scope.row.asin], scope.row._level == 1 ? 1 : 0, false)
          }
        },
        {
          name: '删除',
          perm: 'add',
          fn: scope => {
            this.del([scope.row.asin], scope.row._level == 1 ? 1 : 0)
          }
        }
      ],
      columns,
      setChange,
      searchFields: {
        searchText: {
          label: 'ASIN',
          labelWidth: 52
        },
        displayType: {
          label: '展示方式',
          widget: 'select',
          clearable: false,
          change: setChange,
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
        category: {
          hidden: true,
          widget: 'input',
          label: '平台类目',
          clearable: true
          // props: {
          //   lazy: true,
          //   lazyLoad(node, resolve) {
          //     const { data } = node
          //     const params = {
          //       ...vm.storeInfo,
          //       siteId: vm.$store.state.selling.curSiteId,
          //       parentName: data
          //         ? (data.parentName ? data.parentName + ':' : '') + data.value
          //         : null
          //     }
          //     vm.$api[`ss/sellingGetCategoryList`](params)
          //       .then(data => {
          //         resolve(
          //           data.data.map(e => ({
          //             label: e.name,
          //             value: e.name,
          //             parentName: e.parentName,
          //             leaf: !e.haveChildren
          //           }))
          //         )
          //       })
          //       .catch(() => {
          //         resolve(false)
          //       })
          //   }
          // }
        },
        status: {
          label: '抓取状态',
          hidden: true,
          widget: 'select',
          options: this.$const['PRODUCTANALYSIS/status']
        },
        dataType: {
          label: '抓取方式',
          hidden: true,
          widget: 'select',
          options: this.$const['SS/scDataType']
        },
        attentionFlag: {
          label: '关注',
          hidden: true,
          labelWidth: '55px',
          widget: 'select',
          defaultVal: true,
          options: [
            {
              label: '已关注',
              value: true
            },
            {
              label: '未关注',
              value: false
            }
          ]
        },

        saleFlag: {
          label: '销售状态',
          hidden: true,
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
          ]
        },
        bsr: getSearchNumField.call(vm, '大类BSR', 'bsr', '76px'),
        sellerCnt: getSearchNumField.call(vm, '跟卖数', 'sellerCnt', '70px'),
        searchPrice: getSearchNumField.call(
          vm,
          '价格',
          'searchPrice',
          '50px',
          true,
          2
        ),
        reviewCnt: getSearchNumField.call(vm, '评价数', 'reviewCnt', '65px'),
        starCnt: getSearchNumField.call(vm, '评分', 'starCnt', '56px', true, 1),
        brands: {
          widget: 'textarea',
          placeholder: '一行一个',
          label: '品牌名',
          hidden: true,
          labelWidth: '65px',
          rows: 1
        }
      }
    }
  },
  watch: {
    '$store.state.selling.curSiteId'(val) {
      this.key = val
    },
    'searchData.displayType': {
      immediate: true,
      handler(val) {
        this.setChange({ displayType: val })
      }
    }
  },
  computed: {
    treeTable() {
      return this.searchData.displayType
    },
    curSiteId() {
      return this.$store.state.selling.curSiteId
    }
  },
  methods: {
    apiName(searchData) {
      return searchData.displayType
        ? 'ss/sellingSrcAllProductList'
        : 'ss/sellingSrcChildProductList'
    },
    btnFn(row) {
      let arr = [1]
      if (!row._isChild && this.searchData.displayType) {
        arr.push(2)
      }
      if (row.attentionFlag) {
        return arr.concat([4, 5])
      } else {
        return arr.concat([3, 5])
      }
    },
    handleLeftBatchChange(val, sel) {
      let asins = sel.map(e => e.asin)
      const type = sel[0]._level == 1 ? 1 : 0
      switch (val[0]) {
        case '加入可跟卖库':
          asins = this.selectB(sel)
          if (asins) {
            this.addToLib(asins, type)
          }
          break
        case '重新抓取源数据':
          asins = this.selectA(sel)
          if (asins) {
            this.recrwal(asins, type)
          }
          break
        case '关注':
          asins = this.selectB(sel)
          if (asins) {
            this.atx(asins, type, true)
          }
          break
        case '取消关注':
          asins = this.selectB(sel)
          if (asins) {
            this.atx(asins, type, false)
          }
          break
        case '删除':
          asins = this.selectB(sel)
          if (asins) {
            this.del(asins, type)
          }
          break

        default:
          break
      }
    },
    recrwal(asins, type) {
      this.showTips({ msg: '此操作将重新抓取源数据, 是否继续?' }, () => {
        return this.$api[`ss/sellingReCrawlSrc`]({
          ...this.storeInfo,
          siteId: this.curSiteId,
          asins,
          type
        })
      })
    },
    del(asins, type) {
      this.showTips({ msg: '此操作将删除源数据, 是否继续?' }, () => {
        return this.$api[`ss/sellingRemoveSrc`]({
          ...this.storeInfo,
          siteId: this.curSiteId,
          asins,
          type
        })
      })
    },
    atx(asins, type, attentionFlag) {
      this.showTips(
        { msg: `此操作将${attentionFlag ? '关注' : '取消关注'}数据, 是否继续` },
        () => {
          return this.$api[`ss/sellingAttention`]({
            ...this.storeInfo,
            siteId: this.curSiteId,
            attentionFlag,
            asins,
            type
          })
        }
      )
    },
    addToLib(asins, type) {
      this.$_dialog({
        size: 'medium',
        title: '加入可跟卖库',
        params: { asins, curSiteId: this.curSiteId, type },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/addToLib.vue')
      })
    },
    searchFunc(data) {
      let { category, ...info } = data
      if (category) {
        category = category.join(':')
      }
      return {
        category,
        ...info
      }
    }
  }
}
</script>