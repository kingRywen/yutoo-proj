<template>
  <div class="_none" :style="{height:Height}">
    <i class="iconfont icon-wushuju iconfont22"></i>
    <span>
      <slot>暂无数据</slot>
      <router-link to="/" v-if="backMain">返回主页</router-link>
      <a @click="back" v-else-if="!noBack">点击返回上一级</a>
    </span>

  </div>
</template>

<script>
export default {
  name: "none-page",
  props: {
    backMain: {
      type: Boolean,
      default: false
    },
    noBack: {
      type: Boolean,
      default: false
    },
    Height: {
      type: String,
      default: "300px"
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
._none {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  i.iconfont22 {
    font-size: 80px !important;
    color: #dcdfe6 !important;
    font-weight: 500 !important;
  }
  span {
    margin-top: 20px;
    font-size: 12px;
    color: #666;
  }
  a {
    color: #00c0de;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
