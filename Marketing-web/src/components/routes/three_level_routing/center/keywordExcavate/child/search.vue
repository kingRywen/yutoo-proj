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
                <el-form-item prop="keywordSrc" :label="keyName" :label-width="formLabelWidth" style="width:100%">
                  <el-input type="textarea" :rows="2" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.keywordSrc" style="width:100%" />
                </el-form-item>
                <el-form-item prop="include" label="包含" :label-width="formLabelWidth" style="width:29%">
                  <el-input type="textarea" :rows="3" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.include" style="width:100%" />
                </el-form-item>
                <el-form-item prop="barring" label="不包含" :label-width="formLabelWidth" style="width:29%">
                  <el-input type="textarea" :rows="3" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.barring" style="width:100%" />
                </el-form-item>
                <el-form-item prop="exclude" label="排除" :label-width="formLabelWidth" style="width:29%">
                  <el-input type="textarea" :rows="3" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.exclude" style="width:100%" />
                </el-form-item>
                <section class="button_container">
                  <!-- <div class="div">
                    <el-button :disabled="Disabled" type="success" :loading="buttonLoading.childSearchLoading" @click="searchLists">确认搜索</el-button>
                  </div> -->
                  <div class="div">
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
      searchShow: false,
      conditions: "",
      formLabelWidth: "72px", //公用宽度
      searchData: {},
      Disabled: true,
      searchLoading: false,
      clearSearchLoading: false,
      rules: {
        keywordSrc: [
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
  computed: {
    keyName() {
      let k;
      if (this.$route.query.keywordTypes == 3) {
        k = "原产品ID";
      }
      if (this.$route.query.keywordTypes != 3) {
        k = "源关键词";
      }
      return k;
    }
  },
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
          this.conditions = `当前搜索:`;
          for (let key in newV) {
            let item = newV[key];
            if (key === "keywordSrc") {
              this.conditions += `源关键词${item}；`;
              if (item == "") {
                this.conditions = this.conditions.replace(/源关键词；/, "");
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
  width: 11%;
  display: inline-block;
  position: relative;
  top: 7px;
  .div {
    text-align: center;
  }
  .div2 {
    margin-top: 8px;
  }
}
</style>
