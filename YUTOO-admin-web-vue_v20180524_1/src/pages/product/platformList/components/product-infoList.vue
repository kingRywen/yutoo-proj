<template lang="html">
    <div class="product-infoList">
      <el-button v-for="item in productInfoLists" @click="product_correlation(item)">{{item}}</el-button>
    </div>
</template>

<script>
export default {
    name:"product-infoList",
    data(){
      return {

      }
    },
    props: {
        productInfoLists:{
           type:Array,
           default:[]
        }
    },
    methods: {
        product_correlation(item) {
           this.$emit('product_correlation',item)
        }
    }
}
</script>

<style lang="scss">

</style>
