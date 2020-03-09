

export default {
  data() {
    return {
      editId: null,
    }
  },
  methods: {

    openAdd(title, editId) {
      this.editId = editId

      this.dialogOptions.visible = true
      this.dialogOptions.title = title

    },
    checked(more = true) {
      let data = this.$refs.lay.getCheckedData()
      if (more && !data.length) {
        this.$message.warning('请选择数据进行操作')
        return
      }
      if (!more && data.length !== 1) {
        this.$message.warning('请选择一条数据进行操作')
        return
      }
      return this.$refs.lay.getCheckedData()
    },
    resetData() {
      this.$refs.lay.reset()
    },
    refreshData() {
      this.$refs.lay.handleSearch()
    },
    loadData(data) {
      let {
        time = [], ...info
      } = data
      let [queryStartDate, queryEndDate] = time
      let params = {
        queryStartDate,
        queryEndDate,
        ...info
      }
      return this.$api[`main/${this.listApi}`](params)
        .then(data => {
          return Promise.resolve(data)
        })
        .catch(() => { })
    },
    handleDel(row, title, delApi = 'merchantOrderCancellation', _string, isIdArray) {

      let vm = this
      row = !isIdArray ? row.map(el => ({
        [_string]: el[_string]
      })) : { idArray: row.map(el => el[_string]) }
      vm.$confirm(
        title,
        '警告', {
        type: 'warning'
      }
      )
        .then(() => {
          vm.$api[`main/${delApi}`](row)
            .then(() => {
              vm.$refs.lay.handleSearch()
              if (vm.$refs.lay.$refs.tree) {
                vm.$refs.lay.refreshTree()
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    },
  },
};