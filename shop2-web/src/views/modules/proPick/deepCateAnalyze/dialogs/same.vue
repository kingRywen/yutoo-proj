<template>
  <main-layout
    :outerParams="{...storeInfo,merchantTaskId, styleName}"
    :searchFields="searchFields"
    @searchTrueData="val =>searchData = val"
    :columns="columns"
    :edit-btns="edits"
    edit-width="160px"
    showFilter
    tbRightFixed="right"
    :right-edit-btns="editBtns"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    url="proPick/categoryDepthTaskMerchantSameStyleProductList"
    ref="layout"
  ></main-layout>
</template>
<script>
import { downloadFile } from 'Utils'
import { timeField } from 'Utils/table-render.js'
export default {
  props: ['styleName', 'close'],
  data() {
    return {
      searchData: {},
      merchantTaskId: +this.$route.query.id,
      topBatchBtn: {
        title: '产品',
        loading: false,
        options: [
          {
            label: '设置为独立产品'
          },
          {
            label: '移入其他款式'
          },
          {
            label: '设置为主款'
          },
          {
            label: '导出'
          }
        ]
      },
      searchFields: {
        parentAsinLike: {
          placeholder: 'ASIN'
        },
        fbpFlag: {
          hidden: true,
          widget: 'select',
          label: '发货方式',
          options: this.$const['OTHER/fbpFlag']
        },
        releaseDate: timeField('上架时间', 'releaseDate'),
        titleLike: {
          hidden: true,
          label: '标题'
        }
      },
      columns: [
        {
          label: 'ASIN',
          value: 'parentAsin',
          width: 180,
          render: (h, scope) => {
            let { parentAsin, mainStyle } = scope.row
            return (
              <div class="flex just-sb">
                <a
                  class="link"
                  href="javascript:void(0)"
                  on-click={_ => {
                    window.open(this.currentSite.asinUrl + parentAsin)
                  }}
                >
                  {parentAsin}
                </a>
                {mainStyle && (
                  <el-tag size="mini" type="success">
                    主款
                  </el-tag>
                )}
              </div>
            )
          }
        },
        {
          label: '主图',
          value: 'imageUrl',
          width: 65,
          img: true,
          link: row => {
            return this.storeUrls.asinUrl + row['parentAsin']
          },
          title: 'title'
        },
        {
          label: '销量排名',
          value: 'salesRank',
          sortable: 'custom'
        },
        {
          label: '大类BSR',
          headerTooltip: '单击查看小类排名',
          value: 'bsr',
          width: 100,
          sortable: 'custom',
          numZero: true,
          url: true,
          btnClick: scope => {
            const { parentAsin } = scope.row
            this._openDialog({
              size: 'medium',
              title: 'BSR',
              params: {
                merchantTaskId: this.merchantTaskId,
                parentAsin,
                depth: true
              },
              cancelBtnText: '关闭',
              component: () =>
                import(
                  'Views/modules/proPick/cateAnalyze/detail/dialogs/bsr.vue'
                )
            })
          }
        },
        {
          headerTooltip: '近30天',
          label: '新增评价数',
          width: 120,
          value: 'newReviewCnt',
          sortable: 'custom'
        },
        {
          label: '评价数',
          value: 'reviewCnt',
          sortable: 'custom'
        },

        {
          label: 'QA数',
          value: 'qaCnt',
          sortable: 'custom'
        },
        {
          label: '评分',
          value: 'starCnt',
          sortable: 'custom'
        },
        {
          label: '价格',
          value: 'price',
          sortable: 'custom'
        },
        {
          label: '变体数',
          value: 'skuCnt',
          sortable: 'custom'
        },
        {
          label: '上架时间',
          value: 'releaseDate',
          width: 100,
          sortable: 'custom'
        },
        {
          label: '品牌名',
          value: 'brand'
        },
        {
          label: '发货方式',
          value: 'fbpFlag',
          _enum: this.cfuns.arrayToObj(this.$const['OTHER/fbpFlag'])
        },
        {
          label: '首页中差评数量',
          width: 118,
          value: 'badReviewCnt',
          sortable: 'custom'
        },
        {
          label: '跟卖卖家数',
          width: 90,
          value: 'sellerCnt',
          sortable: 'custom',
          url: true,
          btnClick: scope => {
            const { parentAsin } = scope.row
            this._openDialog({
              size: 'medium',
              title: '跟卖卖家数',
              params: {
                merchantTaskId: this.merchantTaskId,
                parentAsin
              },
              cancelBtnText: '关闭',
              component: () => import('./sellers.vue')
            })
          }
        }
      ],
      edits: [
        {
          name: '查看生命周期',
          perm: 'add',
          fn: scope => {
            this._openDialog({
              size: 'medium',
              title: '新增评价曲线',
              params: {
                merchantTaskId: this.merchantTaskId,
                name: scope.row.parentAsin,
                defaultTime: 30,
                type: 'depth'
              },
              cancelBtnText: '关闭',
              component: () =>
                import(
                  'Views/modules/proPick/cateAnalyze/detail/dialogs/reviewChart.vue'
                )
            })
          }
        }
      ],
      editBtns: []
    }
  },
  methods: {
    _close() {
      this.close && this.close()
    },
    handleLeftBatchChange(val, sel) {
      const parentAsins = sel.map(el => el.parentAsin)
      switch (val[0]) {
        case '设置为独立产品':
          this.showTips({ msg: '此操作将设置为独立产品, 是否继续?' }, () => {
            return this.$api[
              `proPick/categoryDepthTaskMerchantSetAloneProduct`
            ]({
              ...this.storeInfo,
              merchantTaskId: this.merchantTaskId,
              parentAsins
            })
          })
          break
        case '移入其他款式':
          this._openDialog({
            size: 'medium',
            title: '移入其他款式',
            params: {
              querys: {
                ...this.storeInfo,
                merchantTaskId: this.merchantTaskId,
                parentAsins
              },
              closeFn: () => {
                this.getLayoutList()
              }
            },
            cancelBtnText: '取消',
            okBtnText: '确认',
            component: () => import('./moveStyle.vue')
          })

          break
        case '设置为主款':
          if (sel.length !== 1) {
            this.$message.warning('只能选择一个产品进行设置')
          }
          this.topBatchBtn.loading = true

          this.$api[`proPick/categoryDepthTaskMerchantSetProductMainStyle`]({
            ...this.storeInfo,
            merchantTaskId: this.merchantTaskId,
            parentAsin: sel[0].parentAsin,
            styleName: sel[0].styleName
          })
            .then(() => {
              this.topBatchBtn.loading = false

              this.getLayoutList()
            })
            .catch(() => {
              this.topBatchBtn.loading = false
            })
          break
        case '导出':
          this._export(parentAsins)
          break

        default:
          break
      }
    },
    _export(parentAsins) {
      this.topBatchBtn.loading = true
      this.$api[`proPick/categoryDepthTaskMerchantSameStyleProductListExport`]({
        ...this.searchData,
        exportType: 0,
        parentAsins
      })
        .then(data => {
          this.topBatchBtn.loading = false
          downloadFile(data, '同款产品列表.xlsx')
        })
        .catch(() => {
          this.topBatchBtn.loading = false
        })
    }
  }
}
</script>