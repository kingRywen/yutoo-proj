<template>
  <div class="_none">
    <i class="iconfont22">&#xe642;</i>
    <span>
      <slot>页面信息不存在。</slot>
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
  min-height: 300px;
  i.iconfont22 {
    font-size: 80px;
    color: #dcdfe6;
  }
  span {
    margin-top: 20px;
    font-size: 12px;
    color: #666;
  }
  a {
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
