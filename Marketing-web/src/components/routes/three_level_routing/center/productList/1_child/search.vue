<!-- 筛选条件 -->
<template>
  <div class="d_search">
    <!-- todoh -->
    <el-collapse v-model="activeNames">
      <el-collapse-item title="自定义筛选" name="query">
        <!-- <header class="color_666 margin margin_bottom8">
          <span class="iconfont icon-shaixuan"></span>
          <span>自定义筛选</span>
          <span class="color_blue pointer" @click="toggle" v-show="!searchShow">[展开]</span>
          <span class="color_blue pointer" @click="toggle" v-show="searchShow">[收起]</span>
        </header> -->
        <div class="search_container" v-show="true">
          <!-- <header>
            <span>筛选条件</span>
            <span class="searchText paddingLeft10" style="overflow:hidden">{{conditions}}</span>
          </header> -->
          <section class="form_container">
            <div>
              <el-form :rules="rules" :model="searchData" ref="ruleForm" style="width:100%">
                <el-form-item prop="keyword" label="关键词" :label-width="formLabelWidth" style="width:99.5%">
                  <el-input type="textarea" :rows="2" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.keyword" style="width:100%" />
                </el-form-item>
                <el-form-item prop="include" label="包含" :label-width="formLabelWidth" style="width:33%">
                  <el-input type="textarea" :rows="3" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.include" style="width:100%" />
                </el-form-item>
                <el-form-item prop="barring" label="不包含" :label-width="formLabelWidth" style="width:33%">
                  <el-input type="textarea" :rows="3" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.barring" style="width:100%" />
                </el-form-item>
                <el-form-item prop="exclude" label="排除" :label-width="formLabelWidth" style="width:33%">
                  <el-input type="textarea" :rows="3" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.exclude" style="width:100%" />
                </el-form-item>
                <el-form-item prop="product_cnt" label="产品数" :label-width="formLabelWidth" style="width:25%">
                  <el-input type="text" class="keywordIntext" v-model="searchData.productMin" style="width:45%" />
                  <span>~</span>
                  <el-input type="text" class="keywordIntext" v-model="searchData.productMax" style="width:45%" />
                </el-form-item>
                <el-form-item v-if="this.$route.query.searchSites.indexOf('0')===-1?false:true" prop="google" label="谷歌搜索量" label-width="120px" style="width:28%">
                  <el-input type="text" class="keywordIntext" v-model="searchData.googleMin" style="width:40%" />
                  <span>~</span>
                  <el-input type="text" class="keywordIntext" v-model="searchData.googleMax" style="width:40%" />
                </el-form-item>
                <el-form-item v-if="this.$route.query.searchSites.indexOf('2')===-1?false:true" prop="google" label="MerchantWords搜索量" label-width="160px" style="width:28%">
                  <el-input type="text" class="keywordIntext" v-model="searchData.merchantwordsMin" style="width:40%" />
                  <span>~</span>
                  <el-input type="text" class="keywordIntext" v-model="searchData.merchantwordsMax" style="width:40%" />
                </el-form-item>
                <section class="button_container">
                  <div class="div">
                    <!-- <el-button :disabled="Disabled" type="success" :loading="buttonLoading.childSearchLoading" @click="searchLists">确认搜索</el-button> -->
                    <el-button type="success" :loading="buttonLoading.childSearchLoading" @click="searchLists">确认搜索</el-button>
                  </div>
                  <div class="div div2">
                    <el-button :disabled="Disabled" type="success" :loading="buttonLoading.childClearSearchLoading" @click="clearSearchLists">重置搜索</el-button>
                  </div>
                </section>
              </el-form>
            </div>
          </section>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { isDisabled } from "@/api/functions";
