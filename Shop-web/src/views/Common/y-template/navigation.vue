<template>
    <div class="navigation-box">
        <div class="navigation">
            <slot name="breadcrumb"></slot>
            <slot name="back"></slot>
        </div>
    </div>
</template>

<style lang="less" scoped>
.navigation-box{
  .navigation{
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    line-height: 1;
    color: #606266;
    margin-bottom: 5px;
    .breadcrumb{
      border-left: 3px solid #30cc7b;
      padding-left: 5px;
      .link{
        font-weight: bold;
      }
      .link:hover{ 
        cursor:pointer;
        color: #108ee9;
       }
    }
    .back{
      cursor:pointer;
      color: #108ee9;
      .el-icon-back{
        margin-right: 5px;
      }
    }
  }
}
</style>

