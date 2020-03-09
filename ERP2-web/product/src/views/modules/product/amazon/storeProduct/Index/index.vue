<template>
  <MainLayout
    :outerParams="outerParams"
    :edit-btns="edits"
    :tabs="tabs"
    :leftTree="leftTree"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    :searchFields="searchFields"
    :searchDefaultData="searchData"
    :right-edit-btns="editBtns"
    :columns="columns"
    :treeTable="true"
    arrowLeft="-10px"
    :editWidth="180"
    :searchFunc="searchFunc"
    :treeTableOtions="treeTableOtions"
    ref="layout"
    url="product/prProductSellerAmzList"
  ></MainLayout>
</template>
<script>
import {
  platProductMut,
  platProductComputed,
  platProductAct
} from 'Store/helper/platProduct'
import { mapState, mapActions } from 'vuex'
import mixins from '../../mixins'
export default {
  mixins: [mixins],
  props: {
    platId: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
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
              label: '销售状态',
              value: 'salesFlag',
              _enum: {
                1: '在售',
                0: '不可售'
              }
            },
            {
              label: '关联状态',
              value: 'relatedFlag',
              _enum: {
                1: '是',
                0: '否'
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
          minWidth: 120,
          children: [
            {
              label: '标题',
              value: 'productTitle',
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
              label: '仓库SKU',
              value: 'repoSku'
            }
          ]
        },
        {
          type: 'array',
          minWidth: 140,
          children: [
            {
              label: '上架时间',
              value: 'shelfTime'
            },
            {
              label: '导入日期',
              value: 'importTime'
            }
          ]
        },
        {
          type: 'array',
          minWidth: 140,
          children: [
            {
              label: '可售',
              value: 'saleableQuantity'
            },
            {
              label: '更新时间',
              value: 'modifyTime'
            }
          ]
        },
        {
          label: '不可售',
          value: 'unsaleableQuantity'
        },
        {
          label: '入库数量',
          value: 'inboundQuantity'
        },
        {
          label: '预留数量',
          value: 'reservedQuantity'
        },
        {
          label: '费用预览',
          value: ''
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
          label: '配送方式',
          value: 'deliveryType',
          _enum: {
            1: '自发货',
            2: 'FBA'
          }
        },
        {
          label: 'FNSKU',
          value: 'fnsku'
        },
        {
          label: '日均销量',
          value: 'dailyAverageSales',
          render: (h, scope) => {
            const { dailyAverageSales, productSellerId } = scope.row
            return dailyAverageSales ? (
              <span>
                {dailyAverageSales}
                <el-button
                  onClick={() => {
                    this.$dialog({
                      title: '销量',
                      params: this.addParams({
                        productSellerId
                      }),
                      component: () => import('./dialogs/viewSaleChart.vue')
                    })
                  }}
                  class="ml10"
                  type="text"
                  size="mini"
                  icon="iconfont icontubiao"
                ></el-button>
              </span>
            ) : (
              <span>-</span>
            )
          }
        }
      ],
      editBtns: [
        {
          type: 'dropdown',
          btns: [
            {
              name: '新增产品',
              perm: 'addTask',
              fn: () => {
                this.addPro()
              }
            },
            {
              name: '批量添加产品',
              perm: 'addTask',
              fn: () => {
                this.batchAdd()
              }
            },
            {
              name: '新增跟卖产品',
              perm: 'addTask',
              fn: () => {
                this.addToSell()
              }
            }
          ]
        },
        // {
        //   type: 'dropdown',
        //   btns: [
        //     {
        //       name: '移动变体',
        //       perm: 'addTask',
        //       fn: () => {}
        //     },
        //     {
        //       name: '移动日志',
        //       perm: 'addTask',
        //       fn: () => {}
        //     }
        //   ]
        // },
        {
          name: '更新库存',
          perm: 'addTask',
          loading: false,
          showLoading: true,
          fn: () => {
            this.setQuanStatus()
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
        deliveryType: {
          labelWidth: '85px',
          widget: 'radio',
          label: '配送方式',
          options: [
            {
              label: '所有',
              value: null
            },
            {
              label: 'FBA',
              value: 2
            },
            {
              label: '自发货',
              value: 1
            }
          ]
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
        fnsku: {
          hidden: true,
          labelWidth: '80px',
          label: 'FNSKU'
        },
        shelfTime: {
          hidden: true,
          widget: 'daterange',
          label: '上架日期',
          time: true
        },
        importTime: {
          hidden: true,
          widget: 'daterange',
          label: '导入时间',
          time: true
        },
        moveStatus: {
          hidden: true,
          widget: 'select',
          label: '挪动状态',
          options: [
            {
              label: '成功',
              value: 1
            },
            {
              label: '失败',
              value: 0
            },
            {
              label: '挪动中',
              value: 2
            }
          ]
        },
        salesFlag: {
          hidden: true,
          widget: 'select',
          label: '销售状态',
          options: [
            {
              label: '在售',
              value: 1
            },
            {
              label: '不可售',
              value: 0
            }
          ]
        }
      },

      edits: [
        /**
         *
         * 上架失败
         *
         */
        {
          name: '查看报告',
          fn: scope => {
            let productSellerId = scope.row.productSellerId
            this.$dialog({
              title: '查看报告',
              params: this.addParams({
                productSellerId
              }),
              okBtnText: '编辑重新提交',
              cancelBtnText: '取消',
              component: () => import('./dialogs/viewErr.vue')
            })
          }
        },
        /**
         *
         * 在售 待关联
         *
         */
        {
          name: '关联SKU',
          fn: scope => {
            this.relateSku([scope.row.productSellerId])
            // let productSellerId = scope.row.productSellerId
            // this.$dialog({
            //   title: '选择产品',
            //   params: this.addParams({
            //     productSellerId
            //   }),
            //   okBtnText: '确认关联',
            //   component: () => import('./dialogs/relateSkuSelect.vue')
            // })
          }
        },

        {
          name: '逆推',
          // FIXME:
          // eslint-disable-next-line no-unused-vars
          fn: scope => {
            this.reverse([scope.row.productSellerId])
          }
        },

        /**
         * 待编辑
         */
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
        },
        /* 待审核 */
        {
          name: '审核',
          fn: scope => {
            this.$router.push({
              path: '/product/amazon/storeProduct/audit',
              query: this.addParams({
                productSellerId: scope.row.productSellerId
              })
            })
          }
        },

        // 编辑
        // 操作日志

        /**
         *
         * 不可售
         *
         */
        {
          name: '上架',
          fn: scope => {
            let productSellerId = scope.row.productSellerId
            this.upshelf([productSellerId])
          }
        },

        // 复制添加
        // 操作日志
        // 删除
        {
          name: '编辑重新上架',
          fn: scope => {
            this.$router.push({
              path: '/product/amazon/storeProduct/edit',
              query: this.addParams({
                productSellerId: scope.row.productSellerId
              })
            })
          }
        },

        /**
         *
         * 上架成功
         *
         */
        // 编辑
        // 复制添加
        // 新增变体
        // 操作日志
        // 删除

        // 下架
        {
          name: '下架',
          fn: scope => {
            let productSellerId = scope.row.productSellerId
            this.showTips({ msg: '是否下架此产品？' }, () => {
              let params = this.addParams({
                productSellerIds: [productSellerId],
                flag: 0
              })
              return this.$api[`product/prProductSellerAmzShelf`](params)
            })
          }
        },

        {
          name: '新增变体',
          fn: scope => {
            this.$router.push({
              path: '/product/amazon/storeProduct/addNewVar',
              query: this.addParams({
                productSellerId: scope.row.productSellerId
              })
            })
          }
        },
        {
          name: '复制添加',
          fn: scope => {
            this.$router.push({
              path: '/product/amazon/storeProduct/copy',
              query: this.addParams({
                productSellerId: scope.row.productSellerId
              })
            })
          }
        },

        //  复制添加（存在）

        // 删除
        {
          name: '删除',
          fn: scope => {
            let productSellerId = scope.row.productSellerId
            this.showTips({ msg: '是否删除此产品？' }, () => {
              let params = this.addParams({
                productSellerIds: [productSellerId]
              })
              return this.$api[`product/prProductSellerAmzRemove`](params)
            })
          }
        },
        {
          name: '操作日志',
          // eslint-disable-next-line no-unused-vars
          fn: scope => {
            this.$dialog({
              title: '产品操作日志',
              params: {
                modelLogType: 9
              },
              component: () =>
                import('Views/modules/product/setup/common/log.vue')
            })
          }
        }

        // 操作日志（存在）

        /**
         *
         * 上架中
         *
         */

        // 操作日志（存在）
      ],
      tabs: [
        {
          name: '所有',
          num: '-',
          query: {
            tableStatus: 0
          }
        },
        {
          name: '在售',
          num: '-',
          query: {
            tableStatus: 1
          }
        },
        {
          name: '不可售',
          num: '-',
          query: {
            tableStatus: 2
          }
        },
        {
          name: '待编辑',
          num: '-',
          query: {
            tableStatus: 3
          }
        },
        {
          name: '待审核',
          num: '-',
          query: {
            tableStatus: 4
          }
        },
        {
          name: '上架中',
          num: '-',
          query: {
            tableStatus: 5
          }
        },
        {
          name: '上架失败',
          num: '-',
          query: {
            tableStatus: 6
          }
        },
        {
          name: '待关联产品',
          num: '-',
          query: {
            tableStatus: 7
          }
        }
      ],
      leftTree: {
        props: {
          label: 'catePlatName',
          children: 'childArray'
          // isLeaf: 'leaf'
        },
        // 要传给后端的搜索数据
        dataFn(data) {
          return { catePlatId: data.catePlatId }
        },
        // 懒加载
        dataPromise: () => {
          return this.$api[`product/catePlatTree`]({}).then(data => {
            return [
              {
                catePlatName: '全部',
                catePlatId: -1,
                childArray: data.rows
              }
            ]
          })
        }
      },
      topBatchBtn: {
        options: [
          {
            label: '审核',
            children: [
              {
                label: '审核通过'
              },
              {
                label: '审核不通过'
              }
            ]
          },
          {
            label: '下架'
          },
          {
            label: '切换配送方式为FBA'
          },
          {
            label: '切换配送方式为自发货'
          },
          {
            label: '上架'
          },
          {
            label: '逆推'
          },
          {
            label: '关联SKU'
          },
          {
            label: '移动变体'
          },
          {
            label: '删除'
          },
          {
            label: '自定义导出'
          }
        ],
        search: {
          field: 'search',
          placeholder: '请输入仓库SKU、ASIN、sellerSKU、平台SKU、标题',
          width: '550px'
        }
      }
    }
  },
  computed: {
    ...platProductComputed,
    ...mapState('product/storeProduct', ['quanLoading']),
    outerParams() {
      return {
        platSiteId: this.selectedSite.value
      }
    }
  },
  created() {
    if (!this.selectedSite.value) {
      this.getButtedSiteList({ isSite: true, platId: this.platId })
    }

    this.getQuanStatus()
  },

  watch: {
    'selectedSite.value': {
      handler(val) {
        if (val) {
          this.getListCount()
        }
      },
      immediate: true
    },
    quanLoading(val) {
      this.editBtns[1].loading = val
      if (val) {
        this.editBtns[1].name = '库存更新中'
      } else {
        this.editBtns[1].name = '更新库存'
      }
    }
  },
  methods: {
    ...platProductMut,
    ...platProductAct,
    ...mapActions('product/storeProduct', ['getQuanStatus', 'setQuanStatus']),
    addParams(params) {
      return { ...this.outerParams, ...params }
    },
    // 新增店铺产品
    addPro() {
      this.$router.push({
        path: '/product/amazon/storeProduct/add',
        query: this.addParams({
          platId: this.platId
        })
      })
    },
    // 批量添加产品
    batchAdd() {
      this.$router.push({
        path: '/product/amazon/storeProduct/batchAdd',
        query: this.outerParams
      })
    },
    // 新增跟卖产品
    addToSell() {
      this.$router.push({
        path: '/product/amazon/storeProduct/addToSell',
        query: this.outerParams
      })
    },
    // 获取tab页产品数量
    getListCount() {
      let params = { platSiteId: this.selectedSite.value }
      this.$api[`product/prProductSellerAmzListCount`](params).then(data => {
        const rows = data.rows
        this.tabs.forEach(el => {
          let e = rows.find(e => e.pageType === el.query.tableStatus)
          if (e) {
            el.num = e.total
          } else {
            el.num = 0
          }
        })
      })
    },
    handleLeftBatchChange(val, selection) {
      // console.log(val)
      console.log(val, selection)
      const productSellerIds = selection.map(el => el.productSellerId)
      if (val.length == 2) {
        val = val[1]
      } else {
        val = val[0]
      }
      switch (val) {
        case '审核通过':
          this.batch('audit', productSellerIds, 1)
          break
        case '审核不通过':
          this.batch('audit', productSellerIds, 0)
          break
        case '下架':
          this.batch('shelf', productSellerIds, 0)
          break
        case '切换配送方式为FBA':
          this.batch('trans', productSellerIds, 2)
          break
        case '切换配送方式为自发货':
          this.batch('trans', productSellerIds, 1)
          break
        case '上架':
          this.upshelf(productSellerIds)
          break
        case '逆推':
          this.reverse(productSellerIds)
          break
        case '关联SKU':
          this.relateSku(productSellerIds)
          break
        case '移动变体':
          if (
            selection.every(
              el => el.cateId === selection[0].cateId && el.count == null
            )
          ) {
            this.movePro(selection)
          } else {
            this.$message.warning('请选择具有相同底层类目的变体')
          }
          break
        case '删除':
          this.batch('del', productSellerIds, 1)
          break
        case '自定义导出':
          this.customExport(productSellerIds)
          break

        default:
          break
      }
    },
    customExport(productSellerIds) {
      this.$dialog({
        title: '自定义导出',
        params: this.addParams({
          productSellerIds,
          storeProduct: true,
          saveName: 'a'
        }),
        okBtnText: '导出',
        component: () =>
          import(
            'Views/modules/product/amazon/platProduct/index/dialogs/customEx.vue'
          )
      })
    },
    movePro(selection) {
      this.$dialog({
        title: '批量移动产品',
        params: {
          platSiteId: this.outerParams.platSiteId,
          params: {
            data: selection
          }
        },
        okBtnText: '确认移动',
        component: () => import('./dialogs/movePro.vue')
      })
    },
    upshelf(productSellerIds) {
      this.$dialog({
        title: '库存价格',
        params: this.addParams({
          productSellerIds
        }),
        okBtnText: '确认',
        component: () => import('./dialogs/upshelf.vue')
      })
    },

    batch(type, productSellerIds, flag = 1) {
      let name, msg
      let params = this.addParams({
        flag,
        productSellerIds
      })
      switch (type) {
        case 'audit':
          name = 'prProductSellerAmzAudit'
          params.auditReason = ''
          msg = `是否审核${flag ? '' : '不'}通过选中的产品？`
          break
        case 'shelf':
          name = 'prProductSellerAmzShelf'
          params.auditReason = ''
          msg = `是否下架选中的产品？`
          break
        case 'trans':
          name = 'prProductSellerAmzChangeDelivery'
          params.auditReason = ''
          delete params.flag
          params.deliveryType = flag
          msg = `是否将选中产品的配送方式切换为${
            flag == 1 ? '自发货' : 'FBA'
          }？`
          break
        case 'del':
          name = 'prProductSellerAmzRemove'
          delete params.flag
          msg = `是否将选中的产品删除？`
          break

        default:
          break
      }
      this.showTips({ msg }, () => {
        return this.$api[`product/${name}`](params)
      })
    },

    relateSku(productSellerIds) {
      this.$dialog({
        title: '选择产品',
        params: this.addParams({
          productSellerIds
        }),
        okBtnText: '确认关联',
        component: () => import('./dialogs/relateSkuSelect.vue')
      })
    },

    reverse(productSellerIds) {
      this.$router.push({
        path: '/product/common/base/productOperate',
        query: {
          productSellerIds
        }
      })
    },
    searchFunc(data) {
      return data
    }
  }
}
</script>