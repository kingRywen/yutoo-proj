<template>
  <ImportFile ref="file" :action="action" downloadApi="finance/financeBooksAccountDetailListTemplate" @success="close" @error="close" />
</template>

<script>
import ImportFile from './ImportFile';
export default {
  components: {
    ImportFile
  },
  data() {
    return {
      action:`/finance/books/account/detail/upload`
    }
  },
  methods: {
    async _submit(done) {
      if (!this.$refs.file.fileList.length) {
        this.$message.warning('请选择上传文件')
        done()
        return
      }
      this.done = done
      this.$refs.file.submitUpload()
    },
    close() {
      this.done(true)
    }
  },
}
</script>

<style>

</style>
