<!-- chart弹窗 -->
<template>
  <div class="dialogContainer __wrapper_i">
    <el-dialog :close-on-click-modal="false" top="15vh" :title="dialog.title" :visible.sync="dialog.dialogShow" :width="dialog.width">
      <div class='dialogContent' style="overflow:hidden;padding:0 5px;margin-top:-20px;">
        <!-- 搜索框 -->
        <div style="margin-bottom:8px;margin-top:8px;">
          <el-select :popper-append-to-body="false"v-model="pageIndex.soldTime" placeholder="请选择时间段" style="width:150px;" clearable>
            <el-option v-for="item in pageOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" @click="searchChangeTime">搜索</el-button> -->
          <el-button type="success" icon="el-icon-search" @click="searchChangeTime">搜索</el-button>
        </div>
        <!-- table -->
        <el-table v-loading="pageIndex.sellAllLoading" height="400px" :data="pageIndex.list" stripe style="width: 100%;overflow:auto">
          <el-table-column prop="soldBeginTime" label="跟卖开始时间" align='center'>
            <template slot-scope="scope">
              <div>{{scope.row.soldBeginTime | _formatData}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="soldEndTime" label="跟卖结束时间" align='center'>
            <template slot-scope="scope">
              <div>{{scope.row.soldEndTime | _formatData}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="fbpFlag" label="发货方式" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.fbpFlag==0?"自发货":scope.row.fbpFlag==1?"FBA":scope.row.fbpFlag==2?"自发货+FBA":"-"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.price?scope.row.price:"-"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cartRate" label="购物车占有率" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.cartRate | _formatData}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- todoh -->
        <PageVue v-bind:childPages="pageIndex" v-on:size-change="getSize_pageIndex" v-on:current-page="getPage_pageIndex" style="margin:5px 0px !important"></PageVue>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isDisabled } from "@/api/functions";
import PageVue from "@/components/common/page.vue"; //分页
import { ProductSellingDetailList } from "@/api/myApi";
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
        soldTime: "",
        Size: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 切换时间段
    searchChangeTime() {
      this.pageIndex.currentPage = 1;
      this.pageIndex.Size = 10;
      this.getProductSellingDetailList();
    },
    // 查看跟卖-子ASINtodom
    getProductSellingDetailList(currentPage, pageSize, soldTime) {
      let params = {
        taskId: this.dialog.taskId,
        sku: this.dialog.sku,
        statTime: this.dialog.statTime,
        sellerId: this.dialog.sellerId,
        pageNumber: currentPage || this.pageIndex.currentPage,
        pageSize: pageSize || this.pageIndex.Size
      };
      if (this.pageIndex.soldTime) {
        params.soldTime = this.dialog.statTime + " " + this.pageIndex.soldTime;
      }
      params = this.$.dealObjectValue(params);
      this.pageIndex.sellAllLoading = true;
      this.$axios
        .post(this.dialog.url, params)
        .then(res => {
          if (res.status == 200) {
            this.pageIndex.list = res.data.rows;
            // 处理购物车占有率显示
            this.pageIndex.list = this.pageIndex.list.map(item => {
              if (item.cartRate !== null && item.cartRate !== "") {
                let num = item.cartRate * 10000 / 100;
                if (/^\d+\.\d+$/.test(num)) {
                  item.cartRate = num.toFixed(2) + "%";
                } else {
                  item.cartRate = num + "%";
                }
                return item;
              }
            });
            this.pageIndex.total = res.data.total;
            this.pageIndex.pageNo = res.data.pageNo;
            this.pageIndex.totalPages = res.data.totalPages;
            this.pageIndex.sellAllLoading = false;
          }
        })
        .catch(err => {
          this.pageIndex.sellAllLoading = false;
        });
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
    }
  },
  computed: {},
  watch: {
    "pageIndex.soldTime": {
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
