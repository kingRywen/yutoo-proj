<template>
  <div class="email-index">
    <el-tabs type="border-card" @tab-click="tabClick" class="email-box" v-model="name">
      <el-tab-pane label="回复模板管理" name="ReplyTempManager">
        <router-view v-if="name === 'ReplyTempManager'"></router-view>
      </el-tab-pane>
      <el-tab-pane label="营销模板管理" name="MarketTempManager">
        <router-view v-if="name === 'MarketTempManager'"></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: 'outbox'
    }
  },
  created() {
    console.log(this.$router.path)

    this.name = this.$route.path.split('/').pop()
  },
  computed: {},
  methods: {
    tabClick(tab) {
      this.$router.push({ path: tab.name })
    }
  }
}
</script>

<style lang="scss">
.email-index {
  .email-box {
    .el-tab-pane {
      height: 700px;
    }
  }
}
</style>
