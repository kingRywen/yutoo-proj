<!--  -->
<template>
  <div class="messageCenter __wrapper_i">
    <!-- <section class="parentPosition"> -->
    <main class="main">
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
        <!-- 系统消息 -->
        <!-- 绝对定位，全部标记为已读 -->
        <!-- <el-button @click="add()" style="position:absolute;top: 73px;right:200px;z-index:100" type="text">手动添加消息（方便测试）</el-button> -->
        <el-button @click="signRead()" v-show="unreadCnt===0?false:true" style="position:absolute;top: 73px;right: 74px;z-index:100" type="text">全部标记为已读</el-button>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="全部" name="first" v-loading="loading_all">
            <div v-show="show">
              <el-card class="box-card" v-for="(item,index) in rows">
                <div slot="header" class="clearfix">
                  <span class="color_blue" v-show="item.isRead===0?true:false">[未读]</span>
                  <span class="color_999" v-show="item.isRead===0?false:true">[已读]</span>
                  <span>{{item.title||"消息"}}</span>
                  <span class="color_666" style="margin-left:20px;">{{item.createTime}}</span>
                  <el-button @click="getOneMessage(item,index,'all_tab')" v-show="item.isRead===0?true:false" style="float:right;padding: 3px 0;margin-right:10px;margin-top:3px;" type="text">标记为已读</el-button>
                </div>
                <div :id="`text${index}`" class="text item" :class="{'fix__row_1':item.className}">
                  {{item.content}}
                  <!-- 隐藏的文字跟上面的文字比较长度 -->
                  <span :id="`span${index}`" class="span">
                    {{item.content}}
                  </span>
                </div>
                <el-button v-show="item.showBtn" class="button" type="text" @click="showDetail(item, index,'all_tab')">{{item.btn}}</el-button>
              </el-card>
              <none-page v-show="!show" noBack></none-page>
            </div>
            <PageVue v-show="show" style="margin-top:20px;" v-bind:childPages="page" v-on:size-change="getSizeChange" v-on:current-page="getPage"></PageVue>
          </el-tab-pane>

          <el-tab-pane label="未读" name="second" v-loading="loading_0">
            <div v-show="show2">
              <el-card class="box-card" v-for="(item,index) in rows_0">
                <div slot="header" class="clearfix">
                  <span class="color_blue" v-show="item.isRead===0?true:false">[未读]</span>
                  <span class="color_999" v-show="item.isRead===0?false:true">[已读]</span>
                  <span>{{item.title||"消息"}}</span>
                  <span class="color_666" style="margin-left:20px;">{{item.createTime}}</span>
                  <el-button @click="getOneMessage(item,index,'one_tab')" v-show="item.isRead===0?true:false" style="float:right;padding: 3px 0;margin-right:10px;margin-top:3px;" type="text">标记为已读</el-button>
                </div>
                <div :id="`text_${index}`" class="text item" :class="{'fix__row_1':item.className}">
                  {{item.content}}
                  <span :id="`span_${index}`" class="span">
                    {{item.content}}
                  </span>
                </div>
                <el-button v-show="item.showBtn" class="button" type="text" @click="showDetail(item, index,'one_tab')">{{item.btn}}</el-button>
              </el-card>
            </div>
            <none-page v-show="!show2" noBack></none-page>
            <PageVue v-show="show2" style="margin-top:20px;" v-bind:childPages="page_0" v-on:size-change="getSizeChange_0" v-on:current-page="getPage_0"></PageVue>
          </el-tab-pane>
        </el-tabs>
      </div>

    </main>
    <!-- </section> -->
  </div>
</template>

