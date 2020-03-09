<!--  -->
<template>
    <div class="feedbackCenter __wrapper_i">
        <!-- <section class="parentPosition"> -->
        <main class="main" v-loading="Loaidng">
            <div class="list">
                <ul class="ul1">
                    <li class="mine">
                        <img src="~@/assets/mineBig.png">
                    </li>
                </ul>
                <ul class="ul2">
                    <li :class="{active:item.isActived}" v-for="(item,index) in list" @click="toggleClass(item,index)">{{item.text}}</li>
                </ul>
            </div>
            <div class="context" v-show="list[0].isActived">
                <feedback v-on:child-msg="getChildFromFeedback"></feedback>
            </div>
            <div class="context" v-show="list[1].isActived">
                <record ref="record" v-on:child-msg="getChildFromFeedback"></record>
            </div>
        </main>
        <!-- </section> -->
    </div>
</template>

<script>
import feedback from "./child/1_feedback";
import record from "./child/2_record";
export default {
  components: { feedback, record },
  data() {
    return {
      list: [
        { isActived: true, text: "意见反馈" },
        { isActived: false, text: "反馈记录" }
      ],
      Loaidng: false,
      childMsg: null
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
      if (index === 1) {
        this.$refs.record.getList();
      }
    },
    getChildFromFeedback(msg) {
      this.childMsg = msg;
    }
  },
  computed: {},

  watch: {
    childMsg(newVal) {
      let to = newVal.slice(0, 2);
      if (to === "TS") {
        this.list.forEach((item, index) => {
          if (1 === index) {
            item.isActived = true;
          } else {
            item.isActived = false;
          }
        });
        // 切换了菜单之后，调用子组件的方法更新反馈信息的列表
        this.$refs.record.getList();
      } else if (to === "TF") {
        this.list.forEach((item, index) => {
          if (0 === index) {
            item.isActived = true;
          } else {
            item.isActived = false;
          }
        });
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.feedbackCenter {
  background: #fafafa;
  padding: 0 0 0px !important;
}
.feedbackCenter .main {
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
