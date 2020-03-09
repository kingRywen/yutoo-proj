<template>
  <el-row :gutter="10" class="productsImglist">
    <el-col :span="8" class="productsImgitem" v-for="(i,index) in datas" :key="index">
      <div class="imgbox" :style="{backgroundImage: 'url('+i.productImg +')' }"></div>
      <p v-if="!hiddenBotton">
        数量:{{`${i.productQuantity}` || 0}}
        <span v-if="price">{{i.price}}</span>
      </p>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'productsImg',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    price: {
      type: [Boolean, String],
      default: false
    },
    hiddenBotton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    datas: {
      get() {
        return this.data.map(item => {
          item.price = '金额$:' + item.price
          return item
        })
      },
      set() {}
    }
  }
}
</script>
<style lang="scss" scope>
.productsImglist {
  width: 100%;
  max-height: 560px;
  // overflow: auto;
}
.productsImgitem {
  height: 192px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
  .imgbox {
    width: 100%;
    height: 100%;
    border: 1px solid green;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  p {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    font-weight: 600;
    span {
      font-weight: 600;
      display: inline-block;
      padding-left: 20px;
      height: 35px;
      line-height: 35px;
      font-size: 14px;
    }
  }
}
</style>
