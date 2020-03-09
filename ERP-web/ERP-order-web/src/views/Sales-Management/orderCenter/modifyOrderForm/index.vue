<template>
  <div class="build">
    <div class="box">
      <div>
        <img src="./building.png" alt="正在建设中...">
      </div>

      <div class="text">正在建设中...</div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.build {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .box {
    text-align: center;
    .text {
      margin-top: 20px;
      font-size: 24px;
      color: #7d91b8;
    }
  }
}
</style>
