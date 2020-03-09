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

                <el-form-item prop="reviewCntMin" label="评价数" :label-width="formLabelWidth" style="width:140px">
                  <el-input type="text" class="keywordIntext" v-model="searchData.reviewCntMin" style="width:80px" />
                </el-form-item>
                <span>~</span>
                <el-form-item prop="reviewCntMax" style="width:10%">
                  <el-input type="text" class="keywordIntext" v-model="searchData.reviewCntMax" style="width:80px" />
                </el-form-item>

                <el-form-item prop="starCntMin" label="评分" :label-width="formLabelWidth" style="width:140px">
                  <el-input type="text" class="keywordIntext" v-model="searchData.starCntMin" style="width:80px" />
                </el-form-item>
                <span>~</span>
                <el-form-item prop="starCntMax" style="width:10%">
                  <el-input type="text" class="keywordIntext" v-model="searchData.starCntMax" style="width:80px" />
                </el-form-item>

                <el-form-item prop="qaCntMin" label="Q&A数" :label-width="formLabelWidth" style="width:140px">
                  <el-input type="text" class="keywordIntext" v-model="searchData.qaCntMin" style="width:80px" />
                </el-form-item>
                <span>~</span>
                <el-form-item prop="qaCntMax" style="width:10%">
                  <el-input type="text" class="keywordIntext" v-model="searchData.qaCntMax" style="width:80px" />
                </el-form-item>

                <el-form-item prop="rankMin" label="BSR排名" :label-width="formLabelWidth" style="width:140px">
                  <el-input type="text" class="keywordIntext" v-model="searchData.rankMin" style="width:80px" />
                </el-form-item>
                <span>~</span>
                <el-form-item prop="rankMax" style="width:10%">
                  <el-input type="text" class="keywordIntext" v-model="searchData.rankMax" style="width:80px" />
                </el-form-item>

                <el-form-item label="上架时间" label-width="70px" style="width:24%">
                  <el-date-picker unlink-panels style="width:100%;" v-model="searchData.datePickValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label-width="120px" prop="value" style="width:27%" label="发货方式">
                  <!-- 非wish平台模式-->
                  <el-checkbox-group class="keywordTypesStyle" :min="min" :max="max" v-model="searchData.fbpFlag">
                    <el-checkbox :label="item.value" v-for="item in fbpFlagArr">{{item.name | FBA_Filter}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <section class="button_container">
                  <!-- <el-button :disabled="Disabled" type="success" :loading="buttonLoading.childSearchLoading" @click="searchLists">确认搜索</el-button> -->
                  <el-button type="success" :loading="buttonLoading.childSearchLoading" @click="searchLists">确认搜索</el-button>
                  <el-button :disabled="Disabled" type="success" :loading="buttonLoading.childClearSearchLoading" @click="clearSearchLists" style="margin-left:20px !important;">重置搜索</el-button>
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
import { isDisabled, Trim } from "@/api/functions";
export default {
  components: {},
  props: ["buttonLoading"],
  data() {
    // 正整数
    var validateNumber = (rule, value, callback) => {
      // console.log(value);
      value = Trim(value, "g");
      value = +value;
      if (/^[0-9]*$/.test(value) === false) {
        callback(new Error("请输入0以上的整数"));
      } else {
        callback();
      }
    };
    // （正整数，正小数）
    var validateNumber2 = (rule, value, callback) => {
      value = Trim(value, "g");
      value = +value;
      if (
        /^\+?((0|([1-9]+\d*))|((0\.\d+)|([1-9]+\d*\.\d+)))$/.test(value) ===
        false
      ) {
        callback(new Error("只能输入正数"));
      } else if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) === false) {
        callback(new Error("只能输入数字"));
      } else {
        // console.log(this.searchData);
        callback();
      }
    };
    return {
      activeNames: ["query"],
      // todod
      fbpFlagArr: [
        {
          value: 0,
          name: "自发货"
        },
        {
          value: 1,
          name: "FBA"
        }
      ],
      min: 0,
      max: Infinity,
      searchSites: this.$route.query.searchSites,
      searchShow: false,
      conditions: "",
      formLabelWidth: "60px", //公用宽度
      Disabled: true,
      searchLoading: false,
      clearSearchLoading: false,
      rules: {
        reviewCntMin: [
          {
            required: false,
            validator: validateNumber,
            trigger: ["change", "blur"]
          }
        ],
        reviewCntMax: [
          {
            required: false,
            validator: validateNumber,
            trigger: ["change", "blur"]
          }
        ],
        starCntMin: [
          {
            required: false,
            validator: validateNumber2,
            trigger: ["change", "blur"]
          }
        ],
        starCntMax: [
          {
            required: false,
            validator: validateNumber2,
            trigger: ["change", "blur"]
          }
        ],
        qaCntMin: [
          {
            required: false,
            validator: validateNumber,
            trigger: ["change", "blur"]
          }
        ],
        qaCntMax: [
          {
            required: false,
            validator: validateNumber,
            trigger: ["change", "blur"]
          }
        ],
        rankMin: [
          {
            required: false,
            validator: validateNumber,
            trigger: ["change", "blur"]
          }
        ],
        rankMax: [
          {
            required: false,
            validator: validateNumber,
            trigger: ["change", "blur"]
          }
        ]
      },
      searchData: {
        fbpFlag: []
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
      this.searchData = {
        fbpFlag: []
      };
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
          let reviewCntMin,
            reviewCntMax,
            starCntMin,
            starCntMax,
            qaCntMin,
            qaCntMax,
            rankMin,
            rankMax;
          this.conditions = `当前搜索:`;
          for (let key in newV) {
            reviewCntMin = newV["reviewCntMin"];
            reviewCntMax = newV["reviewCntMax"];
            starCntMin = newV["starCntMin"];
            starCntMax = newV["starCntMax"];
            qaCntMin = newV["qaCntMin"];
            qaCntMax = newV["qaCntMax"];
            rankMin = newV["rankMin"];
            rankMax = newV["rankMax"];
            let item = newV[key];
            if (key === "datePickValue") {
              if (item !== null) {
                this.conditions += `上架时间${item[0]}至${item[1]}；`;
              }
              if (item == "") {
                this.conditions = this.conditions.replace(/上架时间至;/, "");
              }
            }
            if (key === "fbpFlag") {
              if (item.length && item.length == 1) {
                if (item[0] == 0) {
                  this.conditions += `发货方式 ：FBA；`;
                } else if (item[0] == 1) {
                  this.conditions += `发货方式 ：FBA；`;
                }
              }
              if (item.length && item.length == 2) {
                this.conditions += `发货方式 ：FBA，FBA；`;
              }
            }
          }
          // for 循环之外
          // 只有最小评价数
          if (
            reviewCntMin !== undefined &&
            reviewCntMin !== "" &&
            Number.isFinite(reviewCntMin - 0) === true &&
            (reviewCntMax === undefined || reviewCntMax === "")
          ) {
            this.conditions += `评价数${reviewCntMin}以上；`;
            this.conditions = this.conditions.replace(/评价数；/, "");
            this.conditions = this.conditions.replace(/评价数~；/, "");
          }
          // 只有最大评价数
          if (
            reviewCntMax !== undefined &&
            reviewCntMax !== "" &&
            typeof Number.isFinite(reviewCntMax - 0) === true &&
            (reviewCntMin === undefined || reviewCntMin === "")
          ) {
            this.conditions += `评价数${reviewCntMax}以下；`;
            this.conditions = this.conditions.replace(/评价数；/, "");
            this.conditions = this.conditions.replace(/评价数~；/, "");
          }
          //评价数最大最小都有
          if (
            reviewCntMin !== undefined &&
            reviewCntMin !== "" &&
            Number.isFinite(reviewCntMin - 0) === true &&
            (reviewCntMax !== undefined &&
              reviewCntMax !== "" &&
              Number.isFinite(reviewCntMax - 0) === true)
          ) {
            if (+reviewCntMin === +reviewCntMax) {
              this.conditions += `评价数${reviewCntMin}；`;
              this.conditions = this.conditions.replace(/评价数~；/, "");
            } else if (+reviewCntMin < +reviewCntMax) {
              this.conditions += `评价数${reviewCntMin}~${reviewCntMax}；`;
              this.conditions = this.conditions.replace(/评价数；/, "");
            } else if (+reviewCntMin > +reviewCntMax) {
              this.conditions += `评价数${reviewCntMax}~${reviewCntMin}；`;
              this.conditions = this.conditions.replace(/评价数；/, "");
            }
          }
          // 只有最小评分
          if (
            starCntMin !== undefined &&
            starCntMin !== "" &&
            Number.isFinite(starCntMin - 0) === true &&
            (starCntMax === undefined || starCntMax === "")
          ) {
            this.conditions += `评分${starCntMin}以上；`;
            this.conditions = this.conditions.replace(/评分；/, "");
            this.conditions = this.conditions.replace(/评分~；/, "");
          }
          // 只有最大评分
          if (
            starCntMax !== undefined &&
            starCntMax !== "" &&
            Number.isFinite(starCntMax - 0) === true &&
            (starCntMin === undefined || starCntMin === "")
          ) {
            this.conditions += `评分${starCntMax}以下；`;
            this.conditions = this.conditions.replace(/评分；/, "");
            this.conditions = this.conditions.replace(/评分~；/, "");
          }
          //评分最大最小都有
          if (
            starCntMin !== undefined &&
            starCntMin !== "" &&
            Number.isFinite(starCntMin - 0) === true &&
            (starCntMax !== undefined &&
              starCntMax !== "" &&
              Number.isFinite(starCntMax - 0) === true)
          ) {
            if (+starCntMin === +starCntMax) {
              this.conditions += `评分${starCntMin}；`;
              this.conditions = this.conditions.replace(/评分~；/, "");
            } else if (+starCntMin < +starCntMax) {
              this.conditions += `评分${starCntMin}~${starCntMax}；`;
              this.conditions = this.conditions.replace(/评分；/, "");
            } else if (+starCntMin > +starCntMax) {
              this.conditions += `评分${starCntMax}~${starCntMin}；`;
              this.conditions = this.conditions.replace(/评分；/, "");
            }
          }
          // 只有最小Q&A数
          if (
            qaCntMin !== undefined &&
            qaCntMin !== "" &&
            Number.isFinite(qaCntMin - 0) === true &&
            (qaCntMax === undefined || qaCntMax === "")
          ) {
            this.conditions += `Q&A数${qaCntMin}以上；`;
            this.conditions = this.conditions.replace(/Q&A数；/, "");
            this.conditions = this.conditions.replace(/Q&A数~；/, "");
          }
          // 只有最大Q&A数
          if (
            qaCntMax !== undefined &&
            qaCntMax !== "" &&
            Number.isFinite(qaCntMax - 0) === true &&
            (qaCntMin === undefined || qaCntMin === "")
          ) {
            this.conditions += `Q&A数${qaCntMax}以下；`;
            this.conditions = this.conditions.replace(/Q&A数；/, "");
            this.conditions = this.conditions.replace(/Q&A数~；/, "");
          }
          //Q&A数最大最小都有
          if (
            qaCntMin !== undefined &&
            qaCntMin !== "" &&
            Number.isFinite(qaCntMin - 0) === true &&
            (qaCntMax !== undefined &&
              qaCntMax !== "" &&
              Number.isFinite(qaCntMax - 0) === true)
          ) {
            if (+qaCntMin === +qaCntMax) {
              this.conditions += `Q&A数${qaCntMin}；`;
              this.conditions = this.conditions.replace(/Q&A数~；/, "");
            } else if (+qaCntMin < +qaCntMax) {
              this.conditions += `Q&A数${qaCntMin}~${qaCntMax}；`;
              this.conditions = this.conditions.replace(/Q&A数；/, "");
            } else if (+qaCntMin > +qaCntMax) {
              this.conditions += `Q&A数${qaCntMax}~${qaCntMin}；`;
              this.conditions = this.conditions.replace(/Q&A数；/, "");
            }
          }
          //   只有最小BSR排名
          if (
            rankMin !== undefined &&
            rankMin !== "" &&
            Number.isFinite(rankMin - 0) === true &&
            (rankMax === undefined || rankMax === "")
          ) {
            this.conditions += `BSR排名${rankMin}以上；`;
            this.conditions = this.conditions.replace(/BSR排名；/, "");
            this.conditions = this.conditions.replace(/BSR排名~；/, "");
          }
          // 只有最大BSR排名
          if (
            rankMax !== undefined &&
            rankMax !== "" &&
            Number.isFinite(rankMax - 0) === true &&
            (rankMin === undefined || rankMin === "")
          ) {
            this.conditions += `BSR排名${rankMax}以下；`;
            this.conditions = this.conditions.replace(/BSR排名；/, "");
            this.conditions = this.conditions.replace(/BSR排名~；/, "");
          }
          //BSR排名最大最小都有
          if (
            rankMin !== undefined &&
            rankMin !== "" &&
            Number.isFinite(rankMin - 0) === true &&
            (rankMax !== undefined &&
              rankMax !== "" &&
              Number.isFinite(rankMax - 0) === true)
          ) {
            if (+rankMin === +rankMax) {
              this.conditions += `BSR排名${rankMin}；`;
              this.conditions = this.conditions.replace(/BSR排名~；/, "");
            } else if (+rankMin < +rankMax) {
              this.conditions += `BSR排名${rankMin}~${rankMax}；`;
              this.conditions = this.conditions.replace(/BSR排名；/, "");
            } else if (+rankMin > +rankMax) {
              this.conditions += `BSR排名${rankMax}~${rankMin}；`;
              this.conditions = this.conditions.replace(/BSR排名；/, "");
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
  width: 31.5%;
  display: inline-block;
  text-align: left;
}
</style>
