<!--  -->
<template>
  <div class="recharge">
    <main class="main">
      <!-- table1 -->
      <section v-loading="table1Loaidng">
        <none-page v-show="nonemenuData" noBack>暂无套餐数据</none-page>
        <table v-show="menuData" class="table1" border="0" cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <th>套餐名称</th>
              <!-- <th v-for="(item,index) in menuData"><img src="~@/assets/recharge.png">{{item.packagesName?item.packagesName:""}}</th> -->
              <th v-for="(item,index) in menuData">
                <!-- <img style="width:70px;height:70px;" :src="item.icon?item.icon:'~@/assets/recharge.png'"> -->
                {{item.packageName?item.packageName:""}}
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- tr1 -->
            <tr class="tr1">
              <td>套餐点数</td>
              <td v-for="(item,index) in menuData">
                <p>{{item.duration?item.duration+"点":""}}</p>
                <p>图片空间容量{{item.capacity?item.capacity:""}}</p>
              </td>
            </tr>
            <!-- tr2 -->
            <tr class="tr2">
              <td>套餐价格</td>
              <td v-for="(item,index) in menuData">
                <span>￥{{item.charge?item.charge:""}}</span>
              </td>
            </tr>
            <!-- tr3 -->
            <tr class="tr2">
              <td></td>
              <td v-for="(item,index) in menuData">
                <button @click="saveOrder(item)">立即购买</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <!-- table2 -->
      <section style="margin-top:30px" v-if="table2Show">
        <template>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="functionName" label="功能名称" align="center" width="300">
            </el-table-column>
            <el-table-column prop="desc" label="功能介绍" align="center">
            </el-table-column>
            <el-table-column prop="charge" label="消耗额度" align="center" width="180">
              <template slot-scope="scope">
                {{scope.row.chargeType===2||scope.row.chargeType==="2"?scope.row.charge+"点/100M/月":scope.row.charge+"点/次"}}
              </template>
            </el-table-column>
            <el-table-column prop="-" label="支持平台站点" align="center">
              <template slot-scope="scope">
                <span v-for="item in scope.row.platformSiteNames" style="font-weight:600">{{item}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </section>
    </main>
  </div>
</template>

<script>
import {
  MerchantPackagesMktPackagesMktList,
  FunctionMktFunctionMktList
} from "@/api/myApi";
// import { KBtoM } from "@/api/functions";
export default {
  components: {},
  data() {
    return {
      // table1
      menuData: false,
      table1Loaidng: true,
      nonemenuData: false,
      // table2
      table2Show: false,
      tableData: []
    };
  },

  created() {
    // if (this.$route.query.pageId) {
    //   this.$store.commit("common/savePageId", this.$route.query.pageId);
    //   // 如果用户刷新的是充值的页面，则讲评台的id存为-1，方便切换平台的时候出发watch
    // }
    this.getMerchantPackagesMktPackagesMktList();
    this.getFunctionMktFunctionMktList();
  },
  mounted() {},
  methods: {
    // 查看市场套餐
    getMerchantPackagesMktPackagesMktList() {
      this.$axios
        .post(MerchantPackagesMktPackagesMktList)
        .then(res => {
          let code = res.data.code;
          if (code == 0) {
            res.data.data.forEach((item, index) => {
              // console.log(item.capacity);
              // item.capacity = KBtoM(item.capacity);
            });
            this.menuData = res.data.data;
            // 暂无套餐数据
            if (this.menuData.length === 0) {
              this.nonemenuData = true;
              this.menuData = false;
            }
          }
          if (res.data.code === 500) {
            this.nonemenuData = true;
            this.menuData = false;
            this.table1Loaidng = false;
            this.$message("服务器出错，请刷新页面重试");
          }
          this.table1Loaidng = false;
          // console.log("套餐", res);
        })
        .catch(err => {
          this.nonemenuData = true;
          this.menuData = false;
          this.table1Loaidng = false;
          // this.$message("服务器出错，请刷新页面重试");
        });
    },
    // 点击购买，生成订单
    async saveOrder(item) {
      // console.log(item);
      let orderData = await this.makeOrder(item.packageId);
      // orderData.capacity = KBtoM(orderData.capacity);
      orderData.pageId = 1;
      this.$router.push({
        path: "/admin/payPage",
        query: orderData
      });
      // this.table1Loaidng = true;
      // this.$axios
      //   .post(MerchantOrderSave, { packageId: item.packageId })
      //   .then(res => {
      //     let code = res.data.code;
      //     let data = res.data.data;
      //     if (code == 0) {
      //       console.log("点击购买", data);
      //       this.table1Loaidng = false;
      //     }
      //     if (code === 500) {
      //       this.table1Loaidng = false;
      //       this.$message("服务器出错，请刷新页面重试");
      //     }
      //   })
      //   .catch(err => {
      //     this.table1Loaidng = false;
      //     this.$message("服务器出错，请刷新页面重试");
      //   });
    },
    // 获取功能点数
    getFunctionMktFunctionMktList() {
      this.$axios
        .post(FunctionMktFunctionMktList)
        .then(res => {
          let code = res.data.code;
          if (code == 0) {
            let data = res.data.data;
            // console.log(data);
            if (data.length > 0) {
              // item.是每一项
              data.forEach((item, index) => {
                // console.log(item.platformSiteNames);
                let platformSiteNames = [];
                // item.platformSiteNames是每一项中的平台和站点
                item.platformSiteNames.forEach((v, k) => {
                  // console.log(v);
                  // 如果每个平台的站点不止一个，则还要遍历每个平台下的站点
                  if (v.siteNames.length > 1) {
                    v.siteNames.forEach((i, j) => {
                      platformSiteNames.push(
                        v.platformName + "(" + v.siteNames[j] + ")" + "、"
                      );
                    });
                  } else {
                    platformSiteNames.push(
                      v.platformName + "(" + v.siteNames[0] + ")" + "、"
                    );
                  }
                });
                let len = platformSiteNames.length - 1;
                // alert(len);
                platformSiteNames.forEach((c, d) => {
                  // console.log(c);
                  if (len == d) {
                    // 去掉最后一个顿号
                    c = c.slice(0, -1);
                    // alert(1);
                    // console.log(c, "1");
                    platformSiteNames[d] = c;
                  }
                });
                item.platformSiteNames = platformSiteNames;
              });
            }
            this.tableData = data;
            // console.log(this.tableData, 1111);
            this.table2Show = true;
          }
        })
        .catch(err => {
          // console.log("功能列表出错", err);
        });
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
.recharge .main {
  margin: 0 auto;
  min-height: 200px;
  min-width: 800px;
  max-width: 1200px;
}
.table1 {
  width: 100%;
  text-align: center;
  thead {
    th {
      background: #f1f5fb;
      color: #555;
      width: 20%;
      height: 100px;
      img {
        vertical-align: middle;
      }
    }
  }
  tbody {
    tr {
      td {
        height: 90px;
        box-sizing: border-box;
        border: 1px solid #f1f5fb;
        p {
          margin-bottom: 5px;
          color: #30cc7b;
        }
        span {
          color: #00c0de;
        }
        button {
          padding: 5px 16px;
          cursor: pointer;
          background: #00c0de;
          color: #fafafa;
          border: none;
        }
      }
    }
  }
}
</style>
