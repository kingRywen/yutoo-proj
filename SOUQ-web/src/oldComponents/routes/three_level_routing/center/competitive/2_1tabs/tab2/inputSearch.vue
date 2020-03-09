<!-- 店铺详情tabs2 的搜索框 -->
<template>
  <div>
    <section>
      <el-input :placeholder="page.placeholder" v-model="inputText" clearable style='max-width:200px;'>
      </el-input>
      <!-- 搜索按钮 -->
      <el-button type="success" icon="el-icon-search" @click="searchFunction" :disabled="computedInputText.length>0?false:true">搜索</el-button>
    </section>
  </div>
</template>

<script>
import {
  ShopAnalysisInfoUrl,
  ShopDetailUrl
} from "../../../../../../../api/myApi";
import { Trim } from "../../../../../../../api/functions.js";
export default {
  name: "shopInputSearch",
  components: {},
  props: ["Fun", "page"],
  data() {
    return {
      inputText: ""
    };
  },

  created() {},
  mounted() {},
  methods: {
    searchFunction() {
      this.$emit("child-input-text", this.computedInputText);
      this.Fun(this.page.currentPage, this.page.Size, this.computedInputText);
    },
    getAll() {
      //清除的输入框则改变当前的表格显示的数据状态，切回到全部显示，-1
      this.$emit("table-type", "-1");
      this.Fun(this.page.currentPage, this.page.Size);
    }
  },
  computed: {
    computedInputText() {
      return Trim(this.inputText, "g").replace(/>|：|》/g, ":");
    }
  },
  watch: {
    inputText(a) {
      if (a == "") {
        this.$emit("table-type", "-1");
        this.Fun(this.page.currentPage, this.page.Size);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
