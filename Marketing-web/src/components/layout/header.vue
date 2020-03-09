<template>
  <div class="header-wrapper">

    <div class="menu __menumain">
      <el-menu popper-class="popper-menu" @select="handleSelect" class="el-menu-demo" mode="horizontal" background-color="#272b2c" text-color="#fafafa" :default-active="menuIndex">
        <div class="menu_box">
          <el-menu-item index="zero">首页</el-menu-item>
          <el-menu-item index="first" @click="goBuyMenu">账号充值</el-menu-item>
        </div>
        <div class="menu_box after">
          <el-submenu index="third" :show-timeout="timeout" :hide-timeout="timeout" popper-class="custom-my">
            <template slot="title">
              <span style="cursor:pointer;display: flex;align-items: center;height: 50px;" class="font14">
                <img style="display: block;" class="mine" src="~@/assets/mine.png">
              </span>
            </template>
            <el-menu-item index="3-0" disabled style="opacity: 1">{{this.userName}}</el-menu-item>
            <el-menu-item index="3-1" @click.native="PersonalCenter">个人中心</el-menu-item>
            <el-menu-item index="3-2" @click.native="exit">退出</el-menu-item>
          </el-submenu>
          <el-menu-item index="feedback" style="line-height: 50px;" @click="goFeedback">
            <div>
              <i class="iconfont icon-yijianfankui" style="vertical-align: top;position:relative;top:1px;"></i>
              <span class="font15" style="vertical-align: top;">反馈</span>
            </div>
          </el-menu-item>
          <el-menu-item index="message" style="line-height: 50px;" @click="goMessage('jadge')">
            <div @mouseover="showMessage" @mouseout="hiddenMessage" style="height:50px">
              <div style="height:50px">
                <el-badge :hidden="unreadCnt===0?true:false" :value="unreadCnt" :max="99" class="item" style="height:50px;display:block">
                  <i class="iconfont icon-tongzhi" style="vertical-align: top;"></i>
                  <span class="font15" style="vertical-align: top;">消息</span>
                </el-badge>
              </div>
              <!-- 消息弹窗 -->
              <transition name="mybox">
                <section v-show="boxshow" class="message_box">
                  <header>
                    <el-row style="height:30px" type="flex" justify="space-between">
                      <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
                        <span>消息&nbsp;&nbsp;(</span>
                        <span v-if="unreadCnt===0?true:false">&nbsp;0&nbsp;</span>
                        <span v-if="unreadCnt===0?false:true" class="not_read_count" @click.stop="goMessage('noRead')">{{unreadCnt||0}}</span>
                        <span>)&nbsp;&nbsp;条未读</span>
                      </el-col>
                      <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
                        <span class="read" @click="signRead" v-if="unreadCnt===0?false:true">全部标记为已读</span>
                      </el-col>
                    </el-row>
                  </header>
                  <section>
                    <div class="ul">
                      <div class="noMessage" v-if="messageArr.length===0?true:false">
                        暂无消息
                      </div>
                      <div v-if="messageArr.length===0||index>4?false:true" v-for="(item,index) in messageArr">
                        <span v-if="item.isRead===0?true:false" class="noread icon">
                        </span>
                        <span v-if="item.isRead===1?true:false" class="read icon">
                        </span>
                        <span class="content fix__row_1" @click.stop="goMessage('jadgeRead',item)">
                          <span v-if="item.title">《{{item.title}}》：</span>
                          {{item.content}}
                        </span>
                        <br>
                        <span v-if="item.createTime" style="color:#999;position:relative;top:-5px;">{{item.createTime}}</span>
                      </div>
                    </div>
                  </section>
                  <div style="height:1px;border-top:1px solid rgba(39, 43, 44, 0.94);"></div>
                  <footer @click.stop="goMessage('all')">
                    查看全部消息
                  </footer>
                </section>
              </transition>
            </div>
          </el-menu-item>
          <el-submenu index="second" :show-timeout="timeout" :hide-timeout="timeout" id="platform" popper-class="custom-site">
            <template slot="title"><img style="width: 24px;margin-right: 4px;margin-top: -2px;" src="~@/assets/USA.png" />{{platformTitle}}</template>
            <el-submenu :index="item.platformId+''" v-for="item in stateData" :show-timeout="timeout" :hide-timeout="timeout">
              <template slot="title">{{item.platformName}}</template>
              <el-menu-item :index="item.platformId+',1'" show-timeout="0" hide-timeout="0">美国站</el-menu-item>
            </el-submenu>
          </el-submenu>
        </div>

      </el-menu>
    </div>
    <div class="menu-bar" :style="barStyle"></div>
  </div>

