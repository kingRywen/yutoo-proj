<template>
  <div class="none-wrapper">
    <img src="~@/assets/img/none.png">
    <span>暂无内容</span>
  </div>
</template>

<script>
export default {}
</script>

<style lang='scss' scoped>
.none-wrapper {
  min-height: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    font-size: 14px;
    margin: 20px 0;
    color: #6c7c9d;
  }
}
</style>
