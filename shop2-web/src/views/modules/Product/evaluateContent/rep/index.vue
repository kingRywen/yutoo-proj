<template>
  <div>
    <evaHeader activeName="first" />
    <main-layout
      @searchTrueData="val => searchData = val"
      :outerParams="storeInfo"
      :addQuery="true"
      :searchDefaultData="{flag}"
      :searchFields="searchFields"
      :columns="columns"
      :edit-btns="edits"
      edit-width="160px"
      :right-edit-btns="editBtns"
      :searchFunc="searchFn"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="productAnalysis/rcReview"
      ref="layout"
      tip="当对翻译结果不满意可以人工进行翻译。"
    ></main-layout>
  </div>
</template>
<script>
import evaHeader from '../components/eva-header'
import { downloadFile } from 'Utils'
export default {
  components: {
    evaHeader
  },
  data() {
    let flag = 0
    return {
      searchData: {},
      flag,
      taskId: +this.$route.query.taskId,
      searchFields: {
        flag: {
          label: '评价库类型',
          labelWidth: '90px',
          defaultVal: flag,
          widget: 'radio',
          options: [
            {
              label: '好评库',
              value: 0
            },
            {
              label: '中评库',
              value: 1
            },
            {
              label: '差评库',
              value: 2
            }
          ]
        },
        parentAsin: {
          labelWidth: '85px',
          hidden: true,
          width: '120px',
          label: '产品ASIN'
        },
        buyerName: {
          hidden: true,
          label: '评价者名称',
          labelWidth: '95px',
          width: '100px'
        },
        vineVoiceFlag: {
          hidden: true,
          label: '是否 vine voice',
          widget: 'select',
          labelWidth: '120px',
          width: '70px',
          options: this.$const['OTHER/yesno']
        },
        time: {
          hidden: true,
          label: '评价时间',
          widget: 'daterange',
          fields: ['startTime', 'endTime']
        }
      },
      columns: [
        {
          label: '评价者',
          url: 'buyerUrl',
          minWidth: 120,
          noTooltip: true,
          copy: false,
          // btnClick: () => {},
          value: 'buyerName'
        },
        {
          label: 'ASIN',
          value: 'parentAsin',
          width: 110,
          url: true,
          btnClick: scope => {
            window.open(this.currentSite.asinUrl + scope.row.parentAsin)
          }
        },
        {
          label: '评价时间',
          value: 'reviewTime',
          sortable: 'custom',
          width: 100
        },
        {
          label: '评价星级',
          value: 'reviewStar',
          sortable: 'custom',
          width: 100
        },
        {
          label: '是否 vine voice',
          value: 'vineVoiceFlag',
          _enum: ['否', '是'],
          width: 120
        },
        {
          label: '评价内容',
          noTooltip: true,
          minWidth: 200,
          value: 'content'
        },
        {
          label: '中文翻译',
          noTooltip: true,
          minWidth: 200,
          copy: false,
          value: 'contentCn'
          // render: (h, scope) => {
          //   let { contentCn, _editable, reviewId } = scope.row
          //   return !_editable ? (
          //     <div class="flex just-sb w100">
          //       <el-tooltip
          //         class="flex over"
          //         style={{ flex: 1 }}
          //         placement="top"
          //         content={contentCn}
          //       >
          //         <span style={{ flex: 1 }}>{contentCn}</span>
          //       </el-tooltip>
          //       <el-button
          //         type="text"
          //         style="opacity: 0.4"
          //         icon="el-icon-edit-outline"
          //         on-click={() => {
          //           this.$set(scope.row, '_editable', true)
          //           this.$set(scope.row, '_editVal', scope.row.contentCn)
          //         }}
          //       ></el-button>
          //     </div>
          //   ) : (
          //     <div class="flex just-sb w100">
          //       <el-input
          //         type="textarea"
          //         rows={1}
          //         autosize={{ minRows: 1, maxRows: 6 }}
          //         size="small"
          //         vModel={scope.row._editVal}
          //       ></el-input>
          //       <el-button
          //         type="text"
          //         class="ml10"
          //         icon="el-icon-check"
          //         on-click={() => {
          //           this.tran(
          //             { reviewId, contentCn: scope.row._editVal },
          //             scope.row
          //           )
          //             .then(() => {
          //               scope.row.contentCn = scope.row._editVal
          //               scope.row._editable = false
          //             })
          //             .catch(() => {})
          //         }}
          //       ></el-button>
          //       <el-button
          //         type="text"
          //         icon="el-icon-close"
          //         on-click={() => {
          //           scope.row._editVal = scope.row.contentCn
          //           scope.row._editable = false
          //         }}
          //       ></el-button>
          //     </div>
          //   )
          // }
        }
      ],
      edits: [
        {
          name: '翻译',
          fn: scope => {
            let { reviewId } = scope.row
            this.tran({ reviewId }, scope.row)
          }
        }
      ],
      editBtns: [
        {
          name: '导出全部Excel',
          perm: 'add',
          showLoading: true,
          fn: () => {
            return this.expReview(undefined, 0, null, this.searchData)
          }
        },
        {
          name: '导出全部CSV',
          perm: 'add',
          showLoading: true,
          fn: () => {
            return this.expReview(undefined, 1, null, this.searchData)
          }
        }
      ],
      topBatchBtn: {
        loading: false,
        title: '评价',
        options: [
          // {
          //   label: '翻译'
          // },
          {
            label: '导出CSV'
          },
          {
            label: '导出Excel'
          }
        ]
      }
    }
  },
  methods: {
    handleLeftBatchChange(val, selection) {
      let reviewIds = selection.map(el => el.reviewId)
      switch (val[0]) {
        case '导出CSV':
          this.expReview(reviewIds, 1, true)
          break
        case '导出Excel':
          this.expReview(reviewIds, 0, true)
          break

        default:
          break
      }
    },
    expReview(reviewIds, exportType, setLoading, searchData) {
      setLoading && (this.topBatchBtn.loading = true)
      return this.$api[`productAnalysis/rcExportReview`]({
        reviewIds,
        ...this.storeInfo,
        taskId: this.taskId,
        flag: this.flag,
        exportType,
        ...searchData
      })
        .then(data => {
          setLoading && (this.topBatchBtn.loading = false)
          let ext = exportType ? 'csv' : 'xlsx'
          downloadFile(data, `评价库.${ext}`)
        })
        .catch(err => {
          setLoading && (this.topBatchBtn.loading = false)
          return Promise.reject(err)
        })
    },
    searchFn(data) {
      return { ...data, taskId: +data.taskId }
    },
    tran(params, row) {
      this.$_dialog({
        fullscreen: false,
        size: 'medium',
        title: '编辑中文翻译',
        params: {
          row
        },
        cancelBtnText: '取消',
        okBtnText: '保存',
        component: () => import('./dialogs/tran.vue')
      })
      // return this.$api[`productAnalysis/rcTranslateReview`]({
      //   ...this.storeInfo,
      //   taskId: this.taskId,
      //   ...params
      // }).then(data => {
      //   if (!params.contentCn) {
      //     this.$set(row, 'contentCn', data.contentCn)
      //   }
      // })
    }
  }
}
</script>