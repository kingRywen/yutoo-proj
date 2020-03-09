<template>
  <div class="el-page-header">
    <div class="el-page-header__left" v-if="$listeners.back" @click="$listeners.back">
      <i :class="backIcon || 'iconfont icon-Icon-'"></i>
      <!-- <div class="el-page-header__title">返回</div> -->
    </div>
    <div class="el-page-header__content">{{content}}</div>
  </div>
</template>
<script>
export default {
  name: 'ElPageHeader',
  props: {
    backIcon: String,
    content: {
      required: true,
      default: '',
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
.el-page-header {
  display: flex;
  line-height: 24px;
  &__left {
    display: flex;
    cursor: pointer;
    margin-right: 40px;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      width: 1px;
      height: 16px;
      right: -20px;
      top: 50%;
      transform: translateY(-50%);
      background-color: #dcdfe6;
    }
    & .iconfont {
      font-size: 18px;
      margin-right: 6px;
      align-self: center;
    }
  }
  &__content {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
  }
}
</style>