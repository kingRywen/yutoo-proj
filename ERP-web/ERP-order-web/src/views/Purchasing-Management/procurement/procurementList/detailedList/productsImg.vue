<template>
  <el-row :gutter="10" class="productsImglist">
    <el-col :span="8" class="productsImgitem" v-for="(i,index) in data" :key="index">
      <div class="imgbox" :style="{backgroundImage: 'url('+i.productImg +')' }">
        <p>{{type === 'order' ? (i.finalAmount || 0) : (i.productSingleQuantity || 0)}} / {{i.orderAmount || i.requirement || 0}}</p>
      </div>
    </el-col>
    
  </el-row>
</template>

<script>
export default {
    props: {
        type: String,
        data: {
            type: Array,
            default: () => []
        }
    }
}
</script>
<style lang="scss" scope>
.productsImglist {
    width: 100%;
    max-height: 560px;
    overflow: auto;
}
.productsImgitem {
    height: 192px;
    margin-bottom: 10px;
    .imgbox {
        width: 100%;
        height: 100%;
        border: 1px solid green;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        flex-direction: column-reverse;
        text-align: center;
        p {
            height: 35px;
            line-height: 35px;
            font-size: 14px;
            font-weight: 600;
        }
    }
}
</style>
