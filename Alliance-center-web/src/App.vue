<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['getMsg']),
    bindEvent() {
      GLOBAL.vbus.$on('business.response.incorrect', message => {
        // ... code 不为 0，业务不正确处理
        this.$message({
          type: 'error',
          dangerouslyUseHTMLString: true,
          message
        })
      })
      GLOBAL.vbus.$on('business.response.success', message => {
        // ... code 为 0，显示成功信息
        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
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
          dangerouslyUseHTMLString: true,
          message
        })
      })
    },
    init() {
      // 登录成功之后获取主菜单
      this.initMenu()
    },
    getSelectPlatform(params) {
      let defaults = {
        platformId: 1
      }
      let opts = {
        ...defaults,
        ...params
      }
    }
  },
  created() {
    // this.init()
    this.bindEvent()
  },

  watch: {
    $route() {
      this.getSelectPlatform()
    }
  }
}
</script>
<style lang="scss">
@import './assets/font/iconfont/iconfont.css';
#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #333;
  background-color: #fff;
}
</style>
