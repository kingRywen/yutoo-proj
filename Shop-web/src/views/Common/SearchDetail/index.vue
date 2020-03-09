<!-- 筛选条件 -->
<template>
  <div class="d_search ___common">
    <!-- todoh -->
    <section class="__relative">
      <el-collapse class="custom-collapse custom-collapse-1" v-model="activeNames">
        <el-collapse-item title="筛选条件" name="query">
          <div class="search_container" v-show="true">
            <section class="form_container">
              <div>
                <el-form size="small" :rules="rules" :model="searchData" ref="ruleForm" style="width:100%">
                  <el-form-item prop="keywordSrc" :label="keyName" :label-width="formLabelWidth" style="min-width:20%;vertical-align: top;">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.keywordSrc" style="width:100%;margin-top: 8px" />
                  </el-form-item>
                  <!-- <el-form-item prop="include" label="包含" :label-width="formLabelWidth" style="width:29%">
                  <el-input type="textarea" :rows="3" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.include" style="width:100%" size="mini" />
                </el-form-item>
                <el-form-item prop="barring" label="不包含" :label-width="formLabelWidth" style="width:29%">
                  <el-input type="textarea" :rows="3" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.barring" style="width:100%" size="mini" />
                </el-form-item>
                <el-form-item prop="exclude" label="排除" :label-width="formLabelWidth" style="width:29%">
                  <el-input type="textarea" :rows="3" placeholder="多个使用换行或逗号分隔" v-model.trim="searchData.exclude" style="width:100%" size="mini" />
                </el-form-item> -->
                  </el-form-item>
                  <el-form-item label-width="10px" style="min-width:20%;vertical-align: top;margin-top:4px">
                    <el-button type="primary" @click="searchFun" size="mini" :loading="searchLoading" icon="el-icon-search">搜索</el-button>
                    <el-button :disabled="Disabled" type="primary" @click="clearFun" size="mini" plain>重置搜索</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </section>
          </div>
        </el-collapse-item>
      </el-collapse>
      <!-- <el-button v-if="backFun" type="text" icon="el-icon-back" @click="backFungo" size="mini" class="__back ">返回</el-button> -->
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  // props: ["buttonLoading"],
  inject: {
    getList: {
      default: null
    },
    clearSort: {
      default: null
    }
  },
  props: {
    backFun: {
      default: null
    }
  },
  data() {
    // 自定义校验
    var validatorate = (rule, value, callback) => {
      if (value) {
        let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
        let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
        if (regEn.test(value) || regCn.test(value)) {
          // callback(new Error("不能包含特殊字符"));
					callback();
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
      searchData: {
	  },
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
        ]
      },
      searchLoading: false
    };
  },

  created() {},
  mounted() {},
  methods: {
    async searchFun() {
      console.log(this.searchData);
      if (this.searchData.keywordSrc) {
        let reg = new RegExp(/[\n|\r\n|\,|\，]/, "g");
        var keywordSrc = this.searchData.keywordSrc.split(reg);
        // console.log(keywordSrc, "keywordSrc");
      }
      //保存一下到vuex 导出需要用
      this.$store.commit("keywordExcavate/SearchData", this.searchData);
      let param = {
        pageSize: 10,
        pageNumber: 1,
        keywordSrc: keywordSrc
      };
      this.searchLoading = true;
       this.$emit('searchTrueData',param)
      let result = await this.getList(param);
      if (result) {
        this.searchLoading = false;
        if (this.clearSort) {
          this.clearSort();
        }
      }
    },
    clearFun() {
	  console.log('123')
      this.searchData = {};
    },
    backFungo() {
      this.$router.go(-1);
    }
  },
  computed: {
    keyName() {
      let k;
      if (this.$route.query.keywordTypes == 3) {
        k = "原产品ID";
      }
      if (
        this.$route.query.keywordTypes &&
        this.$route.query.keywordTypes != 3
      ) {
        k = "源关键词";
      } else if (!this.$route.query.keywordTypes) {
        k = "关键词";
      }
      return k;
    }
  },
  watch: {
    // 监听帅选条件，空值Disabled的true和falsea
    searchData: {
      handler(newV) {
        // console.log(newV);
        this.Disabled = this.cfuns.noValue(newV);
        if (this.Disabled === true) {
          this.conditions = "";
          this.searchFun();
          return;
        }
      },
      deep: true
    }
  }
};
</script>

<style lang='less' scoped>
.search_container {
  overflow: hidden;
  border-top: none;
  border-bottom: none;
  width: 100%;
  // border-left: 1px solid #f5f5f5;
  header {
    padding: 10px 10px;
    background: #fafafa;
    width: 100%;
  }
  .form_container {
    padding: 8px 0x 0px 0px;
  }
}
</style>