<template>
  <div class="b" v-loading="loading">
    <!-- <transition name="fade">
      <div v-show="!islogged" class="wrapper">
        <div v-show="!islogged" class="logo">联盟-账号登录</div>
      </div>
    </transition>-->

    <el-tabs class="tabs" v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane
        :label="item.cnName"
        :name="item.code"
        :key="item.code"
        v-for="item in platformInfo.platform.slice().reverse()"
        lazy
      >
        <Main @setLog="val => islogged = val" :platformCode="item.code" :curSites="item.sites" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Main from './main'
export default {
  components: {
    Main
  },
  data() {
    let items = window.items
    let logged = []
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const element = items[key]
        if (element) {
          logged.push(key)
        }
      }
    }

    return {
      islogged: true,
      activeName: logged.pop() || 'amazon',
      loading: false,
      platformInfo: {
        platform: []
      }
      // curSites: []
    }
  },
  created() {
    this.getPlatformInfo()
  },
  methods: {
    handleTabClick(tab) {
      this.islogged = tab.$children[0] && tab.$children[0].logged
    },
    getPlatformInfo() {
      this._fetch(
        '/extension/getPlatformSite',
        {},
        res => {
          const {
            data: { rows }
          } = res
          rows.platform.forEach(el => {
            el.sites = rows.platformSite
              .filter(e => e.platformCode == el.code)
              .map(e => ({ ...e, cnName: e.cnName.split('-')[1] + '站' }))
            // .concat({ cnName: '22', countryCode: '22' })
          })
          console.log(rows)

          this.platformInfo = rows
          // this.curSites = rows.platformSite
        },
        err => {}
      )
    },
    _fetch(url, params, cb, errCb) {
      this.loading = true
      let bgPage = chrome.extension.getBackgroundPage()
      bgPage.fetchData(
        { url, params },
        res => {
          this.loading = false
          if (cb) cb(res)
        },
        res => {
          this.loading = false
          if (errCb) {
            errCb(res)
          }
        }
      )
    }
  }
}
</script>
<style lang="scss">
.b {
  min-width: 360px;
  min-height: 400px;
}
.wrapper {
  transition: all 0.2s ease-in;
  height: 8em;
  display: flex;
  justify-content: center;
  align-content: center;

  .logo {
    transition: all 0.1s ease-in;
    color: #ddd;
    font-size: 1.6em;
    font-weight: 400;
    line-height: 5em;
  }
}
.tabs > .el-tabs__header,
.wrapper {
  background: #141e30; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #243b55,
    #141e30
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #243b55,
    #141e30
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.tabs {
  &.el-tabs--border-card {
    border: none;
  }
  & > .el-tabs__header {
    margin: 0;
    .el-tabs__item {
      user-select: none;
      * {
        user-select: none;
      }
      color: #a8a8a8;
      // line-height: 30px;
      // height: 30px;
      border-radius: 5px 5px 0 0;
      padding: 0 11px !important;
      position: relative;
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        height: 2px;
        width: 100%;
        background: #fff;
        background: #f1c453;
        bottom: 0px;
        transform: scaleX(0);
        transition: transform 0.25s;
      }
      &.is-active {
        color: #fff;
        &::after {
          transform: scaleX(0.8);
        }
      }
    }
    .el-tabs__nav-wrap::after {
      background-color: #1b2b41;
    }
    .el-tabs__active-bar {
      display: none;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.4s;
  // height: 70px;
}
.fade-enter,
.fade-leave-to {
  height: 0;
}
</style>