export default {
  components: {},
  props: ["buttonLoading"],
  data() {
    // 自定义校验
    var validatorate = (rule, value, callback) => {
      if (value) {
        let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
        let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
        if (regEn.test(value) || regCn.test(value)) {
          callback(new Error("不能包含特殊字符"));
        } else {
          callback();
        }
      }
    };
    return {
      activeNames: ["query"],
      // todod
      searchSites: this.$route.query.searchSites,
      searchShow: false,
      conditions: "",
      formLabelWidth: "72px", //公用宽度
      searchData: {},
      Disabled: true,
      searchLoading: false,
      clearSearchLoading: false,
      rules: {
        keyword: [
          {
            required: false,
            validator: validatorate,
            trigger: ["change", "blur"]
          }
        ],
        include: [
          {
            required: false,
            validator: validatorate,
            trigger: ["change", "blur"]
          }
        ],
        barring: [
          {
            required: false,
            validator: validatorate,
            trigger: ["change", "blur"]
          }
        ],
        exclude: [
          {
            required: false,
            validator: validatorate,
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },

  created() {},
  mounted() {},
  methods: {
    // todom
    toggle() {
      if (this.searchShow === false) {
        this.searchShow = true;
        return;
      } else {
        this.searchShow = false;
      }
    },
    searchLists() {
      this.$emit("event2", this.searchData);
    },
    clearSearchLists() {
      this.searchData = {};
    }
  },
  computed: {},
  watch: {
    // 监听帅选条件，空值Disabled的true和falsea
    searchData: {
      handler(newV) {
        // console.log(newV, "搜索条件");
        this.Disabled = isDisabled(newV);
        //要干的事情
        if (this.Disabled === true) {
          this.conditions = "";
          this.$emit("event", true);
          return;
        } else {
          let productMin,
            productMax,
            googleMin,
            googleMax,
            merchantwordsMin,
            merchantwordsMax;
          this.conditions = `当前搜索:`;
          for (let key in newV) {
            productMin = newV["productMin"];
            productMax = newV["productMax"];
            googleMin = newV["googleMin"];
            googleMax = newV["googleMax"];
            merchantwordsMin = newV["merchantwordsMin"];
            merchantwordsMax = newV["merchantwordsMax"];
            let item = newV[key];
            if (key === "keyword") {
              this.conditions += `关键词${item}；`;
              if (item == "") {
                this.conditions = this.conditions.replace(/关键词；/, "");
              }
            }
            if (key === "include") {
              this.conditions += `包含${item}；`;
              if (item == "") {
                this.conditions = this.conditions.replace(/包含；/, "");
              }
            }
            if (key === "barring") {
              this.conditions += `不包含${item}；`;
              if (item == "") {
                this.conditions = this.conditions.replace(/不包含；/, "");
              }
            }
            if (key === "exclude") {
              this.conditions += `排除${item}；`;
              if (item == "") {
                this.conditions = this.conditions.replace(/排除；/, "");
              }
            }
          }
          // for循环之外
          // 只有最小产品
          if (
            productMin !== undefined &&
            productMin !== "" &&
            typeof +productMin === "number" &&
            (productMax === undefined || productMax === "")
          ) {
            this.conditions += `产品数${productMin}以上；`;
            this.conditions = this.conditions.replace(/产品数；/, "");
            this.conditions = this.conditions.replace(/产品数~；/, "");
          }
          // 只有最大产品
          if (
            productMax !== undefined &&
            productMax !== "" &&
            typeof +productMax === "number" &&
            (productMin === undefined || productMin === "")
          ) {
            this.conditions += `产品数${productMax}以下；`;
            this.conditions = this.conditions.replace(/产品数；/, "");
            this.conditions = this.conditions.replace(/产品数~；/, "");
          }
          //产品最大最小都有
          if (
            productMin !== undefined &&
            productMin !== "" &&
            (productMax !== undefined && productMax !== "")
          ) {
            if (+productMin === +productMax) {
              this.conditions += `产品数${productMin}；`;
              this.conditions = this.conditions.replace(/产品数~；/, "");
            } else if (+productMin < +productMax) {
              this.conditions += `产品数${productMin}~${productMax}；`;
              this.conditions = this.conditions.replace(/产品数；/, "");
            } else if (+productMin > +productMax) {
              this.conditions += `产品数${productMax}~${productMin}；`;
              this.conditions = this.conditions.replace(/产品数；/, "");
            }
          }
          // 只有最小谷歌搜索量
          if (
            googleMin !== undefined &&
            googleMin !== "" &&
            typeof +googleMin === "number" &&
            (googleMax === undefined || googleMax === "")
          ) {
            this.conditions += `谷歌搜索量${googleMin}以上；`;
            this.conditions = this.conditions.replace(/谷歌搜索量；/, "");
            this.conditions = this.conditions.replace(/谷歌搜索量~；/, "");
          }
          // 只有最大谷歌搜索量
          if (
            googleMax !== undefined &&
            googleMax !== "" &&
            typeof +googleMax === "number" &&
            (googleMin === undefined || googleMin === "")
          ) {
            this.conditions += `谷歌搜索量${googleMax}以下；`;
            this.conditions = this.conditions.replace(/谷歌搜索量；/, "");
            this.conditions = this.conditions.replace(/谷歌搜索量~；/, "");
          }
          //谷歌搜索量最大最小都有
          if (
            googleMin !== undefined &&
            googleMin !== "" &&
            (googleMax !== undefined && googleMax !== "")
          ) {
            if (+googleMin === +googleMax) {
              this.conditions += `谷歌搜索量${googleMin}；`;
              this.conditions = this.conditions.replace(/谷歌搜索量~；/, "");
            } else if (+googleMin < +googleMax) {
              this.conditions += `谷歌搜索量${googleMin}~${googleMax}；`;
              this.conditions = this.conditions.replace(/谷歌搜索量；/, "");
            } else if (+googleMin > +googleMax) {
              this.conditions += `谷歌搜索量${googleMax}~${googleMin}；`;
              this.conditions = this.conditions.replace(/谷歌搜索量；/, "");
            }
          }
          // 只有最小MerchantWords搜索量
          if (
            merchantwordsMin !== undefined &&
            merchantwordsMin !== "" &&
            typeof +merchantwordsMin === "number" &&
            (merchantwordsMax === undefined || merchantwordsMax === "")
          ) {
            this.conditions += `MerchantWords搜索量${merchantwordsMin}以上；`;
            this.conditions = this.conditions.replace(
              /MerchantWords搜索量；/,
              ""
            );
            this.conditions = this.conditions.replace(
              /MerchantWords搜索量~；/,
              ""
            );
          }
          // 只有最大MerchantWords搜索量
          if (
            merchantwordsMax !== undefined &&
            merchantwordsMax !== "" &&
            typeof +merchantwordsMax === "number" &&
            (merchantwordsMin === undefined || merchantwordsMin === "")
          ) {
            this.conditions += `MerchantWords搜索量${merchantwordsMax}以下；`;
            this.conditions = this.conditions.replace(
              /MerchantWords搜索量；/,
              ""
            );
            this.conditions = this.conditions.replace(
              /MerchantWords搜索量~；/,
              ""
            );
          }
          //MerchantWords搜索量最大最小都有
          if (
            merchantwordsMin !== undefined &&
            merchantwordsMin !== "" &&
            (merchantwordsMax !== undefined && merchantwordsMax !== "")
          ) {
            if (+merchantwordsMin === +merchantwordsMax) {
              this.conditions += `MerchantWords搜索量${merchantwordsMin}；`;
              this.conditions = this.conditions.replace(
                /MerchantWords搜索量~；/,
                ""
              );
            } else if (+merchantwordsMin < +merchantwordsMax) {
              this.conditions += `MerchantWords搜索量${merchantwordsMin}~${merchantwordsMax}；`;
              this.conditions = this.conditions.replace(
                /MerchantWords搜索量；/,
                ""
              );
            } else if (+merchantwordsMin > +merchantwordsMax) {
              this.conditions += `MerchantWords搜索量${merchantwordsMax}~${merchantwordsMin}；`;
              this.conditions = this.conditions.replace(
                /MerchantWords搜索量；/,
                ""
              );
            }
          }
        }
      },
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
.search_container {
  overflow: hidden;
  // min-height: 200px;
  width: 100%;
  border: 1px solid #ebeef5;
  margin-bottom: 8px;
  color: #606266;
  header {
    padding: 10px 10px;
    background: #fafafa;
    width: 100%;
  }
  .form_container {
    padding: 8px 8px 0px 0px;
  }
}
.button_container {
  width: 15%;
  display: inline-block;
  .div {
    width: 45%;
    text-align: center;
    display: inline-block;
  }
  .div2 {
    margin-top: 8px;
    margin-left: 5px;
  }
}
</style>
