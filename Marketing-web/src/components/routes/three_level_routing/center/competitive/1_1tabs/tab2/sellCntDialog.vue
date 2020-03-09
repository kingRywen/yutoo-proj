<!-- chart弹窗 -->
<template>
  <div class="dialogContainer">
    <el-dialog :close-on-click-modal="false" top="15vh" :title="dialog.title" :visible.sync="dialog.dialogShow" :width="dialog.width">
      <div class='dialogContent' style="overflow:hidden;padding:0 5px;margin-top:-20px;">
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane label="跟卖列表" name="first">
            <!-- 搜索框 -->
            <!-- <div style="margin-bottom:10px;">
              <el-select :popper-append-to-body="false"v-model="pageIndex.inHour" placeholder="请选择时间段" style="width:150px;" clearable>
                <el-option v-for="item in pageOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-button :disabled="isDisabled" type="success" icon="el-icon-search" @click="searchChangeTime">搜索</el-button>
            </div> -->
            <!-- table -->
            <el-table v-loading="pageIndex.sellAllLoading" height="400px" :data="pageIndex.list" stripe style="width: 100%;overflow:auto">
              <el-table-column prop="soldTime" label="跟卖时间" align="center" width="160">

              </el-table-column>
              <!-- <el-table-column prop="sku" label="子sku" align="center" width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.sku}}</span>
                </template>
              </el-table-column> -->
              <el-table-column prop="sellerName" label="卖家" align="center">
                <template slot-scope="scope">
                  <!-- 点击前往亚马孙商店 -->
                  <span class="canClick" @click="toAmazonShop(scope.row)">{{scope.row.sellerName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fbpFlag" label="属性" align='center' width="420">
                <template slot-scope="scope">
                  <div v-if="scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[0]&&scope.row.skuAttr[0]">
                    <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[0]&&scope.row.skuAttr[0].attrName?scope.row.skuAttr[0].attrName:""}}</span>：
                    <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[0]&&scope.row.skuAttr[0].attrValue?scope.row.skuAttr[0].attrValue:""}}</span>
                  </div>
                  <div v-if="scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[1]&&scope.row.skuAttr[1]">
                    <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[1]&&scope.row.skuAttr[1].attrName?scope.row.skuAttr[1].attrName:""}}</span>：
                    <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[1]&&scope.row.skuAttr[1].attrValue?scope.row.skuAttr[1].attrValue:""}}</span>
                  </div>
                  <div v-if="scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[2]&&scope.row.skuAttr[2]">
                    <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[2]&&scope.row.skuAttr[2].attrName?scope.row.skuAttr[2].attrName:""}}</span>：
                    <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[2]&&scope.row.skuAttr[2].attrValue?scope.row.skuAttr[2].attrValue:""}}</span>
                  </div>
                  <div v-if="scope.row.skuAttr==''?true:false">-</div>
                </template>
              </el-table-column>
              <el-table-column prop="fbpFlag" label="发货方式" align='center'>
                <template slot-scope="scope">
                  <span>{{scope.row.fbpFlag==0?"自发货":scope.row.fbpFlag==1?"FBA":scope.row.fbpFlag==2?"自发货+FBA":"-"}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.price?scope.row.price:"-"}}</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- todoh -->
            <PageVue v-bind:childPages="pageIndex" v-on:size-change="getSize_pageIndex" v-on:current-page="getPage_pageIndex" style="margin:5px 0px !important"></PageVue>
          </el-tab-pane>
          <el-tab-pane label="跟卖卖家列表" name="second">
            <!-- table -->
            <el-table v-loading="page2.sellParentLoading" :data="page2.list" stripe height="400px" style="width: 100%;overflow:auto">
              <!-- <el-table-column prop="soldTime" label="跟卖时间" align="center">

          </el-table-column> -->
              <el-table-column prop="sellerName" label="卖家" align="center">
                <template slot-scope="scope">
                  <!-- 点击前往亚马孙商店 -->
                  <span class="canClick" @click="toAmazonShop(scope.row)">{{scope.row.sellerName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="sellingAmount" label="跟卖子sku数量" align="center">
                <template slot-scope="scope">
                  <!-- 点击打开子sku跟卖列表 -->
                  <span class="canClick" @click="toChildSkuPage(scope.row)">{{scope.row.sellingAmount}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fbpFlag" label="发货方式" align='center'>
                <template slot-scope="scope">
                  <span>{{scope.row.fbpFlag==0?"自发货":scope.row.fbpFlag==1?"FBA":scope.row.fbpFlag==2?"自发货+FBA":"-"}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.price?scope.row.price:"-"}}</span>
                </template>
              </el-table-column>
            </el-table>
            <PageVue v-bind:childPages="page2" v-on:size-change="setSizeChange" v-on:current-page="setPage" style="margin:5px 0px !important"></PageVue>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <!-- 子sku弹窗 -->
    <el-dialog :close-on-click-modal="false" top="15vh" :title="childDialog.title" :visible.sync="childDialog.dialogShow" :width="childDialog.width">
      <div class='dialogContent' style="overflow:hidden;padding:0 5px;margin-top:-20px;" v-loading="page3.sellAllLoading">
        <!-- 搜索框 -->
        <div style="margin-bottom:10px;">
          <el-input placeholder="输入sku" v-model.trim="inputText" clearable style='max-width:150px;'>
          </el-input>
          <!-- <el-button type="success" icon="el-icon-search" @click="searchProduct" :disabled="inputText.length>0?false:true">搜索</el-button> -->
          <el-button type="success" icon="el-icon-search" @click="searchProduct">搜索</el-button>
        </div>
        <!-- table -->
        <el-table height="525px" :data="page3.list" stripe style="width: 100%;overflow:auto">
          <el-table-column prop="soldTime" label="跟卖时间" align="center" width="160">

          </el-table-column>
          <el-table-column prop="sku" label="子sku" align="center" width="140">
            <template slot-scope="scope">
              <!-- 点击打开子sku跟卖列表 -->
              <span>{{scope.row.sku}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fbpFlag" label="属性" align='center' width="420">
            <template slot-scope="scope">
              <div v-if="scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[0]&&scope.row.skuAttr[0]">
                <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[0]&&scope.row.skuAttr[0].attrName?scope.row.skuAttr[0].attrName:""}}</span>：
                <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[0]&&scope.row.skuAttr[0].attrValue?scope.row.skuAttr[0].attrValue:""}}</span>
              </div>
              <div v-if="scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[1]&&scope.row.skuAttr[1]">
                <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[1]&&scope.row.skuAttr[1].attrName?scope.row.skuAttr[1].attrName:""}}</span>：
                <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[1]&&scope.row.skuAttr[1].attrValue?scope.row.skuAttr[1].attrValue:""}}</span>
              </div>
              <div v-if="scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[2]&&scope.row.skuAttr[2]">
                <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[2]&&scope.row.skuAttr[2].attrName?scope.row.skuAttr[2].attrName:""}}</span>：
                <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[2]&&scope.row.skuAttr[2].attrValue?scope.row.skuAttr[2].attrValue:""}}</span>
              </div>
              <div v-if="scope.row.skuAttr==''?true:false">-</div>
            </template>
          </el-table-column>
          <el-table-column prop="fbpFlag" label="发货方式" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.fbpFlag==0?"自发货":scope.row.fbpFlag==1?"FBA":scope.row.fbpFlag==2?"自发货+FBA":"-"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.price?scope.row.price:"-"}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <PageVue v-bind:childPages="page3" v-on:size-change="childGetSizeChange" v-on:current-page="childGetPage"></PageVue>
    </el-dialog>
  </div>
