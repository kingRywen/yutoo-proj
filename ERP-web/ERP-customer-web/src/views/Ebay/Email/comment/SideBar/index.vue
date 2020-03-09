<template>
  <div class="side-bar">
    <el-row>
      <span class="el-icon-d-arrow-left"></span>
    </el-row>
    <el-row class="leftBar">
      <el-col :span="24">
        <el-row class="top-bar">
          <el-col :span="22">邮件分类</el-col>
          <el-col :span="2">
            <span class="el-icon-d-arrow-right"></span>
          </el-col>
        </el-row>
        <el-row class="center-bar">
          <el-col :span="2" :offset="21">
            <span class="el-icon-refresh"></span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">123</el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.side-bar {
  position: fixed;
  right: 0;
  top: 194px;
  width: 30px;
  height: 30px;
  z-index: 10;
  background: #108ee9;
  .el-icon-d-arrow-left {
    font-size: 33px;
  }
  .leftBar {
    position: absolute;
    width: 260px;
    height: 710px;
    top: 0;
    background: rgb(231, 231, 231);
    right: 0;
    z-index: 9999;
    .el-icon-d-arrow-right {
      font-size: 20px;
    }
    .top-bar {
      padding: 5px 0;
      background: #108ee9;
      line-height: 20px;
      padding-left: 10px;
      color: #fff;
    }
  }
  .center-bar {
    height: 44px;
    border-bottom: 1px solid rgb(211, 211, 211);
    .el-icon-refresh {
      font-size: 24px;
      margin-top: 10px;
    }
  }
}
</style>
