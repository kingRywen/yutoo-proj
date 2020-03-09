<template>
  <div>
    <el-tabs v-model="activeIndex" type="card" closable @tab-remove="removeTab">
      <el-tab-pane v-for="(item) in editableTabs2" :key="item.name" :label="item.title" :name="item.name">
        <slot></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  mounted() {
    // console.log(this.$route.path)
    this.tabs = this.$store.state.tab;
    this.$store.commit("tab/addTabs", {
      route: "/",
      name: "首页"
    });
  },
  methods: {
    // 关闭tab
    removeTab(targetName) {
      let tabs = this.editableTabs2;
      let activeName = this.editableTabsValue2;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue2 = activeName;
      this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
    }
  },
  computed: {
    tabs() {
      return this.$store.state.tab;
    }
  }
};
</script>
