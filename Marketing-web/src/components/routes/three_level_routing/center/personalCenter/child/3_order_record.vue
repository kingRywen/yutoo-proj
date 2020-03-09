<!-- tab个人中心 -->
<template>
  <div class="centerComtainer">
    <header>订单记录</header>
    <section class="record" v-loading="tableLoading">
      <el-table :max-height="12000" :data="tableData" border style="width: 100%;">
        <el-table-column prop="createTime" label="购买时间" align="center" width="160">
        </el-table-column>
        <el-table-column prop="packageName" label="套餐名称" align="center" width="100">
        </el-table-column>
        <el-table-column prop="charge" label="支付状态" align="center">
          <template slot-scope="scope">
            {{scope.row.payStatus===0?"未支付":scope.row.payStatus===1?"已支付":scope.row.payStatus===2?"已失效":"--"}}
          </template>
        </el-table-column>
        <el-table-column prop="charge" label="价格" align="center">
          <template slot-scope="scope">
            {{scope.row.charge?"￥"+scope.row.charge:"--"}}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="套餐点数" align="center">
          <template slot-scope="scope">
            {{scope.row.duration?scope.row.duration+"点":"--"}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="surplusPoint" label="剩余点数" align="center">
          <template slot-scope="scope">
            {{scope.row.surplusPoint?scope.row.surplusPoint+"点":"--"}}
          </template>
        </el-table-column> -->
        <el-table-column prop="capacity" label="图片空间容量" align="center" width="90">
          <template slot-scope="scope">
            {{scope.row.capacity?scope.row.capacity:"--"}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="surplusCapacity" label="图片空间剩余容量" align="center" width="110">
                    <template slot-scope="scope">
                        {{scope.row.surplusCapacity?scope.row.surplusCapacity:"--"}}
                    </template>
                </el-table-column> -->
        <el-table-column prop="unit" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small" v-if="scope.row.payStatus===2?false:true">
              {{scope.row.payStatus===0?"立即支付":scope.row.payStatus===1?"再次购买":scope.row.payStatus===2?"重新购买":"--"}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <PageVue style="margin-top:20px;" v-bind:childPages="page" v-on:size-change="getSizeChange" v-on:current-page="getPage"></PageVue>
    </section>
  </div>
</template>

<script>
// import { KBtoM } from "@/api/functions";
import { MerchantOrderList, MerchantOrderInfo } from "@/api/myApi";
import PageVue from "@/components/common/page.vue";
export default {
  components: { PageVue },
  data() {
    return {
      tableData: [],
      page: {
        Size: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      },
      tableLoading: true
    };
  },

  created() {
    this.getMerchantOrderList();
  },
  mounted() {},
  methods: {
    // 获取我的订单
    getMerchantOrderList() {
      this.tableLoading = true;
      this.$axios
        .post(MerchantOrderList, {
          pageNumber: this.page.currentPage,
          pageSize: this.page.Size
        })
        .then(res => {
          let code = res.status;
          if (code == 200) {
            // 0 未支付,1已支付,2失效
            res.data.rows.forEach((item, index) => {
              //   console.log(item.capacity);
              // item.capacity = KBtoM(item.capacity);
              // item.surplusCapacity = KBtoM(item.surplusCapacity);
            });
            this.tableData = res.data.rows;
            this.page.total = res.data.total;
            this.page.pageNo = res.data.pageNo;
            this.page.totalPages = res.data.totalPages;
          }
          //   console.log(res);
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 监听分页
    getSizeChange(size) {
      this.page.Size = size;
      this.getMerchantOrderList();
    },
    getPage(currentPage) {
      this.page.currentPage = currentPage;
      this.getMerchantOrderList();
    }, // 再次购买或者立即支付或者重新购买
    async handleClick(row) {
      //   console.log(row);
      this.Loaidng = true;
      // 点击购买，生成订单
      if (row.payStatus === 0) {
        // 根据orderNo请求订单信息
        let orderData = await this.getOrderData(row.orderNo);
        // console.log(orderData, 111);
        if (orderData !== -1) {
          // console.log(-1);
          orderData.pageId = 1;
          this.$router.push({
            path: "/admin/payPage",
            query: orderData
          });
        }
        return;
      }
      if (row.payStatus === 1) {
        // console.log(1);
        // 根据orderNo请求订单信息
        let orderData = await this.makeOrder(row.packageId);
        orderData.pageId = 1;
        this.$router.push({
          path: "/admin/payPage",
          query: orderData
        });
      }
      // if (!row.packageId) {
      //   this.$message.error("测试提示，暂时找不到套餐id，请联系后台管理员");
      //   return;
      // }
      // this.$router.push({
      //   path: "/admin/payPage",
      //   query: row
      // });
    },
    //// 根据orderNo请求订单信息
    getOrderData(orderNo) {
      return this.$axios
        .post(MerchantOrderInfo, { orderNo: orderNo })
        .then(res => {
          //   console.log(res.data);
          if (res.data.code === 0) {
            return res.data.data;
          } else {
            return -1;
          }
        });
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
//   list[0].isActived
.centerComtainer {
}
.context {
  flex: 1;
  padding: 55px 35px 0;
  header {
    font-size: 22px;
    color: #00c0de;
    text-align: center;
  }
  section.record {
    margin-top: 50px;
    width: 930px;
    min-height: 300px;
    margin: 50px auto 20px;
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
        padding: 6px 16px;
        cursor: pointer;
        border-radius: 3px;
        border: 1px solid #00c0de;
        background: #fafafa;
        color: #00c0de;
      }
    }
  }
}
</style>
