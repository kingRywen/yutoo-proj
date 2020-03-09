<template>
  <div class="_none" :style="{minHeight:Height}">
    <img src="./none.png">
    <slot>
      <span class="text" v-html="text">暂无数据</span>
    </slot>
    <router-link to="/" v-if="backMain">返回主页</router-link>
    <a @click="back" v-else-if="!noBack">点击返回上一级</a>
  </div>
</template>

<script>
export default {
  name: 'NonePage',
  props: {
    text: {
      type: String,
      default: null
    },
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
      default: '300px'
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
._none {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  span {
    margin: 20px 0;
    font-size: 12px;
    color: #666;
  }
  .text {
    font-size: 14px;
  }
  a {
    color: #5d92e8;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
