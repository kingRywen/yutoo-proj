<!-- tab个人中心 -->
<template>
  <div class="recordCom">
    <div>
      <header>反馈记录</header>
      <section class="feedContent">
        <el-button @click="Delete('all')" v-show="data_all.rows.length>0?true:false" style="position:absolute;top: 0px;right: 120px;z-index:100" type="text">
          全部删除
        </el-button>
        <el-button @click="Delete()" v-show="data_all.rows.length>0?true:false" :disabled="deleteShow" style="position:absolute;top: 0px;right:75px;z-index:100" type="text">
          删除
        </el-button>
        <el-button @click="toActiveOne" style="position:absolute;top: 0px;right: 20px;z-index:100" type="text">
          提意见
        </el-button>
        <el-tabs v-model="activeName" type="card">
          <!-- tab1 -->
          <el-tab-pane label="全部" name="first" v-loading="loading_all">
            <el-checkbox-group v-model="checkList_all" v-if="data_all.rows.length>0?true:false">
              <Child :data="data_all"></Child>
            </el-checkbox-group>
            <none-page v-else noBack></none-page>
            <PageVue v-if="data_all.rows.length>0?true:false" style="margin-top:20px;" v-bind:childPages="page_all" v-on:size-change="get_size_all" v-on:current-page="get_page_all"></PageVue>
          </el-tab-pane>
          <!-- tab2 -->
          <el-tab-pane label="已回复" name="second" v-loading="loading_1">
            <el-checkbox-group v-model="checkList_1" v-if="data_1.rows.length>0?true:false">
              <Child :data="data_1"></Child>
            </el-checkbox-group>
            <none-page v-else noBack></none-page>
            <PageVue v-if="data_1.rows.length>0?true:false" style="margin-top:20px;" v-bind:childPages="page_1" v-on:size-change="get_size_1" v-on:current-page="get_page_1"></PageVue>
            <!-- tab3 -->
          </el-tab-pane>
          <el-tab-pane label="未回复" name="third" v-loading="loading_0">
            <el-checkbox-group v-model="checkList_0" v-if="data_0.rows.length>0?true:false">
              <Child :data="data_0"></Child>
            </el-checkbox-group>
            <none-page v-else noBack></none-page>
            <PageVue v-if="data_0.rows.length>0?true:false" style="margin-top:20px;" v-bind:childPages="page_0" v-on:size-change="get_size_0" v-on:current-page="get_page_0"></PageVue>
          </el-tab-pane>
        </el-tabs>
      </section>
    </div>
  </div>
</template>