</template>

<script>
import { isDisabled } from "@/api/functions";
import PageVue from "@/components/common/page.vue"; //分页
import { ProductSellingDetailList, ProductSellingList } from "@/api/myApi";
import { Trim } from "@/api/functions";
export default {
  name: "sellingCntDialog",
  props: ["dialog"],
  components: {
    PageVue
  },
  data() {
    return {
      isDisabled: true,
      activeName2: "first",
      //选择的时间段
      pageOptions: [
        {
          value: 0,
          label: "00:00-01:00"
        },
        {
          value: 1,
          label: "01:00-02:00"
        },
        {
          value: 2,
          label: "02:00-03:00"
        },
        {
          value: 3,
          label: "03:00-04:00"
        },
        {
          value: 4,
          label: "04:00-05:00"
        },
        {
          value: 5,
          label: "05:00-06:00"
        },
        {
          value: 6,
          label: "06:00-07:00"
        },
        {
          value: 7,
          label: "07:00-08:00"
        },
        {
          value: 8,
          label: "08:00-09:00"
        },
        {
          value: 9,
          label: "09:00-10:00"
        },
        {
          value: 10,
          label: "10:00-11:00"
        },
        {
          value: 11,
          label: "11:00-12:00"
        },
        {
          value: 12,
          label: "12:00-13:00"
        },
        {
          value: 13,
          label: "13:00-14:00"
        },
        {
          value: 14,
          label: "14:00-15:00"
        },
        {
          value: 15,
          label: "15:00-16:00"
        },
        {
          value: 16,
          label: "16:00-17:00"
        },
        {
          value: 17,
          label: "17:00-18:00"
        },
        {
          value: 18,
          label: "18:00-19:00"
        },
        {
          value: 19,
          label: "19:00-20:00"
        },
        {
          value: 20,
          label: "20:00-21:00"
        },
        {
          value: 21,
          label: "21:00-22:00"
        },
        {
          value: 22,
          label: "22:00-23:00"
        },
        {
          value: 23,
          label: "23:00-24:00"
        }
      ],
      pageIndex: {
        list: [],
        sellAllLoading: false,
        inHour: "",
        Size: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      },
      // table 的loading动画
      sellLoadingChildSku: false,
      page2: {
        list: [],
        sellParentLoading: false,
        //page的也放这里了跟别的组件不太一样
        Size: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      },
      // 弹窗组件todod
      childDialog: {
        title: "查看跟卖-卖家名称（动态展示）",
        width: "1000px",
        dialogShow: false,
        list: [] // 传给弹窗组件的数据，包括新品和非新品的数字
      },
      page3: {
        list: [],
        sellAllLoading: false,
        inHour: "",
        Size: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      },
      childArg: "", //保存一下跟卖明细的请求参数
      inputText: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 切换时间段
    searchChangeTime() {
      this.pageIndex.currentPage = 1;
      this.pageIndex.Size = 10;
      this.getProductSellingDetailList();
    },
    //   跳转到亚马逊商店
    toAmazonShop(arg) {
      // console.log(arg);
      if (arg.sellerUrl) {
        window.open(arg.sellerUrl);
      } else {
        this.$message.error("暂无链接");
      }
    },
    // 查看跟卖-子ASINtodom
    getProductSellingDetailList(currentPage, pageSize, inHour) {
      let params;
      params = {
        sku: this.dialog.sku,
        pageNumber: currentPage || this.pageIndex.currentPage,
        pageSize: pageSize || this.pageIndex.Size,
        inHour: inHour || this.pageIndex.inHour
      };
      params = this.$.dealObjectValue(params);
      this.pageIndex.sellAllLoading = true;
      this.$axios
        .post(ProductSellingDetailList, params)
        .then(res => {
          if (res.status == 200) {
            this.pageIndex.list = res.data.rows;
            this.pageIndex.total = res.data.total;
            this.pageIndex.pageNo = res.data.pageNo;
            this.pageIndex.totalPages = res.data.totalPages;
            // console.log(this.pageIndex);
            this.pageIndex.sellAllLoading = false;
          }
        })
        .catch(err => {
          this.pageIndex.sellAllLoading = false;
        });
    },
    // 2 跟卖卖家列表
    getSellerCnt(currentPage, pageSize) {
      this.page2.sellParentLoading = true;
      let params = {
        sku: this.dialog.sku,
        pageNumber: currentPage || 1,
        pageSize: pageSize || 10
      };
      // params = {
      //   parentSku: this.childArg.parentSku,
      //   sellerId: this.childArg.sellerId,
      //   querySku: this.inputText,
      //   pageNumber: currentPage || this.page3.currentPage,
      //   pageSize: pageSize || this.page3.Size
      // };
      params = this.$.dealObjectValue(params);
      this.$axios
        .post(ProductSellingList, params)
        .then(res => {
          if (res.status == 200) {
            // console.log(res, "跟卖数量");
            this.page2.list = res.data.rows;
            this.page2.total = res.data.total;
            this.page2.pageNo = res.data.pageNo;
            this.page2.totalPages = res.data.totalPages;
            this.page2.sellParentLoading = false;
          }
        })
        .catch(error => {
          // console.log("跟卖列表出错", error);
          this.page2.sellParentLoading = false;
        });
    },
    // 弹出子sku窗口
    toChildSkuPage(arg) {
      this.childDialog.dialogShow = true;
      // console.log(arg);
      this.childDialog.title = "查看跟卖-" + arg.sellerName;
      //保存一下跟卖明细（子sku）的请求明细
      this.childArg = arg;
      this.getChild();
    },
    // 查看跟卖-卖家跟卖明细
    getChild(currentPage, pageSize) {
      let params;
      // todonow
      params = {
        parentSku: this.childArg.parentSku,
        sellerId: this.childArg.sellerId,
        querySku: this.inputText,
        pageNumber: currentPage || this.page3.currentPage,
        pageSize: pageSize || this.page3.Size
      };
      params = this.$.dealObjectValue(params);
      this.page3.sellAllLoading = true;
      this.$axios
        .post(ProductSellingDetailList, params)
        .then(res => {
          if (res.status == 200) {
            this.page3.list = res.data.rows;
            this.page3.total = res.data.total;
            this.page3.pageNo = res.data.pageNo;
            this.page3.totalPages = res.data.totalPages;
            // console.log(this.pageIndex);
            this.page3.sellAllLoading = false;
          }
        })
        .catch(err => {
          this.page3.sellAllLoading = false;
        });
    },
    // 单个子sku搜索toddm
    searchProduct() {
      this.inputText = Trim(this.inputText, "g");
      // if (this.inputText.length == 0) {
      //   this.$message.warning("sku不能为空");
      //   return;
      // }
      // this.$message.error("已指派等后台返回");
      // 这个搜索列表暂时有问题
      this.page3.currentPage = 1;
      this.page3.Size = 10;
      this.getChild();
    },
    // 清空子搜索
    reSearchProduct() {
      this.page3.currentPage = 1;
      this.page3.Size = 10;
      this.getChild();
    },
    // 一
    // // 监听分页总子sku
    getSize_pageIndex(size) {
      // this.$store.commit("competitive/saveSellingCntPageSize", size);
      this.pageIndex.Size = size;
      this.getProductSellingDetailList();
    },
    getPage_pageIndex(currentPage) {
      // this.$store.commit("competitive/saveSellingCntPageSize", currentPage);
      this.pageIndex.currentPage = currentPage;
      this.getProductSellingDetailList();
    },
    // // 二
    // // 监听分页(卖家列表)
    setSizeChange(size) {
      // this.$store.commit("competitive/saveSellingCntPageSize", size);
      this.page2.Size = size;
      this.getSellerCnt();
    },
    setPage(currentPage) {
      // this.$store.commit("competitive/saveSellingCntPageSize", currentPage);
      this.page2.currentPage = currentPage;
      this.getSellerCnt();
    },
    // // 三
    // // 监听分页(子sku跟卖)
    childGetSizeChange(size) {
      this.page3.Size = size;
      this.getChild();
    },
    childGetPage(currentPage) {
      this.page3.currentPage = currentPage;
      this.getChild();
    }
  },
  computed: {},
  watch: {
    "pageIndex.inHour": {
      handler(newV) {
        // console.log(newV, "搜索条件");
        if (newV) {
          this.isDisabled = false;
        }
        if (newV === "") {
          this.isDisabled = true;
          this.searchChangeTime();
        }
      },
      deep: true
    },
    // 监听子sku搜索为空则发起请求
    inputText(v) {
      if (v === "") {
        this.reSearchProduct();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.canClick {
  cursor: pointer;
  padding: 2px;
  color: #5757ff;
  font-size: 14px;
}
</style>
