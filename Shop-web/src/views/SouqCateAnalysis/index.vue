<!--  -->
<template>
  <div v-if="$route.name==='CateAnalysis'">
    <el-tabs type="card" v-model="activeName" @tab-click="change">
      <el-tab-pane label="沙特站" name="10">
        <keep-alive>
          <Analysis ref="site1" v-if="siteId__==10" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="阿联酋站" name="11">
        <keep-alive>
          <Analysis ref="site2" v-if="siteId__==11" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
  <router-view v-else />
</template>

<script>
import Analysis from "./CateAnalysis";
export default {
  components: { Analysis },
  data() {
    return {
      activeName: "10",
      siteId__: 10
    };
  },

  created() {},
  mounted() {
    let siteId__ = this.$route.query.siteId__;
    // 1
    if (!siteId__) {
      siteId__ = this.activeName;
    }
    let arg;
    if (siteId__ == "11") {
      this.activeName = "11";
      this.siteId__ = 11;
      this.$store.commit("common/siteId__", this.siteId__);
      arg = {
        siteId: this.siteId__
      };
      this.$refs.site2.getList(arg);
    } else if (siteId__ == "10" || !siteId__) {
      this.activeName = "10";
      this.siteId__ = 10;
      this.$store.commit("common/siteId__", this.siteId__);
      arg = {
        siteId: this.siteId__
      };
      this.$refs.site1.getList(arg);
    }
  },
  methods: {
    change(val) {
      let n = val.name;
      let arg;
      if (n === "10") {
        this.siteId__ = 10;
        arg = {
          siteId: this.siteId__
        };
        // 2
        this.$nextTick(() => {
          this.$refs.site1.getList(arg);
        });
      } else if (n === "11") {
        this.siteId__ = 11;
        arg = {
          siteId: this.siteId__
        };
        // 3
        this.$nextTick(() => {
          this.$refs.site2.getList(arg);
        });
      }
      this.$store.commit("common/siteId__", this.siteId__);
    }
  },
  computed: {
    events() {
      return Object.assign(this.innerEvents, this.outerEvents);
    }
  },
  watch: {
    // sellerData() {
    //   this.$refs.site1.getList();
    // }
    sellerData() {
      let n = this.activeName;
      if (n === "10") {
        this.siteId__ = 10;
        this.$refs.site1.getList();
      } else if (n === "11") {
        this.siteId__ = 11;
        this.$refs.site2.getList();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
