<!--  -->
<template>
  <div class="personalCenter __wrapper_i">
    <!-- <section class="parentPosition"> -->
    <main class="main" v-loading="Loaidng">
      <div class="list">
        <ul class="ul1">
          <li class="mine">
            <img src="~@/assets/mineBig.png">
          </li>
          <!-- <li class="order">个人中心</li> -->
          <!-- <li class="buy">消费记录</li> -->
        </ul>
        <ul class="ul2">
          <li :class="{active:item.isActived}" v-for="(item,index) in list" @click="toggleClass(item,index)">{{item.text}}</li>
        </ul>
      </div>
      <div class="context" v-show="list[0].isActived">
        <personalCenter></personalCenter>
      </div>
      <div class="context" v-show="list[1].isActived">
        <myUsing></myUsing>
      </div>
      <div class="context" v-show="list[2].isActived">
        <orderRecord></orderRecord>
      </div>
      <div class="context" v-show="list[3].isActived">
        <payRecord></payRecord>
      </div>
    </main>
    <!-- </section> -->
  </div>
</template>

<script>
import personalCenter from "./child/1_centerIndex";
import myUsing from "./child/2_my_using";
import orderRecord from "./child/3_order_record";
import payRecord from "./child/4_pay_record";
export default {
  components: { personalCenter, myUsing, orderRecord, payRecord },
  data() {
    return {
      list: [
        { isActived: false, text: "个人中心" },
        { isActived: false, text: "我的套餐" },
        { isActived: false, text: "订单记录" },
        { isActived: false, text: "消费记录" }
      ],
      Loaidng: false
    };
  },
  created() {},
  mounted() {
    if (this.$route.query.isActived) {
      let index = parseInt(this.$route.query.isActived);
      this.list[index].isActived = true;
    } else {
      this.list[0].isActived = true;
    }
  },
  methods: {
    toggleClass(item, index) {
      this.list.forEach((v, k) => {
        if (index === k) {
          v.isActived = true;
        } else {
          v.isActived = false;
        }
      });
    }
    // toRechargePage() {
    //   this.$router.push("/admin/rechargePage?pageId=1");
    // },
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
.personalCenter {
  background: #fafafa;
  padding: 0 0 0px !important;
}
.personalCenter .main {
  margin: 0 auto;
  width: 1200px !important;
  border-radius: 5px;
  background: #fff;
  display: flex;
  height: 100%;
}

.list {
  width: 200px;
  box-sizing: border-box;
  border-right: 1px solid #e3e3e3;
  ul.ul1 {
    position: relative;
    li.mine {
      height: 150px;
      img {
        display: block;
        width: 100px;
        height: 100px;
        margin: 25px auto;
      }
    }
  }
  .ul2 {
    letter-spacing: 2px;
    color: #555;
    font-weight: 500;
    li {
      text-align: center;
      height: 60px;
      width: 200px;
      box-sizing: border-box;
      line-height: 60px;
      margin-bottom: 10px;
      &:hover {
        background: #fff;
        cursor: pointer;
        border-top: 1px solid #e3e3e3;
        border-bottom: 1px solid #e3e3e3;
        border-right: 2px solid #fff;
        // border-left: 2px solid #00c0de;
      }
    }
    li.active {
      background: #fff;
      border-top: 1px solid #e3e3e3;
      border-bottom: 1px solid #e3e3e3;
      border-right: 2px solid #fff;
      border-left: 2px solid #2f353d;
      &:hover {
        cursor: default;
      }
    }
  }
}
.context {
  flex: 1;
  padding: 55px 35px 0;
  header {
    font-size: 22px;
    color: #00c0de;
    text-align: center;
  }
  section {
    margin-top: 50px;
    width: 900px;
    margin: 50px auto 20px;
  }
}
.box {
  position: relative;
}
</style>
