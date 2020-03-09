<template>
  <div class="_none" :style="{minHeight:Height}">
    <img :width="imgWidth" src="./none.png" />
    <slot>
      <span class="text" v-html="text"></span>
    </slot>
    <router-link to="/" v-if="backMain">返回主页</router-link>
    <a @click="back" v-else-if="!noBack">点击返回上一页</a>
  </div>
</template>

<script>
export default {
  name: 'NonePage',
  props: {
    imgWidth: {
      default: 120
    },
    text: {
      type: String,
      default: '暂无数据'
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
    font-size: 13px;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