</template>
<script>
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";

export default {
  props: ["lists", "activedIndex"],
  data() {
    return {
      barStyle: { width: 0 },
      menuIndex: null,
      // 系统消息
      // unreadCnt: 0,
      // messageArr: []
      // 系统消息动画
      boxshow: false,
      timeout: 0, //el-menu收起展开延时
      list: [
        {
          index: "zero",
          name: "首页",
          func: this.goIndex,
          isActived: true
        },
        {
          index: "first",
          name: "账号充值",
          func: this.goBuyMenu,
          isActived: false
        }
      ],
      // todod
      platformTitle: "Amazon",
      AccountRecharge: "账号充值"
    };
  },

  created() {
    GLOBAL.vbus.$on("reset.menubar", () => {
      this.setBar();
    });
    this.setBar.num = 0;
    if (this.$route.meta.notShowPoint) {
      return;
    }
    this.getSelectPlatformApi({});
    if (this.$route.path !== "/admin/messageCenter") {
      this.getMessage();
    }
  },
  mounted() {
    window.onresize = this.setBar;
    // 处理默认选中头部菜单
    this.handleMenuIndex();
    // console.log(this.stateData);
    if (this.$route.meta.notShowPoint) {
      return;
    }
    if (this.$route.query.pageId) {
      this.$store.commit("common/savePageId", this.$route.query.pageId);
      // 如果用户刷新的是充值的页面，则讲评台的id存为-1，方便切换平台的时候出发watch
      this.$store.commit("common/savePlatformIdAndSiteId", "-2,1");
    }
    if (!this.$route.query.pageId) {
      this.$store.commit(
        "common/savePlatformIdAndSiteId",
        sessionStorage.getItem("platformId") || "1,1"
      );
    }
    this.$store.commit("selectPlatform/isGetFromSessionStorage", true);
    this.$router.push(sessionStorage.getItem("path") || "/index");
    setTimeout(() => {
      this.setBar();
    });
  },
  methods: {
    ...mapActions("selectPlatform", ["getSelectPlatformApi"]),
    ...mapMutations("selectPlatform", {
      aaaaa: "addSelectPlatform"
    }),
    // 请求消息
    getMessage() {
      // 一开始显示5条
      this.$axios
        .post("/MerchantMessage/list", {
          pageSize: 10,
          pageNumber: 1
        })
        .then(res => {
          // console.log(res, "系统消息");
          let status = res.status;
          if (status === 200) {
            this.$store.commit("common/unreadCnt", res.data.data.unreadCnt);
            this.$store.commit("common/messageArr", res.data.rows);
            // this.message.messageArr = res.data.rows;
            // this.message.unreadCnt = res.data.data.unreadCnt;
          }
        });
    },
    // 全部标记已读
    signRead() {
      this.$axios.post("/MerchantMessage/updateRead", {}).then(res => {
        let code = res.data.code;
        if (code === 0) {
          this.$message.success(res.data.msg);
          // 处于消息页面发提示给vuex，消息页面通过wacth更新列表
          if (this.$route.path === "/admin/messageCenter") {
            let num = parseInt(this.$store.state.common.num);
            this.$store.commit("common/num", num + 1);
            return;
          }
          // 处于其他页面直接更新消息
          this.updateVuex();
          // 隐藏按钮
        } else if (code === 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 更新header消息弹窗提示用
    updateVuex() {
      let params = {
        pageNumber: 1,
        pageSize: 10,
        isRead: null
      };
      this.$axios.post("/MerchantMessage/list", params).then(res => {
        let code = res.status;
        if (code == 200) {
          this.$store.commit("common/unreadCnt", res.data.data.unreadCnt);
          this.$store.commit("common/messageArr", res.data.rows);
        }
      });
    },
    // getOneMessage(merchantMessageId) {
    //   let params = {
    //     merchantMessageId: merchantMessageId
    //   };
    //   this.$axios.post("/MerchantMessage/info", params).then(res => {
    //     this.updateVuex();
    //   });
    // },
    // 点击 消息的4种跳转
    goMessage(arg, item) {
      // this.$store.commit("common/savePlatformIdAndSiteId", "-2,1");
      this.boxshow = false;
      let count = this.unreadCnt;
      // console.log(arg, "1");
      let url;
      if (arg === "jadge") {
        // 1.大菜单
        if (count != 0) {
          url = "/admin/messageCenter?pageId=2&isRead=0&count=" + count;
        } else if (count == 0) {
          url = "/admin/messageCenter?pageId=2&count=" + count;
        }
      } else if (arg === "noRead") {
        // 2.未读数量
        url = "/admin/messageCenter?pageId=2&isRead=0&count=" + count;
      } else if (arg === "jadgeRead") {
        if (item.isRead === 0) {
          // 3.1单条 已读
          url =
            "/admin/messageCenter?pageId=2&count=" +
            count +
            "&merchantMessageId=" +
            item.merchantMessageId +
            "&isRead=0";
        } else if (item.isRead === 1) {
          // 3.2单条 未读
          url =
            "/admin/messageCenter?pageId=2&count=" +
            count +
            "&merchantMessageId=" +
            item.merchantMessageId;
        }
        // 未读的请求接口设置为已读
        // this.getOneMessage(item.merchantMessageId);
      } else if (arg === "all") {
        // 4.查看全部
        url = "/admin/messageCenter?pageId=2&count=" + count;
      }
      url = url + "&time=" + new Date().getTime();
      this.$store.commit("common/messageUrl", url);
      this.$nextTick(() => {
        this.$router.push(url);
      });
    },
    // 鼠标以上消息项
    showMessage() {
      this.boxshow = true;
    },
    hiddenMessage() {
      this.boxshow = false;
    },
    handleSelect(key, keyPath) {
      this.setBar();
      this.menuIndex = keyPath[0];
      if (keyPath[0] === "second") {
        this.$store.commit("common/savePlatformIdAndSiteId", key);
        this.$store.commit("selectPlatform/isGetFromSessionStorage", false);
        sessionStorage.setItem("platformId", key);
      }
    },
    setBar() {
      this.setBar.num = this.setBar.num == null ? 0 : this.setBar.num + 1;
      this.$nextTick(() => {
        let el = document.querySelectorAll(
          ".__menumain .menu_box > li.is-active"
        )[0];

        if (!el && this.setBar.num < 10) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.setBar();
          }, 300);
          return;
        }
        this.timer = null;

        if (!el) {
          return;
        }

        let bound = el.getBoundingClientRect();
        const { width, left } = bound;
        if (el.id === "platform") {
          this.barStyle = {
            width: width + "px",
            left: left + "px"
          };
          return;
        }
        this.barStyle = {
          width: width + "px",
          left: left + "px"
        };
      });
    },
    goFeedback() {
      let url = "/admin/feedbackCenter?pageId=2";
      this.$nextTick(() => {
        this.$router.push(url);
      });
    },
    handleMenuIndex() {
      let path = this.$route.path;
      if (path === "/admin/messageCenter") {
        this.menuIndex = "message";
      } else if (path === "/admin/personalCenter") {
        this.menuIndex = "third";
      } else if (path === "/admin/rechargePage") {
        this.menuIndex = "first";
      } else if (path === "/admin/feedbackCenter") {
        this.menuIndex = "feedback";
      } else if (path === "/admin/center") {
        let platformId = sessionStorage.getItem("platformId") || "1,1";
        let newPlatformId = platformId.split(",")[0];
        if (newPlatformId == -2) {
          this.platformTitle = "选择平台";
          return;
        }
        if (newPlatformId == 1) {
          this.platformTitle = "Amazon";
        } else if (newPlatformId == 2) {
          this.platformTitle = "eBay";
        } else if (newPlatformId == 3) {
          this.platformTitle = "AliExpress";
        } else if (newPlatformId == 4) {
          this.platformTitle = "Wish";
        } else if (newPlatformId == 5) {
          this.platformTitle = "Walmart";
        }
        this.menuIndex = platformId;
      }
    },

    // 获取当前页面的路由，控制左边菜单栏
    handlerSiderByRoute(newRoute) {
      let siderBarPath = newRoute.meta.siderBarPath;
      if (siderBarPath) {
        // console.log(siderBarPath, 1);/
        this.$store.commit("common/pathFromCheckProductAnalysis", siderBarPath);
        // console.log(this.$store.state.common.pathFromCheckProductAnalysis, 2);
      }
    },
    // 退出
    exit() {
      this.LogOut();
    }
  },
  beforeDestroy() {
    window.onresize = null;
  },
  computed: {
    // 当前激活菜单todo
    unreadCnt() {
      return this.$store.state.common.unreadCnt;
    },
    messageArr() {
      return this.$store.state.common.messageArr;
    },
    ...mapState("selectPlatform", {
      stateData: "selectPlatformData"
    }),
    ...mapGetters("menu", {
      menus: "allMenus"
    }),
    userName() {
      return (
        this.$store.state.common.setLoginData ||
        localStorage.getItem("userName")
      );
    },
    savePlatformIdAndSiteId() {
      return this.$store.state.common.savePlatformIdAndSiteId;
    },
    platformId() {
      return this.$store.state.common.savePlatformIdAndSiteId.split(",")[0];
    },
    pageId() {
      // return this.$store.state.common.pageId;
    }
  },
  watch: {
    platformId() {
      sessionStorage.removeItem("market_cateList");
    },
    $route(newRoute) {
      this.setBar.num = 0;
      this.handleMenuIndex();
      this.handlerSiderByRoute(newRoute);
      // console.log("genxiong", sessionStorage.getItem("platformId"));
      // 如果新的路由不是充值的，则存入sessionstorage中的平台id，选择平台那里的显示
      if (
        newRoute.path !== "/admin/rechargePage" &&
        newRoute.path !== "/admin/personalCenter" &&
        newRoute.path !== "/admin/messageCenter" &&
        newRoute.path !== "/admin/feedbackCenter"
      ) {
        this.$store.commit(
          "common/savePlatformIdAndSiteId",
          sessionStorage.getItem("platformId") || "1,1"
        );
        this.$store.commit("common/savePageId", -2);
        this.AccountRecharge = "账号充值";
      }
      // 如果路由是充值的那两个页面，则存入pageId出发显示隐藏
      if (
        newRoute.path == "/admin/rechargePage" ||
        newRoute.path == "/admin/personalCenter" ||
        newRoute.path == "/admin/payPage" ||
        newRoute.path == "/admin/payedPage" ||
        newRoute.path == "/admin/personalCenter" ||
        newRoute.path == "/admin/messageCenter" ||
        newRoute.path == "/admin/feedbackCenter"
      ) {
        this.$store.commit("common/savePageId", this.$route.query.pageId || 1);
        this.$store.commit("common/savePlatformIdAndSiteId", "-2,1");
      }
      setTimeout(() => {
        this.setBar();
      });
    },
    savePlatformIdAndSiteId(newSavePlatformIdAndSiteId, old) {
      let newPlatformId = newSavePlatformIdAndSiteId.split(",")[0];
      // 在切换我购买套餐的时候回改变为-2，-2是返回，不进行跳转
      if (newPlatformId == -2) {
        this.platformTitle = "选择平台";
        return;
      }
      if (newPlatformId == 1) {
        this.platformTitle = "Amazon";
      } else if (newPlatformId == 2) {
        this.platformTitle = "eBay";
      } else if (newPlatformId == 3) {
        this.platformTitle = "AliExpress";
      } else if (newPlatformId == 4) {
        this.platformTitle = "Wish";
      } else if (newPlatformId == 5) {
        this.platformTitle = "Walmart";
      }
      this.$store.commit("common/savePageId", "");
      let path = this.$route.path;
      if (this.$store.state.selectPlatform.isGetFromSessionStorage === false) {
        if (path != "/admin/center" && newSavePlatformIdAndSiteId != -2) {
          this.$store.commit(
            "common/pathFromCheckProductAnalysis",
            "/admin/center"
          );
          this.$router.push("/admin/center");
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.menu-bar {
  background-color: rgb(0, 192, 222);
  position: absolute;
  right: 0;
  bottom: 0;
  height: 3px;
  transition: all 0.2s ease;
  top: 47px;
}
.logo {
  background: #272b2c;
}
.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 800px;
}
h2 {
  width: 180px;
  font-size: 28px;
  text-align: center;
}
.menu {
  flex: auto;
  padding-right: 15px;
}
.menu ul {
  list-style: none;
  display: flex;

  // max-width: 1060px;
  margin-left: 20px;
  .menu_box {
    display: flex;
    // justify-content: space-between;
    &.after {
      outline: none;
      flex: 1;
      flex-direction: row-reverse;
      justify-content: initial;
    }
  }
}
.menu ul li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 50px;
  width: auto;
  /* flex: auto; */
  align-items: center;
  // line-height: 30px;
  cursor: pointer;
  font-size: 15px;
  color: #fafafa;
  // &:hover {
  //   color: #fafafa;
  //   background: #3a3f51;
  // }
}

.logged {
  padding: 0 20px;
  color: #b4b6bd;
  &:hover {
    color: #fafafa;
    background: #3a3f51;
  }
  .el-dropdown {
    color: #fafafa;
    &:hover {
      color: #fafafa;
      background: #3a3f51;
    }
  }
  /* margin-right: 50px; */
}
.mine {
  vertical-align: middle;
  margin-right: 10px;
  width: 26px;
  filter: grayscale(70%);
  filter: gray;
}
.active {
  background: #3a3f51;
}
.choosePlat {
  font-size: 15px;
  color: #b4b6bd;
  margin-right: 200px;
  cursor: pointer;
  padding: 0 20px;
  &:hover {
    color: #fafafa;
    background: #3a3f51;
  }
  .icon {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-top: 4px solid \9;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }
}
// 系统消息动画
.mybox-leave-active,
.mybox-enter-active {
  transition: all 0.2s ease;
}
.mybox-leave-active,
.mybox-enter {
  height: 0px !important;
}
.mybox-leave,
.mybox-enter-active {
  height: 350px;
}
// 消息容器
.message_box {
  box-sizing: border-box;
  cursor: auto;
  color: #fafafa;
  text-align: left;
  position: absolute;
  top: 50px;
  border: 1px solid rgba(39, 43, 44, 0.94);
  z-index: 9999;
  right: 14px;
  background-color: rgba(39, 43, 44, 0.9);
  width: 320px;
  height: 370px;
  padding: 10px 20px;
  overflow: hidden;
  header {
    height: 36px;
    line-height: 36px;
    .not_read_count {
      cursor: pointer;
      color: #f56c6c;
      padding: 0px 3px;
      &:hover {
        text-decoration: underline;
      }
    }
    .read {
      cursor: pointer;
      color: #00c0de;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  section {
    letter-spacing: 2px;
    box-sizing: border-box;
    width: 100%;
    height: 284px;
    .ul {
      display: block;
      margin-left: 0;
      border-top: 1px solid rgba(39, 43, 44, 0.94);
      padding-top: 20px;
      .noMessage {
        text-align: center;
        height: 280px;
        line-height: 280px;
        cursor: auto;
        &:hover {
          opacity: 1;
          color: #fafafa;
          text-decoration: none;
        }
      }
      div {
        letter-spacing: 1px;
        white-space: normal;
        width: 100%;
        font-size: 12px;
        margin-bottom: 12px;
        line-height: 1.1em;
        position: relative;
        .content {
          padding-left: 15px;
          &:hover {
            opacity: 0.8;
            color: #00c0de;
            text-decoration: underline;
            cursor: pointer;
          }
        }
        .fix__row_1 {
          overflow: hidden;
          display: -webkit-box;
          text-overflow: ellipsis; // display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .icon {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 0px;
        }
        .noread {
          background: #00c0de;
        }
        .read {
          background: #f3f3f3;
        }
      }
    }
  }
  footer {
    width: 50%;
    height: 30px;
    text-align: center;
    margin: 0 auto;
    margin-top: 4px;
    line-height: 30px;
    cursor: pointer;
    color: #00c0de;
    &:hover {
      // background: #000000;
      opacity: 0.8;
      color: #00c0de;
    }
  }
}
</style>

<style lang='scss'>
.header-wrapper {
  .el-menu--popup-bottom-start {
    margin-top: 0px;
    border: 1px solid #181818;
  }
}
.custom-my {
  .el-menu--popup {
    padding: 0;
    right: 3px;
  }
}
.custom-site {
  .el-menu--popup {
    padding: 0;
    min-width: 140px !important;
  }
  .el-submenu {
    .el-menu--horizontal {
      width: 140px !important;
      & > .el-menu--popup-right-start {
        & > li {
          min-width: 140px !important;
        }
      }
    }
  }
}
</style>

