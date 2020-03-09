<template>
  <MainLayout
    :outerParams="outerParams"
    :edit-btns="edits"
    v-if="selectedSite.value"
    :topBatchBtn="topBatchBtn"
    :leftTree="leftTree"
    @left-batch-change="handleLeftBatchChange"
    :searchFields="searchFields"
    :searchDefaultData="searchData"
    :columns="columns"
    :treeTable="true"
    :editWidth="140"
    :searchFunc="searchFunc"
    :treeTableOtions="treeTableOtions"
    ref="layout"
    :url="alertName == 3 ? `product/prProductSellerChangeAmzList` :`product/prProductSellerImproveAmzList`"
  ></MainLayout>
</template>
<script>
import {
  platProductMut,
  platProductComputed,
  platProductAct
} from 'Store/helper/platProduct'
import mixins from '../../mixins'
export default {
  mixins: [mixins],
  props: {
    alertName: {
      type: Number,
      // 预警类型 1-待改善 2-禁止显示 3-商品信息变动
      default: 1
    },
    platId: {
      type: Number,
      default: 1
    }
  },
  data() {
    let topBatchBtn = {
      search: {
        field: 'search',
        placeholder: '请输入自定义SKU、ASIN、sellerSKU、平台SKU、标题',
        width: '400px'
      }
    }
    let edits = [
      {
        name: '编辑',
        fn: scope => {
          this.$router.push({
            path: '/product/amazon/storeProduct/edit',
            query: this.addParams({
              productSellerId: scope.row.productSellerId
            })
          })
        }
      }
    ]

    if (this.alertName == 3) {
      Object.assign(topBatchBtn, {
        props: {
          label: 'label',
          value: 'label',
          expandTrigger: 'hover'
        },
        options: [
          {
            label: '忽略'
          }
        ]
      })
      edits.push({
        name: '忽略',
        fn: scope => {
          this.ignore([scope.row.productSellerId])
        }
      })
    }
    return {
      topBatchBtn,
      treeTableOtions: {
        childs: 'childList',
        // eslint-disable-next-line no-unused-vars
        expandFunc: row => {
          return row.childList && row.childList.length > 0
        }
      },
      columns: [
        {
          type: 'array',
          minWidth: 130,
          children: [
            {
              label: 'Seller SKU',
              value: 'sellerSku',
              // FIXME:
              url: 'imgUrl',
              numField: 'childList',
              expand: true
            },
            {
              label: '状态',
              value: 'productStatus',
              _enum: {
                1: '待编辑',
                2: '待审核',
                3: '上架中',
                4: '上架失败',
                5: '上架成功'
              }
            }
          ]
        },
        {
          type: 'array',
          children: [
            {
              label: '店铺',
              value: 'storeName'
            },
            {
              label: '销售类型',
              value: 'salesType',
              _enum: {
                1: '自主上架',
                2: '跟卖'
              }
            }
          ]
        },
        {
          label: '图片',
          img: true,
          value: 'imgUrl'
        },
        {
          type: 'array',
          minWidth: 200,
          children: [
            {
              label: '标题',
              value: 'productTitle',
              // FIXME: 修改为线上对应的产品链接
              url: 'imgUrl',
              showTooltip: true
            },
            {
              label: 'ASIN',
              value: 'asin'
            }
          ]
        },
        {
          type: 'array',
          children: [
            {
              label: '平台SKU',
              value: 'platSku'
            },
            {
              label: '仓库自定义SKU',
              value: 'repoSku'
            }
          ]
        },
        {
          type: 'array',
          minWidth: 140,
          children: [
            {
              label: '更新日期',
              value: 'modifyTime',
              sortable: true
            },
            {
              label: '上架时间',
              value: 'shelfTime'
            }
          ]
        },
        {
          label: '可售',
          sortable: true,
          value: 'saleableQuantity'
        },
        {
          type: 'array',
          children: [
            {
              label: '价格',
              value: 'price'
            },
            {
              label: '+配送费',
              value: 'freightPrice'
            }
          ]
        },
        {
          label:
            this.alertName == 1
              ? '改善'
              : this.alertName == 2
              ? '需要修复的问题'
              : '变动项',
          value: 'explanation',
          width: '200px',
          render: (h, scope) => {
            let { explanation, problemList,_level } = scope.row
            if (this.alertName == 1 || this.alertName == 2) {
              return <span>点击编辑，改善{explanation}</span>
            }
            if (this.alertName == 3) {
              
              return (
                <span class="__warn">
                  点击编辑，改善{explanation}
                  {  (
                    <span
                      on-click={() => {
                        this.$dialog({
                          title: '问题类型',
                          params: {
                            productSellerId: scope.row.productSellerId,
                            platSiteId: this.outerParams.platSiteId,
                            parent: _level == 1,
                            problemList
                          },
                          component: _level == 1 ? () => import('./dialogs/question') : () => import('./dialogs/quesInfo') 
                        })
                      }}
                      class="warn-circle"
                    >
                     {problemList && problemList.length ? '+' + problemList.length : '变动' } 
                    </span>
                  ) }
                </span>
              )
            }
          }
        }
      ],
      searchData: {},
      searchFields: {
        salesType: {
          labelWidth: '70px',
          widget: 'radio',
          label: '销售类型',
          options: this.$const['PRODUCT_PLAT/saleType']
        },
        storeIds: {
          noLabel: true,
          widget: 'select',
          multi: true,
          placeholder: '选择店铺',
          options: '$store.common.shopList',
          handler: {
            action: 'common/getShopList'
          }
        },
        shelfTime: {
          hidden: true,
          widget: 'daterange',
          label: '上架日期',
          time: true
        },
        modifyTime: {
          hidden: true,
          widget: 'daterange',
          label: '修改时间',
          time: true
        },
        price: {
          type: 'object',
          label: '价格区间',
          hidden: true,
          properties: {
            start: {
              widget: 'currency',
              label: '',
              span: 12
            },
            end: {
              widget: 'currency',
              label: '~',
              labelWidth: '30px',
              span: 12
            }
          }
        }
      },
      edits,
      leftTree: {
        props: {
          label: 'name',
          children: 'childArray',
          num: 'total'
          // isLeaf: 'leaf'
        },
        // 要传给后端的搜索数据
        dataFn(data) {
          return {
            fieldName: data.pageType === '全部改善类型' ? null : data.pageType
          }
        },
        // 懒加载
        dataPromise: () => {
          return this.$api[
            `product/${
              this.alertName == 3
                ? `prProductSellerChangeAmzListCount`
                : `prProductSellerImproveAmzListCount`
            }`
          ]({
            platSiteId: this.outerParams.platSiteId,
            alertName: this.alertName == 3 ? null : this.alertName
          }).then(data => {
            if (this.alertName == 3) {
              return data.rows.map(el => {
                const names = [
                  // 页面类型 0-所有 1-父子关系变动 2-品牌变动 3-类目变动 4-卖点变动
                  '所有',
                  '父子关系变动',
                  '品牌变动',
                  '类目变动',
                  '卖点变动'
                ]
                let name,
                  total = el.total,
                  pageType = el.pageType
                name = names[el.pageType]
                return {
                  name,
                  total,
                  pageType
                }
              })
            } else {
              let all = data.rows.find(el => el.pageType === '全部改善类型')
              all.name = '全部改善类型'
              all.childArray = data.rows
                .filter(el => el.pageType !== '全部改善类型')
                .map(el => ({ ...el, name: el.pageType }))
              return [all]
            }
          })
        }
      }
    }
  },
  created() {
    if (this.selectedSite.value) {
      return
    }
    this.getButtedSiteList({ isSite: true, platId: this.platId })
  },
  methods: {
    ...platProductMut,
    ...platProductAct,
    handleLeftBatchChange(val, selection) {
      this.ignore(selection.map(el => el.productSellerIds))
    },
    ignore(productSellerIds) {
      this.showTips({ msg: '是否忽略问题？' }, () => {
        // FIXME:
        return Promise.resolve()
      })
    },
    addParams(params) {
      return { ...this.outerParams, ...params }
    },
    searchFunc(data) {
      const { modifyTime, shelfTime, price, ...info } = data
      const [modifyStartTime, modifyEndTime] = modifyTime || []
      const [shelfStartTime, shelfEndTime] = shelfTime || []
      const { start: minPrice, end: maxPrice } = price || {}
      return {
        modifyStartTime,
        modifyEndTime,
        shelfStartTime,
        shelfEndTime,
        minPrice,
        maxPrice,
        ...info
      }
    }
  },
  computed: {
    ...platProductComputed,
    outerParams() {
      return {
        platSiteId: this.selectedSite.value,
        alertName: this.alertName == 3 ? undefined : this.alertName
      }
    }
  }
}
</script>
<style lang="scss">
.warn-circle {
  width: 30px;
  height: 30px;
  background: #f6c758;
  border-radius: 20px;
  display: inline-block;
  text-align: center;
  line-height: 29px;
  color: #fff;
  cursor: pointer;
  margin-left: 6px;
}
</style>