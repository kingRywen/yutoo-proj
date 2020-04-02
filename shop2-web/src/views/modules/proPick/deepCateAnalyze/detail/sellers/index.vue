<template>
  <main-layout
    :outerParams="{...storeInfo,...querys, merchantTaskId}"
    :searchFields="searchFields"
    :columns="columns"
    @searchTrueData="val => searchData = val"
    edit-width="160px"
    tbRightFixed="right"
    :right-edit-btns="editBtns"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    url="proPick/categoryDepthTaskMerchantSellerDetails"
    ref="layout"
  ></main-layout>
</template>
<script>
import { getSearchNumField } from 'Utils/table-render'
import { downloadFile } from 'Utils'
export default {
  data() {
    return {
      merchantTaskId: +this.$route.query.merchantTaskId,
      querys: JSON.parse(this.$route.query.params),
      searchData: {},
      searchFields: {
        sellerNameLike: {
          placeholder: '店铺名称'
        },
        productCnt: getSearchNumField.call(
          this,
          '店铺产品数区间',
          'productCnt',
          '120px'
        ),
        feedbackCnt: getSearchNumField.call(
          this,
          'Feedback总数区间',
          'feedbackCnt',
          '140px'
        ),
        newFeedbackCnt: getSearchNumField.call(
          this,
          '近30天Feedback数区间',
          'newFeedbackCnt',
          '170px'
        ),
        positiveRate: getSearchNumField.call(
          this,
          '好评率区间',
          'positiveRate',
          '95px',
          undefined,
          2
        ),
        mainCategoryLike: {
          label: '主营类目',
          hidden: true
        },
        fbaFlag: {
          widget: 'select',
          labelWidth: '105px',
          label: '有无FBA发货',
          hidden: true,
          options: [
            {
              label: '有',
              value: true
            },
            {
              label: '无',
              value: false
            }
          ]
        }
      },
      columns: [
        {
          label: '序号',
          type: 'index',
          width: 50
        },
        {
          label: '店铺名称',
          value: 'sellerName',
          showTooltip: true,
          minWidth:200,
          url: 'sellerUrl',
          btnClick(scope) {
            window.open(scope.row.sellerUrl)
          }
        },
        {
          label: '店铺产品数',
          sortable: 'custom',
          value: 'productCnt'
        },
        {
          label: '品牌数',
          sortable: 'custom',
          value: 'brandCnt'
        },
        {
          label: 'Feedback总数',
          sortable: 'custom',
          value: 'feedbackCnt',
          url: true,
          width: 140,
          btnClick: scope => {
            this.$_dialog({
              size: 'medium',
              title: 'Feedback',
              params: {
                isRelate: true,
                title: '新增Feedback数',
                defaultMonth: 6,
                apiName:
                  'proPick/categoryDepthTaskMerchantListToNewFeedbackCntBySeller',
                params: {
                  merchantTaskId: this.merchantTaskId,
                  sellerId: scope.row.sellerId
                }
              },
              cancelBtnText: '关闭',
              component: () => import('Views/common/chart/singleChart.vue')
            })
          }
        },
        {
          label: '近30天Feedback数',
          sortable: 'custom',

          value: 'newFeedbackCnt'
        },
        {
          label: '好评率',
          sortable: 'custom',
          isPercent: true,
          value: 'positiveRate'
        },
        {
          label: '主营类目(占比)',
          sortable: 'custom',
          value: 'mainCategory',
          minWidth: 200,

          render(h, scope) {
            const { mainCategory, mainCategoryRatio } = scope.row
            if (!mainCategory) {
              return <span>-</span>
            }
            return (
              <span>
                {mainCategory} ({Math.ceil(mainCategoryRatio * 10000) / 100}%)
              </span>
            )
          }
        },
        {
          label: '有无FBA发货',
          value: 'fbaFlag',
          _enum: {
            true: '有',
            false: '无'
          }
        }
      ],
      editBtns: [
        {
          name: '导出',
          type: 'plain',
          icon: 'iconfont icondaochu',
          perm: 'add',
          fn: () => {
            this._export(this.searchData)
          }
        }
      ],
      topBatchBtn: {
        title: '店铺',
        loading: false,
        options: [
          {
            label: '导出'
          }
        ]
      }
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      if (val[0] == '导出') {
        this._export({ sellerIds: sel.map(e => e.sellerId) })
      }
    },
    _export(params) {
      params = {
        ...params,
        exportType: 0,
        ...this.storeInfo,
        merchantTaskId: this.merchantTaskId
      }
      return this.$api[`proPick/categoryDepthTaskMerchantSellerDetailsExport`](
        params
      ).then(data => {
        downloadFile(data, '卖家列表.xlsx')
      })
    }
  }
}
</script>