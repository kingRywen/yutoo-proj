<template>
  <div>
    <main-layout
      :simple="true"
      :outerParams="info"
      :columns="columns"
      :isShowPag="false"
      :edit-btns="edits"
      ref="layout"
      url="productAnalysis/rcAnswerList"
    ></main-layout>
  </div>
</template>
<script>
export default {
  props: ['info'],
  data() {
    return {
      edits: [
        {
          name: '翻译',
          fn: scope => {
            this.tran({}, scope.row)
          }
        }
      ],
      columns: [
        {
          label: '回答时间',
          value: 'answerTime'
        },
        {
          label: '回答者',
          value: 'answerName',
          noTooltip: true,
          copy: false,
          url: 'answerUrl'
        },
        {
          label: '回答内容',
          noTooltip: true,
          copy: false,
          value: 'answerContent'
        }
        // {
        //   label: '中文翻译',
        //   value: 'answerContentCn',
        //   render: (h, scope) => {
        //     return this.editRender(h, scope, 'answerContentCn')
        //   }
        // }
      ]
    }
  },
  methods: {
    editRender(h, scope, str) {
      let { _editable, answerId } = scope.row,
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
              this.tran({ answerId, [str]: scope.row._editVal }, scope.row)
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
    tran(params, row) {
      this._openDialog({
        fullscreen: false,
        size: 'small',
        title: '翻译',
        params: {
          row,
          type: 'question'
        },
        cancelBtnText: '关闭',
        // okBtnText: '保存',
        component: () => import('../../rep/dialogs/tran.vue')
      })
    }
  }
}
</script>