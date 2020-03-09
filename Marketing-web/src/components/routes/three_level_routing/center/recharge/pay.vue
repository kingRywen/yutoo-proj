<!-- 支付页面 -->
<template>
  <div class="payContainer" v-loading="Loaidng">
    <main class="main">
      <header class="header">
        订单详情
        <button class="button" @click="goBack()">返回上一级</button>
      </header>
      <section class="section">
        <!-- ul1 -->
        <ul style="width:100%;height:50px;">
          <li>
            <span class="icon"></span>
            订单名称
          </li>
          <li>{{orderData.packageName?orderData.packageName:"-"}}</li>
        </ul>
        <!-- ul2 -->
        <ul>
          <li>
            <span class="icon"></span>
            套餐点数
          </li>
          <li>{{orderData.duration?orderData.duration+"点":"-"}}</li>
        </ul>
        <!-- ul3 -->
        <ul>
          <li>
            <span class="icon"></span>
            创建时间
          </li>
          <li>{{orderData.createTime?orderData.createTime:"-"}}</li>
        </ul>

        <!-- ul4 -->
        <ul style="margin-top:50px;">
          <li>
            <span class="icon"></span>
            图片空间容量
          </li>
          <li>{{orderData.capacity?orderData.capacity:"-"}}</li>
        </ul>
        <!-- ul5 -->
        <ul>
          <li>
            <span class="icon"></span>
            付款状态
          </li>
          <li>{{orderData.payStatus===0||orderData.payStatus==="0"?"等待确认":"-"}}</li>
        </ul>
        <!-- line -->
        <p class="line"> </p>
        <!-- ul5 -->
        <ul style="margin-top:70px;height:60px;font-size:16px;font-weight:bold;">
          <li>
            <span class="icon"></span>
            应付金额
          </li>
          <li style="color:#E25321">{{orderData.charge?"￥"+orderData.charge:"-"}}</li>
        </ul>
        <!-- ul6 -->
        <!-- ul6 -->
        <!-- <ul style="font-size:16px;">
                    <li>
                        <span class="icon"></span>
                        选择支付方式
                    </li>
                    <li style="font-size:14px;text-align:center;color:#EC7789">
                        <div>
                            <img src="~@/assets/wechar.png">
                        </div>
                        <div>
                            微信
                        </div>
                        <div>
                            WeChat
                        </div>
                    </li>
                </ul> -->
        <div v-if="!showReload" style="margin-top:10px;color:#777;padding-left:100px;">
          此订单还未支付，请用微信扫描以下二维码进行支付
        </div>
        <div v-if="showReload" style="color:#777;padding-left:194px;">
          二维码失效，请
          <span @click="showOrder" style="cursor:pointer;color:#00c0de">刷新二维码</span>
        </div>
        <div v-show="payImg" style="margin-top:10px;color:#777;padding-left:100px;padding-right:200px;text-align:center;">
          <img id="payImg" :src="payImg" style="width:300px;height:300px;">
        </div>
        <div v-if="nonePage" style="margin-top:10px;color:#777;padding-left:100px;padding-right:200px;text-align:center;">
          <none-page>生成二维码失败</none-page>
        </div>
        <div v-if="payed" @click="toMyOrder" style="margin-top:10px;padding-left:100px;color:#EC7789;padding-right:200px;text-align:center;">
          正在跳转...
        </div>
        <div v-if="payed" style="color:#777;padding-left:100px;padding-right:200px;text-align:center;">
          完成扫描支付后，若没有自动跳转
        </div>
        <div v-if="payed" @click="toMyOrder" style="margin-top:10px;padding-left:100px;color:#EC7789;padding-right:200px;text-align:center;cursor:pointer">
          点击这里
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { MerchantOrderSave, ApiWxpayPay, WxpayQueryStatus } from "@/api/myApi";
import { baseURL } from "@/api/axios.js";
import { getQueryString } from "@/api/functions";
export default {
  components: {},
  data() {
    return {
      Loaidng: false,
      orderData: "",
      payImg: "",
      nonePage: false,
      payed: false,
      imgStatus: "",
      orderNo: "",
      fromFull: "",
      showReload: false
    };
  },

  created() {},

  mounted() {
    this.orderData = new getQueryString();
    // console.log(this.orderData, 11111);
    this.showOrder();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.fromFull = from.fullPath;
      // console.log(vm.fromFull, "上一层路由");
    });
  },
  methods: {
    goBack() {
      // this.$confirm("是否返回上一个页面?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      if (
        this.fromFull !== "/admin/personalCenter?pageId=2" &&
        this.fromFull !== "/admin/personalCenter?pageId=2&isActived=2"
      ) {
        this.$router.push("/admin/rechargePage?pageId=1");
        return;
      }
      this.$router.push("/admin/personalCenter?pageId=2&isActived=2");
      // })
      // .catch(() => {});
    },
    toMyOrder() {
      this.$router.push("/admin/personalCenter?pageId=2&isActived=2");
    },
    showOrder() {
      if (this.$route.query.orderNo) {
        let orderNo = this.$route.query.orderNo;
        this.getPayImg(orderNo);
      } else {
        this.$message.error("超时，请重新购买");
        if (this.fromFull !== "/admin/personalCenter?pageId=2") {
          this.$router.push("/admin/personalCenter?pageId=2&isActived=2");
          return;
        }
        this.$router.push("/admin/rechargePage?pageId=1");
      }
    },
    // 根据生成订单中的id请求二维码
    getPayImg(orderNo) {
      this.orderNo = orderNo;
      this.payImg =
        baseURL + ApiWxpayPay + "?orderNo=" + orderNo + "&time=" + Date.now();
      let img = document.getElementById("payImg");
      this.imgLoad(img, orderNo);
    },
    // 监听图片
    imgLoad(img, orderNo) {
      let _this = this;
      var timer = setInterval(function() {
        if (img.complete) {
          _this.callback(orderNo);
          clearInterval(timer);
        }
      }, 100);
    },
    // 图片加载完成之后调用监听支付是否完成事件
    callback(orderNo, cnt) {
      this.showReload = false;
      let params = {
        orderNo: orderNo
      };
      if (cnt) {
        params.cnt = cnt;
      }
      this.$axios.post(WxpayQueryStatus, params).then(res => {
        // console.log(res);
        if (res.data.code == 0) {
          this.payed = true;
          this.$router.push("/admin/payedPage?pageId=1");
          //   alert("支付成功");
        } else if (res.data.code == 500) {
          this.showReload = true;
          // this.$alert("二维码失效，点击页面刷新", "提示", {
          //   type: "info"
          // });
        } else if (res.data.code == 300) {
          let cnt = res.data.msg;
          this.callback(orderNo, cnt);
        }
      });
    }
  },
  computed: {},
  watch: {
    // imgStatus(newV, old) {
    //   if (newV === true) {
    //     // alert("图片加载完成");
    //     setTimeout(() => {
    //       this.callback(this.orderNo);
    //     }, 5000);
    //   }
    // }
  }
};
</script>

<style lang='scss' scoped>
.payContainer {
  background: #fafafa;
  padding: 0 0 20px !important;
}
.payContainer .main {
  margin: 0 auto;
  width: 1000px;
  border-radius: 5px;
  background: #fff;
}
.header {
  padding-top: 20px;
  text-align: center;
  color: #00c0de;
  font-size: 25px;
  font-weight: 500;
  position: relative;
  .button {
    padding: 8px 16px;
    cursor: pointer;
    background: #fcfcfc;
    color: #41618e;
    border: none;
    border-radius: 4px;
    border: 1px solid #dddddd;
    position: absolute;
    right: 20px;
  }
}
.section {
  margin: 0 120px 0 200px;
  margin-top: 30px;
  min-height: 90vh;
  ul {
    li {
      float: left;
      color: #777;
      margin-right: 0px;
      width: 160px;
      //   .icon {
      //     display: inline-block;
      //     height: 5px;
      //     width: 5px;
      //     border-radius: 50%;
      //     background: #00c0de;
      //     position: relative;
      //     top: -2px;
      //   }
    }
  }
}
.line {
  width: 100%;
  border-top: 1px solid #e5e5e5;
  position: relative;
  top: 50px;
}
</style>
