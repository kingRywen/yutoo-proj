export const mixins = {
  data() {
    return {}
  },
  methods: {
    //提示消息
    coincident(msg) {
      this.$message.success(msg)
      this.$refs.page.resetForm()
      this.$refs.page.getList()
    }
  }
}
