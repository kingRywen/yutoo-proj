<template>
  <div class="import-province">
    <el-row style="min-height: 160px;">
      <el-col :span="24">
        <el-button type="primary" size="small" class="upload">上传文件</el-button>
        <el-button type="primary" size="small" class="updown">下载模板</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    submitForm(cb) {
      cb && cb()
    },
    resetForm() {}
  }
}
</script>

<style lang="scss">
.import-province {
  background: #fff;
  .upload {
    margin-left: 15%;
  }
  .updown {
    margin-left: 20%;
  }
}
</style>