<script>
import PageVue from "@/components/common/page.vue";
export default {
  components: { PageVue },
  data() {
    return {
      list: [{ isActived: true, text: "系统消息" }],
      loading_all: false,
      activeName: "first",
      page: {
        pageSize: 10,
        pageNumber: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      },
      rows: [],
      show: true,
      loading_0: false,
      page_0: {
        pageSize: 10,
        pageNumber: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      },
      rows_0: [],
      show2: true
    };
  },
  created() {},
  mounted() {
    //   和header的goMessage最后一笔一样 然后可以通过监听路由请求数据
    if (this.messageUrl === "") {
      let url = this.$route.fullPath;
      this.$store.commit("common/messageUrl", url);
      return;
    } else {
      if (this.$route.query.isRead && this.$route.query.isRead == 0) {
        this.getMerchantOrderList(0);
        this.activeName = "second";
        return;
      } else {
        // 全部
        this.activeName = "first";
        this.getMerchantOrderList();
      }
    }
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
    },
    handleClick(tab, event) {
      //   console.log(tab.name);
      if (tab.name === "second") {
        this.getMerchantOrderList(0);
        this.activeName = "second";
      } else {
        this.getMerchantOrderList();
      }
      //   console.log(tab, event);
    },
    // 获取消息列表
    getMerchantOrderList(isRead) {
      console.log(1);
      let params = {};
      // 全部
      if (isRead === undefined) {
        this.loading_all = true;
        params = {
          pageNumber: this.page.pageNumber,
          pageSize: this.page.pageSize,
          isRead: null
        };
      } else if (isRead == 0) {
        // 未读
        this.loading_0 = true;
        params = {
          pageNumber: this.page_0.pageNumber,
          pageSize: this.page_0.pageSize,
          isRead: isRead
        };
      }
      this.$axios
        .post("/MerchantMessage/list", params)
        .then(res => {
          if (isRead === undefined) {
            this.loading_all = false;
          } else if (isRead == 0) {
            this.loading_0 = false;
          }
          //   console.log(res);
          let code = res.status;
          if (code == 200) {
            this.updateVuex();
            // 全部
            if (isRead === undefined) {
              if (res.data.rows == "") {
                this.show = false;
                return;
              }
              if (res.data.rows != "") {
                this.show = true;
                //end
                res.data.rows.forEach((item, index) => {
                  item.className = true;
                  item.btn = "查看";
                  //   if (this.$route.query.merchantMessageId == index) {
                  //     item.className = false;
                  //     item.btn = "收起";
                  //   }
                });
              }
              this.rows = res.data.rows;
              this.page.total = res.data.total;
              this.page.pageNo = res.data.pageNo;
              this.page.totalPages = res.data.totalPages;
              // 计算文字的宽度比较是否要显示 查看 收起按钮
              this.$nextTick(() => {
                res.data.rows.forEach((item, index) => {
                  let el_text = document.getElementById(`text${index}`)
                    .clientWidth;
                  let el_span = document.getElementById(`span${index}`)
                    .clientWidth;
                  if (el_text === el_span) {
                    item.showBtn = true;
                  } else {
                    item.showBtn = false;
                  }
                });
                this.rows = Object.assign([], res.data.rows);
              });
              return;
            } else if (isRead == 0) {
              // 未读
              if (res.data.rows == "") {
                this.show2 = false;
                return;
              }
              if (res.data.rows_0 != "") {
                this.show2 = true;
                res.data.rows.forEach((item, index) => {
                  item.className = true;
                  item.btn = "查看";
                  //   if (this.$route.query.merchantMessageId) {
                  //     item.className = false;
                  //     item.btn = "收起";
                  //   }
                });
              }
              this.rows_0 = res.data.rows;
              this.page_0.total = res.data.total;
              this.page_0.pageNo = res.data.pageNo;
              this.page_0.totalPages = res.data.totalPages;
              // 计算文字的宽度比较是否要显示 查看 收起按钮
              this.$nextTick(() => {
                res.data.rows.forEach((item, index) => {
                  let el_text = document.getElementById(`text_${index}`)
                    .clientWidth;
                  let el_span = document.getElementById(`span_${index}`)
                    .clientWidth;
                  if (el_text === el_span) {
                    item.showBtn = true;
                  } else {
                    item.showBtn = false;
                  }
                });
                this.rows_0 = Object.assign([], res.data.rows);
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
          if (isRead === undefined) {
            this.loading_all = false;
          } else if (isRead == 0) {
            this.loading_0 = false;
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
    // 单条设置已读
    getOneMessage(item, index, type) {
      let params = {
        merchantMessageId: item.merchantMessageId
      };
      this.$axios.post("/MerchantMessage/info", params).then(res => {
        // console.log(res);
        let code = res.data.code;
        if (code === 0) {
          item.isRead = 1;
          if (type === "all_tab") {
            this.rows.splice(index, 1, item);
          } else if (type === "one_tab") {
            this.rows_0.splice(index, 1, item);
          }
          this.updateVuex();
        } else if (res.data.code === 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 展示每条信息的详情
    showDetail(item, index, type) {
      //   console.log(item.className);
      if (item.className === true) {
        item.btn = "收起";
        item.className = false;
        if (item.isRead === 0) {
          this.getOneMessage(item, index, type);
        }
        item.isRead = 1;
        if (type === "all_tab") {
          this.rows.splice(index, 1, item);
        } else if (type === "one_tab") {
          this.rows_0.splice(index, 1, item);
        }
        return;
      }
      item.btn = "查看";
      item.className = true;
      if (item.isRead === 0) {
        this.getOneMessage(item, index, type);
      }
      item.isRead = 1;
      if (type === "all_tab") {
        this.rows.splice(index, 1, item);
      } else if (type === "one_tab") {
        this.rows_0.splice(index, 1, item);
      }
    },
    // 全部标记已读
    signRead() {
      this.$axios.post("/MerchantMessage/updateRead", {}).then(res => {
        let code = res.data.code;
        if (code === 0) {
          this.$message.success(res.data.msg);
          if (this.activeName === "first") {
            this.getMerchantOrderList();
          } else {
            this.getMerchantOrderList(0);
          }
          // 隐藏按钮
        } else if (res.data.code === 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 监听全部分页
    // 监听分页
    getSizeChange(size) {
      this.page.pageSize = size;
      this.getMerchantOrderList();
    },
    getPage(pageNumber) {
      this.page.pageNumber = pageNumber;
      this.getMerchantOrderList();
    },
    // 监听未读分页
    // 监听分页
    getSizeChange_0(size) {
      this.page_0.pageSize = size;
      this.getMerchantOrderList(0);
    },
    getPage_0(pageNumber) {
      this.page_0.pageNumber = pageNumber;
      this.getMerchantOrderList(0);
    },
    // 添加消息
    add() {
      let str1 = this.randomText(5);
      let str2 = this.randomText(100);
      let params = {
        title: "随机标题" + str1,
        content: "随机内容" + str2
      };
      this.$axios.post("/MerchantMessage/save", params).then(res => {
        if (res.data.code === 0) {
          this.$message.success("添加成功");
          if (this.activeName === "first") {
            this.getMerchantOrderList();
          } else if (this.activeName === "second") {
            this.getMerchantOrderList(0);
          }
        } else if (res.data.code === 500) {
          this.$message.error("失败");
        }
      });
    },
    randomText(_len) {
      var i = 0;
      var _str = "";
      var _base = 20000;
      var _range = 1000;
      while (i < _len) {
        i++;
        var _lower = parseInt(Math.random() * _range);
        _str += String.fromCharCode(_base + _lower);
      }
      return _str;
    }
  },
  computed: {
    unreadCnt() {
      return this.$store.state.common.unreadCnt;
    },
    num() {
      return this.$store.state.common.num;
    },
    messageUrl() {
      return this.$store.state.common.messageUrl;
    }
  },
  watch: {
    num() {
      if (this.activeName === "first") {
        this.getMerchantOrderList();
        return;
      } else {
        this.getMerchantOrderList(0);
      }
    },
    messageUrl(newV) {
      // 获取消息列表
      if (this.$route.path === "/admin/messageCenter") {
        let has = newV.indexOf("isRead");
        if (has !== -1) {
          this.getMerchantOrderList(0);
          this.activeName = "second";
          return;
        } else {
          // 全部
          this.activeName = "first";
          this.getMerchantOrderList();
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.messageCenter {
  background: #fafafa;
  padding: 0 0 0px !important;
}
.messageCenter .main {
  margin: 0 auto;
  width: 1200px !important;
  border-radius: 5px;
  background: #fff;
  display: flex;
  // height: 100%;
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
  position: relative;
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
//end
// 每一条信息
.text {
  font-size: 12px;
}

.item {
  margin-bottom: 18px;
  position: relative;
  .span {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: " ";
  clear: both;
}
.clearfix {
  //   display: flex;
  //   flex: auto;
  //   align-items: center;
}
.button {
  padding: 3px 0;
}
.box-card {
  width: 98%;
  margin-bottom: 20px;
}
// end
</style>