<script>
import Child from "./child/child";
// import Second from "./child/2_tab_reply";
import PageVue from "@/components/common/page.vue";
export default {
  components: { Child, PageVue },
  data() {
    return {
      activeName: "first",
      //
      loading_all: false,
      loading_1: false,
      loading_0: false,
      //
      page_all: {
        pageSize: 10,
        pageNumber: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      },
      page_1: {
        pageSize: 10,
        pageNumber: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      },
      page_0: {
        pageSize: 10,
        pageNumber: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      },
      //
      data_all: {
        show: false,
        rows: [],
        type: "all",
        showDetail: this.showDetail
      },
      data_1: {
        show: false,
        rows: [],
        type: "1",
        showDetail: this.showDetail
      },
      data_0: {
        show: false,
        rows: [],
        type: "0",
        showDetail: this.showDetail
      },
      //
      checkList_all: [],
      checkList_1: [],
      checkList_0: []
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    //   请求列表
    async getList() {
      let list_all = await this.getListFun();
      // console.log(list_all.data.rows);
      let status = list_all.status;
      if (status === 200) {
        this.data_all.rows = list_all.data.rows;
        this.data_all.show = true;
        this.data_all.rows.forEach((item, index) => {
          item.className = true;
          item.show_reply = false;
          item.btn = "查看回复";
        });
        this.page_all.total = list_all.data.total;
        this.page_all.pageNo = list_all.data.pageNo;
        this.page_all.totalPages = list_all.data.totalPages;
      } else {
        this.data_all.rows = list_all.data.rows;
        this.data_all.show = false;
      }
      if (list_all) {
        let list_1 = await this.getListFun(1);
        let status = list_1.status;
        if (status === 200) {
          this.data_1.rows = list_1.data.rows;
          this.data_1.show = true;
          this.data_1.rows.forEach((item, index) => {
            item.className = true;
            item.show_reply = false;
            item.btn = "查看回复";
          });
          this.page_1.total = list_1.data.total;
          this.page_1.pageNo = list_1.data.pageNo;
          this.page_1.totalPages = list_1.data.totalPages;
        } else {
          this.data_1.rows = list_1.data.rows;
          this.data_1.show = false;
        }
        if (list_1) {
          let list_0 = await this.getListFun(0);
          let status = list_0.status;
          if (status === 200) {
            this.data_0.rows = list_0.data.rows;
            this.data_0.show = true;
            this.data_0.rows.forEach((item, index) => {
              item.className = true;
              item.show_reply = false;
              item.btn = "查看回复";
            });
            this.page_0.total = list_0.data.total;
            this.page_0.pageNo = list_0.data.pageNo;
            this.page_0.totalPages = list_0.data.totalPages;
          } else {
            this.data_0.rows = list_0.data.rows;
            this.data_0.show = false;
          }
        }
      }
    },
    // tab2 请求列表 公用
    getListFun(isReply) {
      let params;
      if (isReply === undefined) {
        this.loading_all = true;
        params = {
          pageSize: this.page_all.pageSize,
          pageNumber: this.page_all.pageNumber,
          isReply: isReply
        };
      } else if (isReply === 1) {
        this.loading_1 = true;
        params = {
          pageSize: this.page_1.pageSize,
          pageNumber: this.page_1.pageNumber,
          isReply: isReply
        };
      } else if (isReply === 0) {
        this.loading_0 = true;
        params = {
          pageSize: this.page_0.pageSize,
          pageNumber: this.page_0.pageNumber,
          isReply: isReply
        };
      }
      params = this.$.dealObjectValue(params);
      return this.$axios.post("/MerchantFeedback/list", params).then(res => {
        // console.log(res, isReply);
        if (!isReply) {
          this.loading_all = false;
        } else if (isReply === 1) {
          this.loading_1 = false;
        } else if (isReply === 0) {
          this.loading_0 = false;
        }
        return res;
      });
    },
    // 展示每条信息的详情
    showDetail(item, index, type) {
      //   console.log(item);
      //   console.log(index);
      //   console.log(type);
      if (item.btn === "查看回复") {
        item.show_reply = true;
        item.btn = "收起";
        this.update_data(item, index, type);
        return;
      } else {
        item.show_reply = false;
        item.btn = "查看回复";
        this.update_data(item, index, type);
      }
    },
    // 不请求，更新一下点击后的文字
    update_data(item, index, type) {
      if (type === "all") {
        this.data_all.rows.splice(index, 1, item);
      } else if (type === "1") {
        this.data_1.rows.splice(index, 1, item);
      } else if (type === "0") {
        this.data_0.rows.splice(index, 1, item);
      }
    },
    // 全部删除&删除
    Delete(arg) {
      let params;
      let text;
      if (arg === "all") {
        text = "此操作将删除所有反馈消息（包括已回复和未回复），是否继续？";
        params = {
          merchantFeedbackIds: []
        };
      } else if (!arg) {
        text = "此操作将删除当前选中项，是否继续？";
        if (this.activeName === "first") {
          params = {
            merchantFeedbackIds: this.checkList_all
          };
        } else if (this.activeName === "second") {
          params = {
            merchantFeedbackIds: this.checkList_1
          };
        } else if (this.activeName === "third") {
          params = {
            merchantFeedbackIds: this.checkList_0
          };
        }
      }
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        // center: true
      })
        .then(() => {
          this.DeleteFun(params);
        })
        .catch(() => {});
    },
    // 删除函数
    DeleteFun(params) {
      this.$axios.post("/MerchantFeedback/remove", params).then(res => {
        let code = res.data.code;
        if (code === 0) {
          this.$message.success(res.data.msg);
          // 删除选中后刷新列表，让删除变成disabled
          this.page_all.pageNumber = 1;
          this.page_1.pageNumber = 1;
          this.page_0.pageNumber = 1;
          this.getList();
          this.checkList_all = [];
          this.checkList_1 = [];
          this.checkList_0 = [];
        } else if (code === 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 提意见
    toActiveOne() {
      this.$emit("child-msg", "TF" + new Date().getTime());
    },
    // 监听分页
    // 监听全部分页 tab1
    async get_page_all_list() {
      let list_all = await this.getListFun();
      //   console.log(list_all);
      let status = list_all.status;
      if (status === 200) {
        this.$set(this.data_all, "rows", list_all.data.rows);
        console.log(this.data_all);
        this.data_all.show = true;
        this.data_all.rows.forEach((item, index) => {
          item.className = true;
          item.show_reply = false;
          item.btn = "查看回复";
        });
        this.page_all.total = list_all.data.total;
        this.page_all.pageNo = list_all.data.pageNo;
        this.page_all.totalPages = list_all.data.totalPages;
      }
    },
    get_size_all(size) {
      this.page_all.pageSize = size;
      this.page_all.pageNumber = 1;
      this.get_page_all_list();
    },
    get_page_all(pageNumber) {
      this.page_all.pageNumber = pageNumber;
      this.get_page_all_list();
    },
    // 监听已回复 tab2
    async get_page_1_list() {
      let list_1 = await this.getListFun(1);
      //   console.log(list_all);
      let status = list_1.status;
      if (status === 200) {
        this.$set(this.data_1, "rows", list_1.data.rows);
        // console.log(this.data_all);
        this.data_1.show = true;
        this.data_1.rows.forEach((item, index) => {
          item.className = true;
          item.show_reply = false;
          item.btn = "查看回复";
        });
        this.page_1.total = list_1.data.total;
        this.page_1.pageNo = list_1.data.pageNo;
        this.page_1.totalPages = list_1.data.totalPages;
      }
    },
    get_size_1(size) {
      this.page_1.pageSize = size;
      this.page_1.pageNumber = 1;
      this.get_page_1_list();
    },
    get_page_1(pageNumber) {
      this.page_1.pageNumber = pageNumber;
      this.get_page_1_list();
    },
    // 监听未回复 tab3
    async get_page_0_list() {
      let list_0 = await this.getListFun(0);
      //   console.log(list_all);
      let status = list_0.status;
      if (status === 200) {
        this.$set(this.data_0, "rows", list_0.data.rows);
        // console.log(this.data_all);
        this.data_0.show = true;
        this.data_0.rows.forEach((item, index) => {
          item.className = true;
          item.show_reply = false;
          item.btn = "查看回复";
        });
        this.page_0.total = list_0.data.total;
        this.page_0.pageNo = list_0.data.pageNo;
        this.page_0.totalPages = list_0.data.totalPages;
      }
    },
    get_size_0(size) {
      this.page_0.pageSize = size;
      this.page_0.pageNumber = 1;
      this.get_page_0_list();
    },
    get_page_0(pageNumber) {
      this.page_0.pageNumber = pageNumber;
      this.get_page_0_list();
    }
  },
  computed: {
    deleteShow() {
      if (this.activeName === "first") {
        console.log(this.checkList_all.length);
        if (this.checkList_all.length > 0) {
          return false;
        } else {
          return true;
        }
      } else if (this.activeName === "second") {
        if (this.checkList_1.length > 0) {
          return false;
        } else {
          return true;
        }
      } else if (this.activeName === "third") {
        if (this.checkList_0.length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  },
  watch: {}
};
</script>

<style lang='scss' scoped>
//   list[0].isActived
.recordCom {
  color: #5a5a5a;
}
.margin_top20 {
  margin-top: 20px;
}
header {
  font-size: 22px;
  color: #00c0de;
  text-align: center;
}
section.feedContent {
  margin-top: 50px;
  min-height: 300px;
  margin: 50px 40px 20px;
  position: relative;
  content {
    width: 100%;
    display: block;
    .label {
      height: 50px;
      width: 150px;
      text-align: left;
      display: inline-block;
      .icon {
        color: #888 !important;
      }
      .s2 {
        letter-spacing: 10px;
      }
      .s1,
      .s3 {
        letter-spacing: 35px;
      }
    }
    .button {
      display: inline-block;
      padding: 4px 16px;
      cursor: pointer;
      border-radius: 3px;
      border: 1px solid #00c0de;
      background: #fafafa;
      color: #00c0de;
    }
  }
}
.hidden {
  display: none;
}
</style>
