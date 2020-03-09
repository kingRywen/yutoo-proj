<template>
  <div class="tips" v-if="$.isTrueUserAgent()">
    <span>
      为保证页面正常显示，请使用Chrome或Firefox浏览器，点击下载
      <el-button type="text" href="https://en.softonic.com/download/chrome/windows/post-download?sl=1" @click="download('https://en.softonic.com/download/chrome/windows/post-download?sl=1')">Chrome</el-button>或
      <el-button type="text" href="https://download-ssl.firefox.com.cn/releases-sha2/stub/official/zh-CN/Firefox-latest.exe" @click="download('https://download-ssl.firefox.com.cn/releases-sha2/stub/official/zh-CN/Firefox-latest.exe')">Firefox</el-button>浏览器。如使用360、搜狗、QQ等国产浏览器请设置为“极速模式”
    </span>
  </div>
</template>

<script>
export default {
  methods: {
    download(url) {
      location.href = url;
    }
  }
};
</script>

<style scoped>
.tips {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background: #fdf6ec;
  color: #e6a23c;
  display: flex;
  text-align: center;
  line-height: 30px;
  justify-content: center;
  font-size: 14px;
}
</style>
