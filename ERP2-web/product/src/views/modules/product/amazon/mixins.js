export default {
  methods: {
    showTips(data, cb, errCb) {
      this.$confirm(data.msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      })
        .then(() => {
          if (cb) {
            return cb().then(() => this.$refs.layout.getList())
          }
          this.$refs.layout.getList()
        })
        .catch(() => {
          if (errCb) {
            return errCb()
          }
          // this.$refs.layout.getList()
        })
    }
  },
};
