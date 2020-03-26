<template>
  <main-layout
    :outerParams="{...storeInfo,merchantTaskId }"
    :searchFields="searchFields"
    :columns="columns"
    @searchTrueData="handleSearchTrueData"
    edit-width="160px"
    :big-data="true"
    tbRightFixed="right"
    :right-edit-btns="editBtns"
    :topBatchBtn="topBatchBtn"
    @requestSuccess="requestSuccess"
    showFilter
    :spanMethod="spanMethod"
    @left-batch-change="handleLeftBatchChange"
    url="proPick/categoryTaskMerchantDetails"
    ref="layout"
    :scroll="true"
  ></main-layout>
</template>
<script>
import { downloadFile } from 'Utils'
import depMixin from 'Views/modules/proPick/deepCateAnalyze/mixin'
import { getSearchNumField } from 'Utils/table-render'
export default {
  mixins: [depMixin],
  data() {
    let vm = this
    const linkMethod = num => row => {
      return this.storeUrls.asinUrl + row[`top${num}Asin`]
    }
    function getTopYear(num) {
      return {
        show: true,
        label: `上架年份TOP${num}`,
        headerTooltip: 'TOP100产品上架时间最高的时间',
        // width: 160,
        value: `top${num}ReleaseYear`,
        merge: [
          {
            label: '年份',
            sortable: 'custom',
            width: 70,
            value: `top${num}ReleaseYear`
          },
          {
            label: '占比',
            sortable: 'custom',
            width: 70,
            isPercent: true,
            value: `top${num}ReleaseYearRatio`
          }
        ]
      }
    }
    function getTopYears(n) {
      let ret = []

      for (let i = 1; i <= n; i++) {
        ret.push(getTopYear(i))
      }
      return ret
    }

    function getTopBrand(num) {
      return {
        show: true,
        // width: 220,
        value: `TOP${num}品牌`,
        label: `TOP${num}品牌`,
        merge: [
          {
            label: '名称',
            width: 140,
            noTooltip: true,
            sortable: 'custom',
            value: `top${num}Brand`
          },
          {
            label: '占比',
            width: 60,
            sortable: 'custom',
            isPercent: true,
            value: `top${num}BrandRatio`
          }
        ]
      }
    }

    function getTopBrands(n) {
      let ret = []
      for (let i = 1; i <= n; i++) {
        ret.push(getTopBrand(i))
      }
      return ret
    }
    let topBtnClick = num => scope => {
      console.log(num)

      const { category } = scope.row
      const asin = scope.row[`top${num}Asin`]
      this.openBsr({ category, asin })
    }
    let reviewClick = num => scope => {
      const { category } = scope.row
      const asin = scope.row[`top${num}ParentAsin`]
      this.openReviewDialog({ category, parentAsin: asin })
    }
    function getTop(num = 1) {
      return {
        label: `TOP${num}`,
        show: true,
        // width: 460,
        value: `top${num}`,
        merge: [
          {
            label: '主图',
            img: true,
            width: 70,
            link: linkMethod(num),
            value: `top${num}ImageUrl`
          },
          {
            sortable: 'custom',
            label: '大类BSR',
            width: 80,
            url: true,
            btnClick: topBtnClick(num),
            value: `top${num}Bsr`
          },
          {
            label: '评价数',
            width: 90,
            sortable: 'custom',
            url: true,
            btnClick: reviewClick(num),
            value: `top${num}ReviewCnt`
          },
          {
            label: '价格',
            width: 90,
            sortable: 'custom',
            value: `top${num}Price`
          },
          {
            label: '上架时间',
            width: 110,
            sortable: 'custom',
            value: `top${num}ReleaseDate`
          }
        ]
      }
    }
    function getTops(n) {
      let ret = []
      for (let i = 1; i <= n; i++) {
        ret.push(getTop(i))
      }
      return ret
    }
    return {
      isTenLenth: false,
      merchantTaskId: +this.$route.query.id,
      rest: true,
      searchData: {},
      topBatchBtn: {
        title: '',
        options: [
          {
            label: '加入深度分析'
          },
          {
            label: '隐藏类目'
          },
          {
            label: '显示类目'
          }
        ]
      },
      searchFields: {
        searchText: {
          placeholder: '请输入类目..'
        },
        newReviewCnt: getSearchNumField.call(
          vm,
          '新增评价数区间',
          'newReviewCnt',
          '122px'
        ),
        productCnt: getSearchNumField.call(
          vm,
          '总产品数区间',
          'productCnt',
          '110px'
        ),
        fbaProductCnt: getSearchNumField.call(
          vm,
          'FBA产品数区间',
          'fbaProductCnt',
          '120px'
        ),
        reviewCnt: getSearchNumField.call(
          vm,
          '评价数区间',
          'reviewCnt',
          '95px'
        ),
        starCnt: getSearchNumField.call(vm, '平均评分区间', 'starCnt', '106px'),
        reviewAvgCnt: getSearchNumField.call(
          vm,
          '平均评价数区间',
          'reviewAvgCnt',
          '120px'
        ),
        hideCateType: {
          widget: 'switch',
          label: '是否隐藏类目',
          labelWidth: '110px',
          defaultVal: 0,
          options: [
            { label: '否', value: 0 },
            { label: '是', value: 1 }
          ]
        }
      },
      columns: [
        {
          label: '序号',
          type: 'index',
          width: 50,
          fixed: 'left'
        },
        {
          label: '类目',
          value: 'category',
          noTooltip: false,
          width: 220,
          copyProps: 'category',
          fixed: 'left',
          render: (h, scope) => {
            let { category, categoryUrl } = scope.row
            const cates = category.split(':')
            return (
              <el-tooltip placement="top-start" content={category}>
                <a class="link" href={categoryUrl} target="_blank">
                  {cates.pop()}
                </a>
              </el-tooltip>
            )
          }
        },
        {
          label: '深度分析',
          value: 'depthTaskId',
          width: 90,
          render: (h, scope) => {
            const { depthTaskId } = scope.row
            return (
              <span>
                {depthTaskId != null ? (
                  <el-button
                    type="text"
                    on-click={() => {
                      this.$router.push({
                        path: '/proPick/deepCateAnalyze/detail',
                        query: {
                          id: depthTaskId
                        }
                      })
                    }}
                  >
                    有
                  </el-button>
                ) : (
                  '无'
                )}
              </span>
            )
          }
        },
        {
          label: '新增评价数',
          width: 110,

          headerTooltip: 'TOP100产品近30天累计新增评价数',
          sortable: 'custom',
          value: 'newReviewCnt'
        },
        {
          label: '总产品数',
          width: 110,
          // headerTooltip: 'TOP100产品',
          sortable: 'custom',
          value: 'productCnt'
        },
        {
          label: 'FBA产品数',
          width: 110,
          // headerTooltip: 'TOP100产品',
          sortable: 'custom',
          value: 'fbaProductCnt'
        },
        {
          label: '评价数',
          width: 110,
          url: true,
          btnClick: scope => {
            let { category } = scope.row
            this.openReviewDialog({ category, type: 'category' })
          },
          headerTooltip: 'TOP100产品评价数',
          sortable: 'custom',
          value: 'reviewCnt'
        },
        {
          label: '平均评分',
          width: 110,
          headerTooltip: 'TOP100产品平均评分',
          sortable: 'custom',
          value: 'starCnt'
        },
        {
          label: '平均评价数',
          width: 110,
          headerTooltip: 'TOP20产品平均评价数，TOP20产品评价数/产品数',
          sortable: 'custom',
          value: 'reviewAvgCnt'
        },
        ...getTopYears(3),
        ...getTopBrands(5),
        ...getTops(20)
      ],
      editBtns: [
        // {
        //   name: '导出',
        //   perm: 'add',
        //   // icon: 'el-icon-link',
        //   fn: () => {
        //     this._export()
        //   }
        // },
        {
          name: '导出',
          perm: 'add',
          icon: 'iconfont icondaochu',
          type: 'plain',
          showLoading: true,
          fn: () => {
            return this._export(
              this.$refs.layout.selection.map(e => e.category)
            )
          }
        }
      ]
    }
  },
  methods: {
    openBsr({ category, asin }) {
      this.$_dialog({
        size: 'medium',
        title: 'BSR',
        params: {
          merchantTaskId: this.merchantTaskId,
          category: category,
          asin: asin
        },
        cancelBtnText: '关闭',
        component: () => import('./dialogs/bsr.vue')
      })
    },
    openReviewDialog({ category, asin, type, parentAsin }) {
      this.$_dialog({
        size: 'medium',
        title: '评价曲线',
        params: {
          merchantTaskId: this.merchantTaskId,
          category,
          parentAsin,
          asin,
          type
        },
        cancelBtnText: '关闭',
        component: () => import('./dialogs/reviewChart.vue')
      })
    },
    spanMethod(params) {
      // console.log(columnIndex)
      // debugger
      // console.log(params.column.label)

      if (params.fixed == 'right' || params.column.label == 'left') {
        if (params.$rowIndex == 0) {
          return { rowspan: 100, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
    },
    getMore() {
      // if (this.$refs.layout.showRestRows(5)) {
      //   this.rest = false
      // }pagingScrollTopLeft
      let table = this.$refs.layout.$refs.table.$refs.bigTab.$refs.table
      table.pagingScrollTopLeft(
        0,
        this.$refs.layout.$refs.table.tableScrlLeft + 430
      )
      // table.scrollLeft += 430
    },
    handleSearchTrueData(params) {
      this.searchData = params
    },
    handleLeftBatchChange(val, sel) {
      let categorys = sel.map(e => e.category)
      switch (val[0]) {
        case '加入深度分析':
          this.showTips({ msg: '此操作将类目加入深度分析, 是否继续?' }, () => {
            return this.addDepth({ categorys })
          })
          break
        case '隐藏类目':
          this.toggleStatus(categorys, false)
          break
        case '显示类目':
          this.toggleStatus(categorys)
          break

        default:
          break
      }
    },
    toggleStatus(categorys, show = true) {
      this.showTips(
        { msg: `此操作将${show ? '显示' : '隐藏'}类目, 是否继续?` },
        () => {
          let params = {
            ...this.storeInfo,
            merchantTaskId: this.merchantTaskId,
            categorys
          }
          return this.$api[
            `proPick/${
              show
                ? 'categoryTaskMerchantNoHideCate'
                : 'categoryTaskMerchantHideCate'
            }`
          ](params)
        }
      )
    },
    requestSuccess(suc, list) {
      console.log(list.length)

      this.isTenLenth = list.length > 10
    },
    // addToDepth() {},
    _export(categorys) {
      let params = {
        ...this.searchData,
        categorys: categorys.length ? categorys : null
      }
      return this.$api[`proPick/categoryTaskMerchantDetailsExport`](
        params
      ).then(data => {
        downloadFile(data, `类目分析数据.xlsx`)
      })
    }
  }
}
</script>