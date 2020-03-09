<template>
  <div class="main-wrapper">
    <div class="main-view">
      <div class="top-menu">
        <div class="logo">联盟</div>
        <div class="home" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
          <router-link class="home-btn" tag="a" to="/login">
            <svg width="20" height="20">
              <use xlink:href="#home"></use>
            </svg>
            返回主页
          </router-link>
        </div>
      </div>
      <div class="find-pass-container">
        <div>
          <el-input v-model="value" placeholder="注册邮箱"></el-input>
          <el-button class="per100 mt20" type="primary">找回密码</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  methods: {
    setSvg(fPath = '#fff', sPath = '#fff') {
      let svg = document.getElementById('__SVG_SPRITE_NODE__')
      let path0 = svg.getElementsByTagName('path')[0]
      let path1 = svg.getElementsByTagName('path')[1]
      path0.setAttribute('fill', fPath)
      path1.setAttribute('fill', sPath)
    },
    handleMouseenter() {
      this.setSvg()
    },
    handleMouseleave() {
      this.setSvg('#444444', '#00D8A0')
    }
  },
  beforeRouteLeave(to, from, next) {
    this.setSvg('#444444', '#00D8A0')
    next()
  },
  beforeDestroy() {
    this.setSvg('#444444', '#00D8A0')
  }
}
</script>

<style scoped lang='scss'>
svg#home {
  path {
    transition: all 0.15s ease-in-out;
  }
}
.main-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  // align-items: center;
  display: flex;
  .main-view {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    .top-menu {
      height: 60px;
      line-height: 60px;
      display: flex;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.04);
      position: relative;
      z-index: 22;
      .logo {
        font-size: 28px;
        font-weight: bolder;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
      }
      .home {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
        .home-btn {
          height: 34px;
          padding: 0 20px;
          border-radius: 17px;
          display: flex;
          font-size: 14px;
          align-items: center;
          transition: all 0.15s ease-in-out;
          svg {
            margin-right: 6px;
          }
          &:hover {
            background: #108ee9;
            color: #fff;
            svg {
              color: #fff;
            }
          }
        }
      }
    }
    .find-pass-container {
      // width: 600px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
