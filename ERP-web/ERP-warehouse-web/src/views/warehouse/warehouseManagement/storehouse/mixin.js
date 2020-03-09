
// 列表页mixin
export default {
  data() {
    return {
      selection: []
    }
  },
  methods: {
    selectChange(val) {
      this.selection = val
    },
    batchModify(api, content, params) {
      let ids = this.getChecked()
      if (ids) {
        if (content) {
          this.$.showWarning(content, () => {
            this.$api[`warehouse/${api}`]({
                ids,
                ...params
              })
              .then(() => {
                this.refresh()
              })
              .catch(() => {})
          })
        } else {
          this.$api[`warehouse/${api}`]({
              ids,
              ...params
            })
            .then(() => {
              this.refresh()
            })
            .catch(() => {})
        }
      }
    },
    getChecked(key = 'wmLocationId') {
      if (this.selection.length) {
        if (key) {
          return this.selection.map(el => el[key]).filter(el => el != null)
        }
        return this.selection
      } else {
        this.$message.warning('请选择数据进行操作')
      }
    },
    // 重置搜索刷新
    getList() {
      return this.$refs.page.resetSearchAndGetData()
    },
    // 当前搜索条件刷新列表
    refresh() {
      return this.$refs.page.getList(true)
    }
  },
}