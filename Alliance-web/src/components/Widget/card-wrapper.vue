<template>
  <div class="wrapper">
    <div class="header" v-if="title">
      <span>{{title}}</span>
      <i v-if="isCollapse" @click="handleArrow" :class="`el-icon-arrow-${hideMore ? 'down': 'up'}`"></i>
    </div>
    <div class="content" v-show="!isCollapse ? true : !hideMore">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardWrapper',
  props: {
    // 是否有折叠展开按钮
    isCollapse: {
      default: false,
      type: Boolean
    },
    // 默认是否隐藏
    defaultHide: {
      default: true,
      type: Boolean
    },
    // 标题
    title: String
  },
  data() {
    return {
      hideMore: this.defaultHide
    }
  },
  methods: {
    handleArrow() {
      this.hideMore = !this.hideMore
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  font-size: 13px;
  margin: 20px 0;

  .header {
    color: #333;
    font-size: 13px;
    padding: 14px;

    font-weight: bold;
    background-color: #f5f5f5;
    border-radius: 5px 5px 0 0;
    border: 1px solid #e4e4e4;
    border-bottom: none;
    display: flex;
    justify-content: space-between;
    span {
      font-weight: bold;
    }
    i {
      cursor: pointer;
    }
  }
  .content {
    line-height: 2;
    border-radius: 0 0 5px 5px;
    border: 1px solid #e4e4e4;
    padding: 14px;
    padding-top: 30px;
  }
}
</style>