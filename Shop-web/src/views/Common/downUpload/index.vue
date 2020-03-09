<!--  -->
<template>
  <div>
    <div>
      <a v-show="false" ref="exportExcel"></a>
    </div>
    <div style="position:relative;">
      <div style="position:relative;left:100px;top:-6px;width: 300px;">
        <el-upload style="margin-top:8px;" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleFileChange" :file-list="fileList" :on-remove="handleFileRemove" :auto-upload="false">
          <el-button size="mini" type="primary" plain>导入数据</el-button>
        </el-upload>
      </div>
      <el-button size="mini" type="primary" plain @click="downLoad" style="position:relative;left:0px;top:-6px;position:absolute;left: 270px;top:-6px;">下载模板</el-button>
    </div>
  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from "Config";
export default {
  components: {},
  props: ["params"],
  data() {
    return {
      fileList: []
    };
  },

  created() {},
  mounted() {},
  methods: {
    //导入提交
    _submit() {
      const { BASE_URL } = CONST_PORT_CONFIG;
      let params = new FormData();
      params.append("siteId", this.siteId);
      params.append("sellerId", this.sellerId);
      // params.append("platformId", this.platformId);
      params.append("file", this.fileList[0].raw);
      let headers = { headers: { "Content-Type": "multipart/form-data" } };
      return this.$ajax
        .post(BASE_URL + this.params.uploadUrl, params, headers)
        .then(res => {
          // console.log(res);
          let code = res.code;
          if (code == 0) {
            this.$message.success(res.msg);
            //this.getParent();
            this.$parent.$parent.$parent.$parent.handleCancelClick();
          } else if (code === 500) {
            this.$message.error(res.msg);
          }
        });
    },
    // 上传模板
    handleFileChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    handleFileRemove(file, fileList) {
      this.fileList = [];
    },
    // 下载模板
    downLoad() {
      const { BASE_URL } = CONST_PORT_CONFIG;
      let that = this;
      console.log(that.params);
      this.$ajax({
        method: "post",
        url: BASE_URL + this.params.downLoadUrl,
        data: "",
        responseType: "blob"
      })
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", that.params.excellName + ".xlsx");
          y.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          // console.log(error);
        });
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
</style>
