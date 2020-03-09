<template>
  <div>
    <evaHeader activeName="second" />
    <main-layout
      @searchTrueData="val => searchData = val"
      :outerParams="storeInfo"
      :searchFields="searchFields"
      :columns="columns"
      :edit-btns="edits"
      :addQuery="true"
      edit-width="160px"
      :right-edit-btns="editBtns"
      :searchFunc="searchFn"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="productAnalysis/rcQuestionList"
      ref="layout"
      tip="选中问题进行翻译，会同步翻译回答。当对翻译结果不满意可以人工进行翻译。"
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
    return {
      searchData: {},
      taskId: +this.$route.query.taskId,
      searchFields: {
        parentAsin: {
          placeholder: '请输入ASIN',
          suffixIcon: 'el-icon-search'
        }
      },
      columns: [
        {
          label: '提问时间',
          sortable: 'custom',
          value: 'questionTime'
        },
        {
          label: 'ASIN',
          value: 'parentAsin',
          url: true,
          btnClick: scope => {
            window.open(this.currentSite.asinUrl + scope.row.parentAsin)
          }
        },
        {
          label: '提问内容',
          noTooltip: true,
          // copy: false,
          value: 'questionContent'
        },
        {
          label: '中文翻译',
          noTooltip: true,
          copy: false,
          value: 'questionContentCn'
          // render: (h, scope) => {
          //   return this.editRender(h, scope, 'questionContentCn')
          // }
        },
        {
          label: '回答数',
          sortable: 'custom',
          value: 'answerCnt',
          url: true,
          btnClick: scope => {
            this.$_dialog({
              size: 'large',
              fullscreen: false,
              title: '回答列表',
              params: {
                info: {
                  ...this.storeInfo,
                  taskId: this.taskId,
                  questionId: scope.row.questionId
                }
              },
              cancelBtnText: '关闭',
              component: () => import('./dialogs/questions.vue')
            })
          }
        }
      ],
      edits: [
        {
          name: '翻译',
          fn: scope => {
            let { questionId } = scope.row
            this.tran({ questionId }, scope.row)
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
    editRender(h, scope, str) {
      let { _editable, questionId } = scope.row,
        content = scope.row[str]
      return !_editable ? (
        <div class="flex just-sb w100">
          <el-tooltip
            class="flex over"
            style={{ flex: 1 }}
            placement="top"
            content={content}
          >
            <span style={{ flex: 1 }}>{content}</span>
          </el-tooltip>
          <el-button
            type="text"
            style="opacity: 0.4"
            icon="el-icon-edit-outline"
            on-click={() => {
              this.$set(scope.row, '_editable', true)
              this.$set(scope.row, '_editVal', scope.row[str])
            }}
          ></el-button>
        </div>
      ) : (
        <div class="flex just-sb w100">
          <el-input
            type="textarea"
            rows={1}
            autosize={{ minRows: 1, maxRows: 6 }}
            size="small"
            vModel={scope.row._editVal}
          ></el-input>
          <el-button
            type="text"
            class="ml10"
            icon="el-icon-check"
            on-click={() => {
              this.tran({ questionId, [str]: scope.row._editVal }, scope.row)
                .then(() => {
                  scope.row[str] = scope.row._editVal
                  scope.row._editable = false
                })
                .catch(() => {})
            }}
          ></el-button>
          <el-button
            type="text"
            icon="el-icon-close"
            on-click={() => {
              scope.row._editVal = scope.row[str]
              scope.row._editable = false
            }}
          ></el-button>
        </div>
      )
    },
    handleLeftBatchChange(val, selection) {
      let questionIds = selection.map(el => el.questionId)
      switch (val[0]) {
        case '导出CSV':
          this.expReview(questionIds, 1, true)
          break
        case '导出Excel':
          this.expReview(questionIds, 0, true)
          break

        default:
          break
      }
    },
    expReview(questionIds, exportType, setLoading, searchData) {
      setLoading && (this.topBatchBtn.loading = true)
      return this.$api[`productAnalysis/rcExportQuestion`]({
        questionIds,
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
          row,
          type: 'qa'
        },
        cancelBtnText: '取消',
        okBtnText: '保存',
        component: () => import('../rep/dialogs/tran.vue')
      })
      // return this.$api[`productAnalysis/rcTranslateQa`]({
      //   ...this.storeInfo,
      //   taskId: this.taskId,
      //   ...params
      // }).then(data => {
      //   if (!params.questionContentCn) {
      //     this.$set(row, 'questionContentCn', data.questionContentCn)
      //   }
      // })
    }
  }
}
</script>