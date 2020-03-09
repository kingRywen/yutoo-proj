<!-- chart弹窗 -->
<template>
  <div class="dialogContainer">
    <el-dialog top="30vh" :title="dialog.title" :visible.sync="dialog.dialogShow" :width="dialog.width">
      <div class='dialogContent' style="overflow:hidden;padding:0 5px;">
        <!-- table -->
        <el-table :data="dialog.list" stripe style="width: 100%;height:400px;overflow:scroll">
          <el-table-column prop="soldTime" label="跟卖时间" align="center">

          </el-table-column>
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
          <el-table-column prop="price" label="价格" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.price}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <PageVue v-bind:childPages="dialog.page" v-on:size-change="getSizeChange" v-on:current-page="getPage"></PageVue>
    </el-dialog>
    <!-- 子sku弹窗 -->
    <el-dialog top="30vh" :title="childDialog.title" :visible.sync="childDialog.dialogShow" :width="childDialog.width">
      <div class='dialogContent' style="overflow:hidden;padding:0 5px;">
        <!-- table -->
        <el-table :data="childDialog.list" stripe style="width: 100%;height:400px;overflow:scroll">
          <el-table-column prop="soldTime" label="跟卖时间" align="center">

          </el-table-column>
          <el-table-column prop="sku" label="子sku" align="center">
            <template slot-scope="scope">
              <!-- 点击打开子sku跟卖列表 -->
              <span>{{scope.row.sku}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.price}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <PageVue v-bind:childPages="page" v-on:size-change="childGetSizeChange" v-on:current-page="childGetPage"></PageVue>
    </el-dialog>
  </div>
</template>

<script>
import PageVue from "@/components/common/page.vue"; //分页
// import { ProductSellingDetailList } from "../../../api/functions.js";
export default {
  name: "sellingCntDialog",
  props: ["dialog"],
  components: {
    PageVue
  },
  data() {
    return {
      // 弹窗组件todod
      childDialog: {
        title: "跟卖明细",
        width: "60%",
        dialogShow: false,
        list: [] // 传给弹窗组件的数据，包括新品和非新品的数字
      },
      page: {
        //page的也放这里了跟别的组件不太一样
        Size: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1,
        sku: ""
      },
      childArg: "" //保存一下跟卖明细的请求参数
    };
  },
  created() {},
  mounted() {},
  methods: {
    //   跳转到亚马逊商店
    toAmazonShop(arg) {
      console.log(arg);
      window.open(arg.sellerUrl);
    },
    // 监听分页
    getSizeChange(size) {
      this.$store.commit("competitive/saveSellingCntPageSize", size);
      //   this.page.Size = size;
    },
    getPage(currentPage) {
      this.$store.commit("competitive/saveSellingCntPageSize", currentPage);
      //   this.page.currentPage = currentPage;
    },
    // 弹出子sku窗口
    toChildSkuPage(arg) {
      this.childDialog.dialogShow = true;
      console.log(arg);
      //保存一下跟卖明细（子sku）的请求明细
      this.childArg = arg;
      this.getProductSellingDetailList();
    },
    // 请求跟卖明细（子sku）
    getProductSellingDetailList() {
      this.$axios
        .get(ProductSellingDetailList, {
          params: {
            parentSku: this.childArg.parentSku,
            sellerId: this.childArg.sellerId,
            pageNumber: this.page.currentPage,
            pageSize: this.page.currentPage
          }
        })
        .then(res => {
          if (res.status == 200) {
            this.childDialog.list = res.data.rows;
            this.page.total = res.data.total;
            this.page.pageNo = res.data.pageNo;
            this.page.totalPages = res.data.totalPages;
          }
        });
    },
    // 监听分页(字sku跟卖)
    childGetSizeChange(size) {
      //   this.$store.commit("competitive/saveSellingCntPageSize", size);
      this.page.Size = size;
    },
    childGetPage(currentPage) {
      //   this.$store.commit("competitive/saveSellingCntPageSize", currentPage);
      this.page.currentPage = currentPage;
    }
  },
  computed: {},
  watch: {
    // 监听页码大小
    "page.Size"() {
      // 非搜索状态下请求全部
      this.getProductSellingDetailList(
        this.dialog.page.sku,
        this.dialog.page.currentPage,
        this.dialog.page.Size
      );
    },
    // 监听页数
    "page.currentPage"() {
      this.getProductSellingDetailList(
        this.dialog.page.sku,
        this.dialog.page.currentPage,
        this.dialog.page.Size
      );
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
