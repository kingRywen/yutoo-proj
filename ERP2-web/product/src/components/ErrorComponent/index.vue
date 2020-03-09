<template>
  <div class="errorPage">
    <i class="iconfont img">&#xe64b;</i>
    <span>页面加载失败，请刷新重试</span>
  </div>
</template>

<script>
export default {}
</script>

<style lang='scss' scoped>
.errorPage {
  width: 100%;
  height: 100%;
  background-color: #f6f9fc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .img {
    font-size: 96px;
    margin-bottom: 50px;
    color: #e2e6ea
  }
  span {
  }
}
</style>
