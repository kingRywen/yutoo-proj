<template>
  <el-upload
    action
    list-type="picture-card"
    :auto-upload="true"
    :show-file-list="false"
    :http-request="handleHttpRequest"
    multiple
    accept=".jpg, .png, .gif"
    :drag="drag"
    :disabled="disabled"
    :on-change="onChange"
  >
    <i v-if="addFlag" slot="default" class="el-icon-plus"></i>
    <div v-else class="contain-wrap" slot="default">
      <ElButton class="update-btn" type="primary">{{btnText}}</ElButton>
      <div style="margin-top: -100px">{{lowText}}</div>
    </div>
  </el-upload>
</template>

<script>
import { oss } from "@yutoo/yutoo/utils/utils.umd.min";
import { OSS_CONFIG } from "Config";
export default {
  props: {
    addFlag: {
      type: Boolean,
      default: true
    },

    btnText: {
      type: String,
      default: "添加图片"
    },
    lowText: {
      type: String,
      default: "可以直接拖拽和复制黏贴上传图片"
    },
    uploadType: {
      type: String,
      default: "product-img"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drag: false,
      fileList: []
    };
  },
  created() {},
  computed: {},
  methods: {
    handleHttpRequest() {
      let vm = this;
      let token = this.$store.state.auth.token;
      vm.$api[`product/constantRealPathGet`]({
        uploadType: vm.uploadType
      })
        .then(async data => {
          let { filePath } = data;
          let res = await oss.batchUpload(
            vm.fileList.filter(item => !item.up).map(item => item.raw),
            filePath,
            OSS_CONFIG.signUrl,
            null,
            token
          );
          vm.fileList = vm.fileList.map(item => (item.up = true));
          this.$emit("upload", res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChange(file, fileList) {
      this.fileList = fileList;
    }
  }
};
</script>

<style lang='scss'>
.upload {
  background: #fff;
}
</style>