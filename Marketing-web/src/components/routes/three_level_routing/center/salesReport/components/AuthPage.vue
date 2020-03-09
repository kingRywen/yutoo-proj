<template>
  <div class="box">
    <div class="wrapper">
      <div>
      <img src="./auth.png" alt="" width="200">
    </div>
    <div class="text">
      <h3>您的店铺未开启数据监控</h3>
      <p>立刻前往
        <router-link to="/admin/shopAuthorization" tag="a">店铺授权</router-link>
        添加授权并开通监控</p>
    </div>
    </div>
    
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .wrapper {
    display: flex;
    transform: translateY(-30%);
    .text {
      color: #666;
      margin-left: 40px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      h3 {
        font-size: 24px;
        font-weight: normal;
      }
      p {
        color: #999;
        line-height: 3;
        font-size: 16px;
        a {
          outline-style:none;
          font-size: 16px;
          text-decoration: none;
          &:visited, &:link, &:active {
            color: #179dff;
          }
          
          &:hover {
            color: #0a6ab0;
          }
        }
      }
    }
  }
}
</style>
