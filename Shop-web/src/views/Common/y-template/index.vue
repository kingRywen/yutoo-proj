<template>
    <div class="template-box">
        <div class="screen-info" v-if="screenInfoShow">         
          <el-collapse accordion  v-model="activeName" >
            <el-collapse-item title="筛选条件" name="condition">
              <slot name="ScreenInfo"></slot>
            </el-collapse-item>
          </el-collapse>               
        </div>
        
        <div class="box-update-btn" style="padding-left: 0">
          <slot name="HandleBtn"></slot>
        </div>
        <div class="box-data">
          <slot name="table"></slot>
          <slot name="pagination"></slot>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    screenInfoShow: {
      type: Boolean,
      default: true
    },
    scrollName:{
      type:String,
      default:null,
    }
  },
  data(){
    return {
        activeName:'',
    }
  },
  created(){
    this.activeName=this.scrollName;
  },
  watch:{
    scrollName(){
        this.activeName=this.scrollName;
    }
  }
}
</script>


<style lang="less" scoped>
.template-box{
  // border:1px solid @borderColor;
  // padding: 10px;
  .screen-info{
      /deep/.el-collapse-item__header{
        border:1px solid @borderColor;
        background-color: @boxQueryBGColor;
        padding-left: 15px;
      }
      /deep/.el-collapse-item__wrap{
        border-left:1px solid @borderColor;
        border-right:1px solid @borderColor;
        width: 100%;
      }
      /deep/.el-collapse-item__content{
        padding: 15px 15px 0 15px;
      }
    }
    // .box-query{
    //   padding: 15px 15px 0 15px;
    //   border-left:1px solid @borderColor;
    //   border-right:1px solid @borderColor;
    //   border-bottom:1px solid @borderColor;
    // }
    .box-update-btn {
      margin-top: 10px;
    }
    .box-data{
      .el-pagination{
          margin-top: 5px;
          padding-left: 0;
          /deep/.el-pagination__sizes{
              .el-input{
                  margin-left: 0!important;
              }
          }
      }
    }
}
</style>
