<!-- tab个人中心 -->
<template>
  <div class="centerComtainer">
    <el-dialog :close-on-click-modal="false" title="修改图片空间容量" :visible.sync="surpSpaceShow" width="400px">
      <el-form :model="ruleForm" label-width="30px" class="__register" :rules="rules" ref="ruleForm">
        <el-form-item prop="space">
          <el-row :span="24">
            <el-col :span="24">
              <!-- 选择升降 -->
              <el-select :popper-append-to-body="false"v-model="ruleForm.status" placeholder="请选择" style='max-width:90px' :clearable="false">
                <el-option v-for="item in StatusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model="ruleForm.space" placeholder="请输入1-100的整数" style="width:160px !important"></el-input>
              <span style="margin-left:5px;color:#888">00M</span>
            </el-col>
            <!-- <el-col :span="4" style="margin-left:5px;">00M</el-col> -->
          </el-row>
        </el-form-item>
        <div style="text-align:center">
          <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')" style="width:80%;height:38px;">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
    <header>我的套餐</header>
    <section class="record" v-loading="tableLoading">
      <el-table :max-height="12000" :data="tableData" border style="width: 100%;">
        <el-table-column prop="packageName" label="产品" align="center" width="100">
        </el-table-column>
        <el-table-column prop="purchaseDate" label="首次购买时间" align="center" width="120">
        </el-table-column>
        <!-- <el-table-column prop="charge" label="支付状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.payStatus===0?"未支付":scope.row.payStatus===1?"已支付":scope.row.payStatus===2?"已失效":"--"}}
                    </template>
                </el-table-column> -->
        <!-- <el-table-column prop="charge" label="价格" align="center">
                    <template slot-scope="scope">
                        {{scope.row.charge?"￥"+scope.row.charge:"--"}}
                    </template>
                </el-table-column> -->
        <el-table-column prop="orderCnt" label="下单次数" align="center" width="80">
          <template slot-scope="scope">
            {{scope.row.orderCnt?scope.row.orderCnt:"--"}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="duration" label="套餐点数" align="center">
                    <template slot-scope="scope">
                        {{scope.row.duration?scope.row.duration+"点":"--"}}
                    </template>
                </el-table-column> -->
        <el-table-column prop="surplusPoint" label="剩余点数" align="center" width="160px">
          <template slot-scope="scope">
            {{scope.row.surplusPoint?scope.row.surplusPoint+"点":"--"}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="capacity" label="图片空间容量" align="center" width="90">
                    <template slot-scope="scope">
                        {{scope.row.capacity?scope.row.capacity:"--"}}
                    </template>
                </el-table-column> -->
        <el-table-column prop="surplusCapacity" label="图片空间剩余容量" align="center" width="200">
          <template slot-scope="scope">
            {{scope.row.surplusCapacity?scope.row.surplusCapacity:"--"}}
          </template>
        </el-table-column>
        <el-table-column prop="imgCapacity" label="图片空间容量" align="center">
          <template slot-scope="scope">
            {{scope.row.imgCapacity?scope.row.imgCapacity:"--"}}
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="surpSpaceShow=true" type="text">
              修改图片空间容量
            </el-button>
            <el-button @click="toRechargePage" type="text">
              购买套餐
            </el-button>
            <el-button v-if="scope.row.type==1?true:false" @click="closeSpace(scope.row,0)" type="text">
              关闭空间
            </el-button>
            <el-button v-if="scope.row.type==0?true:false" @click="closeSpace(scope.row,1)" type="text">
              开启空间
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <PageVue style="margin-top:20px;" v-bind:childPages="page" v-on:size-change="getSizeChange" v-on:current-page="getPage"></PageVue> -->
    </section>
  </div>
</template>

<script>
// import { KBtoM } from "@/api/functions";
import { MerchantPackagesMktListStatistics } from "@/api/myApi";
// import PageVue from "@/components/common/page.vue";
export default {
  //   components: { PageVue },
  data() {
    var validspace = (rule, value, callback) => {
      if (!value) {
        callback(new Error("提示：请输入容量，1-100之间的整数"));
      } else {
        if (!/^([1-9][0-9]{0,1}|100)$/.test(value)) {
          callback(new Error("提示：最小1，最大100"));
        }
        callback();
      }
    };
    return {
      loading: false,
      surpSpaceShow: false,
      tableData: [],
      page: {
        Size: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      },
      tableLoading: true,
      Space: true,
      // 状态
      StatusOptions: [
        {
          value: 1,
          label: "升级"
        },
        {
          value: 0,
          label: "降级"
        }
      ],
      ruleForm: {
        space: "",
        status: ""
      },
      rules: {
        space: [
          {
            required: true,
            validator: validspace,
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },

  created() {
    this.getMerchantPackagesMktListStatistics();
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      console.log(this.ruleForm);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$axios
            .post("/ImgCapacity/updateCapacity", {
              capacity: parseInt(this.ruleForm.space),
              status: this.ruleForm.status
            })
            .then(res => {
              let code = res.data.code;
              if (code == 0) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
                this.getMerchantPackagesMktListStatistics();
              } else if (res.data.code === 500) {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
              this.loading = false;
              this.surpSpaceShow = false;
              //   console.log(res, "升级返回");
            });
        } else {
        }
      });
    },
    //   升级空间
    surpSpace(arg) {
      //   console.log(arg, "升级空间");
    },
    closeSpace(arg, type) {
      //   console.log(arg, "关闭空间");
      let tips;
      if (type == 0) {
        tips =
          "关闭图片空间，将停止每月扣点。若在15天内未开启，将清空图片空间所有内容。";
      } else {
        tips = "确定开启图片空间？";
      }
      this.$confirm(tips, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("/ImgCapacity/switchCapacity", {
              type: type
            })
            .then(res => {
              //   console.log(res, "关闭返回");
              let code = res.data.code;
              if (code == 0) {
                if (type == 0) {
                  this.$message({
                    type: "success",
                    message: res.data.msg
                  });
                  //   this.Space = false;
                } else {
                  this.$message({
                    type: "success",
                    message: res.data.msg
                  });
                  //   this.Space = true;
                }
                this.getMerchantPackagesMktListStatistics();
              } else if (res.data.code === 500) {
                this.$message({
                  type: "error",
                  message: "未知异常，请联系管理员"
                });
              }
            });
        })
        .catch(() => {
          //   this.$message({
          //     type: "info",
          //     message: "取消"
          //   });
        });
    },
    // 获取我的订单
    getMerchantPackagesMktListStatistics() {
      this.tableLoading = true;
      this.$axios
        .post(MerchantPackagesMktListStatistics, {
          pageNumber: this.page.currentPage,
          pageSize: this.page.Size
        })
        .then(res => {
          let code = res.data.code;
          if (code == 0) {
            // 0 未支付,1已支付,2失效
            if (res.data.data.length > 0) {
              res.data.data.forEach((item, index) => {
                // console.log(item.capacity);
                // item.capacity = KBtoM(item.capacity);
                // item.surplusCapacity = KBtoM(item.surplusCapacity);
              });
              this.tableData = res.data.data;
              //   this.page.total = res.data.total;
              //   this.page.pageNo = res.data.pageNo;
              //   this.page.totalPages = res.data.totalPages;
            }
            // console.log(res, "我的订单");
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 监听分页
    getSizeChange(size) {
      this.page.Size = size;
      this.getMerchantPackagesMktListStatistics();
    },
    getPage(currentPage) {
      this.page.currentPage = currentPage;
      this.getMerchantPackagesMktListStatistics();
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
