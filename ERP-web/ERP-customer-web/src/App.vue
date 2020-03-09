
<template>
  <!-- <div id="app" v-loading.fullscreen.lock="$store.state.isloading"> -->
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('perms', ['initMenu']),
    bindEvent() {
      GLOBAL.vbus.$on('business.response.incorrect', message => {
        // ... code 不为 0，业务不正确处理
        this.$message({
          type: 'error',
          message
        })
      })
      GLOBAL.vbus.$on('business.response.success', message => {
        // ... code 为 0，显示成功信息
        this.$message({
          type: 'success',
          message
        })
      })
      // 自行触发
      GLOBAL.vbus.$on('ajax.request.error', resData => {
        console.info(resData)
      })
      GLOBAL.vbus.$on('ajax.response.error', message => {
        console.info(message)
        this.$message({
          type: 'error',
          message
        })
      })
    },
    init() {
      // 登录成功之后获取主菜单
      this.initMenu()
    }
  },
  created() {
    // this.init()
    this.bindEvent()
  }
}
</script>
<style lang="scss">
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
}
</style>
