<!-- tab个人中心 -->
<template>
  <div class="centerComtainer">
    <header>消费记录</header>
    <section class="record" v-loading="tableLoading">
      <el-table :max-height="12000" :data="tableData" border style="width: 100%;">
        <el-table-column prop="functionName" label="功能" align="center">
        </el-table-column>
        <el-table-column prop="platformName" label="平台" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" align="center">
        </el-table-column>
        <el-table-column prop="changeCharge" label="消费额度" align="center">
        </el-table-column>
      </el-table>
      <PageVue style="margin-top:20px;" v-bind:childPages="page" v-on:size-change="getSizeChange" v-on:current-page="getPage"></PageVue>
    </section>
  </div>
</template>

<script>
import { MerchantPackageRecList } from "@/api/myApi";
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
    this.getMerchantPackageRecList();
  },
  mounted() {},
  methods: {
    // 获取我的订单
    getMerchantPackageRecList() {
      this.tableLoading = true;
      this.$axios
        .post(MerchantPackageRecList, {
          pageNumber: this.page.currentPage,
          pageSize: this.page.Size
        })
        .then(res => {
          let code = res.status;
          if (code == 200) {
            // 0 未支付,1已支付,2失效
            // res.data.rows.forEach((item, index) => {
            //   console.log(item.capacity);
            //   item.capacity = KBtoM(item.capacity);
            //   item.surplusCapacity = KBtoM(item.surplusCapacity);
            // });
            this.tableData = res.data.rows;
            this.page.total = res.data.total;
            this.page.pageNo = res.data.pageNo;
            this.page.totalPages = res.data.totalPages;
          }
          // console.log(res);
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 监听分页
    getSizeChange(size) {
      this.page.Size = size;
      this.getMerchantPackageRecList();
    },
    getPage(currentPage) {
      this.page.currentPage = currentPage;
      this.getMerchantPackageRecList();
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
