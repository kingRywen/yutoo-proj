<template>
  <v-card :bordered="false" class="yt-card">
    <div class="yt-card-icon" :style="{backgroundColor: $attrs.color}"><v-icon :type="$attrs.icon"></v-icon></div>
    <div class="yt-card-right">
      <div class="main-title">
        <p class="main">{{$attrs.title}}</p> 
        <span>{{$attrs.count}}</span>
      </div>
      <div class="sub-title">
        <p class="main">{{$attrs.subTitle}}</p>
        <span>{{$attrs.subCount}}</span>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "yt-card",
  inheritAttrs: false
};
</script>

<style lang="less">
.yt-card {
  margin-bottom: 20px;
  .ant-card-body {
    padding: 0 !important;
  }
  .yt-card-icon {
    float: left;
    width: 100px;
    height: 100px;
    background: #108ee9;
    text-align: center;
    font-size: 32px;
    i {
      line-height: 100px;
      font-size: 32px;
      color: #fff;
    }
  }
  .yt-card-right {
    margin-left: 120px;
    padding: 20px 20px 20px 0;
    .main-title {
      text-align: justify;
      font-size: 24px;
      .main {
        display: inline;
        
      }
      span {
        float: right;
        font-weight: bolder;
      }
    }
    .sub-title {
      font-size: 14px;
      margin-top: 2px;
      .main {
        float: left;
      }
      span {
        float: right;
      }
    }
  }
}
</style>
