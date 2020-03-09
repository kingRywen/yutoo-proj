<template>
  <div>
    <div class="before_sku">
      <p class="leftTitle">
        <span class="marked">更改前</span>系统SKU:
      </p>
      <label>
        <el-input v-model="sky_Info.before" clearable/>
      </label>
    </div>
    <div class="homologous_sku">
      <p class="leftTitle">对应SKU:</p>
      <label>
        <el-input  v-model="sky_Info.homologous"clearable/>
      </label>
      <el-button type="primary" @click="search_order">搜索相关订单</el-button>
    </div>

    <div class="after_sku">
      <p class="leftTitle">
        <span class="marked">更改后系统</span>SKU:
      </p>
      <label>
        <el-input v-model="sky_Info.after" clearable/>
      </label>
      <el-button type="primary" @click="change_order">确定更改订单</el-button>
    </div>

    <div class="order_number">
      <div class="leftTitle">
          <span>系统订单号:</span>
          <span class="marked">(一行一个订单号)</span>
      </div>

      <div>
          <el-input v-model="order.number1" type="textarea" :rows="2" />
      </div>
      <div>
          <el-input v-model="order.number1" type="textarea" :rows="2" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sky_Info:{
          before: '',
          after:'',
          homologous:''
      },
      order:{
          number1:'',
          number2:''
      },
    }
  },
  methods: {
    search_order() {
      // console.log(this.sky_Info)
      // console.log(this.order)
      // alert(1)
    },
    change_order() {
      console.log(this.sky_Info)
      console.log(this.order)
      this.$message({
          message: '更改成功',
          type: 'success'
      });

    }
  }
}
</script>

<style lang="scss">
  body{
    padding: 10px;
  }
.flex_row{
    display: flex;
    flex-direction: row;
  }
  .lineHeight{
      line-height: 40px;
      margin-right: 10px;
  }
  label{
      width: 320px;
  }
  .marked{
    color: #0080C9;
  }
  .leftTitle{
      width: 120px;
      text-align: center;
  }
  .before_sku{
      @extend .flex_row;
      p{
         @extend .lineHeight;
         span{
             font-weight: 700;
         }
      }
  }
  .homologous_sku{
      margin-top:10px;
      @extend .flex_row;
      p{
        @extend .lineHeight;
      }
      .el-button{
         margin-left: 30px;
      }
  }
.after_sku{
      @extend .flex_row;
      margin-top: 10px;
      p{
         @extend .lineHeight;
         span{
             font-weight: 700;
         }
      }
      .el-button{
         margin-left: 30px;
      }
    }
.order_number{
    margin-top: 10px;
    @extend .flex_row;
    div{
        &:first-child{
          display: flex;
          flex-direction: column;
          margin-right: 10px;
          text-align: center;
        }
        height: 400px;
        .el-textarea__inner{
          width: 320px;
          height:100%;
          &:first-child{
            margin-right: 10px;
          }
        }
      }
    }
</style>
