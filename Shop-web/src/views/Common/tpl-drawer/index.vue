<template>
  <div class="drawer-box w100">
    <div class="drawer-btn" @click="setShow()" :style="position">
      <i :class="icon"></i>
    </div>

    <ElRow :gutter="20">
      <ElCol :span="4" v-show="isShow" style="padding-left:20px;">
        <slot name="leftMenu"/>
      </ElCol>
      <ElCol :span="isShow ? 20 : 24">
        <slot name="body"/>
      </ElCol>
    </ElRow>
    <!-- <div class="drawer-body">
      <div class="menu" v-show="isShow">
        
      </div>
      <div class="body">
        
      </div>
    </div>-->
  </div>
</template>
<script>
export default {
  // props: {
  //     isShow:{
  //         type: Boolean,
  //         default: false
  //     }
  // },
  props: {
    left: {
      type: String,
      default: '13px'
    }
  },
  data() {
    return {
      // isShow: false, // 默认关闭
      isShow: true, // 默认开启
      icon: 'el-icon-caret-left',
      position: {
        position: 'absolute',
        top: '300px',
        // left: "20px",// 默认关闭
        left: this.left, // 默认开启
        color: '#108ee9'
      }
    }
  },
  methods: {
    setShow() {
      this.isShow = !this.isShow
      if (this.isShow) {
        this.icon = 'el-icon-caret-left'
        this.position.left = this.left
      } else {
        this.icon = 'el-icon-caret-right'
        this.position.left = this.left
      }
    }
  }
}
</script>
<style lang="less" scoped>
.drawer-box {
  .drawer-btn {
    background-color: #fff;
    border: 1px solid @borderColor;
    width: 15px;
    height: 100px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  .drawer-body {
    display: flex;
    .menu {
      // height: 100vh;
      overflow-y: auto;
      border: 1px solid @borderColor;
      border-radius: 3px;
      width: 300px;
      // margin-bottom: 10px;
      padding: 10px;
    }
    .body {
      // width: 100%;
      overflow: hidden;
      // padding: 10px;
      // border: 1px solid @borderColor;
      // border-radius: 3px;
      margin-left: 10px;
      // margin-right: 10px;
    }
  }
}
</style>