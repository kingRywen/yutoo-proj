<template>
  <div class="none">
    <img width="80" src="./empty.png" />
    <span>暂无数据</span>
  </div>
</template>

<script>
export default {
  name: 'NoneData'
}
</script>

<style lang='scss' scoped>
.none {
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    font-size: 12px;
  }
}
</style>
