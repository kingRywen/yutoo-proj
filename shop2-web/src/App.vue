<template>
  <div id="app" :class="$route.meta.theme">
    <router-view></router-view>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { mapActions } from 'vuex'

export default {
  computed: {
    cachePage() {
      return this.$store.state.app.cachePage
    }
  },

  methods: {
    ...mapActions('perms', ['initMenu']),
    bindEvent() {
      //新版提示
      GLOBAL.vbus.$on('business.response.newSuccess', regData => {
        let msg = `<span>共处理: ${regData.total}条 , <span style="color:#67C23A">成功: ${regData.success}条</span> , <span style="color:#F56C6C">失败: ${regData.fail}条</span> , <span style="color:#409EFF">忽略: ${regData.ignore}条 ! </span></span>`
        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: msg
        })
      })
      GLOBAL.vbus.$on('business.response.newFalseMessage', regData => {
        let str = ''
        if (regData.failMsgList && regData.failMsgList.length) {
          str = `<p style="font-weight: bold;">失败原因:</p>`
          regData.failMsgList.forEach(e => {
            str += e + '<br/>'
          })
          if (regData.ignoreMsgList && regData.ignoreMsgList.length)
            str += '<br/>'
        }
        if (regData.ignoreMsgList && regData.ignoreMsgList.length) {
          str += `<p style="font-weight: bold;">忽略原因:</p>`
          regData.ignoreMsgList.forEach(e => {
            str += e + '<br/>'
          })
        }
        this.$notify({
          type: 'error',
          dangerouslyUseHTMLString: true,
          message: str
        })
      })

      GLOBAL.vbus.$on('business.response.incorrect', message => {
        // ... code 不为 0，业务不正确处理
        this.$message({
          type: 'error',
          dangerouslyUseHTMLString: true,
          message: message || '未知异常，请联系客服人员'
        })
      })
      GLOBAL.vbus.$on('business.response.warningMsg', message => {
        // ... code 不为 0，业务不正确处理
        this.$message({
          type: 'warning',
          dangerouslyUseHTMLString: true,
          message: message
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
    }
  },
  created() {
    // this.init()
    this.bindEvent()

    
  },
  beforeDestroy() {
    GLOBAL.vbus.$emit('setTableEnter')
  },
}
</script>
<style lang="scss">
#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 1240px;
  color: #333;
}
button,
input,
textarea,
#app {
  font-family: PingFangSC, 'Open Sans', sans-serif, microsoft yahei ui,
    microsoft yahei, simsun, helvetica neue, hiragino sans gb, arial !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // font-weight: 600;
}
</style>
