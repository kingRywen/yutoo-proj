<!--  -->
<template>
  <div class="orderPage">
    <main class="main">
      <header>
        <img src="~@/assets/payed.png">支付成功
      </header>
      <section>
        <button class="button" @click="goRecharge">继续购买</button>
      </section>
      <section>
        <span class="check" @click="goOrder">查看订单&gt;</span>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.reloadPointApi();
  },
  methods: {
    goRecharge() {
      this.$router.push("/admin/rechargePage?pageId=1");
    },
    goOrder() {
      this.$router.replace("/admin/personalCenter?pageId=2&isActived=1");
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
.orderPage {
  // background: #fafafa;
  padding: 0 0 20px !important;
  height: 100%;
}
.orderPage .main {
  margin: 0 auto;
  width: 1200px !important;
  border-radius: 5px;
  background: #fff;
  height: 100%;
  header {
    width: 300px;
    margin: 0 auto;
    margin-top: 140px;
    font-size: 40px;
    color: #545454;
    img {
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  section {
    width: 300px;
    margin: 0 auto;
    .button {
      padding: 10px 20px;
      cursor: pointer;
      background: #00c0de;
      color: #fafafa;
      border: none;
      position: relative;
      left: 110px;
      top: 40px;
    }
    .check {
      cursor: pointer;
      color: #00c0de;
      border: none;
      position: relative;
      left: 120px;
      top: 70px;
      font-size: 14px;
    }
  }
}
</style>
