<template>
  <div>
    <el-tabs v-model="index" type="card" closable @tab-remove="removeTab" @tab-click="tabClick">
      <el-tab-pane
        v-for="(item) in tabs"
        :key="item.name"
        :label="item.name"
        :name="item.route"
      >
        <div>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'Center',
  mounted () {
    // 路由不是当前路由
    if (this.$route.path !== this.index) {
      // 如果存在路由
      if (this.tabs.some(tab => (tab.route === this.$route.path || (tab.route + '/') === this.$route.path))) {
        let path = this.$route.path
        this.$store.commit('tab/setActiveTab', path.charAt(path.length - 1) === '/' ? path.substring(0, path.length - 1) : path)
      } else {
        this.$store.commit('tab/addTabs', {
          route: this.$route.path,
          name: this.$route.name
        })
      }
    }
    this.$store.commit('tab/setActiveTab', this.$route.path)
  },
  methods: {
    // 点击动态切换路由
    tabClick (tab) {
      this.$router.push(tab.name)
    },
    // 关闭tab
    removeTab (targetName) {
      console.log(targetName)
      // 删除store里匹配的路由标签，并设置当前标签页， 如果只有一个标签，则不再关闭
      if (this.tabs.length === 1) {
        return
      }
      this.$store.commit('tab/deleteTabs', targetName)
      this.$store.commit('tab/setActiveTab', this.tabs[this.tabs.length - 1].route)
      this.$router.push(this.tabs[this.tabs.length - 1].route)
    }
  },
  computed: {
    ...mapState('tab', {
      'tabs': 'options'
    }),
    index: {
      get () {
        return this.$store.state.tab.activeIndex
      },
      set () {
      }
    }
  },
  watch: {
    '$route' (to, from) {
      // 三级路由切换时 添加标签，并定位到当前标签页
      // 如果已有标签页则直接切换
      console.log('是否命中已有路由 ', this.tabs.some(tab => tab.route === to.path))
      if (this.tabs.some(tab => tab.route === to.path)) {
        this.$store.commit('tab/setActiveTab', to.path)
        return
      }
      this.$store.commit('tab/addTabs', {
        route: this.$route.path,
        name: this.$route.name
      })
      this.$store.commit('tab/setActiveTab', to.path)
    }
  }
}
</script>
